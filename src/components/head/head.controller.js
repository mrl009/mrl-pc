import {API} from '../../config'
import angular from 'angular'
import $ from 'jQuery'
import './head.less'

export default function ($scope,
                         $state,
                         Core,
                         Layer,
                         $location,
                         $timeout,
                         CtrlUtil) {
    $scope.data = {}
    const token = Core.getToken()
    $scope.getInfo = function () {
        CtrlUtil.getInfo(token, function (c) {
            $scope.data = c.data
        })
    }
    $scope.needsCode = function () {
        Core.get('system/index?app_type=pc', function (json) {
            var c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.data.isCode = c.data.is_code == 1 ? true : false
            }
        })
    }
    $scope.needsCode()
    $scope.codeRefresh = function () {
        $('#login_code').children('img').attr('src', $scope.codeSrc + '&time=' + Math.random() + (new Date()).getTime())
    }
    // 刷新
    $scope.refresh = function () {
        location.reload()
    }
    // 验证码
    $scope.codeSrc = ''
    $scope.getCapt = function () {
        CtrlUtil.getCapt(function (c) {
            $scope.codeSrc = API + 'login/code?token_private_key=' + c.data.token_private_key
            $scope.token_private_key = c.data.token_private_key
        })
    }
    $scope.getCapt()
    $scope.goPath = function (path) {
        $state.go(path)
    }

    $scope.logout = function () {
        CtrlUtil.logout(function () {
            $scope.isLogin = false
            $scope.codeRefresh()
        })
    }
    $scope.isLogin = !!token
    if ($scope.isLogin) {
        $scope.getInfo()
    }
    $scope.pwd = {
        pwd: ''
    }
    $scope.login = function () {
        $scope.data.token_private_key = $scope.token_private_key
        $scope.data.pwd = $scope.pwd.pwd
        CtrlUtil.login(
            $scope.data,
            'headTip',
            function (code) {
                if (code == 425) {
                    $scope.data.isCode = true
                }
                $scope.codeRefresh()
            },
            function () {
                $scope.isLogin = true
                $scope.getInfo()
                $scope.checkRemainRedPacket()
                $scope.getRedPacketList()
                $scope.red_packet_notice()
            }
        )
    }
    //检查是否显示红包
    $scope.checkRedPacket = function () {
        // $scope.isShow = true
        Core.get('red_bag/index', function (json) {
            let c = angular.fromJson(json)
            if (c.code == 200) {
                if (c.data != null && c.data.start_time - c.data.server_time <= 1800 && c.data.server_time < c.data.end_time) {
                    let now = new Date()
                    let time = c.data.start_time - c.data.server_time + parseInt(now.getTime() / 1000)
                    $scope.isShow = true
                    $scope.initCountDown()
                    $scope.remainTime = time
                    $scope.id = c.data.id
                } else {
                    $scope.isShow = false
                }
            }
        }, false)
    }
    $scope.checkRedPacket()
    $scope.refreshRedPacket = function () {
        var __innerStart = function () {
            $scope._timerRedRefresh = $timeout(function () {
                $scope.checkRedPacket()
                __innerStart()
            }, 300000)
        }
        __innerStart()
    }

    $scope.refreshRedPacket()
    //计时器
    $scope.isOpenAvailable = false
    $scope.initCountDown = function () {
        let __innerStart = function () {
            $scope._timer = $timeout(function () {
                $scope.countDownPro()
                __innerStart()
            }, 1000)
        }
        __innerStart()
    }
    $scope.countDownPro = function () {
        let fpBuyTime = function (m) {
            let str = Core.ShowCountDown(m)
            if (str == 'end') {
                $timeout.cancel($scope._timer)
                $scope.timeStr = '抢红包啦'
                $('.red-packet-text').text('活动已经开始了')
                $scope.isOpenAvailable = true
            } else {
                $scope.timeStr = str
            }
            $('.red-packet-count').text($scope.timeStr)
        }
        fpBuyTime($scope.remainTime*1000)
    }
    //退出页面关闭timer
    $scope.$on('$destroy', function () {
        $timeout.cancel($scope._timer)
        $timeout.cancel($scope._timerRedRefresh)
    })
    $scope.checkRemain = {
        total: 0,
        count: 0
    }
    //获取昨日存款量及可抢次数
    $scope.checkRemainRedPacket = function () {
        Core.get('red_bag/user_detail', function (json) {
            let c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.checkRemain.count = c.data.count
                $scope.checkRemain.total = c.data.total
            }
        }, false)
    }
    //获取红包排行榜
    $scope.getRedPacketList = function () {
        Core.get('red_bag/bag_list', function (json) {
            let c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.dataList = c.data
            }
        })
    }
    //抢红包
    $scope.catchRedPacket = function () {
        if ($scope.id) {
            let param = {
                id: $scope.id
            }
            Core.post('red_bag/grab_red_bag', param, function (json) {
                let c = angular.fromJson(json)
                if (c.code == 200) {
                    $scope.money = c.data.money
                    $scope.surplus_num = c.data.surplus_num
                    let msg = ''
                    if ($scope.surplus_num <= 0) {
                        msg = `<div class="red-packet-show-alert animated bounce">
                                    <div class="red-packet-top-show">
                                    <p class="red-packet-title">恭喜你抢到</p>
                                    <button class="red-packet-btn-closed"></button>
                                    <p class="red-packet-wins-info"><span class="price">` + $scope.money + `</span>元</p>
                                    <button class="red-packet-btn-again" disabled>次数已尽</button></div>
                                </div>`
                    } else {
                        msg = `<div class="red-packet-show-alert animated bounce">
                                    <div class="red-packet-top-show">
                                    <p class="red-packet-title">恭喜你抢到</p>
                                    <button class="red-packet-btn-closed"></button>
                                    <p class="red-packet-wins-info"><span class="price">` + $scope.money + `</span>元</p>
                                    <button class="red-packet-btn-again">再抢一次</button></div>
                                </div>`
                    }

                    let param = {
                        title: false,
                        msg: msg,
                        style: {
                            background: 'transparent',
                            minHeight: '480px'
                        }
                    }
                    $('.modal.blocker.current').remove()
                    Layer.modal(param)
                    $('.red-packet-btn-again').on('click', function () {
                        $('.modal.blocker.current').remove()
                        $scope.catchRedPacket()
                    })
                    $('.red-packet-btn-closed').on('click', function () {
                        $('.modal.blocker.current').remove()
                    })
                } else {
                    Layer.alert(c.msg)
                }
            })
        } else {
            Layer.alert('红包ID不能为空')
        }
    }
    //红包提示
    $scope.red_packet_notice = function () {
        $scope.html = ''
        Core.get('rules/game_rules/get_game_article_content?id=38', function (json) {
            var c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.html = c.data[0].content
            }
        })
    }
    //主页面红包关闭按钮
    $scope.red_packet_close = function () {
        $timeout.cancel($scope._timer)
        $('.red_packet_button_show').remove()
    }
    //如果没有登录，则不请求接口
    if ($scope.isLogin) {
        $scope.checkRemainRedPacket()
        $scope.getRedPacketList()
        $scope.red_packet_notice()
    }
    $scope.red_packet_login_show = function () {
        if ($scope.isLogin) {
            let msg = `<div class="red-packet-show-alert animated rubberBand">
        <div class="red-packet-login-show">
        <p class="red-packet-price p-target">您昨天充值金额` + $scope.checkRemain.total + `元</p>
        <p class="red-packet-time p-target">能抢` + $scope.checkRemain.count + `次</p>
        <button class="red-packet-btn-close"></button>
        <button class="red-packet-btn-open"></button>
        <p class="red-packet-text p-target">离活动开始时间</p>
        <p class="red-packet-count p-target">` + $scope.timeStr + `</p>
        <button class="red-packet-top ">&lt&lt红包排行榜</button>
        <button class="red-packet-detail ">红包说明&gt&gt</button>
        </div>
    </div>`
            let param = {
                title: false,
                msg: msg,
                style: {
                    background: 'transparent',
                    minHeight: '480px'
                }
            }
            Layer.modal(param)
            $('.red-packet-btn-close').on('click', function () {
                $('.modal.blocker.current').remove()
            })
            $('.red-packet-top').on('click', function () {
                let text = ''
                if ($scope.dataList != null) {
                    for (let i = 0; i < $scope.dataList.length; i++) {
                        text += '<li><div class="content">' + $scope.dataList[i].username + '</div><div>喜中' + $scope.dataList[i].total + '元</div></li>'
                    }
                }
                let msg = `<div class="red-packet-show-alert animated bounce">
            <div class="red-packet-top-show">
            <p class="red-packet-top-title">红包榜</p>
            <button class="red-packet-top-btn-close"></button>
             <marquee class="red-packet-marquee" isEqual="true" direction="up" scrollDelay="30">` + text + `</marquee></div>
        </div>`
                let param = {
                    title: false,
                    msg: msg,
                    style: {
                        background: 'transparent',
                        minHeight: '480px'
                    }
                }
                $('.modal.blocker.current').remove()
                Layer.modal(param)
                $('.red-packet-top-btn-close').on('click', function () {
                    $('.modal.blocker.current').remove()
                })
            })
            $('.red-packet-detail').on('click', function () {
                msg = `<div class="red_packet_bg">
                <div class="red-packet-notice-content">` + $scope.html + '</div></div>'
                let param = {
                    title: '红包说明',
                    msg: msg,
                    style: {
                        width: '790px',
                        marginLeft: '-400px',
                        height: '680px'
                    }
                }
                $('.modal.blocker.current').remove()
                Layer.modal(param)
                $('.modal-body').css('overflow', 'auto')
                $('.modal-body').css('height', '580px')
                $('.modal-body').css('text-align', 'left')
            })
            $('.red-packet-btn-open').on('click', function () {
                if ($scope.isOpenAvailable) {
                    $scope.catchRedPacket()
                } else {
                    Layer.alert('未开始，请耐心等候...')
                }
            })
        } else {
            Layer.alert('请先登录或注册', '温馨提示')
        }
    }
}