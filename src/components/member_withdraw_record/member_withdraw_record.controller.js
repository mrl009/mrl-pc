import angular from 'angular'
import $ from 'jQuery'
import moment from 'moment'

const member_withdrawCtrl = function ($scope, Core, Layer, Util) {
    $scope.switchStatus = function (status) {
        switch (status) {
            case '1':
                return '审核中'
            case '2':
                return '提现成功'
            case '3':
                return '取消提现'
            case '4':
                return '预备提现'
            case '5':
                return '审核未通过'
            default:
                return status
        }
    }
    Core.get('user/Payout_record/get_payout_list', function (json) {
        const c = angular.fromJson(json)
        if (c.code == 200) {
            $scope.withdrawRecordData = c.data.rows
            for (let i = 0; i < $scope.withdrawRecordData.length; i++) {
                if ($scope.withdrawRecordData.length != 0) {
                    switch ($scope.withdrawRecordData[i].status) {
                        case '1':
                            $scope.withdrawRecordData[i].status = '审核中'
                            break
                        case '2':
                            $scope.withdrawRecordData[i].status = '提现成功'
                            break
                        case '3':
                            $scope.withdrawRecordData[i].status = '取消提现'
                            break
                        case '4':
                            $scope.withdrawRecordData[i].status = '预备提现'
                            break
                        case '5':
                            $scope.withdrawRecordData[i].status = '审核未通过'
                            break
                        default:
                            break
                    }
                }
            }
            if ($scope.withdrawRecordData.length < 20) {
                $('#nextWithdraw').attr('disabled', true)
            } else {
                $('#nextWithdraw').attr('disabled', false)
            }
        }
    }, false)
    $scope.search_fun = function () {
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
        let status = $('#withdrawReordSelect').val()
        Core.get('user/Payout_record/get_payout_list?type=' + status + '&time_start=' + time[0] + '&time_end=' + time[1], function (json) {
            const c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.withdrawRecordData = c.data.rows.map(function (e) {
                    e.status = $scope.switchStatus(e.status, e.type)
                    return e
                })
                if ($scope.withdrawRecordData.length < 20) {
                    $('#nextWithdraw').attr('disabled', true)
                } else {
                    $('#nextWithdraw').attr('disabled', false)
                }
            }
        }, false)
        if ($scope.nextWithdrawIndex <= 1) {
            $('#nextWithdrawPre').attr('disabled', true)
        } else {
            $('#nextWithdrawPre').attr('disabled', false)
        }
    }
    $scope.nextWithdrawIndex = 1
    $scope.nextWithdrawPage = function (i) {
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
        if (i) {
            $scope.nextWithdrawIndex++
        } else {
            if ($scope.nextWithdrawIndex > 1) {
                $scope.nextWithdrawIndex--
            }
        }
        let status = $('#withdrawReordSelect').val()
        Core.get('user/Payout_record/get_payout_list?type=' + status + '&time_start=' + time[0] + '&time_end=' + time[1] + '&page=' + $scope.nextWithdrawIndex, function (json) {
            const c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.withdrawRecordData = c.data.rows.map(function (e) {
                    e.status = $scope.switchStatus(e.status, e.type)
                    return e
                })
                if ($scope.withdrawRecordData.length < 20) {
                    $('#nextWithdraw').attr('disabled', true)
                } else {
                    $('#nextWithdraw').attr('disabled', false)
                }
            }
        }, false)
        if ($scope.nextWithdrawIndex <= 1) {
            $('#nextWithdrawPre').attr('disabled', true)
        } else {
            $('#nextWithdrawPre').attr('disabled', false)
        }
    }
    $scope.showPicker = function () {
        Util.picker($('#date-input').get(0), () => {}, {mode: 'range'})
    }
}


export default member_withdrawCtrl