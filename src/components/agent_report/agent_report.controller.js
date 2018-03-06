import angular from 'angular'
import $ from 'jQuery'
import moment from 'moment'

export default function ($scope, $sce, Core, Layer, Util) {
    $scope.initData = function () {
        $scope.items = []
        $scope.page = 1
        $scope.isEmpty = false
        $scope.moredata = false
    }
    $scope.nextAgentIndex = 1
    $scope.getTotalReport = function () {
        Layer.loading()
        let time = $('#date-input').val()
        let url = ''
        if (time != '') {
            time = time.split(' 至 ')
            if (time[0] != time[1]) {
                if (!moment(time[1]).isBetween(time[0], moment(time[0]).add(2, 'months')._d)) {
                    Layer.alert('查询时间间隔不能超过2个月', '温馨提示')
                    Layer.closeLoading()
                    return
                }
            }
            url = 'agent/get_agent_report?time_start=' + time[0] + '&time_end=' + time[1]
        } else {
            url = 'agent/get_agent_report'
        }
        Core.get(url, function (json) {
            Layer.closeLoading()
            const c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.total_now_price = c.data[0].total_now_price
                $scope.total_rate_price = c.data[0].total_rate_price
            }
        }, false)
    }
    $scope.setAgentTime = function (i) {
        let time = {
            time_start: '',
            time_end: ''
        }
        switch (i) {
            case 1:
                time.time_start = moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DD')
                time.time_end = moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DD')
                break
            case 2:
                time.time_start = moment().startOf('week').format('YYYY-MM-DD')
                time.time_end = moment().endOf('week').format('YYYY-MM-DD')
                break
            case 3:
                time.time_start = moment().startOf('month').format('YYYY-MM-DD')
                time.time_end = moment().endOf('month').format('YYYY-MM-DD')
                break
            default:
                break
        }
        let time_str = time.time_start + ' 至 ' + time.time_end
        $('#date-input').val(time_str)
    }
    $scope.getTotalReport()
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
        Core.get('agent/get_agent_set', function (json) {
            Layer.closeLoading()
            var c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.initData()
                $scope.items = c.data
                if ($scope.items.length == 0) {
                    $scope.isEmpty = true
                }
            }
        }, false)
    }
    $scope.getAgentList()
    $scope.showPicker = function () {
        Util.picker($('#date-input').get(0), () => {
        }, {mode: 'range'})
    }
}