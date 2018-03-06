/***********购彩公用方法**********************/
import angular from 'angular'
import $ from 'jQuery'
export const Lottery = function ($http, Core, Layer) {
    return {
        /***********获取开奖信息**********************/
        getOpen: function(gid, func) {
            Core.get('open_time/get_games_list?gid=' + gid, function (json) {
                let c = angular.fromJson(json)
                if (c.code == 200) {
                    let kithe = {
                        kithe: c.data[0].kithe,
                        kithe_time_second: c.data[0].kithe_time_second,
                        kithe_time_stamp: c.data[0].kithe_time_stamp,
                        up_close_time: c.data[0].up_close_time,
                        orderTitle: c.data[0].name
                    }
                    let status = c.data[0].status
                    func && func(kithe, status)
                    //$scope.upDateKithe()
                }
            }, false)
        },
        /***********获取近期开奖**********************/
        OpenResult: function(gid, func) {
            Core.get('Open_result?gid=' + gid, function (json) {
                let c = angular.fromJson(json)
                if (c.code == 200) {
                    $.each(c.data.rows, function (i, d) {
                        c.data.rows[i].number = d.number.split(',')
                    })
                    // 近一期
                    func(c.data.rows[0], c.data.rows.slice(0, 5))
                }
            }, false)
        },
        /***********期数切换**********************/
        showIssue: function(single) {
            if (single) {
                $('.one-group').removeClass('hidden')
                $('.five-group').addClass('hidden')
                $('.one-group-btn').addClass('active')
                $('.five-group-btn').removeClass('active')
            } else {
                $('.one-group').addClass('hidden')
                $('.five-group').removeClass('hidden')
                $('.one-group-btn').removeClass('active')
                $('.five-group-btn').addClass('active')
            }
        },
        /***********玩法提示**********************/
        getTips: function(tid, func) {
            Core.get('rules/game_rules/get_game_tips_content?id=' + tid, function (c) {
                if (c.code == 200 && c.data.rows) {
                    var _data = c.data.rows
                    func([_data[0], _data[1], _data[2] + ' ' + _data[3]])
                } else {
                    func(['暂无提示', '暂无范例', '暂无中奖说明'])
                }
            }, false)
        },
        /***********倒计时**********************/
        upDateKithe: function () {

        },
        /***********获取默认玩法信息**********************/
        getPinfo: function (id, playlist, func) {
            $.each(playlist.play, function (i, d) {//大类
                $.each(d.play, function (ii, dd) {//中类
                    if (dd.play == undefined) {//如果没有第三级
                        if (id == dd.id) {
                            dd.cname = dd.sname
                            dd.aname = d.sname
                            dd.ptitle = d.name
                            func(dd) //选中玩法信息
                        }
                    } else {
                        $.each(dd.play, function(iii, ddd) {
                            if (id == ddd.id) {
                                ddd.cname = dd.sname
                                func(ddd)
                            }
                        })
                    }
                })
            })
        },
        /***********获取默认玩法信息**********************/
        getPlay: function (pid, playlist, func) {
            $.each(playlist.play, function (i, d) {
                if (pid == d.id) {
                    if (d.play[0].play == undefined) {
                        func({d}, d.play[0].id)
                        return
                    } else {
                        func(d.play, d.play[0].play[0].id)
                        return
                    }
                }
            })
        },
        /***********获取球号**********************/
        getPros: function (gid, func) {
            Core.get('games/products/' + gid, function (json) {
                var c = angular.fromJson(json)
                if (c.code == 200) {
                    func(c.data)
                }else{
                    func('[]')
                }
            }, false)
        },
        /***********元角分切换**********************/
        unit: function (t, suData) {
            let arr={}
            arr.moneytype=t
            if(t=='y') {
                arr.mtype=1
                arr.money=suData.sumbet*suData.txtmoney
            }else if(t=='j') {
                arr.mtype=10
                arr.money=suData.sumbet*suData.txtmoney/10
            }else if(t=='f') {
                arr.mtype=100
                arr.money=suData.sumbet*suData.txtmoney/100
            }
            return arr
        },
        /***********清除所有已选球**********************/
        clearAll: function () {
            $('.ball').removeClass('active')
        },
        /***********提交下注**********************/
        betSubmit: function (gid, bets, func) {
            if(!gid) {
                Layer.alert('数据有误')
                return
            }
            if(!bets) {
                Layer.alert('下注内容错误')
                return
            }
            let token = Core.getToken()
            if (!token) {
                Layer.alert('请先登录', '提示', 5)
                return
            }
            const betTotal = this.getBetTotal(JSON.parse(bets))
            Core.get('open_time/get_games_list?gid=' + gid, function (json) {
                const o = angular.fromJson(json)
                if (o.code == 200 && o.data && o.data[0] && o.data[0].is_open == 1) {
                    Core.get('user/user/user_balance?token=' + token, function (json) {
                        let c = angular.fromJson(json)
                        if (c.code == 200) {
                            if (c.data.balance >= betTotal) {
                                Layer.loading()
                                var params = {bets: bets}
                                Core.post('orders/bet/' + gid + '/', params, function (json) {
                                    Layer.closeLoading()
                                    var c = angular.fromJson(json)
                                    if (c.code == 200) {
                                        Layer.alert('下注成功', '提示', 5)
                                        func && func()
                                    } else {
                                        Layer.alert(c.msg, '提示', 5)
                                    }
                                })
                            } else {
                                Layer.alert('余额不足', '提示', 5)
                            }
                        } else {
                            Core.removeToken()
                            Layer.alert('请先登录', '提示')
                            setTimeout(function () {
                                window.location.reload()
                            }, 2000)
                        }
                    }, false)
                } else {
                    Layer.alert('当前期数已封盘', '提示', 5)
                }
            }, false)
        },
        /*******************************************追号******************************************************/
        //提交追号下注
        zhBetSubmit: function (type, gid, bets, kithe, func) {
            if(!gid) {
                Layer.alert('数据有误')
                return
            }
            if(!bets) {
                Layer.alert('下注内容错误')
                return
            }
            let token = Core.getToken()
            if (!token) {
                Layer.alert('请先登录', '提示', 5)
                return
            }
            const betTotal = this.getBetTotal(bets, JSON.parse(kithe))
            Core.get('user/user/user_balance', function (json) {
                let c = angular.fromJson(json)
                if (c.code == 200) {
                    if (c.data.balance >= betTotal) {
                        Layer.loading()
                        var params = {bets: JSON.stringify(bets), issues: kithe}
                        Core.post('orders/bets2/' + gid +'/'+(type?1:0), params, function (json) {
                            Layer.closeLoading()
                            var c = angular.fromJson(json)
                            if (c.code == 200) {
                                Layer.alert('下注成功', '提示', 5)
                                func && func()
                            } else {
                                Layer.alert(c.msg, '提示', 5)
                            }
                        })
                    } else {
                        Layer.alert('余额不足', '提示', 5)
                    }
                }
            }, false)
        },
        //追号信息
        getZhKithe: function (e, func) {
            //普通追号
            let kitheAll = [] //获取所有期数列表
            let kitheList = [] //最终期数
            Core.get('Open_time/get_zhkithe_list?gid='+e.gid, function(json) {
                let c = angular.fromJson(json)
                if (c.code == 200) {
                    angular.forEach(c.data, function (d, i) {
                        d.multiple = e.general.multiple
                        d.id = i
                        kitheAll.push(d)
                    })
                    kitheList = kitheAll.slice(0, e.general.period)
                    func(kitheList, kitheAll)
                } else {
                    Layer.alert(c.msg)
                }
            }, false)
        },
        //生成追号计划
        getZhBetList: function (e) {
            //基本追号
            let kitheList = []
            angular.forEach(e.kitheAll, function (d, i) {
                if(i>=e.senior.start) {
                    d.multiple = e.senior.multiple
                    kitheList.push(d)
                }
            })
            kitheList = kitheList.slice(0, e.senior.period)
            //高级追号(每隔X期倍数X)
            if(e.senior.type == 1) {
                let c= e.senior.multiple || 1
                angular.forEach(kitheList, function (d, i) {
                    //每隔X期倍数剩X
                    if(i % e.senior.num1 ==0 && i>=e.senior.num1) {
                        c = c*e.senior.mult1 > 1000000000000 ? c : c*e.senior.mult1
                    }
                    kitheList[i].multiple = parseInt(c)
                })
            }

            //高级追号(前X期 倍数=起始倍数，之后倍数=X)
            if(e.senior.type == 2) {
                let b = 1
                angular.forEach(kitheList, function (d, i) {
                    //每隔X期倍数剩X
                    if (i >= e.senior.num2) {
                        b = e.senior.mult2
                    } else {
                        b = e.senior.num2 ? e.senior.multiple : e.senior.mult2
                    }
                    kitheList[i].multiple = b
                })
            }
            return kitheList
        },
        getBetTotal: function (bets, kithe) {
            let betTotal = 0
            $.each(bets, function (i, d) {
                if (kithe) {
                    $.each(kithe, function (ii, dd) {
                        betTotal += parseFloat(d.price_sum*dd)
                    })
                } else {
                    betTotal += parseFloat(d.price_sum)
                }
            })
            return betTotal
        }
    }
}