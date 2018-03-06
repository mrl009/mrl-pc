import angular from 'angular'
import $ from 'jQuery'
export default function ($scope, $sce, Core, Layer) {
    //需要检验的输入框
    $scope.initDate = function () {
        $scope.title = '申请代理'
        $scope.phone = ''
        $scope.email = ''
        $scope.qq = ''
        $scope.user_memo = '申请理由，建议........'
        $scope.init_memo = '申请理由，建议........'
        $scope.url = '/agent/create_agent_account'//申请代理接口
        $scope.username = ''
        $scope.isDisabled = false
        $scope.statusDate = ''//审核状态
        $scope.statusTips = ''
        $scope.isSubmit = false
        $scope.isStatusNoTow = false
        //$scope.getCheckStatus()
    }
    //$scope.initDate()
    //校验方法
    $scope.checkLen = function (obj) {
        if (obj && obj.error && obj.method) {
            if (!obj.method(obj.ask)) {
                Layer.alert(obj.error, '温馨提示')
                return false
            }
        }
    }
    //手机号码检测
    $scope.checkPhone = function () {
        if (!/^1[34578]\d{9}$/.test($scope.phone)) {
            // Layer.alert("手机号码有误，请重填",'温馨提示')
            return false
        } else {
            return true
        }
    }
    //email检测
    $scope.checkEmail = function () {
        if (!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test($scope.email)) {
            //Layer.alert('email地址有误,请重新填写','温馨提示')
            return false
        } else {
            return true
        }
    }
    $scope.checkQQ = function () {
        if (!/^\D{8}$/.test($scope.qq)) {
            return false
        } else {
            return true
        }
    }
    $scope.checkWX = function () {
        var reg = /^[a-zA-Z\d_]{5,}$/
        if (!reg.test($scope.qq)) {
            return false
        } else {
            return true
        }
    }
    $scope.checkQQandWX = function () {
        var checkqq = $scope.checkQQ()
        var checkwx = $scope.checkWX()
        if (checkqq) {
            return true
        } else if (checkwx) {
            return true
        } else {
            return false
        }
    }
    //获取审核结果
    $scope.getCheckStatus = function () {
        Core.get('agent/check_agent_register', function (data) {
            var c = angular.fromJson(data)
            if (c.code == 200) {
                $scope.statusDate = c.data
                if ($scope.statusDate.status) {
                    $scope.isDisabled = true
                    $scope.isSubmit = true
                    if ($scope.statusDate.status == 2) {
                        $scope.isStatusNoTow = true
                    }
                }
                $scope.phone = $scope.statusDate.phone
                $scope.email = $scope.statusDate.email
                $scope.qq = $scope.statusDate.qq
                if ($scope.statusDate.user_memo) {
                    $scope.user_memo = $scope.statusDate.user_memo
                } else {
                    $scope.user_memo = $scope.init_memo
                }
                $scope.checkStatusTips(c.data.status)
            } else {
                // $scope.initDate()
            }
        }, false)
    }
    //检测集合
    $scope.register = function () {
        $scope.phone = $('.phone').val()
        $scope.email = $('.email').val()
        $scope.qq = $('.qq').val()
        $scope.user_memo = $('.content-box').val()
        var checkphone = $scope.checkPhone()
        var checkeamil = $scope.checkEmail()
        var checkwxORqq = $scope.checkQQandWX()
        if (!checkphone) {
            Layer.alert('手机号码有误，请重填', '温馨提示')
            return false
        } else if (!checkeamil) {
            Layer.alert('email地址有误,请重新填写', '温馨提示')
            return false
        } else if (!checkwxORqq) {
            Layer.alert('你的微信账号或QQ账号填写有误,请重新填写', '温馨提示')
            return false
        } else {
            //url,params,success
            if ($scope.user_memo == $scope.init_memo) {
                $scope.user_memo = ''
            }
            var params = {
                phone: $scope.phone,
                email: $scope.email,
                qq: $scope.qq,
                user_memo: $scope.user_memo
            }
            Core.post($scope.url, params, function (data) {
                var c = angular.fromJson(data)
                if (c.code == 200) {
                    Layer.alert(c.msg, '温馨提示')
                    $scope.isDisabled = true
                    $scope.isStatusNoTow = false
                    $scope.getCheckStatus()
                } else {
                    Layer.alert(c.msg, '温馨提示')
                }
            })
        }
    }
    //判断状态：1提交申请, 2补充资料，3已拒绝，4审核通过
    $scope.checkStatusTips = function (status) {
        switch (status) {
            case '1':
                $scope.statusTips = '审核中....'
                break
            case '2':
                $scope.statusTips = '请补充资料'
                $scope.isDisabled = false
                break
            case '3':
                $scope.statusTips = '申请已被系统拒绝...'
                break
            default:
                break
        }
    }
    $scope.initDate()
    $scope.getCheckStatus()
}