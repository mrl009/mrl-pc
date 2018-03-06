import angular from 'angular'
import $ from 'jQuery'
import md5 from 'md5'

const memberCtrl = function ($rootScope, $scope, Core, $state, Layer, $http) {
    $scope.$on('$destroy', function () {
        $rootScope.member_tips = true
    })
    $scope.showTable = function (i, isAdd) {
        if (i == 2) {
            $scope.bankIsAdd = isAdd
        }
        $('.safe_item_body').eq(i).toggle()
        $('.safe_item_body').not($('.safe_item_body').eq(i)).hide()
        /*if (i == 2 && !$scope.isSetPwd) {
            Layer.alert('请先设置资金密码', '温馨提示')
        } else {
            $('.safe_item_body').eq(i).toggle()
            $('.safe_item_body').not($('.safe_item_body').eq(i)).hide()
        }*/
    }
    Core.get('user/user/bank_list', function (json) {
        const c = angular.fromJson(json)
        if (c.code == 200) {
            $scope.data = c.data.rows
        }
    }, false)
    $scope.bank = {name: ''}
    Core.get('user/user/bank_name', function (json) {
        const c = angular.fromJson(json)
        if (c.code == 200) {
            $scope.bank = c.data
            if ($scope.bank.is_phone) {
                $scope.isPhone = true
            } else {
                $scope.isPhone = false
            }
            if ($scope.bank.name) {
                $scope.isBankName = true
            } else {
                $scope.isBankName = false
            }
            if ($scope.bank.phone) {
                $scope.isEmptyPhone = false
                $scope.editMoneyPwd.phone = $scope.bank.phone
            } else {
                $scope.isEmptyPhone = true
            }
        }
    }, false)
    Core.get('user/user_card/user_card', function (json) {
        const c = angular.fromJson(json)
        if (c.code == 200) {
            $scope.user_card = c.data ? c.data : []
        }
        $scope.iscardFlag = $scope.user_card.length
    }, false)
    $scope.getUser = function () {
        Core.get('user/user/user_balance', function (json) {
            const c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.userInfo = c.data
                // $scope.iscardFlag = c.data.binding
                $scope.isSetPwd = c.data.bank_pwd
                if (!$scope.isSetPwd && !$rootScope.member_tips) {
                    Layer.alert('为了您的资金安全请在第一时间设置资金密码', '温馨提示')
                    $scope.showTable(1)
                }
            }
        }, false)
    }
    $scope.getUser()
    $scope.editpwd = {
        oldpass: '',
        pass: '',
        repass: ''
    }
    // 是否开启密码强度校验
    Core.get('system/index?app_type=pc', function (json) {
        var c = angular.fromJson(json)
        if (c.code == 200) {
            $scope.pwd_reg = c.data.strength_pwd == 1 ? /^(?![^a-zA-Z]+$)(?!\D+$).{6,12}/ : /^.{6,12}$/
        }
    })
    $scope.setLoginPassword = function () {
        if (!$scope.editpwd.oldpass || !$scope.editpwd.pass || !$scope.editpwd.repass) {
            Layer.alert('密码不能为空', '温馨提示')
            return
        }
        else {
            if ($scope.editpwd.pass != $scope.editpwd.repass) {
                Layer.alert('新密码与重复输入密码不一致', '温馨提示')
            } else if (!$scope.pwd_reg.test($scope.editpwd.pass)) {
                Layer.alert('密码格式为：6-12位，不能包含汉字和空格！', '温馨提示')
            } else {
                if (/\s/.test($scope.editpwd.pass)) {
                    Layer.alert('密码格式为：6-12位，不能包含汉字和空格！', '温馨提示')
                    return false
                }
                if (/[\u4E00-\u9FA5]/g.test($scope.editpwd.pass)) {
                    Layer.alert('密码格式为：6-12位，不能包含汉字和空格！', '温馨提示')
                    return false
                }
                let param = {
                    'pwd': md5($scope.editpwd.oldpass),
                    'new_pwd': md5($scope.editpwd.pass)
                }
                Core.post('user/user/chang_login_pwd', param, function (json) {
                    const c = angular.fromJson(json)
                    if (c.code == 200) {
                        Core.setToken(c.data.token)
                        $state.go('home')
                    } else {
                        Layer.alert(json.msg, '温馨提示')
                    }
                })
            }
        }
    }
    $scope.editMoneyPwd = {
        old_pass: '',
        new_pass: '',
        re_new_pass: '',
        money_pass: '',
        phone: ''
    }
    $scope.setMoneyPassword = function () {
        if ($scope.isSetPwd) {
            if (!$scope.editMoneyPwd.old_pass || !$scope.editMoneyPwd.new_pass || !$scope.editMoneyPwd.re_new_pass) {
                Layer.alert('密码不能为空', '温馨提示')
                return
            }
            let reg = new RegExp(/^\d{6}$/)
            if ($scope.editMoneyPwd.new_pass != $scope.editMoneyPwd.re_new_pass) {
                Layer.alert('新密码与重复输入密码不一致', '温馨提示')
            } else if (!reg.test($scope.editMoneyPwd.new_pass)) {
                Layer.alert('资金密码必须为6位纯数字', '温馨提示')
            } else {
                let param = {
                    'bank_pwd': md5($scope.editMoneyPwd.old_pass),
                    'new_pwd': md5($scope.editMoneyPwd.new_pass)
                }
                Core.post('user/user/bank_pwd_chang', param, function (json) {
                    const c = angular.fromJson(json)
                    if (c.code == 200) {
                        Layer.alert(json.msg, '温馨提示')
                        $scope.reloadRoute()
                    } else {
                        Layer.alert(json.msg, '温馨提示')
                    }
                })
            }
        } else {
            if (!$scope.bank.name || !$scope.editMoneyPwd.money_pass) {
                Layer.alert('参数不能为空', '温馨提示')
            } else {
                let reg = new RegExp(/^\d{6}$/)
                if (!reg.test($scope.editMoneyPwd.money_pass)) {
                    Layer.alert('资金密码必须为6位纯数字', '温馨提示')
                } else {
                    let param = ''
                    if ($scope.isPhone) {
                        if (!/^1[3|4|5|8][0-9]\d{4,8}$/.test($scope.editMoneyPwd.phone)) {
                            Layer.alert('手机密码应为11位，并且格式要正确', '温馨提示')
                            return
                        } else {
                            param = {
                                'bank_name': $scope.bank.name,
                                'bank_pwd': md5($scope.editMoneyPwd.money_pass),
                                'phone': $scope.editMoneyPwd.phone
                            }
                        }
                    } else {
                        param = {
                            'bank_name': $scope.bank.name,
                            'bank_pwd': md5($scope.editMoneyPwd.money_pass)
                        }
                    }
                    Core.post('user/user/bank_pwd_add', param, function (json) {
                        const c = angular.fromJson(json)
                        if (c.code == 200) {
                            $scope.isBankName = true
                            Layer.alert('密码设置成功', '温馨提示')
                            $scope.reloadRoute()
                        } else {
                            Layer.alert(json.msg, '温馨提示')
                        }
                    })
                }
            }
        }
    }
    $scope.setBankPwd = {
        bank_account: '',
        bank_address: '',
        checkpass: ''
    }
    $scope.setBankCard = function () {
        if ($scope.iscardFlag < 3) {
            if (!$scope.bank.name) {
                Layer.alert('请输入真实姓名', '温馨提示')
                return
            }
            if ($scope.isPhone && !$scope.bank.phone) {
                Layer.alert('请输入手机号', '温馨提示')
                return
            }
            if (!$scope.bank_id) {
                Layer.alert('请选择开户银行', '温馨提示')
                return
            }
            $scope.file = $('#img_url').val()
            if ($scope.isQrCode == 1 && !$scope.file) {
                Layer.alert('请上传收款二维码。', '温馨提示')
                return
            }
            if ($scope.isQrCode != 1 && !$scope.setBankPwd.bank_address) {
                Layer.alert('请输入开户行地址', '温馨提示')
                return
            }
            if (!$scope.setBankPwd.bank_account ) {
                Layer.alert('请输入账号', '温馨提示')
                return
            }
            if (!$scope.setBankPwd.checkpass ) {
                Layer.alert('请输入资金密码', '温馨提示')
                return
            }
            if (!$scope.setBankPwd.checkpass) {
                Layer.alert('银行卡相关信息不能为空', '温馨提示')
                return
            }
            let reg = new RegExp('^[0-9]*$')
            if ($scope.isQrCode != 1 && !reg.test($scope.setBankPwd.bank_account) || $scope.setBankPwd.bank_account.length > 21) {
                Layer.alert('银行卡号必须是纯数字,且长度最大为21位', '温馨提示')
            } else {
                reg = /\s/
                if (reg.test($scope.setBankPwd.bank_address)) {
                    Layer.alert('银行卡地址必须没有空格', '温馨提示')
                } else {
                    let param = {
                        'file': $scope.file,
                        'bank_id': $scope.bank_id,
                        'phone': $scope.bank.phone,
                        'bank_name': $scope.bank.name,
                        'num': $scope.setBankPwd.bank_account,
                        'address': $scope.setBankPwd.bank_address,
                        'bank_pwd': md5($scope.setBankPwd.checkpass)
                    }
                    Core.post('user/user_card/card_add', param, function (json) {
                        const c = angular.fromJson(json)
                        if (c.code == 200) {
                            Layer.alert(json.msg, '温馨提示')
                            $scope.reloadRoute()
                        } else {
                            Layer.alert(json.msg, '温馨提示')
                        }
                    })
                }
            }
        } else {
            Layer.alert('银行卡达到绑定上限', '温馨提示')
        }
    }
    $scope.isQrCode = false
    $scope.selectBank = function (bank_id) {
        $scope.isQrCode = $('#bank_id').find('option:selected').attr('qrcode')
        $scope.bank_id = bank_id
    }
    $scope.fileUpload = function () {
        if ($scope.isQrCode == 1) {
            var fd = new FormData()
            var file = document.querySelector('input[type=file]').files[0]
            fd.append('file', file)
            $http({
                method: 'POST',
                // url: 'http://www.guocaitupian.com/uploads.php',
                url: 'https://www.sqxingyun.com/uploads.php',
                data: fd,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            }).then(function successCallback(rs) {
                if (rs.data.result) {
                    let extension = rs.data.result.substr(-3)
                    if (extension == 'jpeg' || extension == 'gif' || extension == 'png' || extension == 'jpg') {
                        $scope.data.file = rs.data.result
                        $('.thumb').attr('src', rs.data.result).removeClass('hidden')
                        $('#img_url').val(rs.data.result)
                    }
                }
            }, function errorCallback() {
                Layer.alert('上传失败', '温馨提示', 5)
            })
        }
    }
    $scope.reloadRoute = function () {
        location.reload()
    }
    $scope.logout = function () {
        Layer.confirm({
            msg: '确定要退出吗？',
            okFn: function () {
                Core.get('login/logout', function (json) {
                    var c = angular.fromJson(json)
                    if (c.code == 604) {
                        Core.removeToken()
                        $scope.isLogin = false
                        Layer.headTip(c.msg)
                        $scope.data = {}
                    } else {
                        Layer.headTip(c.msg)
                    }
                    $state.go('home')
                })
            }
        })
        return
    }
}

export default memberCtrl