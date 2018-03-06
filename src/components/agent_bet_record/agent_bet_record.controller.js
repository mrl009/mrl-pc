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
    $scope.orderType = [{id: 0, title: '全部订单'}, {id: 1, title: '已中奖'}, {id: 3, title: '已撤单'}, {id: 4, title: '待开奖'}]
    $scope.nextAgentIndex = 1
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
    $scope.getAgentList = function () {
        Layer.loading()
        Core.get('user/bet_record/get_agent_list?type=' + $scope.type + '&username=' + $scope.data.username + '&page=' + $scope.nextAgentIndex, function (json) {
            Layer.closeLoading()
            var c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.initData()
                $scope.items = c.data.rows.map(function (e) {
                    e.statusStr = $scope.switchStatus(e.status, e.type)
                    e.names_sub = e.names.length > 16 ? e.names.substring(0, 16) + '...' : e.names
                    e.names_arr = e.names.replace(/\|/g, '|\n')
                    if (e.open_resu_num) {
                        e.open_resu_num = e.open_resu_num.split(',')
                    }
                    return e
                })
                if ($scope.items.length == 0) {
                    $scope.isEmpty = true
                }
                if ($scope.items.length < 15) {
                    $('#agent_bet_next').attr('disabled', true)
                } else {
                    $('#agent_bet_next').attr('disabled', false)
                }
            }
        }, false)
        if ($scope.nextAgentIndex <= 1) {
            $('#agent_bet_pre').attr('disabled', true)
        } else {
            $('#agent_bet_pre').attr('disabled', false)
        }
    }
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
    $scope.getOrder = function (i, type) {
        $scope.type = type
        $scope.nextAgentIndex = 1
        $('.tanContainer-li').eq(i).addClass('active')
        $('.tanContainer-li').not($('.tanContainer-li').eq(i)).removeClass('active')
        $('.tanContent-li').eq(i).addClass('fdiv')
        $('.tanContent-li').not($('.tanContent-li').eq(i)).removeClass('fdiv')
        $scope.getAgentList()
    }
    // 加载第一页数据
    $scope.getOrder(0)
    $scope.bet_detail = function (x) {
        let m = '待开奖'
        if (x.open_resu_num) {
            m = `<div  class="balls">${x.open_resu_num[0]}</div>`
            for (let i = 1; i < x.open_resu_num.length; i++) {
                m += `<div class="balls">${x.open_resu_num[i]}</div>`
            }
        }
        let msg = ''
        if (x.status == '5') {
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
                <p><span>状态：${x.statusStr}</span></p><hr>
            </div>
        `
        } else if (x.status == '3' || x.status == '4') {
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
                <p><span>状态：${x.statusStr}</span></p><hr>
            </div>`
        } else {
            msg = `
                <div class="bet_detail_left" style="margin-left: 10px;width:50%;display: inline-block;float: left;text-align: left;">
                    <p class="first"><span>注单号：${x.order_num}</span></p>
                    <p><span>期号：${x.issue}</span></p><hr>
                    <p><span>彩种：${x.game}</span></p><hr>
                    <p><span>单注金额：${x.price}</span></p><hr>
                    <p><span>玩法：${x.tname}</span></p><hr>
                    <p><span>状态：${x.statusStr}</span></p><hr>
                    <p><span>下注号码：${x.names_arr}</span></p>
                    <span class="win_numer_cell">开奖号码：${m}</span>
                </div>
                <div class="bet_detail_right">
                    <p class="first"><span>下注时间：${x.bet_time}</span></p>
                    <p><span>赔率/返点：${x.rate || '0'}/${x.rebate || '0'}%</span></p><hr>
                    <p ng-if="x.win_counts"><span>中奖注数：${x.win_counts || ''}</span></p><hr>
                    <p><span>投注金额：${x.price_sum || ''}</span></p><hr>
                    <p><span>销售返点：${x.rebate*x.price_sum/100 || '0'}</span></p><hr>
                    <p><span>中奖金额：${x.win_price || ''}</span></p><hr>
                    <p><span>盈亏：${isNaN(x.win_price - x.price_sum) ? '' : (x.win_price - x.price_sum).toFixed(2)}</span></p>
                </div>
            `
        }
        let param = {
            title: '投注详情',
            msg: msg,
            style: {
                width: '768px',
                minHeight: '480px'
            }
        }
        Layer.modal(param)
    }
}