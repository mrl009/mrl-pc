import angular from 'angular'
import $ from 'jQuery'
export default function ($scope, $sce, Core, Layer) {
    $scope.initData = function () {
        $scope.items = []
        $scope.page = 1
        $scope.isEmpty = false
        $scope.moredata = false
    }
    $scope.nextAgentIndex = 1
    $scope.switchStatus = function (status) {
        switch (status) {
            case '1':
                return '已返'
            case '2':
                return '未返'
            default:
                return status
        }
    }
    $scope.getAgentList = function () {
        Layer.loading()
        Core.get('agent/get_agent_count?&page=' + $scope.nextAgentIndex, function (json) {
            Layer.closeLoading()
            var c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.initData()
                $scope.total_now_price = c.data.total_now_price
                $scope.total_rate_price = c.data.total_rate_price
                $scope.items = c.data.rows.map(function (e) {
                    e.status = $scope.switchStatus(e.status, e.type)
                    return e
                })
                if ($scope.items.length == 0) {
                    $scope.isEmpty = true
                }
                if ($scope.items.length < 15) {
                    $('#agent_charge_next').attr('disabled', true)
                } else {
                    $('#agent_charge_next').attr('disabled', false)
                }
            }
        }, false)
        if ($scope.nextAgentIndex <= 1) {
            $('#agent_charge_pre').attr('disabled', true)
        } else {
            $('#agent_charge_pre').attr('disabled', false)
        }
    }
    $scope.getAgentList()
    $scope.nextAgentPage = function (i) {
        if (i) {
            $scope.nextAgentIndex++
        } else {
            if ($scope.nextAgentIndex > 1) {
                $scope.nextAgentIndex--
            }
        }
        $scope.getAgentList()
    }
}