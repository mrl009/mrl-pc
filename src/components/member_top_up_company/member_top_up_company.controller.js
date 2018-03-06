import angular from 'angular'
import $ from 'jQuery'
// import {API, IMG_ROOT} from '../../config'
// import Flatpickr from 'flatpickr'
// import zh from 'flatpickr/dist/l10n/zh.js'

const member_top_up_companyCtrl = function ($rootScope, $scope, $location, $timeout, $state, Core, Layer, Indexeddb) {
    Indexeddb.openDB()
    $scope.items = []
    $scope.time = new Date().getTime()
    $scope.$on('$destroy', function () {
        $rootScope.bomb_box = true
    })
    $timeout(function () {
        Indexeddb.getData('bankData', function (c) {
            $scope.items = c == null ? [] : JSON.parse(c)
            $scope.data = {
                money: $scope.items.money,
                id: $scope.items.id,
                code: $scope.items.code,
                from_way: $scope.items.from_way,
                bank_style: 0,
                name: ''
            }
        })
    }, 100)
    $timeout(function () {
        $('#bankName').focus()
        $('#bankName').blur()
    }, 200)
    $scope.topUp = function () {
        if ($scope.data.money <= 0) {
            Layer.alert('请输入充值金额', '温馨提示')
            return
        }
        if ($scope.data.name == '') {
            Layer.alert('请输入存款人姓名', '温馨提示')
            return
        } else if (/\s/.test($scope.data.name)) {
            Layer.alert('存款人姓名不能有空格', '温馨提示')
            return
        }
        if ($scope.data.bank_style == 0) {
            Layer.alert('请选择充值方式', '温馨提示')
            return
        }
        Layer.loading()
        Core.post('pay/pay/pay_do', $scope.data, function (json) {
            var c = angular.fromJson(json)
            Layer.closeLoading()
            if (c.code == 200) {
                Layer.alert('充值成功', '温馨提示')
                $timeout(function () {
                    $state.go('member.member_top_up_record')
                }, 1000)
            } else {
                Layer.alert(c.msg, '温馨提示')
            }
        })
    }
    $scope.bankStyle = function (v) {
        $scope.data.bank_style = v
    }
}

export default member_top_up_companyCtrl