import angular from 'angular'
import moment from 'moment'
import $ from 'jQuery'

export default function (
    $scope,
    $rootScope,
    Core,
    $stateParams,
    Layer,
    $timeout,
    Util
) {
    $scope.selectIssue = ''
    $scope.type = $stateParams.type
    $scope.colorArr = []
    $scope.changeIssue = function (kithe) {
        $scope.reqDetail('?gid=' + $stateParams.gid + '&kithe=' + kithe, function (json) {
            const c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.currLottery.number = c.data.rows[0].number.split(',')
                $scope.currLottery.kj_time = c.data.rows[0].kj_time
                if ($scope.type === 'lhc') {
                    $scope.currLottery.shengxiao = c.data.rows[0].shengxiao.split(',')
                }
            }
        })
    }
    $scope.showPicker = function (evt) {
        Util.picker(evt.target, function(dateStr) {
            $timeout(function () {
                $scope.currDay = $.trim(dateStr)
            })
            $scope.searchByDate(dateStr)
        })
    }

    Core.get('Open_time/get_games_list?gid=' + $stateParams.gid, function (json) {
        const c = angular.fromJson(json)
        if (c.code == 200) {
            $scope.currLottery = c.data[0]
            $scope.currLottery.number = $scope.currLottery.number.split(',')
        }
    })

    $scope.currDay = moment().format('YYYY-MM-DD')
    $scope.dateArr = [{
        date: moment().format('YYYY-MM-DD'),
        name: '今天'
    }, {
        date: moment().subtract(1, 'day').format('YYYY-MM-DD'),
        name: '昨天'
    }, {
        date: moment().subtract(2, 'day').format('YYYY-MM-DD'),
        name: '前天'
    }]
    $scope.searchByDate = function (date) {
        $scope.currDay = date
        $('#date-input').val(date)
        const params = '?gid=' + $stateParams.gid + '&time=' + date + '&rows=300'
        $scope.reqDetail(params, function (json) {
            const c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.rows = c.data.rows.map((el) => {
                    el.number = el.number.replace(/,/g, ' ')
                    return el
                })
                const _len = $scope.rows.length
                const _per = Math.ceil(_len / 3)
                $scope.rows1 = $scope.rows.slice(0, _per)
                $scope.rows2 = $scope.rows.slice(_per, _per * 2)
                $scope.rows3 = $scope.rows.slice(_per * 2)
            }
        })
    }

    $scope.issues = []
    $scope.reqDetail = function (params, callback) {
        Core.get('Open_result' + params, function (json) {
            callback(json)
        }, false)
    }

    //初始化
    $scope.reqDetail('?gid=' + $stateParams.gid, function (json) {
        const c = angular.fromJson(json)
        if (c.code == 200) {
            $scope.rows = c.data.rows.map((el) => {
                el.number = el.number.replace(/,/g, ' ')
                el.shengxiao = typeof el.shengxiao == 'string' ? el.shengxiao.split(',') : el.shengxiao
                el.color = typeof el.color == 'string' ? el.color.split(',') : el.color
                $scope.issues.push(el.kj_issue)
                if ($scope.type === 'lhc' && $scope.currLottery.kj_issue == el.kj_issue) {
                    $scope.currLottery.shengxiao = el.shengxiao
                    $scope.currLottery.color = el.color
                }
                return el
            })
            // const _len = $scope.rows.length
            // const _per = Math.ceil(_len/3)
            // $scope.rows1 = $scope.rows.slice(0, _per)
            // $scope.rows2 = $scope.rows.slice(_per, _per * 2)
            // $scope.rows3 = $scope.rows.slice(_per * 2)
            $scope.selectIssue = c.data.top_issue - 1
        }
    })

    $scope.searchByDate(moment().format('YYYY-MM-DD'))

    $scope.getRule = function (type) {
        Core.get('rules/game_rules/get_games_rules_content?type=' + type, function (json) {
            const c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.handleRuleData(type, c.data.rows)
            }
        })
    }

    $scope.handleRuleData = function (type, data) {
        var handleFns = {
            ssc: function () {
                $scope.sscRules = []
                for (let i in data) {
                    data[i].forEach((ele, j) => {
                        let ret = []
                        ele = $.trim(ele)
                        ret[0] = /^\d{1,}[、|，]\s?([\u4E00-\u9FA5]{1,}\d{0,}\s{0,3})"?：/.exec(ele)[1]
                        ret[1] = /：(.*)/.exec(ele)[1]
                        $scope.sscRules.push({
                            name: j == 0 ? i : null,
                            rules: ret,
                            rows: data[i].length
                        })
                    })
                }
            },
            lhc: function () {
                $scope.lhcRules = []
                for (let i in data) {
                    data[i].forEach((ele, j) => {
                        ele = $.trim(ele)
                        $scope.lhcRules.push({
                            name: j == 0 ? i : null,
                            rules: ele,
                            rows: data[i].length
                        })
                    })
                }
            }
        }
        handleFns[type] ? handleFns[type]() : handleFns.lhc()
    }

    //$scope.getRule($stateParams.type)

    $scope.save_favorite = function () {
        Layer.alert('请使用Ctrl+D,收藏此页', '温馨提示')
    }
}