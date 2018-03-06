import angular from 'angular'
import './pcdd.less'
import $ from 'jQuery'

export default function ($scope, $timeout, $interval, Core, Layer, $stateParams, Lottery, Pcdd) {
    $('.content').addClass('scroll-active')
    //彩票类型
    $scope.type = $stateParams.type
    //游戏ID
    $scope.gid = $stateParams.gid
    // 彩票状态
    $scope.lotteryStatus = true
    //开奖倒计信息
    Lottery.getOpen($scope.gid, function (c, status) {
        $scope.kithe = c
        if (status == 0) {
            $scope.upDateKithe()
            $scope.onStart()
        } else {
            $scope.lotteryStatus = false
            $timeout(function () {
                Layer.closeLoading()
            }, 500)
        }
    })
    //开奖倒计信息
    $scope.upDateKithe = function () {
        function fpssc(m) {
            var str = Core.ShowCountDown(m)
            if (str != 'end') {
                $scope.openStatus = true //开盘状态
                $scope.syTime = str.split(':')
                $scope.ddTimer = $timeout(function () {
                    fpssc(m)
                }, 1000)
            } else {
                $scope.openStatus = false //开盘状态
                if ($scope.betList.length != 0) {
                    Layer.confirm({
                        okCd: 5,
                        okFn: function () {
                            $scope.clearBet()
                            $scope.delAllBet()
                            $scope.kitheList = []
                        },
                        msg: '当前期已结束，是否要清除已投注内容?'
                    })
                }
                $scope.syTime = ['00', '00', '00']
                $scope.timer = $timeout(function () {
                    Core.get('open_time/get_games_list?gid=' + $scope.gid, function (json) {
                        var c = angular.fromJson(json)
                        if (c.code == 200) {
                            if (c.data[0].is_open == 1) {
                                $scope.kithe = {
                                    kithe: c.data[0].kithe,
                                    kithe_time_second: c.data[0].kithe_time_second,
                                    kithe_time_stamp: c.data[0].kithe_time_stamp,
                                    up_close_time: c.data[0].up_close_time
                                }
                                fpssc(new Date().getTime() + c.data[0].kithe_time_second * 1000)
                            } else {
                                return
                            }
                        }
                    }, false)
                }, 2000)
                $scope.opening = $interval(function () {
                    let sj = []
                    angular.forEach($scope.lottery_log_one.number, function (d, i) {
                        if (i != 3) {
                            sj.push(Math.floor(Math.random() * 9))
                        } else {
                            sj.push(Math.floor(Math.random() * 27))
                            $scope.lottery_log_one = Pcdd.setColor($scope.lottery_log_one, sj[3])
                        }
                    })
                    $scope.lottery_log_one.number = sj
                }, 100)
                //获取开奖记录--等待
                $scope.openTimer = $interval(function () {
                    //刷新近期开奖
                    Pcdd.OpenResult($scope.gid, function (o1, o5) {
                        $scope.lottery_log_one = o1
                        $scope.lottery_log_five = o5
                        if ($scope.kithe.kithe - 1 == $scope.lottery_log_one.kj_issue && $scope.lottery_log_one.number.length>2) {
                            $interval.cancel($scope.opening)
                            $interval.cancel($scope.openTimer)
                        }
                        let sj = []
                        angular.forEach($scope.lottery_log_one.number, function (d, i) {
                            if (i != 3) {
                                sj.push(Math.floor(Math.random() * 9))
                            } else {
                                sj.push(Math.floor(Math.random() * 27))
                                $scope.lottery_log_one = Pcdd.setColor($scope.lottery_log_one, sj[3])
                            }
                        })
                        $scope.lottery_log_one.number = sj
                    })
                }, 2 * 1000)
            }
        }

        //退出路由销毁倒计时
        $scope.$on('$destroy', function () {
            $timeout.cancel($scope.timer)
            $interval.cancel($scope.openTimer)
            $timeout.cancel($scope.ddTimer)
        })

        fpssc(parseInt(new Date().getTime()) + $scope.kithe.kithe_time_second * 1000)
    }
    //获取近期开奖
    Pcdd.OpenResult($scope.gid, function (o1, o5) {
        $scope.lottery_log_one = o1
        $scope.lottery_log_five = o5
    })
    //期数切换
    $scope.showIssue = function (single) {
        Lottery.showIssue(single)
    }
    // 输入数字过滤
    $scope.filterNum = function (e) {
        Pcdd.filterNum(e)
    }
    // 特码包三初始化
    $scope.initData = function () {
        $scope.tmb3Select = false
        var tmb3 = $scope.playInfo.tmb3.balls
        $scope.tmb3 = [tmb3[0], tmb3[1], tmb3[2]]
    }
    // 选择特码包三球
    $scope.getTmb3Select = function (type) {
        Pcdd.getTmb3Select(type)
        $scope.tmb3Select = true
        $scope.selectType = type
    }
    $scope.setTmb3Ball = function (e) {
        $scope.tmb3Select = false
        e && Pcdd.setTmb3Ball(e, $scope.selectType, $scope.tmb3, function (c) {
            $scope.tmb3 = c
        })
    }
    //获取玩法页面--初始化
    $scope.onStart = function () {
        Core.get('games/play/' + $scope.gid, function (json) {
            const c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.playlist = c.data//玩法列表
                $scope.getPros()//获取球号
                $timeout(function () {
                    Layer.closeLoading()
                }, 500)
            }
        })
    }
    //获取球号
    $scope.getPros = function () {
        Lottery.getPros($scope.gid, function (c) {
            $scope.pros = c
            //获取对应玩法的球及赔率信息
            $scope.getPinfo()
        })
    }
    //获取对应玩法的球及赔率信息
    $scope.getPinfo = function () {
        Pcdd.getPinfo($scope.playlist, $scope.pros, function (c) {
            $scope.playInfo = c
            // 初始化
            $scope.initData()
        })
    }
    //添加注单
    $scope.betList = []
    $scope.addBet = function () {
        $scope.betList = Pcdd.addBet($scope, $scope.betList)
        $scope.countBet()
        $scope.clearBet()
    }
    $scope.clearBet = function () {
        $scope.initData()
        Pcdd.clearBet()
    }
    //统计总注数及金额
    $scope.betSum = 0
    $scope.betTotal = 0
    $scope.countBet = function () {
        $scope.betSum = 0
        $scope.betTotal = 0
        angular.forEach($scope.betList, function (d) {
            $scope.betSum += d.counts
            $scope.betTotal += parseInt(d.price_sum)
        })
        $scope.betTotal = Core.cutZero($scope.betTotal.toFixed(3))
    }
    //清除一注
    $scope.delOneBet = function (id) {
        $scope.betList.splice(id, 1)
        $scope.countBet()
    }
    //清除所有下注
    $scope.delAllBet = function () {
        $scope.betList = []
        $scope.countBet()
    }
    //提交到下注
    $scope.betSubmit = function () {
        if ($scope.betList.length == 0) {
            Layer.alert('请先添加投注内容')
            return
        }
        Lottery.betSubmit($scope.gid, JSON.stringify($scope.betList), function () {
            $scope.fb($scope.betTotal)
            $scope.betList = []
            $scope.countBet()
        })
    }
    $scope.fb = function (spend) {
        const target = $('#lu-balance')
        const balance = target.text().slice(1)
        target.text(`￥${balance - spend}`)
    }
}

