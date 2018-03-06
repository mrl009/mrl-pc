import $ from 'jQuery'
import angular from 'angular'

import Flatpickr from 'flatpickr'
import zh from 'flatpickr/dist/l10n/zh.js'

import 'flatpickr/dist/themes/material_orange.css'
let picker = null
let tgtCache = []

export const Util = ($timeout,
                     Core) => {
    return {
        drawLines: function (len) {
            const $target = $('#chartsTable')
            this.clearDraw()
            $target.append(`
				<canvas
					style="position:absolute;left:${$target.css('marginLeft')};top: ${$target.css('marginTop')}"
					id="chartsDraw"
					width="${$target.width()}"
					height="${$target.height()}">
				</canvas>
			`)
            $target
                .css('width', $target.width())
                .css('margin-left', $target.css('marginLeft'))

            const _canvas = document.getElementById('chartsDraw')
            const _toffset = $target.find('tbody').offset()

            let lineBalls = Core.createArr(len)
            lineBalls.forEach(function (e, i) {
                lineBalls[i] = []
            })

            $target.find('tr[name="ball_row"]').each(function () {
                const _rowDatas = $(this).find('.charball')
                _rowDatas.each((e, i) => {
                    lineBalls[e] && lineBalls[e].push(i)
                })
            })

            const draw = function (data) {
                const calCircle = function ($target) {
                    $target = $target.find('div')
                    const _offset = $target.offset()
                    const _width = $target.width()
                    const _height = $target.height()
                    return {
                        pointX: _offset.left + _width / 2,
                        pointY: _offset.top + _height / 2,
                        width: _width,
                        height: _height
                    }
                }

                const drawLine = function (pre, next) {
                    const prePoint = calCircle($(pre))
                    const nextPoint = calCircle($(next))

                    let startX = prePoint.pointX - _toffset.left
                    let startY = prePoint.pointY - _toffset.top
                    let endX = nextPoint.pointX - _toffset.left
                    let endY = nextPoint.pointY - _toffset.top

                    //半径
                    const r = nextPoint.width / 2

                    const xw = Math.abs(nextPoint.pointX - prePoint.pointX)
                    const yh = Math.abs(nextPoint.pointY - prePoint.pointY)
                    if (xw == 0) {
                        startY = startY + r
                        endY = endY - r
                    } else {
                        const ls = Math.sqrt(xw * xw + yh * yh)
                        const _y = r / ls * yh
                        const _x = r / ls * xw
                        if (nextPoint.pointX - prePoint.pointX > 0) {
                            startX += _x
                            startY += _y
                            endX -= _x
                            endY -= _y
                        } else {
                            startX -= _x
                            startY += _y
                            endX += _x
                            endY -= _y
                        }
                    }

                    //获取画板
                    if (_canvas.getContext) {
                        let ctx = _canvas.getContext('2d')
                        ctx.strokeStyle = $(next).find('div').css('backgroundColor')

                        ctx.lineWidth = 1
                        ctx.beginPath()
                        ctx.moveTo(startX, startY) //设置起点
                        ctx.lineTo(endX, endY) //画线
                        ctx.closePath()
                        ctx.stroke()
                    }
                }

                angular.forEach(data, function (e, i) {
                    if (i != 0) {
                        drawLine(data[i - 1], e)
                    }
                })
            }
            lineBalls.forEach(function (e) {
                draw(e)
            })
        },
        clearDraw: function () {
            $('#chartsDraw').remove()
        },
        createArrs: function (n) {
            const ret = []
            for (let i = 0; i < n; i++) {
                ret.push([])
            }
            return ret
        },
        initCoursel: function () {
            var circle = function () {
                var currentItem = $('.v_cont ul li').first()
                var currentIndex = currentItem.attr('index')
                $('.circle li').removeClass('circle-cur')
                $('.circle li').eq(currentIndex).addClass('circle-cur')
            }

            var initLoop = function () {
                const vcon = $('.v_cont')
                const offset = $('.v_cont li').width() * -1
                vcon.stop().animate({
                    left: offset
                }, 'slow', function () {
                    var firstItem = $('.v_cont ul li').first()
                    vcon.find('ul').append(firstItem)
                    $(this).css('left', '0px')
                    circle()
                })
            }
            let animateEnd = 1
            $('.circle li').click(function () {
                if (animateEnd == 0) {
                    return
                }
                $(this).addClass('circle-cur').siblings().removeClass('circle-cur')
                const nextindex = $(this).index()
                const currentindex = $('.v_cont li').first().attr('index')
                const curr = $('.v_cont li').first().clone()
                if (nextindex > currentindex) {
                    for (let i = 0; i < nextindex - currentindex; i++) {
                        const firstItem = $('.v_cont li').first()
                        $('.v_cont ul').append(firstItem)
                    }
                    $('.v_cont ul').prepend(curr)
                    const offset = $('.v_cont li').width() * -1
                    if (animateEnd == 1) {
                        animateEnd = 0
                        $('.v_cont').stop().animate({
                            left: offset
                        }, 'slow', function () {
                            $('.v_cont ul li').first().remove()
                            $('.v_cont').css('left', '0px')
                            animateEnd = 1
                        })
                    }
                } else {
                    const curt = $('.v_cont li').last().clone()
                    for (let i = 0; i < currentindex - nextindex; i++) {
                        let lastItem = $('.v_cont li').last()
                        $('.v_cont ul').prepend(lastItem)
                    }
                    $('.v_cont ul').append(curt)
                    const offset = $('.v_cont li').width() * -1
                    $('.v_cont').css('left', offset)
                    if (animateEnd == 1) {
                        animateEnd = 0
                        $('.v_cont').stop().animate({
                            left: '0px'
                        }, 'slow', function () {
                            $('.v_cont ul li').last().remove()
                            animateEnd = 1
                        })
                    }
                }
            })

            initLoop()
        },
        timerCache: [],
        getOpen: function(gid, fn) {
            return Core.get('open_time/get_games_list?gid=' + gid, function (json) {
                const c = angular.fromJson(json)
                if (c.code == 200) {
                    fn && fn(c.data[0])
                }
            }, false)
        },
        locks: {},
        upDateKithe: function () {
            const _this = this
            return function (gid, second, upclose, syTimeCache, fn) {
                const cdFn = function (m) {
                    const str = Core.ShowCountDown(m)
                    if (str != 'end') {
                        syTimeCache[gid] = str
                        const _timer = $timeout(function () {
                            cdFn(m)
                        }, 1000)
                        _this.timerCache.push(_timer)
                    } else {
                        if(_this.locks[gid] != 'locked') {
                            $timeout(function() {
                                _this.getOpen(gid)
                                    .then((json) => {
                                        const c = angular.fromJson(json)
                                        if(c.code == 200 ) {
                                            _this.locks[gid] = 'locked'
                                            c.data[0].kithe_time_second && cdFn(parseInt(new Date().getTime()) + c.data[0].kithe_time_second * 1000)
                                            c.data[0].kithe_time_second == 0 && (syTimeCache[gid] = '未开盘')
                                        }
                                    })
                            }, 2000)

                            const _time = $timeout(function () {
                                _this.getOpen(gid, fn)
                                    .then(() => {
                                        _this.locks[gid] = null
                                    })
                                $timeout.cancel(_time)
                            }, upclose * 1.5 * 1000)
                            _this.timerCache.push(_time)
                        }
                    }
                }
                second && cdFn(parseInt(new Date().getTime()) + second * 1000)
                second == 0 && (syTimeCache[gid] = '未开盘')
            }
        },
        clearCd: function () {
            angular.forEach(this.timerCache, function (e) {
                $timeout.cancel(e)
            })
            this.timerCache = []
        },
        //注册规则
        rRules: {
            username: /^[a-zA-Z0-9]{4,14}$/,
            bank_name: /^[\u4E00-\u9FA5]{2,5}(?:·[\u4E00-\u9FA5]{2,5})*$/,
            password: function (val1, strength_pwd) {
                let reg = strength_pwd ? /^(?![^a-zA-Z]+$)(?!\D+$).{6,12}/ : /^.{6,12}$/
                if (/\s/.test(val1)) {
                    return false
                }
                if (/[\u4E00-\u9FA5]/g.test(val1)) {
                    return false
                }
                if (!reg.test(val1)) {
                    return false
                }
                return true
            },
            re_password: function (val1) {
                return function (val2) {
                    return val2 == val1
                }
            },
            reg_code: function (val1, is_agent) {
                return is_agent == 2 && !val1 ? false : true
            },
            verify_code: /^\d{4}$/
        },
        //登录规则
        lRules: {
            username: /^\w{4,14}$/,
            password: /^.{6,12}$/,
            vcode: /^\d{4}$/
        },
        handleBall: function (ball) {
            return ball < 10 ? '0' + Number(ball) : ball
        },
        convertFromObj2Arr: function (obj) {
            let ret = []
            for (var i in obj) {
                ret.push(obj[i])
            }
            return ret
        },
        picker: function (target, fn, config) {
            let defaultConfig = {
                locale: zh.zh,
                onChange: function (selectedDates, dateStr) {
                    fn && fn(dateStr)
                }
            }
            let isExist = false
            tgtCache.forEach((e) => {
                if (e.target == target) {
                    picker = e.picker
                    isExist = true
                }
            })
            const pickerConfig = Object.assign(defaultConfig, config || {})
            if (!isExist) {
                picker = new Flatpickr(target, pickerConfig)
                picker.open()
                tgtCache.push({
                    target,
                    picker
                })
            } else {
                picker.open()
            }
        }
    }
}
