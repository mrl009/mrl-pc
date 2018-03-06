import angular from 'angular'
import $ from 'jQuery'
import './lhc.lottery.less'

export default function (
	Layer,
	$scope,
	$rootScope,
	$stateParams,
	$timeout,
	$interval,
	CtrlUtil,
	Lottery,
	Core,
	Util,
	Lhc
) {
    $('.content').addClass('scroll-active')
	/*
	 * 229 为特码其他
	 */
	$scope.type = $stateParams.type
	$scope.gid = $stateParams.gid
	$scope.show = 0
	$scope.tid = 0

	$scope.betData = {}
	$scope.betCount = 0
	$scope.betNum = 0
    // 彩票状态
    $scope.lotteryStatus = true
	$scope.calculate = function() {
		$scope.betCount = 0
		$scope.betNum = Object.keys($scope.betData).length
		for(let i in $scope.betData) {
			$scope.betCount += Number($scope.betData[i].price)
		}
		$scope.$apply()
	}


	//开奖倒计信息
    Lottery.getOpen($scope.gid, function (c, status) {
        $scope.kithe = c
        if (status == 0) {
            $scope.initProduct()
            $scope.upDateKithe()
        } else {
            $scope.lotteryStatus = false
        }
        Layer.closeLoading()
    })
    //开奖倒计信息
    $scope.upDateKithe = function () {
        function fplhc(m) {
            var str = Core.ShowCountDown(m)
            if (str != 'end') {
                $scope.openStatus = true //开盘状态
                $scope.syTime = str.split(':')
                $scope.ddTimer = $timeout(function () {
                    fplhc(m)
                }, 1000)
            } else {
                $scope.openStatus = false //开盘状态
                if (Object.keys($scope.betData).length) {
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
                                fplhc(new Date().getTime() + c.data[0].kithe_time_second * 1000)
                            } else {
                                return
                            }
                        }
                    }, false)
                }, 2000)
                /**$scope.opening = $interval(function () {
                    let sj = []
					let sx = []
                    angular.forEach($scope.lottery_log_one.number, function () {
                        sj.push(Math.floor(Math.random() * 9))
						sx.push(Lhc.randomSx())
                    })
                    $scope.lottery_log_one.number = sj
                    $scope.lottery_log_one.shengxiao = sx
                }, 100)**/
                //获取开奖记录--等待
                $scope.openTimer = $interval(function () {
                    //刷新近期开奖
                    Lhc.OpenResult($scope.gid, function (o1, o5) {
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

        fplhc(parseInt(new Date().getTime()) + $scope.kithe.kithe_time_second * 1000)
    }

	$scope.setBetData = function(code, data, flag) {
		$scope.betData[code] = $scope.betData[code] || {}
		Object.assign($scope.betData[code], data)
		$scope.betData[code].gid = $scope.gid
		$scope.betData[code].tid = $scope.betData[code].tid || $scope.tid
		if(flag !== false) {
			$scope.calculate()
		}
	}

	//获取color
	if(!$scope.numsInfo) {
		Lhc.getNums(function(data) {
			$scope.numsInfo = data
			$scope.sxNums = Lhc.sxNums(data.sx)
			$scope.colors = Lhc.setColors(data.sb)
		})
	}

	//初始化合肖tool
	$scope.hxTools = Lhc.initHxTools()
	$scope.toolType = 0
	$scope.changeTool = function(type) {
		$scope.toolType = type
		$scope.betData = Lhc.tools(type, $scope.gid, $scope.tid)
		$scope.calculateCb3()
	}

	$scope.initData = function(sname) {
		let _len = 0, lastId
		$scope.playOneId = sname
		$scope.playTwo = $scope.getPlayTwo()
		if($scope.playTwo) {
			const arr = $scope.playTwo.filter((e) => {
				return e.id == $scope.show
			})
			$scope.tid = arr.length == 0 ? $scope.playTwo[0].id : $scope.show
			$scope.playTwoId = arr.length == 0 ? $scope.playTwo[0].sname : arr[0].sname
			_len = Lhc.getLen($scope.playTwoId)
		} else {
			_len = Lhc.getLen($scope.playOneId)
		}

		if(sname == 'zm16') {
			$scope.playTwoCp = Util.convertFromObj2Arr(Object.assign({}, $scope.playTwo))
			$scope.playTwo = []
			$scope.initBalls(0, false)
            $scope.playTwoCp.forEach(function(e) {
                e.balls = $scope.productData[e.id].balls
            })
		} else if(sname == 'zmgg') {
			$scope.tid = $scope.playOneGid
			$scope.initBalls(_len)
		} else {
			$scope.initBalls(_len)
		}
		if(sname == 'tmab') {
			// $scope.filterPlay(229)
            lastId = $scope.getLastId('tmab', 'qt')
			$scope.filterPlay(lastId)
			$scope.qtBalls = $scope.handleArr(5, $scope.productData[lastId].balls, 'qt')
			$scope.qtTitle = '特码其他'
		}

		if(sname == 'wx') {
			// $scope.filterPlay(291)
            lastId = $scope.getLastId('wx', '5x')
			$scope.filterPlay(lastId)
			$scope.wxBalls = $scope.productData[lastId].balls
			$scope.playTwo = []
		}

		if(sname == 'lmian') {
			// $scope.filterPlay(220)
            lastId = $scope.getLastId('lmian', 'qt')
            $scope.filterPlay(lastId)
			$scope.playTwoCp = [...$scope.playTwo]
			$scope.playTwo = []
			$scope.qtBalls = $scope.handleArr(4, $scope.productData[lastId].balls, 'qt')
            $scope.tid = $scope.playTwoCp[0].id
            $scope.initBalls(1)
            $scope.playTwoCp.forEach(function(e) {
                e.balls = $scope.productData[e.id].balls
            })
		}

		if(sname == 'lm' || sname == 'zxbz' || sname == 'z1') {
			$scope.handlePlayTwo()
		}
	}

	$scope.handleTagAndUrl = function(sname, id) {
		//sname = id == 201 ? 'lmian' : sname
        if (sname == 'lm') {
            sname = $scope.lMainOrLM(id)
        }
		$scope.playOneGid = id
		$scope.initData(sname)
		$scope.reset()
		$scope.currUrl = $rootScope.LTY_ROOT + 'lhc/' + sname + '.tpl.html'
	}

    $scope.balls = []

	$scope.initProduct = function() {
		CtrlUtil.initProduct($scope.gid, function(data) {
			$scope.productData = data
			$scope.initPage()
		})
	}

	$scope.initPage = function() {
		CtrlUtil.initPage($scope.gid, function(data) {
			$scope.playlist = data
			$scope.plays = data.play
			$scope.show = data.show
            $scope.max_money_play = data.max_money_play
            $scope.max_money_stake = data.max_money_stake
			$scope.getPlayOne($scope.show)
			$scope.handleTagAndUrl($scope.playOneId, $scope.playOneGid)
		}, false)
	}

	$scope.filterPlay = function(id) {
		$scope.playTwo = $scope.playTwo.filter((e) => {
			return id != e.id
		})
	}
	$scope.getPlayTwo = function() {
		return $scope.plays.filter((e) => {
			return e.id == $scope.playOneGid
		})[0].play
	}
	$scope.getPlayOne = function(id) {
		$scope.plays.forEach((e) => {
			if(e.play) {
				e.play.forEach((el) => {
					if(el.id == id) {
						$scope.playOneId = e.sname
						$scope.playOneGid = e.id
					}
				})
			}
		})
	}
	$scope.lMainOrLM = function (id) {
	    let sname = 'lm'
        $scope.plays.forEach((e) => {
            if(e.id == id && e.play.length == 7) {
                sname = 'lmian'
            }
        })
        return sname
    }
    $scope.getLastId = function(pname, sname) {
	    let id
        $scope.plays.forEach((e) => {
	        if (pname == 'lmian' && e.sname == 'lm' && e.play.length == 7) {
                e.play.forEach((el) => {
                    if(el.sname == sname) {
                        id = el.id
                    }
                })
            } else if(e.sname == pname) {
                e.play.forEach((el) => {
                    if(el.sname == sname) {
                        id = el.id
                    }
                })
            }
        })
        return id
    }
	//期数切换
    $scope.showIssue = function (single) {
        Lottery.showIssue(single)
    }
	//获取近期开奖
    Lhc.OpenResult($scope.gid, function (o1, o5) {
        $scope.lottery_log_one = o1
        $scope.lottery_log_five = o5
    })

    $scope.inputsArr = $scope.balls
    $scope.handleArr = function(len, balls, type) {
    	const _len = Math.ceil(balls.length/len)
    	$scope[`inarr${type}`] = Core.createArr(_len)
    	return Core.splitArr(balls, _len)
    }

    $scope.initBalls = function(len, flag) {
    	$scope.balls = $scope.productData[$scope.tid || $scope.show].balls.map(function(e) {
			e.code = Util.handleBall(e.code)
			return e
		})

		if($scope.playOneId === 'hx') {
			$scope.rates = $scope.productData[$scope.tid].rate
		}

		if(
			$scope.playOneId === 'lx' ||
			$scope.playOneId === 'lw' ||
			$scope.playOneId === 'sx' ||
			$scope.playOneId === 'hx'
		) {
			$scope.balls = Lhc.splitArr($scope.balls, 2)
			$scope.inarrballs = Core.createArr($scope.balls[0].length)
		} else {
			if(flag == undefined || flag == true) {
				$scope.balls = $scope.handleArr(len, $scope.balls, 'balls')
			}
		}
    }
    $scope.showQuickMoney = Lhc.showTooltip(function(code, val, rate, rebate, contents, names, pid, keyCode, atitle, btitle, tid) {
    	atitle = $.trim(atitle)
    	btitle = $.trim(btitle)
    	$scope.setBetData(keyCode ? keyCode : code, {
    		price: val,
    		price_sum: val,
    		counts: 1,
    		rate,
    		rebate,
    		contents,
    		names,
    		pids: pid,
    		atitle,
    		btitle,
    		tid
    	})
    })

    $scope.reset = function() {
    	$scope.betData= {}
    	$scope.betNum = 0
    	$scope.betCount = 0
    	Lhc.clearInput()
    	Lhc.clearCheckbox()
    	Lhc.removeAllBalls()
    	Lhc.clearRadio()
    	$('input[name="betMoney"]').val('')
    }

    $scope.chooseTab = function(_tid) {
    	$scope.tid = _tid
    	//重置数据
    	$scope.reset()
    	const _sname = $scope.playTwo.filter((e) => {
    		return e.id == _tid
    	})[0].sname
    	$scope.playTwoId = _sname
    	$scope.toolType = 0
    	const len = Lhc.getLen(_sname)
    	//重新渲染球球
    	$scope.initBalls(len)
    }

    $scope.initChange = function() {
    	Lhc.handleInputChange(function(keyCode, code) {
    		delete $scope.betData[keyCode ? keyCode : code]
	    	$scope.calculate()
    	}, function(
			code, price, price_sum, rate, rebate, contents, names, pids, keyCode, atitle, btitle, tid
    	) {
    		atitle = $.trim(atitle)
    		btitle = $.trim(btitle)
    		$scope.setBetData(keyCode ? keyCode : code, { code, price, price_sum, rate, rebate, contents, names, pids, atitle, btitle, tid, counts: 1})
    	})
    }

    $scope.handleRadio= function(evt) {
    	Lhc.handleRadioChange(
    		evt.target,
    		function( rate, rebate, contents, names, pid, code, keyCode, colName, rowName ) {
    			$scope.setBetData(keyCode, { rate, rebate, contents, names, pid, code, keyCode, colName, rowName}, false)
    			$scope.calculateDuo()
    		}
    	)
    }
    $scope.setBalls = function(evt, tid) {
    	Lhc.setBalls(
    	    $scope,
    		evt.target,
    		tid,
    		function(code, rebate, pid, name) {
	    		$scope.setBetData(code, { code, name, rebate, pid }, false)
	    		$scope.calculateCb()
	    	},
	    	function(code) {
	    		delete $scope.betData[code]
	    		$scope.calculateCb()
	    	}
	    )
    }

    $scope.calculateCb = function() {
    	const balls = Util.convertFromObj2Arr($scope.betData).map(function(e) {
    		return e.code
    	})
    	const ballsZh = Lhc.zuHeNums(balls, $scope)
    	$scope.betNum = ballsZh.length
    	const tab = $('.tab-selected')
		$scope.rate = tab.find('.ts-rate').text()
		$scope.tabName = tab.find('.ts-label').text()
		$scope.zhBalls = ballsZh
    }

    //多球一注计算方式
    $scope.calculateDuo = function() {
		$scope.showRet = Util.convertFromObj2Arr($scope.betData)
		$scope.betNum = $scope.showRet.length >= 2 ? 1 : 0
		$scope.showRate = $scope.showRet.map((e) => {
			return e.rate
		}).reduce(function(a, b) {
			return a * b
		})
		$scope.showRate = Number($scope.showRate).toFixed(2)
    }

    $scope.deleteBall = function(keyCode) {
    	delete $scope.betData[keyCode]
    	$scope.calculateDuo()
    	$(`.radio[keyCode="${keyCode}"]`)
    		.find('.icon-radio-check')
    		.removeClass('icon-radio-check')
    		.addClass('icon-radio-uncheck')
    }

    $scope.handlePlayTwo = function() {
    	$scope.playTwo.map(function(e) {
    		e.rate = $scope.productData[e.id].rate
    		e.rebate = $scope.productData[e.id].rebate
    		e.pid = $scope.productData[e.id].id
    		return e
    	})
    }

    $scope.handleNums = function(arrStr) {
    	if(arrStr && arrStr.indexOf(',') >= 0) {
    		return arrStr && arrStr.split(',')
    	} else {
    		return arrStr && arrStr.split(' ')
    	}
    }

    //带生肖的复选框
    $scope.handleCb2 = function(evt, tid) {
    	Lhc.setBalls(
    	    $scope,
    		evt.target,
    		tid,
    		function(code, rebate, pid, name, rate) {
    			Lhc.addBalls(evt.target)
    			$scope.setBetData(code, { code, names: code, rebate, pid, name, rate }, false)
    			if($scope.playOneId == 'hx') {
    				$scope.calculateCb3()
    			} else {
    				$scope.calculateCb2()
    			}
    		},
    		function(code) {
    			Lhc.removeBalls(evt.target)
    			delete $scope.betData[code]
    			if($scope.playOneId == 'hx') {
    				$scope.calculateCb3()
    			} else {
    				$scope.calculateCb2()
    			}
    		}
	    )
    }

    //多球多注
    $scope.calculateCb2 = function() {
    	const balls = Util.convertFromObj2Arr($scope.betData)
    	const ballsZh = Lhc.zuHeNums(balls, $scope)
    	$scope.betNum = ballsZh.length
    	const tab = $('.tab-selected')
		$scope.tabName = tab.text()
		$scope.zhBalls = ballsZh
    }

    //多球一注
    $scope.calculateCb3 = function() {
    	$scope.tabName = $('.tab-selected').text()
    	$scope.oneBall = Lhc.hbData($scope.betData)
    	$scope.betNum = $scope.oneBall ? 1 : 0
    }

    $scope.getMinRate = function(data) {
    	return Math.min(...Util.convertFromObj2Arr(data).map((e) => {return e.rate}).slice(0, -1))
    }

    $scope.getMaxRate = function(data) {
    	return Math.max(...Util.convertFromObj2Arr(data).map((e) => {return e.rate}).slice(0, -1))
    }

    $scope.getNames = function(items) {
    	return items.map((e) => {return e.name}).join(',')
    }

    //单球单注
    $scope.handleSubmit = function() {
    	const arr = Util.convertFromObj2Arr($scope.betData)
    	if(!arr.length) {
    		Layer.alert('请先添加投注内容')
    		return false
    	}
    	const params = JSON.stringify(arr)
    	//price sum
    	const ps = arr.map((e) => e.price_sum).reduce((a, b) => Number(a) + Number(b))
    	Lottery.betSubmit($scope.gid, params, function() {
    		$scope.reset()
    		$scope.fb(ps)
    	})
    }

    //正码过关提交
    $scope.ggSubmit = function() {
    	const params = Lhc.ggd($scope.betData, $scope.balls[0].length)

    	Lhc.submit($scope.gid, params, $scope.betNum, function(d, price) {
    		d.price= price
    		d.price_sum = price
    		return d
    	}, function(ps) {
    		$scope.reset()
    		$scope.fb(ps)
    	})
    }

    $scope.duoSubmit = function() {
    	const params = Lhc.hdData($scope.betData)
    	Lhc.submit($scope.gid, params, $scope.betNum, function(d, price, counts) {
    		d.price = price
    		d.counts = counts
    		d.price_sum = price * counts
    		return d
    	}, function(ps) {
    		$scope.reset()
    		$scope.fb(ps)
    	})
    }

    //多球多注
    //duo1Submit
    $scope.d1s = function() {
    	const params = Lhc.d1sData($scope.zhBalls)
    	Lhc.submit($scope.gid, params, $scope.betNum, function(d, price) {
    		return d.map((e) => {
    			e.price = price
    			e.price_sum = price
    			return e
    		})
    	}, function(ps) {
    		$scope.reset()
    		$scope.fb(ps)
    	})
    }

    //增加六合彩近期开奖球颜色
    Lhc.tf('.ball-magic .small-right', function(clazz) {
    	$(clazz).each(function() {
    		const small = $(this).find('.small')
    		const num = small.text()
    		small.addClass(`ball-${Lhc.colorCache[num]}`)
    	})
    })

    Lhc.tf('.five-group .ball', function(clazz) {
    	$(clazz).each(function() {
    		const num = $(this).text()
    		$(this).addClass(`ball-${Lhc.colorCache[num]}`)
    	})
    })

    //freshBalance 刷新余额
    $scope.fb = function(spend) {
    	const target = $('#lu-balance')
    	const balance = target.text().slice(1)
    	target.text(`￥${balance - spend}`)
    }
}

