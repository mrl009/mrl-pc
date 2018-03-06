import $ from 'jQuery'
export default function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<div id="myquee"><ul ng-transclude></ul></div>',
        link: function (scope, element, attrs) {
            element.css({
                height: '470px',
                overflow: 'hidden'
            })
            var _defaults = {
                isEqual: true,
                loop: 0,
                direction: 'up',
                scrollAmount: 1,
                scrollDelay: 40
            }

            var _opts = (function () {
                var _ret = {}
                for (var i in _defaults) {
                    _ret[i] = attrs[i] || _defaults[i]
                }
                return _ret
            })()

            var init = function () {
                var $marquee = $(element[0])
                var _scrollObj = $marquee.get(0)
                var scrollW = $marquee.width()
                var scrollH = $marquee.height()
                var $element = $marquee.children()
                var $kids = $element.children()
                var scrollSize = 0
                //防止获取不到子元素进行的延时操作
                if ($kids.length == 0) {
                    var _t = setTimeout(function () {
                        if ($kids.length > 0) {
                            clearTimeout(_t)
                        }
                        init()
                    }, 100)
                    return false
                }
                //滚动类型，1左右，0上下
                var _type = _opts.direction == 'left' || _opts.direction == 'right' ? 1 : 0

                //防止滚动子元素比滚动元素宽而取不到实际滚动子元素宽度
                $element.css(_type ? 'width' : 'height', 10000)

                //获取滚动元素的尺寸
                if (_opts.isEqual) {
                    scrollSize = $kids[_type ? 'width' : 'height']() * $kids.length
                }

                //滚动元素总尺寸小于容器尺寸，不滚动
                if (scrollSize < (_type ? scrollW : scrollH)) {
                    return
                }

                //克隆滚动子元素将其插入到滚动元素后，并设定滚动元素宽度
                $element.append($kids.clone()).css(_type ? 'width' : 'height', scrollSize * 2)

                function scrollFunc() {
                    var _dir = 'scrollTop'
                    if (_opts.direction == 'up') {
                        var newPos = _scrollObj[_dir] + _opts.scrollAmount
                        if (newPos >= scrollSize) {
                            newPos -= scrollSize
                        }
                        _scrollObj[_dir] = newPos
                    }
                }

                //滚动开始
                setInterval(scrollFunc, _opts.scrollDelay)
            }
            init()
        }
    }
}