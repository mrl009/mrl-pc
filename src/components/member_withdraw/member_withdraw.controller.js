import angular from 'angular'
import md5 from 'md5'

const member_withdrawCtrl = function ($scope, Core, Layer, $timeout, $state) {
    $scope.data = {money: '', bank_pwd: '', out_type: 0}
    Core.get('pay/out_mamage/out_show', function (json) {
        var c = angular.fromJson(json)
        if (c.code == 200) {
            $scope.items = c.data
        } else {
            Layer.alert(c.msg, '温馨提示')
            $state.go('member.user_center')
        }
    }, false)

    Core.get('user/user_card/user_card', function (json) {
        const c = angular.fromJson(json)
        if (c.code == 200 && c.data) {
            $scope.user_card = c.data
            $scope.bank_id = c.data[0].bank_id
            $scope.setType($scope.bank_id)
        } else {
            Layer.alert('请先绑定银行卡', '温馨提示', 1)
            $state.go('member.user_center')
        }
    }, false)

    $scope.setType = function (bank_id) {
        $scope.bank_id = bank_id
        if (bank_id == 51) {
            $scope.data.out_type = 2
        } else if (bank_id == 52) {
            $scope.data.out_type = 3
        } else {
            $scope.data.out_type = 1
        }
    }

    $scope.withdraw = function () {
        if ($scope.data.out_type == 0) {
            Layer.alert('请选择支付类型', '温馨提示')
            return
        }
        if ($scope.data.money == 0) {
            Layer.alert('请输入提现金额', '温馨提示')
            return
        }
        if (!$scope.data.bank_pwd || $scope.data.bank_pwd.length != 6) {
            Layer.alert('请输入资金密码', '温馨提示')
            return
        }
        $scope.isConfrim = false
        if ($scope.items.all_fee != 0 || $scope.items.all_fee != '0.00') {
            let param = {
                okFn: function () {
                    $scope.data.bank_pwd = md5($scope.data.bank_pwd)
                    Core.post('pay/Out_mamage/member_out', $scope.data, function (json) {
                        var c = angular.fromJson(json)
                        if (c.code == 200) {
                            Layer.alert('提现成功', '温馨提示')
                            $timeout(function () {
                                $state.go('member.member_withdraw_record')
                            }, 1000)
                        } else {
                            Layer.alert(c.msg, '温馨提示')
                            return
                        }
                    })
                    $scope.data.bank_pwd = ''
                    $scope.data.money = ''
                },
                msg: `<div class="withdraw-confirm">
                <p><span class="confirm-left">还需打码量：</span><span class="confirm-right">${$scope.items.auth_dml}</span></p>
                <p><span class="confirm-left">手续费：</span><span class="confirm-right">${$scope.items.out_fee}</span></p>
                <p><span class="confirm-left">行政费：</span><span class="confirm-right">${$scope.items.total_ratio_price}</span></p>
                <p><span class="confirm-left">总扣除：</span><span class="confirm-right">${$scope.items.all_fee}</span></p>
                </div>
                `,
                title: '温馨提示'
            }
            Layer.member_confirm(param)
        } else {
            $scope.data.bank_pwd = md5($scope.data.bank_pwd)
            Core.post('pay/Out_mamage/member_out', $scope.data, function (json) {
                var c = angular.fromJson(json)
                if (c.code == 200) {
                    Layer.alert('提现成功', '温馨提示')
                    $timeout(function () {
                        $state.go('member.member_withdraw_record')
                    }, 1000)
                } else {
                    Layer.alert(c.msg, '温馨提示')
                    return
                }
            })
            $scope.data.bank_pwd = ''
            $scope.data.money = ''
        }
    }
}

export default member_withdrawCtrl