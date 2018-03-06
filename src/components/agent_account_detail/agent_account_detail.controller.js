import angular from 'angular'
import $ from 'jQuery'
export default function ($scope, $sce, Core, Layer) {
    $scope.data = {username: ''}
    $scope.initData = function () {
        $scope.items = []
        $scope.page = 1
        $scope.isEmpty = false
        $scope.moredata = false
    }
    $scope.nextAgentIndex = 1
    $scope.getAgentList = function () {
        Layer.loading()
        Core.get('user/cash_list/get_agent_list?username=' + $scope.data.username + '&page=' + $scope.nextAgentIndex, function (json) {
            Layer.closeLoading()
            var c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.initData()
                $scope.items = c.data.rows
                if ($scope.items.length == 0) {
                    $scope.isEmpty = true
                }
                if ($scope.items.length < 15) {
                    $('#agent_account_next').attr('disabled', true)
                } else {
                    $('#agent_account_next').attr('disabled', false)
                }
            }
        }, false)
        if ($scope.nextAgentIndex <= 1) {
            $('#agent_account_pre').attr('disabled', true)
        } else {
            $('#agent_account_pre').attr('disabled', false)
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