import angular from 'angular'
import $ from 'jQuery'

export default function ($scope, $timeout, $interval, Core, Layer, $stateParams, Lottery, K3) {
    $('.content').addClass('scroll-active')
    //彩票类型
    $scope.type = $stateParams.type
    //游戏ID
    $scope.gid = $stateParams.gid
    //默认球模版
    $scope.tmp = 'k3/balls.tpl.html'
    //初始化注数
    $scope.lotteryStatus = true
    $scope.initData = function () {
        $scope.suData = {money: 0, txtmoney: 2, sumbet: 0, mtype: 1}//金额数据
        // 元角分
        $scope.moneytype = 'y'
        $scope.suData.mtype = 1
    }
    $scope.initData()
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
                            $scope.bb.zhbet = false
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
    //玩法提示
    $scope.getTips = function () {
        let tid = $scope.tid || $scope.show
        Lottery.getTips(tid, function (c) {
            $scope.tips = c
        })
    }
    //玩法提示切换
    $scope.exampleWin = 1
    $scope.notesWin = 1
    $scope.toggleTips = function (v, t) {
        if (t) {
            $scope.exampleWin = v
        } else {
            $scope.notesWin = v
        }
    }
    //获取玩法页面--初始化
    $scope.onStart = function () {
        Core.get('games/play/' + $scope.gid, function (json) {
            const c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.show = c.data.show //默认玩法ID
                $scope.playlist = c.data//玩法列表
                $scope.getPinfo($scope.show) //查找默认玩法内容
                $scope.getPros()//获取球号
                $timeout(function () {
                    Layer.closeLoading()
                }, 500)
                $scope.isType = false
                if (c.data.aid > 0) {
                    $scope.url = '/s_' + c.data.type + '/s_' + c.data.type + '/' + c.data.aid
                    $scope.isType = true
                }
            }
        })
    }

    //获取默认玩法信息
    $scope.getPinfo = function (id) {
        Lottery.getPinfo(id, $scope.playlist, function (c) {
            $scope.playInfo = c
            $scope.playInfo.psname = $scope.playSname || ''
        })
    }
    //点击顶级玩法
    $scope.p2 = []
    $scope.getPlay = function (pid, ptitle, psname) {
        $scope.showParentId = pid
        $scope.playName = ptitle //顶级玩法名称
        $scope.playSname = psname
        $scope.initData()
        Lottery.getPlay(pid, $scope.playlist, function (c, id) {
            $scope.p2 = c
            if (psname == '2th') {
                var tmp = $scope.p2[1]
                $scope.p2[1].play = {tmp}
            }
            $scope.getBall(id)
        })
    }
    //获取球号
    $scope.getPros = function () {
        Lottery.getPros($scope.gid, function (c) {
            $scope.pros = c
            $scope.lottery = c[$scope.show]
            $scope.rate = {
                'rate': $scope.lottery.rate,
                'rate_min': $scope.lottery.rate_min,
                'rebate': $scope.lottery.rebate,
                'volume': 0
            }
            $scope.editRate()
            $scope.getPlay($scope.playInfo.pid)
        })
    }
    //选择玩法更新球
    $scope.getBall = function (id) {
        $scope.initData()
        $scope.lottery = $scope.pros[id] //根据玩法查询球列表
        $scope.rate = {
            'rate': $scope.lottery.rate,
            'rate_min': $scope.lottery.rate_min,
            'rebate': $scope.lottery.rebate,
            'volume': 0
        }
        $scope.editRate()
        $scope.tid = id //玩法ID
        $scope.getPinfo(id)
        $scope.getTips()//获取提示
        if ($scope.playInfo.sname == 'hz') {
            $scope.tmp = 'k3/hz.tpl.html'
        } else {
            $scope.tmp = 'k3/balls.tpl.html'
        }
    }

    //更改赔率
    $scope.editRate = function () {
        $scope.$watch('rate.volume', function () {
            $scope.orate = []
            if ($scope.playInfo.sname == 'hz') {
                let arr = $scope.lottery.balls
                $scope.rate.rebate = arr[0].rebate
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].rebate == 0) {
                        $scope.orate[i] = arr[i].rate - $scope.rate.volume * (arr[i].rate - arr[i].rate_min)
                    } else {
                        $scope.orate[i] = arr[i].rate - $scope.rate.volume * (arr[i].rate - arr[i].rate_min) / arr[i].rebate
                    }

                    $scope.orate[i] = $scope.orate[i].toFixed(3)
                }
            } else {
                if ($scope.rate != undefined && $scope.rate.rate != undefined) {
                    let arr = $scope.rate.rate.split(',')
                    let arrmin = $scope.rate.rate_min.split(',')
                    for (let i = 0; i < arr.length; i++) {
                        if ($scope.rate.rebate == 0) {
                            $scope.orate[i] = arr[i] - $scope.rate.volume * (arr[i] - arrmin[i])
                        } else {
                            $scope.orate[i] = arr[i] - $scope.rate.volume * (arr[i] - arrmin[i]) / $scope.rate.rebate
                        }
                        $scope.orate[i] = $scope.orate[i].toFixed(3)
                    }
                }
            }
        })
    }

    // 金额输入监听
    $scope.$watch('suData.txtmoney', function (n) {
        if (typeof n == 'string') {
            n = n.replace(/\D/, '')
        }
        $scope.suData.txtmoney = n.length > 5 ? n.slice(0, 5) : n
    })
    //点击选择球计算注数和金额
    $scope.selBalls = function (event) {
        $scope.suData.sumbet = K3.selBalls(event.target, $scope.playInfo)
        $scope.suData.money = $scope.suData.sumbet * $scope.suData.txtmoney
    }
    //工具选择
    $scope.toolXz = function (event, type) {
        $scope.suData.sumbet = K3.toolXz(event.target, $scope.playInfo, type)
        $scope.suData.money = $scope.suData.sumbet * $scope.suData.txtmoney
    }
    //清除选中及金额
    $scope.clearBet = function () {
        Lottery.clearAll()
        $scope.initData()
        $scope.rate.volume = 0
    }
    //切换元角分
    $scope.unit = function (t) {
        $scope.moneytype = t
        const c = Lottery.unit(t, $scope.suData)
        $scope.suData.mtype = c.mtype
        $scope.suData.money = c.money
    }
    //添加注单
    $scope.betList = []
    $scope.addBet = function () {
        if ($scope.suData.sumbet == 0 || !($scope.suData.txtmoney > 0)) {
            Layer.alert('您还没有选择号码或所选号码不全')
            return
        }
        $scope.betType = 'all' //下注方式默认组合
        if ($scope.playInfo.sname == 'hz') {
            $scope.betType = 'one'//单注分开
        }
        $scope.betList = K3.addBet($scope, $scope.betList)
        $scope.countBet()
        $scope.clearBet() //清理数据
    }
    //统计总注数及金额
    $scope.countBet = function () {
        $scope.betSum = 0
        $scope.betTotal = 0
        angular.forEach($scope.betList, function (d) {
            $scope.betSum += d.counts
            $scope.betTotal += d.price_sum
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
    $scope.betSum = 0
    $scope.betTotal = 0
    //开启是否追号
    $scope.bb = {zhbet: false, type: false}
    //提交到下注
    $scope.betSubmit = function () {
        if ($scope.betList.length == 0) {
            Layer.alert('请先添加投注内容')
            return
        }
        if (!$scope.bb.zhbet) {//正常下注
            Lottery.betSubmit($scope.gid, JSON.stringify($scope.betList), function () {
                $scope.fb($scope.betTotal)
                $scope.betList = []
                $scope.countBet()
            })
        } else {//追号----------
            $scope.zhBetlist = [] //追号下注列表
            $scope.kitheArr = [] //期数对应倍数
            angular.forEach($scope.kitheList, function (d) { //循环追号期数
                if (parseInt(d.multiple) > 0) {
                    $scope.kitheArr.push('"' + d.kithe + '":' + d.multiple)
                }
            })
            let kitheStr = '{' + $scope.kitheArr.join() + '}'
            Lottery.zhBetSubmit($scope.bb.type, $scope.gid, $scope.betList, kitheStr, function () {
                $scope.betList = [] //清空下注
                $scope.zhBetlist = [] //清空追号
                $scope.bb = {zhbet: false} //关闭追号
                $scope.countBet()
            })
        }
    }
    //点击打开追号界面
    $scope.openZh = function (t) {
        if (t) {
            if ($scope.betList.length == 0) {
                $scope.bb.zhbet = false
                Layer.alert('请先添加投注内容')
                return
            }
            $scope.getZhKithe() //获取追号期数
        } else {
            $scope.kitheList = [] //不追号清空数据
        }
    }
    //追号信息
    $scope.getZhKithe = function () {
        //普通追号
        $scope.initGeneral = function () {
            $scope.general = {
                numArr: [5, 10, 15, 20],
                expected: '',
                period: 10, //多少期
                multiple: 1 //倍数
            }
        }
        $scope.initGeneral()
        $scope.kitheList = [] //获取组合后期数列表
        $scope.kitheAll = [] //获取所有期数列表
        Lottery.getZhKithe($scope, function (arr, all) {
            $scope.kitheList = arr
            $scope.kitheAll = all
        })
        /*************普通追号输入监听***************/
        //监听输入期数
        $scope.$watch('general.period', function (n) {
            if (typeof n == 'string') {
                n = n.replace(/\D/, '')
            }
            if (n > 100) {
                $scope.general.period = 100
                return
            } else {
                $scope.getLimit(n)
            }
        })
        //监听输入倍数
        $scope.$watch('general.multiple', function (n) {
            if (typeof n == 'string') {
                $scope.general.multiple = parseInt(n.replace(/\D/, ''))
            }
            angular.forEach($scope.kitheList, function (d, i) {
                $scope.kitheList[i].multiple = $scope.general.multiple
            })
            angular.forEach($scope.kitheAll, function (d, i) {
                $scope.kitheAll[i].multiple = $scope.general.multiple
            })
        })
        /*************普通追号输入监听End***************/
        /*************高级追号输入监听******************/
        $scope.$watch('senior.period', function (n) {
            if (typeof n == 'string') {
                n = n.replace(/\D/, '')
            }
            $scope.senior.period = n > 100 ? 100 : parseInt(n)
        })
        $scope.$watch('senior.multiple', function (n) {
            if (typeof n == 'string') {
                n = n.replace(/\D/, '')
            }
            $scope.senior.multiple = parseInt(n)
        })
        $scope.$watch('senior.num1', function (n) {
            if (typeof n == 'string') {
                n = n.replace(/\D/, '')
            }
            $scope.senior.num1 = parseInt(n)
        })
        $scope.$watch('senior.num2', function (n) {
            if (typeof n == 'string') {
                n = n.replace(/\D/, '')
            }
            $scope.senior.num2 = parseInt(n)
        })
        $scope.$watch('senior.mult1', function (n) {
            if (typeof n == 'string') {
                n = n.replace(/\D/, '')
            }
            $scope.senior.mult1 = parseInt(n)
        })
        $scope.$watch('senior.mult2', function (n) {
            n = String(n).replace(/\D/, '')
            if (n.length > 3) {
                n = n.slice(0, 3)
            }
            $scope.senior.mult2 = parseInt(n)
        })
        /*************高级追号输入监听End***************/
    }
    //选N个期数
    $scope.getLimit = function (t) {
        $scope.kitheList = $scope.kitheAll.slice(0, t)
        $scope.general.period = t
    }
    /******************高级追号*************************/
    //高级追号
    $scope.initSenior = function () {
        $scope.senior = {
            start: 0, //起始期数
            period: 10, //多少期
            multiple: 1, //倍数
            num1: 2, //每隔X
            mult1: 2, //倍数x
            num2: 5, //前X期 倍数=起始倍数
            mult2: 2, //之后倍数=X
            type: 1 //类型 1每隔X期 倍数x 2前X期 倍数=起始倍数，之后倍数=y
        }
    }
    $scope.initSenior()
    $scope.zhType = 1 //默认普通追号
    $scope.swapTab = function (t) {
        if (t == 1) {
            $scope.zhType = 1
            $scope.initGeneral()
            angular.forEach($scope.kitheAll, function (d, i) {
                $scope.kitheAll[i].multiple = 1
            })
            $scope.kitheList = $scope.kitheAll.slice(0, $scope.general.period)
        } else {
            $scope.zhType = 2
            $scope.initSenior()
            $scope.kitheList = []
        }
    }
    //生成追号计划
    $scope.getZhBetList = function () {
        if ($scope.senior.period > 100) {
            Layer.alert('最大只能追100期')
            $scope.senior.period = 100
            return
        }
        if ($scope.senior.multiple > 100) {
            Layer.alert('最大只能100倍')
            $scope.senior.multiple = 100
            return
        }
        $scope.kitheList = Lottery.getZhBetList($scope)
        $timeout(function () {
            $scope.kitheList = Lottery.getZhBetList($scope)
        }, 500)
    }
    $scope.fb = function (spend) {
        const target = $('#lu-balance')
        const balance = target.text().slice(1)
        target.text(`￥${balance - spend}`)
    }
}