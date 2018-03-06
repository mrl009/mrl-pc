import angular from 'angular'
import $ from 'jQuery'
// import {API, IMG_ROOT} from '../../config'
// import Flatpickr from 'flatpickr'
// import zh from 'flatpickr/dist/l10n/zh.js'

const member_top_upCtrl = function ($rootScope, $scope, Core, Layer, $timeout, $state, Indexeddb) {
    Indexeddb.openDB()
    Core.get('pay/pay/pay_method', function (json) {
        var c = angular.fromJson(json)
        if (c.code == 200) {
            $scope.user = c.data.user
            $scope.payList = c.data.zhifu
            $scope.selPayMent($scope.payList[0].type, $scope.payList[0].list[0], 0)
            if (c.data.is_bomb_box.bomb_box) {
                if (!$rootScope.bomb_box) {
                    let param = {
                        title: '温馨提示',
                        msg: `<div style="padding: 10px">${c.data.is_bomb_box.bomb_box}</div>`,
                        style: {
                            width: '480px',
                            minHeight: '200px',
                            marginLeft: '-240px'
                        }
                    }
                    Layer.modal(param)
                    $('.modal-body').css('text-align', 'left')
                }
            }
        }
    }, false)
    $scope.pay = {type: '', info: '', money: '', card_pwd: '', bj: ''}
    $scope.changeTab = function (i, type) {
        $scope.pay.type = type
        $scope.pay.info = ''
        $scope.pay.bj = ''
        $('.tanContainer-li').eq(i).addClass('active')
        $('.tanContainer-li').not($('.tanContainer-li').eq(i)).removeClass('active')
        $('.tanContent-li').eq(i).addClass('fdiv')
        $('.tanContent-li').not($('.tanContent-li').eq(i)).removeClass('fdiv')
        $scope.selPayMent(type, $scope.payList[i].list[0], 0)
    }
    $scope.filter = function (e) {
        let price = $(e.target).val()
        if (price.indexOf('.') > -1 && price.split('.')[1] != '' && price.split('.')[1].length > 2) {
            $(e.target).val(parseFloat(parseInt(price * 100) / 100))
        }
    }
    $scope.selPayMent = function (type, d, index) {
        $scope.pay.type = type
        $scope.pay.info = d
        $scope.pay.bj = index
    }
    $scope.subPay = function () {
        $scope.html =''
        $scope.pay.money = $('.member_topup_input').val()
        if (!$scope.pay.info && $scope.pay.type != 'card') {
            Layer.alert('请选择支付方式', '温馨提示')
            return
        }
        if ($scope.pay.money <= 0 && $scope.pay.type != 'card') {
            Layer.alert('请输入充值金额', '温馨提示')
            return
        } else if ($scope.pay.type != 'card' && parseInt($scope.pay.money) < parseInt($scope.pay.info.catm_min)) {
            Layer.alert('最少充值金额为' + $scope.pay.info.catm_min, '温馨提示')
            return
        } else if ($scope.pay.type != 'card' && parseInt($scope.pay.money) > parseInt($scope.pay.info.catm_max)) {
            Layer.alert('该方式充值上限为' + $scope.pay.info.catm_max, '温馨提示')
            return
        }
        if ($scope.pay.type == 'card' && !$scope.pay.card_pwd) {
            Layer.alert('请输入彩豆卡号', '温馨提示')
            return
        }
        if ($scope.pay.type == 'card') {
            $scope.data = {
                id: $scope.pay.info.id,
                code: $scope.pay.info.code,
                card_pwd: $scope.pay.card_pwd,
                from_way: 4
            }
        } else if ($scope.pay.type == 'wy') {
            $scope.data = {
                money: $scope.pay.money,
                id: $scope.pay.info.id,
                code: $scope.pay.info.code,
                bank_type: $scope.pay.info.bank_type,
                from_way: 4
            }
        }
        else if ($scope.pay.type == 'bank' || $scope.pay.type == 'zfb' && $scope.pay.info.jump_mode == 2) {
            $scope.data = {
                money: $scope.pay.money,
                id: $scope.pay.info.id,
                code: $scope.pay.info.code,
                bank_name: $scope.pay.info.bank_name,
                user: $scope.pay.info.name,
                card_address: $scope.pay.info.card_address,
                num: $scope.pay.info.num,
                name: '',
                bank_style: '',
                pay_type: $scope.pay.type,
                from_way: 4
            }
            Indexeddb.saveData({key: 'bankData', data: JSON.stringify($scope.data)}, function () {
                $state.go('member.member_top_up_company')
                return
            })
            return
        } else {
            $scope.data = {
                money: $scope.pay.money,
                id: $scope.pay.info.id,
                code: $scope.pay.info.code,
                jump_mode: $scope.pay.info.jump_mode,
                qrcode: $scope.pay.info.qrcode,
                from_way: 4
            }
        }
        if ($scope.pay.info.jump_mode == 4) {
            let cid = $scope.getType($scope.pay.info.jump_mode, $scope.pay.type)
            Core.get('rules/game_rules/get_game_article_content?id=' + cid, function (tt) {
                let d = angular.fromJson(tt)
                if (d.code == 200) {
                    if (d.data[0].content) {
                        $scope.html = d.data[0].content || ''
                    }
                    let msg = ''
                    if ($scope.pay.info.is_confirm) {
                        msg = `<div style="padding: 10px">
                            <p class="first"><span>充值金额：${$scope.pay.money}</span></p>
                            <p class="first"><span>商户订单号：</span><input class="member-confirm-input" type="text"></p>
                            <p class="first"><span style="color:red;font-size: 10px">*支付完成后，请输入商户订单号后9位，点击确认按钮提交</span></p>
                            <p><img src="${$scope.pay.info.qrcode}"></p>
                            <div class="left" style="padding:10px;text-align:left;line-height: 25px;">${$scope.html}</div>
                        </div>
                    `
                    } else {
                        msg = `<div style="padding: 10px">
                            <p class="first"><span>充值金额：${$scope.pay.money}</span></p>
                            <p class="first"><span style="color:red;font-size: 10px">*支付完成后，请点击确认按钮提交</span></p>
                            <p><img src="${$scope.pay.info.qrcode}"></p>
                            <div class="left" style="padding:10px;text-align:left;line-height: 25px;">${$scope.html}</div>
                        </div>
                    `
                    }

                    let param = {
                        title: '充值详情',
                        msg: msg,
                        style: {
                            width: '480px',
                            minHeight: '320px',
                            marginLeft: '-240px'
                        },
                        okFn: function () {
                            let param = ''
                            if ($scope.pay.info.is_confirm) {
                                let inputVal = $('.member-confirm-input').val()
                                if (!/^[0-9a-zA-Z]{9}$/g.test(inputVal)) {
                                    Layer.alert('商户订单号必须为9位数字或字母')
                                    return
                                }
                                param = {
                                    money: $scope.pay.money,
                                    id: $scope.pay.info.id,
                                    code: $scope.pay.info.code,
                                    from_way: 4,
                                    confirm: inputVal
                                }
                            } else {
                                param = {
                                    money: $scope.pay.money,
                                    id: $scope.pay.info.id,
                                    code: $scope.pay.info.code,
                                    from_way: 4
                                }
                            }
                            Core.post('pay/pay/pay_do', param, function (json) {
                                var c = angular.fromJson(json)
                                if (c.code == 200) {
                                    Layer.alert('充值成功')
                                    $timeout(function () {
                                        $state.go('member.member_top_up')
                                    }, 1500)
                                } else {
                                    Layer.alert(c.msg)
                                }
                            })
                        },
                        okText: '我已支付'
                    }
                    Layer.closeLoading()
                    Layer.member_confirm(param)
                }
            })
        } else {
            Core.post('pay/pay/pay_do', $scope.data, function (json) {
                var c = angular.fromJson(json)
                Layer.closeLoading()
                if (c.code == 200) {
                    if ($scope.pay.type == 'card') {
                        Layer.alert('充值成功！充值金额为' + c.data.money + '元', '温馨提示')
                        $timeout(function () {
                            $state.go('member.member_top_up')
                        }, 1500)
                        return
                    }
                    if (c.data.url) {
                        //let openLink = $('<a href="' + c.data.url + '" target="_blank"></a>')
                        //openLink[0].click()
                        Layer.confirm({
                            target: `<a href="${c.data.url}" target="_blank" style="color:#fff;display:block;width:90px;height:30px;line-height: 30px;">确认</a>`,
                            msg: '是否跳转至新的支付窗口?'
                        })
                    } else {
                        let cid = $scope.getType(c.data.jump, $scope.pay.type)
                        Core.get('rules/game_rules/get_game_article_content?id=' + cid, function (tt) {
                            let d = angular.fromJson(tt)
                            if (d.code == 200) {
                                if (d.data[0].content) {
                                    $scope.html = d.data[0].content
                                }
                                let msg = `
                        <div style="font-size:14px;color: #c90021">温馨提示：为了提高入款速度,系统自带小数点金额充值,扫码支付后,系统会按照实际充值金额到账</div>
                       
                        <div style="padding: 10px">
                            <p class="first"><span>订单号：${c.data.order_num}</span></p>
                            <p class="first"><span>充值金额：${c.data.money}</span></p>
                            <p><img src="${c.data.img}"></p>
                            <div class="left" style="padding-left:15px;text-align:left;line-height: 25px;">${$scope.html}</div>
                        </div>
                    `
                                let param = {
                                    title: '充值详情',
                                    msg: msg,
                                    style: {
                                        width: '480px',
                                        minHeight: '320px',
                                        marginLeft: '-240px'
                                    },
                                    okText: '我已支付'
                                }
                                Layer.member_confirm(param)
                            }
                        })
                    }
                } else {
                    Layer.alert(c.msg, '温馨提示')
                }
            })
        }
        Layer.loading()
    }

    $scope.getType = function (c, type) {
        if (c == 4) { //好友
            switch (type) {
                case 'zfb':
                    return 15
                case 'wx':
                    return 13
                case 'qq':
                    return 22
                case 'jd':
                    return 23
                case 'bd':
                    return 24
                case 'xm':
                    return 25
                case 'cft':
                    return 29
                case 'hw':
                    return 26
                case 'sx':
                    return 27
                default:
                    return ''
            }
        } else { //公众号
            switch (type) {
                case 'qq':
                    return 23
                case 'jd':
                    return 24
                case 'bd':
                    return 26
                case 'xm':
                    return 31
                case 'hw':
                    return 32
                case 'sx':
                    return 33
                case 'zfb':
                    return 14
                case 'wx':
                    return 12
                case 'yl':
                    return 30
                case 'cft':
                    return 28
                default:
                    return ''
            }
        }
    }
}

export default member_top_upCtrl