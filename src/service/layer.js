import $ from 'jQuery'
import angular from 'angular'

export const Layer = (
    $timeout,
    $compile,
    $http
) => {
    return {
        load: function(url) {
            return $http
                .get(url)
                .then(function(response) {
                    return response.data && response.data.trim()
                })
        },
        // closeModal: function() {
        //     $('.modal').remove()
        // },
        /*
         *  params: {
         *      title: ''   标题
         *      url: '',    url
         *      msg: ''     url和msg二选其一
         *      footer: ''  支持自定义脚步
         *      maskClose: true/false 默认true
         *      style: {}   自定义样式，对modal-wrap起作用可用于增加宽度等
         *      scope: $scope 如果传url，必须将scope传过来
         *  }
         */
        timerCache: [],
        modal: function(params) {
            const _this = this
            const url = params.url
            const hasTitle = typeof params.title === 'boolean' ? params.title : ' '
            const title = typeof params.title === 'boolean' ? '' : params.title
            const content = url ? '' : params.msg
            const footer_tpl = params.footer ? params.footer : ''
            const maskClose = params.maskClose != undefined ? params.maskClose : true
            const cusStyle = params.style ? params.style : {}
            const modalId = `modal-wrap${new Date().getTime()}`
            const boxId = `modal-box${new Date().getTime()}`
            const tpl = `
                <div class="modal blocker current" id="${boxId}">
                    <div id="${modalId}" class="modal-wrap">
                        <div class="modal-header" style="display: ${hasTitle && hasTitle == ' ' ? 'flex': 'none'}">
                          <h1>${title || '提示'}</h1>
                          <i class="iconfont modal-close"></i>
                        </div>
                        <div class="modal-body clearfix" id="modal-body">
                          ${content}
                        </div>

                        <div class="foot_succ">
                          ${footer_tpl}
                        </div>
                    </div>
                </div>`
            $(document.body).append(tpl)
            if(url) {
                this
                    .load(url)
                    .then((json) => {
                        angular
                            .element(document.getElementById('modal-body'))
                            .append($compile(json)(params.scope))
                    })
            }
            $(`#${modalId}`).css(cusStyle)
            $('.modal-close').click(function() {
                $(`#${boxId}`).remove()
                _this.timerCache.forEach((_timer) => {
                    $timeout.cancel(_timer)
                })
                _this.timerCache = []
            })
            if(maskClose) {
                $(`#${boxId}`).click(function(e) {
                    //增加冒泡判断
                    if(e.target.id === boxId) {
                        $('.modal-close').trigger('click')
                    }
                })
            }
        },
        close: function(e) {
            let _target = e.target
            while(!$(_target).hasClass('modal')) {
                _target = _target.parentNode
            }

            $(_target).remove()
        },
        /* 接受msg, title, 不支持自定义
         * msg可为html 或 字符串
         * count 为倒计时读秒, 非必填
         * title 为弹出框的标题
         */
        alert: function (msg, title, count) {
            const _this = this
            let _count = count
            let _timer = 0
            _this.modal({
                footer: '<button class="button alert-btn">确定</button>',
                msg,
                title,
                maskClose: false,
                style: {
                    width: '480px',
                    minHeight: '180px',
                    marginLeft: '-240px'
                }
            })
            if(!isNaN(_count)) {
                const _innerFn = function() {
                    _timer = $timeout(function() {
                        if(_count >= 0) {
                            $('.alert-btn').text('确定('+_count+'s)')
                            _count = _count - 1
                            _innerFn()
                        } else {
                            $timeout.cancel(_timer)
                            $('.alert-btn').trigger('click')
                        }
                        _this.timerCache.push(_timer)
                    }, 1000)
                }
                _innerFn()
            }
            $('.alert-btn').click(function(e) {
                _this.close(e)
                $timeout.cancel(_timer)
            })
        },
        /*
         * params: {
         *   okCd: number 确认键的倒计时读秒 和cancelCd 2选其一，后期会优化
         *   cancelCd: number 取消键的倒计时读秒 和okCd 2选其一，后期会优化
         *   okFn: confirm 的点击事件，默认点击关闭窗口
         *   cancelFn: cancel 的点击事件，默认点击关闭窗口，建议不进行操作
         *   title: 弹窗标题
         *   msg: 弹出消息，支持html自助样式
         *   okText: 字符串
         *   cancelText: 字符串
         * }
         */
        confirm: function(params) {
            const _this = this
            let _timer = 0
            let _okCd = params.okCd
            let _cancelCd = params.cancelCd
            const styles = params.style || {
                width: '480',
                minHeight: '180px',
                marginLeft: '-240px'
            }
            const createFn = function(fname) {
                return function(e) {
                    if(params[fname]) {
                        params[fname]()
                    }

                    if(!isNaN(_okCd) || !isNaN(_cancelCd)) {
                        $timeout.cancel(_timer)
                    }
                    _this.close(e)
                }
            }
            const okFn = createFn('okFn')
            const cancelFn = createFn('cancelFn')
            _this.modal({
                title: params.title,
                msg: params.msg,
                style: styles,
                maskClose: false,
                footer: `<button class="button modal-cancel-btn">${params.cancelText || '取消'}</button><button class="button modal-confirm-btn">${params.target || params.okText || '确认'}</button>`
            })
            if(!isNaN(_okCd)) {
                let _count = _okCd
                const _innerFn = function() {
                    _timer = $timeout(function() {
                        if(_count >= 0) {
                            $('.modal-confirm-btn').text('确定('+_count+'s)')
                            _count = _count - 1
                            _innerFn()
                        } else {
                            $('.modal-confirm-btn').trigger('click')
                        }
                    }, 1000)
                    _this.timerCache.push(_timer)
                }
                _innerFn()
            }
            if(!isNaN(_cancelCd)) {
                let _count = _cancelCd
                const _innerFn = function() {
                    _timer = $timeout(function() {
                        if(_count >= 0) {
                            $('.modal-cancel-btn').text('取消('+_count+'s)')
                            _count = _count - 1
                            _innerFn()
                        } else {
                            $('.modal-cancel-btn').trigger('click')
                        }
                    }, 1000)
                    _this.timerCache.push(_timer)
                }
                _innerFn()
            }

            $('.modal-cancel-btn').bind('click', cancelFn)
            $('.modal-confirm-btn').bind('click', okFn)
        },
        member_confirm: function(params) {
            this.confirm({
                okFn: params.okFn,
                title: params.title,
                msg: params.msg,
                okCd: params.okCd,
                cancelCd: params.cancelCd,
                style: {
                    width: '640px',
                    minHeight: '480px',
                    marginLeft: '-240px'
                },
                okText: params.okText
            })
        },
        headTip: function (msg, delta) {
            const $wrap = $('.header_error')
            if($wrap.length) {
                $wrap.css({
                    display: 'flex'
                })
                $('#header_error_msg').text(msg || '注意')
            } else {
                $(document.body).append(`
                    <div class="header_error">
                        <span id="header_error_msg">${msg}</span>
                    </div>`
                )
            }
            const delay = delta || 2
            const _t = $timeout(function () {
                $timeout.cancel(_t)
                $('.header_error').hide()
            }, delay * 1000)
        },
        /*
         * 暂不支持参数
         * 关闭方法使用 closeLoading
         */
        loading: function(idx) {
            const loadObj = [
                `
                    <div class="loading0">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                `,
                `
                    <div class="loading1">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                `,
                `
                    <div class="loading2">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                `,
                `
                    <div class="loading3">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                `,
                `
                    <div class="loading4">
                        <div><span></span></div>
                        <div><span></span></div>
                        <div><span></span></div>
                        <div><span></span></div>
                    </div>
                `
            ]
            const _idx = idx || 0
            this.modal({
                msg: loadObj[_idx],
                style: {
                    background: 'transparent',
                    width: '200px',
                    marginLeft: '-100px'
                },
                maskClose: false
            })
            $('.modal-header').hide()
            $('.modal').addClass('loading-modal')
        },
        /*
         * loading关闭方法，closeModal不在对外开放，因为影响到其他弹层
         */
        closeLoading: function() {
            $('.loading-modal').remove()
        },
        /*
         * mode inner行内还是body, 默认body
         *
         */
        tooltip: function(opts) {
            const _this = this
            if($('.tooltip-wrap').length) {
                return
            }
            const mode = opts.mode || 'body'
            const target = opts.target || document.body
            const success = opts.success
            let parentNode = null
            if(mode == 'inner') {
                parentNode = target.parentNode
                const _position = $(parentNode).css('position')

                if(_position !== 'relative') {
                    $(parentNode).css('position', 'relative')
                }

                $(parentNode).append(`
                    <div class="tooltip-wrap">
                        ${opts.content}
                    </div>
                `)

                success && success()
                $('.tooltip-wrap').click(function() {
                    _this.closeTooltip()
                })
            }

            $(parentNode).mouseleave(function() {
                _this.closeTooltip()
            })
        },
        closeTooltip: function() {
            $('.tooltip-wrap').remove()
        }
    }
}