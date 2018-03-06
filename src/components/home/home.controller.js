import angular from 'angular'
import $ from 'jQuery'
import moment from 'moment'
export default function(
	$scope,
	Core,
	$timeout,
	$rootScope,
	$location,
	$cookies,
	Util,
	Layer,
    $interval
) {
	Layer.loading()
	$scope.prizeData = []
	$scope.openData = []
	const { $$search } = $location
	$$search.intr && $cookies.put('intr', Number($$search.intr), {expires: new Date(moment().add(1, 'y').format('YYYY-MM-DD HH:mm:ss'))})

	//初始化轮播图
	$scope.start = function() {
		const _len = $('.v_cont li').length
		if(_len == 0 ) {
			const _t = $timeout(function() {
				$timeout.cancel(_t)
				$scope.start()
			}, 10)
		} else {
			Util.initCoursel()
		}
		let tt = $('.circle li').length
		let aa = 0
		if(tt != 0) {
            $interval(function() {
                if(aa < tt) {
                    aa = aa + 1
                }else{
                    aa=0
                }
                $('.circle li').eq(aa).click()
            }, 3000)
		}
	}

	$scope.start()

	//初始化中奖结果
	$scope.initPrize = function() {
		Core.get('home/get_list_wins', function(json) {
			const c = angular.fromJson(json)
			if(c.code == 200 ) {
				//$scope.prizeData = c.data.rows.slice(0, 10)
				$scope.prizeData = c.data
			}
		})
	}

	$scope.initPrize()

	//初始化开奖结果
	$scope.initOpen = function() {
		Core.get('Open_time/get_games_list', function(json) {
			const c = angular.fromJson(json)
			if( c.code == 200 ) {
				let _data = c.data.slice(0, 5)
				_data = _data.map((e) => {
					e.number = e.number.split(',')
					e.kj_time = moment(e.kj_time).format('YYYY-MM-DD')
					return e
				})
				$scope.openData = _data
			}
		})
	}

	$scope.initOpen()

    //初始化首页弹框
    $scope.initLog = function() {
        Core.get('rules/game_rules/get_game_article_content?id=68', function(json) {
            const c = angular.fromJson(json)
            if( c.code == 200 ) {
                let info = c.data[0].content
				if(info) {
                    Layer.modal({
                        title: '系统公告',
                        msg: `<div 
								style="text-align: left;padding:0 20px 0 20px;overflow: auto;min-height: 320px;max-height: 472px;">${info}</div>`,
                        style: {
                            width: '600px',
                            minHeight: '320px',
                            marginLeft: '-240px',
                            maxHeight: '550px',

                        }
                    })
				}
            }
        })
    }
    if(sessionStorage.getItem('tip')!=1) {
        $scope.initLog()
        sessionStorage.setItem('tip', 1)
	}

	$scope.fastData = []
	$scope.fastCurrIdx = 0
	$scope.upDateKithe = Util.upDateKithe()
	$scope.syTimeCache = {}
	// 获取热门开奖及随机一注
	Core.get('open_time/get_games_list?hot=1', function (json) {
		const c = angular.fromJson(json)
		if (c.code == 200) {
            let fastData = []
            $.each(c.data, function (i, d) {
                if (d.tmp == 'ssc' || d.tmp == 'pk10' || d.tmp == 's_ssc' || d.tmp == 's_pk10' || d.tmp == 's_kl10') {
                    fastData.push(d)
                }
            })
            $scope.fastData = fastData.slice(0, 4).map((e) => {
                e.number = $scope.randomOne(e.tmp, true)
                $scope.upDateKithe(
                    e.gid,
                    e.kithe_time_second,
                    e.up_close_time,
                    $scope.syTimeCache,
                    function(data) {
                        e.number = $scope.randomOne(data.tmp, true)
                        e.kithe = data.kithe
                        $scope.setLotteryData($scope.fastCurrIdx)
                    }
                )
                return e
            })
            $scope.setLotteryData(0)
		}
    })

	$scope.changeTab = function(idx) {
		if($scope.fastCurrIdx == idx ) {
			return
		} else {
            $scope.setLotteryData(idx)
			$scope.fastCurrIdx = idx
		}
	}

	Core.get('content/content/getContentList?parent_id=1', function (json) {
		var c = angular.fromJson(json)
		if (c.code == 200) {
			$scope.news = c.data.rows
			$timeout(function() {
				Layer.closeLoading()
			}, 500)
		}
	})

	$scope.qrCode = 0
	$scope.showQrCode = function (i) {
		$scope.qrCode = i
		$('.tab-mobileapp').addClass('hidden')
		$('.tab-mobileapp').eq(i).removeClass('hidden')
	}

	$scope.noticeTab = 0
	$scope.showNotice = function(i) {
		$scope.noticeTab = i
		$('.notice_content').addClass('hidden')
		$('.notice_content').eq(i).removeClass('hidden')
	}

	$scope.$on('$destroy', function() {
		Util.clearCd()
	})
	/******************开奖购彩start********************/
	$scope.setLotteryData = function (idx) {
        $scope.lotteryData = {
            multiple: 1,
			type: $scope.fastData[idx].tmp,
			gid: $scope.fastData[idx].gid,
            number: $scope.fastData[idx].number
		}
    }
    // 加减
    $scope.$watch('lotteryData.multiple', function (n) {
        if (n != undefined) {
            if (typeof n == 'string') {
                n = n.replace(/\D/, '')
            }
            n = !n ? 1 : n
            n = n > 999 ? 999 : n
            $scope.lotteryData.multiple = n
		}
    })
    $scope.setMultiple = function (flag) {
        if (flag) {
            $scope.lotteryData.multiple = parseInt($scope.lotteryData.multiple) + 1
        } else {
            $scope.lotteryData.multiple = $scope.lotteryData.multiple > 1 ? $scope.lotteryData.multiple - 1 : 1
        }
    }
    // 随机一注
	$scope.randomOne = function (type, flag) {
		let balls = []
		let ball = []
		type = type || $scope.lotteryData.type
		let baseBall = {
            'ssc': {
                ball: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                num: 5
            },
            'pk10': {
                ball: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                num: 1
            },
			's_ssc': {
                ball: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, '大', '小', '单', '双'],
                num: 1
            },
			's_pk10': {
                ball: ['大', '小', '单', '双', '龙', '虎'],
                num: 1
			},
            's_kl10': {
                // ball: ['大', '小', '单', '双', '尾大', '尾小', '合单', '合双', '东', '南', '西', '北', '中', '发', '白'],
                ball: ['大', '小', '单', '双', '东', '南', '西', '北', '中', '发', '白'],
                num: 1
            }
		}
        baseBall = baseBall[type]
        if (type == 'ssc') {
            balls = Core.randomOne(baseBall.ball, true, 1, 1, 1, 1, 1)
		} else {
            balls = Core.randomOne(baseBall.ball, false, 1)
		}
        angular.forEach(balls, function (d) {
            ball.push(d[0])
        })
        if (!flag) {
            $scope.fastData[$scope.fastCurrIdx].number = ball
            $scope.lotteryData.number = ball
		} else {
			return ball
		}
    }
    // 下注
    $scope.setLottery = function () {
		sessionStorage.setItem('lotteryData', JSON.stringify($scope.lotteryData))
    }
}
