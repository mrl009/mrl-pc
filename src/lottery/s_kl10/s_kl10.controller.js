import angular from 'angular'
import $ from 'jQuery'

export default function ($scope, $timeout, $interval, Layer, $stateParams, Core, Lottery, Sc, SKl10) {
    $('.content').addClass('scroll-active')
    //彩票类型
    $scope.type = $stateParams.type
    //游戏ID
    $scope.gid = $stateParams.gid
    //默认球模版
    $scope.tmp = 's_kl10/lm.tpl.html'
    //开奖状态
    $scope.lotteryStatus = true
    // 获取主页缓存注数
    $scope.sessionBet = sessionStorage.getItem('lotteryData') || []
    //初始化数据
    $scope.r2 = Core.createArr(2)
    $scope.r4 = Core.createArr(4)
    $scope.r5 = Core.createArr(5)
    $scope.r9 = Core.createArr(9)
    $scope.r15 = Core.createArr(15)
    $scope.initData = function () {
        $scope.p1 = []
        $scope.p2 = []
        $scope.p3 = []
        $scope.lm = true
    }
    $scope.initData()
    $scope.betData = {}
    $scope.betList = []
    $scope.betCount = 0
    $scope.betNum = 0
    $scope.suData = {txtmoney: 0}
    //获取玩法页面--初始化
    $scope.onStart = function () {
        Core.get('games/play/' + $scope.gid, function (json) {
            const c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.playlist = c.data//玩法列表
                $scope.getPros()//组合球
                $scope.showParentId = $scope.playlist.play[0].id
                $scope.getBall($scope.playlist.play[0].sname)
                $timeout(function () {
                    Layer.closeLoading()
                }, 500)
            }
        })
    }

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
                if ($scope.betNum != 0) {
                    Layer.confirm({
                        okCd: 5,
                        okFn: function () {
                            $scope.reset()
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
                    angular.forEach($scope.lottery_log_one.number, function () {
                        sj.push(Math.floor(Math.random() * 9))
                    })
                    $scope.lottery_log_one.number = sj
                }, 100)
                //获取开奖记录--等待
                $scope.openTimer = $interval(function () {
                    //刷新近期开奖
                    Lottery.OpenResult($scope.gid, function (o1, o5) {
                        $scope.lottery_log_one = o1
                        $scope.lottery_log_five = o5
                        if ($scope.kithe.kithe - 1 == $scope.lottery_log_one.kj_issue && $scope.lottery_log_one.number.length>2) {
                            $interval.cancel($scope.opening)
                            $interval.cancel($scope.openTimer)
                        }
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
    Lottery.OpenResult($scope.gid, function (o1, o5) {
        $scope.lottery_log_one = o1
        $scope.lottery_log_five = o5
    })
    //期数切换
    $scope.showIssue = function (single) {
        Lottery.showIssue(single)
    }

    //组合球
    $scope.getPros = function () {
        Lottery.getPros($scope.gid, function (c) {
            $scope.balls = c
        })
    }

    //更新球模版
    $scope.getTmp = function (pid, sname) {
        $scope.reset()
        $scope.showParentId = pid
        $scope.getBall(sname)
        if (sname == 'lm' || sname == 'zh') {
            $scope.tmp = 's_kl10/lm.tpl.html'
        } else if (sname == 'lma') {
            $scope.tmp = 's_kl10/lma.tpl.html'
        } else {
            $scope.tmp = 's_kl10/db.tpl.html'
        }
    }

    //获取球
    $scope.getBall = function (sname) {
        $scope.initData()
        angular.forEach($scope.playlist.play, function (d) {
            if (sname == 'lm' && d.sname == 'lm') {
                $scope.p1.push(d.play[0])
                $scope.p2 = d.play.slice(1, 5)
                $scope.p3 = d.play.slice(5)
            } else if (sname == 'zh' && d.sname == 'zh') {
                $scope.lm = false
                $scope.p1.push(d.play[0])
            } else if (sname == 'lma' && d.sname == 'lma') {
                $scope.p1 = d.play
                $scope.setSname(d.play[0].id, d.play[0].sname)
            } else if (sname != 'lm' && sname != 'zh' && sname != 'lma' && d.sname == sname) {
                $scope.p1.push(d.play[0])
            }
        })
    }

    //设置玩法类型
    $scope.setSname = function (id, sname) {
        $scope.reset()
        SKl10.clearAll()
        $scope.suData = {
            tid: id,
            rate: $scope.balls[id].rate,
            rebate: $scope.balls[id].rebate,
            txtmoney: 0,
            sumbet: 0,
            sname: sname
        }
    }

    //点击统计球金额
    $scope.setBalls = function (evt) {
        $scope.betNum = SKl10.setBalls($scope.suData, evt.target)
    }

    //是否球样式
    $scope.isBall = function (v) {
        return !/\D/i.test(v)
    }

    //输入设置
    $scope.initChange = function () {
        Sc.handleInputChange(function (code) {
            delete $scope.betData[code]
            $scope.calculate()
        }, function (code, price, price_sum, rate, rebate, contents, names, pids, tid) {
            $scope.addBet(code, {
                gid: $scope.gid,
                price,
                price_sum,
                counts: 1,
                rate,
                rebate,
                contents,
                names,
                pids,
                tid
            })
        })
    }

    //添加
    $scope.addBet = function (code, data, flag) {
        $scope.betData[code] = $scope.betData[code] || {}
        Object.assign($scope.betData[code], data)
        if (flag !== false) {
            $scope.calculate()
        }
    }

    //统计注数
    $scope.calculate = function () {
        $scope.betCount = 0
        $scope.betNum = Object.keys($scope.betData).length
        for (let i in $scope.betData) {
            $scope.betCount += Number($scope.betData[i].price)
        }
        $scope.$apply()
    }

    //清空注数
    $scope.reset = function () {
        $scope.betData = {}
        $scope.betList = []
        $scope.betCount = 0
        $scope.betNum = 0
        $scope.suData.txtmoney = 0
        Sc.clearInput()
        SKl10.clearAll()
    }

    //提交下注
    $scope.betSubmit = function (isOneBall = false) {
        if (!isOneBall) {
            $scope.betList = Object.values($scope.betData)
        } else {
            $scope.betList = SKl10.getBetList($scope)
        }
        if ($scope.betList.length == 0 || isOneBall && $scope.suData.txtmoney == 0) {
            Layer.alert('请先添加投注内容')
            return
        }
        Lottery.betSubmit($scope.gid, JSON.stringify($scope.betList), function () {
            const betCount = isOneBall ? $scope.betNum * $scope.suData.txtmoney : $scope.betCount
            $scope.fb(betCount)
            $scope.reset()
        })
    }

    /*主页面缓存下注***/
    if ($scope.sessionBet.length > 0) {
        sessionStorage.removeItem('lotteryData')
        $timeout(function () {
            $scope.sessionBet = JSON.parse($scope.sessionBet)
            $scope.betData = Sc.sellBalls($scope.sessionBet)
            $scope.calculate()
        }, 2000)
    }
    $scope.fb = function (spend) {
        const target = $('#lu-balance')
        const balance = target.text().slice(1)
        target.text(`￥${balance - spend}`)
    }
}
