import angular from 'angular'
import $ from 'jQuery'
import moment from 'moment'

const member_transactionCtrl = function ($scope, Core, Layer, Util) {
    $scope.switchStatus = function (status) {
        switch (status) {
            case '1':
                return '已中奖'
            case '3':
                return '已撤单'
            case '4':
                return '待开奖'
            case '5':
                return '未中奖'
            default:
                return status
        }
    }
    $scope.cashType = 0
    Core.get('user/cash_list/get_type', function (json) {
        const c = angular.fromJson(json)
        if (c.code == 200) {
            $scope.cashType = c.data.rows
        }
    }, false)
    Core.get('user/cash_list/get_list', function (json) {
        const c = angular.fromJson(json)
        if (c.code == 200) {
            $scope.changeRecordVal = c.data.rows
            if ($scope.changeRecordVal.length < 15) {
                $('#change_record').attr('disabled', true)
            } else {
                $('#change_record').attr('disabled', false)
            }
        }
    }, false)
    $scope.search_fun = function () {
        let type = $('#betRecordSelect').val()
        Core.get('user/bet_record/get_list?type=' + type, function (json) {
            const c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.data = c.data.rows.map(function (e) {
                    e.status = $scope.switchStatus(e.status)
                    e.names_sub = e.names.length > 20 ? e.names.substring(0, 20) + '...' : e.names
                    e.names_arr = e.names.replace(/\|/g, '|\n')
                    if (e.open_resu_num) {
                        e.open_resu_num = e.open_resu_num.split(',')
                    }

                    return e
                })
                if ($scope.data.length < 15) {
                    $('#bet_record').attr('disabled', true)
                } else {
                    $('#bet_record').attr('disabled', false)
                }
            }
        }, false)
    }
    $scope.searchChange = function () {
        let time = $('#date-input').val()
        if (time != '') {
            time = time.split('至')
            if (!moment(time[1]).isBetween(time[0], moment(time[0]).add(2, 'months')._d)) {
                Layer.alert('查询时间间隔不能超过2个月', '温馨提示')
                return
            }
        }
        let type = $('#changeRecordSelect').val()
        Core.get('user/cash_list/get_list?type=' + type + '&time_start=' + time[0] + '&time_end=' + time[1], function (json) {
            const c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.changeRecordVal = c.data.rows
                if ($scope.changeRecordVal.length < 15) {
                    $('#change_record').attr('disabled', true)
                } else {
                    $('#change_record').attr('disabled', false)
                }
            }
        }, false)
    }
    //追号
    $scope.searchGetBack = function () {
        return 'searchGetBack'
    }
    $scope.pageIndex = 0
    $scope.TMP = 'src/components/member_transaction/member_bet_record.tpl.html'
    Core.get('user/bet_record/get_list', function (json) {
        const c = angular.fromJson(json)
        if (c.code == 200) {
            $scope.data = c.data.rows.map(function (e) {
                e.status = $scope.switchStatus(e.status)
                e.names_sub = e.names.length > 16 ? e.names.substring(0, 16) + '...' : e.names
                e.names_arr = e.names.replace(/\|/g, '|\n')
                if (e.open_resu_num) {
                    e.open_resu_num = e.open_resu_num.split(',')
                }
                return e
            })
            if ($scope.data.length < 15) {
                $('#bet_record').attr('disabled', true)
            } else {
                $('#bet_record').attr('disabled', false)
            }
        }
    }, false)
    $scope.betRecord = function (i) {
        $scope.pageIndex = i
        $scope.TMP = 'src/components/member_transaction/member_bet_record.tpl.html'
        Core.get('user/bet_record/get_list', function (json) {
            const c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.data = c.data.rows.map(function (e) {
                    e.status = $scope.switchStatus(e.status)
                    e.names_sub = e.names.length > 16 ? e.names.substring(0, 16) + '...' : e.names
                    e.names_arr = e.names.replace(/\|/g, '|\n')
                    if (e.open_resu_num) {
                        e.open_resu_num = e.open_resu_num.split(',')
                    }
                    return e
                })
                if ($scope.data.length < 15) {
                    $('#bet_record').attr('disabled', true)
                } else {
                    $('#bet_record').attr('disabled', false)
                }
            }
        }, false)
    }
    $scope.showPicker = function () {
        Util.picker($('#date-input').get(0), () => {}, {mode: 'range'})
    }
    $scope.getBackNumRecord = function (i) {
        $scope.TMP = 'src/components/member_transaction/member_getback_record.tpl.html'
        $scope.pageIndex = i
        $scope.data = null
    }
    $scope.changeRecord = function (i) {
        $scope.TMP = 'src/components/member_transaction/member_change_record.tpl.html'
        $scope.pageIndex = i
        Core.get('user/cash_list/get_list', function (json) {
            const c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.changeRecordVal = c.data.rows
                if ($scope.changeRecordVal.length < 15) {
                    $('#change_record').attr('disabled', true)
                } else {
                    $('#change_record').attr('disabled', false)
                }
            }
        }, false)
    }

    $scope.bet_detail = function (x) {
        let m = '待开奖'
        if (x.open_resu_num) {
            m = `<div  class="balls">${x.open_resu_num[0]}</div>`
            for (let i = 1; i < x.open_resu_num.length; i++) {
                m += `<div class="balls">${x.open_resu_num[i]}</div>`
            }
        }
        let msg = ''
        if (x.status == '未中奖') {
            msg = `
            <div class="bet_detail_left" style="margin-left: 10px;width:50%;display: inline-block;float: left;text-align: left;">
                <p class="first"><span>注单号：${x.order_num}</span></p>
                <p><span>期号：${x.issue}</span></p><hr>
                <p><span>彩种：${x.game}</span></p><hr>
                <p><span>玩法：${x.tname}</span></p><hr>
                <p><span>下注号码：${x.names_arr}</span></p>
                <span class="win_numer_cell">开奖号码：${m}</span>
            </div>
            <div class="bet_detail_right">
                <p class="first"><span>下注时间：${x.bet_time}</span></p>
                <p><span>投注金额：${x.price_sum || ''}</span></p><hr>
                <p><span>单注金额：${x.price}</span></p><hr>
                <p><span>状态：${x.status}</span></p><hr>
            </div>
        `
        } else if (x.status == '已撤单' || x.status == '待开奖') {
            msg = `
            <div class="bet_detail_left" style="margin-left: 10px;width:50%;display: inline-block;float: left;text-align: left;">
                <p class="first"><span>注单号：${x.order_num}</span></p>
                <p><span>期号：${x.issue}</span></p><hr>
                <p><span>彩种：${x.game}</span></p><hr>
                <p><span>玩法：${x.tname}</span></p><hr>
                <p><span>下注号码：${x.names_arr}</span></p>
            </div>
            <div class="bet_detail_right">
                <p class="first"><span>下注时间：${x.bet_time}</span></p>
                <p><span>投注金额：${x.price_sum || ''}</span></p><hr>
                <p><span>单注金额：${x.price}</span></p><hr>
                <p><span>状态：${x.status}</span></p><hr>
            </div>`
        } else {
            msg = `
                <div class="bet_detail_left" style="margin-left: 10px;width:50%;display: inline-block;float: left;text-align: left;">
                    <p class="first"><span>注单号：${x.order_num}</span></p>
                    <p><span>期号：${x.issue}</span></p><hr>
                    <p><span>彩种：${x.game}</span></p><hr>
                    <p><span>单注金额：${x.price}</span></p><hr>
                    <p><span>玩法：${x.tname}</span></p><hr>
                    <p><span>状态：${x.status}</span></p><hr>
                    <p><span>下注号码：${x.names_arr}</span></p>
                    <span class="win_numer_cell">开奖号码：${m}</span>
                </div>
                <div class="bet_detail_right">
                    <p class="first"><span>下注时间：${x.bet_time}</span></p>
                    <p><span>赔率/返点：${x.rate || '0'}/${x.rebate || '0'}%</span></p><hr>
                    <p ng-if="x.win_counts"><span>中奖注数：${x.win_counts || ''}</span></p><hr>
                    <p><span>投注金额：${x.price_sum || ''}</span></p><hr>
                    <p><span>销售返点：${x.price_sum*x.rebate/100 || '0'}</span></p><hr>
                    <p><span>中奖金额：${x.win_price || ''}</span></p><hr>
                    <p><span>盈亏：${isNaN(x.win_price - x.price_sum) ? '' : (x.win_price - x.price_sum).toFixed(2)}</span></p>
                </div>
            `
        }
        let param = ''
        if (x.status == '待开奖') {
            param = {
                title: '投注详情',
                msg: msg,
                okFn: function () {
                    let param = {order_num: x.order_num}
                    Core.post('orders/cancel', param, function (json) {
                        var c = json
                        if (c.code == 200) {
                            Layer.alert('撤销成功', '温馨提示')
                        } else {
                            Layer.alert(c.msg, '温馨提示')
                            return
                        }
                    })
                },
                style: {
                    width: '640px',
                    minHeight: '480px'
                },
                okText: '撤销注单'
            }
            Layer.member_confirm(param)
        } else {
            param = {
                title: '投注详情',
                msg: msg,
                style: {
                    width: '640px',
                    minHeight: '480px'
                }
            }
            Layer.modal(param)
        }
    }
    $scope.nextBetIndex = 1
    $scope.nextChangeIndex = 1
    $scope.nextBetPage = function (i) {
        let type = $('#betRecordSelect').val()
        if (i) {
            $scope.nextBetIndex++
        } else {
            if ($scope.nextBetIndex > 1) {
                $scope.nextBetIndex--
            }
        }
        Core.get('user/bet_record/get_list?type=' + type + '&page=' + $scope.nextBetIndex, function (json) {
            const c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.data = c.data.rows.map(function (e) {
                    e.status = $scope.switchStatus(e.status)
                    e.names_sub = e.names.length > 16 ? e.names.substring(0, 16) + '...' : e.names
                    e.names_arr = e.names.replace(/\|/g, '|\n')
                    if (e.open_resu_num) {
                        e.open_resu_num = e.open_resu_num.split(',')
                    }
                    return e
                })
            }
            if ($scope.data.length < 15) {
                $('#bet_record').attr('disabled', true)
            } else {
                $('#bet_record').attr('disabled', false)
            }
            if ($scope.nextBetIndex <= 1) {
                $('#bet_record_pre').attr('disabled', true)
            } else {
                $('#bet_record_pre').attr('disabled', false)
            }
        }, false)
    }
    $scope.nextChangePage = function (i) {
        let time = $('#date-input').val()
        if (time != '') {
            time = time.split('至')
            if (!moment(time[1]).isBetween(time[0], moment(time[0]).add(2, 'months')._d)) {
                Layer.alert('查询时间间隔不能超过2个月', '温馨提示')
                return
            }
        }
        if (i) {
            $scope.nextChangeIndex++
        } else {
            if ($scope.nextChangeIndex > 1) {
                $scope.nextChangeIndex--
            }
        }
        let type = $('#changeRecordSelect').val()
        Core.get('user/cash_list/get_list?type=' + type + '&time_start=' + time[0] + '&time_end=' + time[1] + '&page=' + $scope.nextChangeIndex, function (json) {
            const c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.changeRecordVal = c.data.rows
            }
            if ($scope.changeRecordVal.length < 15) {
                $('#change_record').attr('disabled', true)
            } else {
                $('#change_record').attr('disabled', false)
            }
        }, false)
        if ($scope.nextChangeIndex <= 1) {
            $('#change_record_pre').attr('disabled', true)
        } else {
            $('#change_record_pre').attr('disabled', false)
        }
    }
}


export default member_transactionCtrl