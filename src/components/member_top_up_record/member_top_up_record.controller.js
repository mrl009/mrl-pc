import angular from 'angular'
import $ from 'jQuery'
import moment from 'moment'

const member_top_up_recordCtrl = function ($scope, Core, Layer, Util) {
    $scope.switchStatus = function (status, type) {
        if (type == '1' || type == '2') {
            switch (status) {
                case '1':
                    return '等待审核'
                case '2':
                    return '审核通过'
                case '3':
                    return '审核未通过'
                default:
                    return status
            }
        } else if (type == '3') {
            switch (status) {
                case '1':
                    return '使用过'
                case '2':
                    return '未使用'
                default:
                    return status
            }
        } else {
            return status
        }
    }
    Core.get('user/income_record/get_list', function (json) {
        const c = angular.fromJson(json)
        if (c.code == 200) {
            $scope.topUpRecordData = c.data.rows.map(function (e) {
                e.status = $scope.switchStatus(e.status, e.type)
                return e
            })
            if ($scope.topUpRecordData.length < 15) {
                $('#nextTopUp').attr('disabled', true)
            } else {
                $('#nextTopUp').attr('disabled', false)
            }
        }
    }, false)

    $scope.search_fun = function () {
        let type = $('#topUpReordSelect').val()
        let time = $('#date-input').val()
        if (time != '') {
            time = time.split(' 至 ')
            if (time[0] != time[1]) {
                if (!moment(time[1]).isBetween(time[0], moment(time[0]).add(2, 'months')._d)) {
                    Layer.alert('查询时间间隔不能超过2个月', '温馨提示')
                    Layer.closeLoading()
                    return
                }
            }
        }
        Core.get('user/income_record/get_list?type=' + type + '&time_start=' + time[0] + '&time_end=' + time[1], function (json) {
            const c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.topUpRecordData = c.data.rows.map(function (e) {
                    e.status = $scope.switchStatus(e.status, e.type)
                    return e
                })
            }
            if ($scope.topUpRecordData.length < 15) {
                $('#nextTopUp').attr('disabled', true)
            } else {
                $('#nextTopUp').attr('disabled', false)
            }
        }, false)
    }
    $scope.showPicker = function () {
        Util.picker($('#date-input').get(0), () => {}, {mode: 'range'})
    }
}

export default member_top_up_recordCtrl