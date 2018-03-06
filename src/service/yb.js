import $ from 'jQuery'
export const Yb = function ($http, Core) {
    return {
        /***********操作选号**********************/
        //选择
        addActive: function (pn) {
            let _ = $(pn)
            if (_.hasClass('active')) {
                _.removeClass('active')
            } else {
                _.addClass('active')
            }
        },
        //单击选号
        selBalls: function (pn, e) {
            this.addActive(pn)
            return this.countNum(e)
        },
        //统计注数
        countNum: function (e) {
            //判断玩法对应的注数
            var l0 = this.arrBall(0)
            var l1 = this.arrBall(1)
            var l2 = this.arrBall(2)
            if (e.id == 8 || e.id == 9 || e.id == 108 || e.id == 109) {// 三码_直选_直选复式|单式
                if (l0.length == 0 || l1.length == 0 || l2.length == 0) {
                    return 0
                }
                return Core.zuHe(l0, l1, l2)
            } else if (e.id == 10 || e.id == 110) {// 三码_直选_直选和值
                var c = this.arrBall(0)
                var count = 0
                var arr = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 63, 69, 73, 75, 75, 73, 69, 63, 55, 45, 36, 28, 21, 15, 10, 6, 3, 1]
                c.forEach(function (e) {
                    count += arr[e]
                })
                return count
            } else if (e.id == 11 || e.id == 111) {// 三码_组选_组三
                var c = Core.arrange(l0, 2)
                return c.length * 2
            } else if (e.id == 13 || e.id == 14 || e.id == 113 || e.id == 114) {// 三码_组选_组六|混合组选
                var c = Core.arrange(l0, 3)
                return c.length
            } else if (e.id == 19 || e.id == 20 || e.id == 119 || e.id == 120) {// 二码_后二直选_复式|单式
                if (l0.length == 0 || l1.length == 0) {
                    return 0
                }
                return Core.zuHe(l0, l1)
            } else if (e.id == 21 || e.id == 121) {// 二码_后二直选_直选和值
                var c = this.arrBall(0)
                var count = 0
                var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
                c.forEach(function (e) {
                    count += arr[e]
                })
                return count
            } else if (e.id == 22 || e.id == 23 || e.id == 122 || e.id == 123) {// 二码_后二组选_复式|单式
                var c = Core.arrange(l0, 2)
                return c.length
            } else if (e.id == 24 || e.id == 25 || e.id == 124 || e.id == 125) {// 二码_前二直选_复式|单式
                if (l0.length == 0 || l1.length == 0) {
                    return 0
                }
                return Core.zuHe(l0, l1)
            } else if (e.id == 26 || e.id == 126) {// 二码_前二直选_直选和值
                var c = this.arrBall(0)
                var count = 0
                var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
                c.forEach(function (e) {
                    count += arr[e]
                })
                return count
            } else if (e.id == 27 || e.id == 28 || e.id == 127 || e.id == 128) {// 二码_前二组选_复式|单式
                var c = Core.arrange(l0, 2)
                return c.length
            } else if (e.id == 29 || e.id == 129) {// 定位胆_定位胆
                return l0.length + l1.length + l2.length
            } else if (e.id == 30 || e.id == 130) {// 不定位_不定位
                return l0.length
            }
        },
        /***********操作选号**********************/
        //对象转数组
        arrBall: function (v) {
            let arr = []
            const e = $('.balls').eq(v).find('.active')
            $.each(e, (i, d) => {
                arr.push($(d).attr('name'))
            })
            return arr
        },
        toolQuan: (pn, e) => {
            const _ = $(pn)
            console.log(_)
            console.log(e)
            /*_.parent().parent().parent().find('li>span').addClass('active')
             return this.countNum(e)*/
        },
        //选择方法
        toolXz: function (pn, e, type) {
            let arr = [], sum = 0
            if (type == 1) {
                arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            } else if (type == 2) {//大
                arr = [5, 6, 7, 8, 9]
            } else if (type == 3) {//小
                arr = [0, 1, 2, 3, 4]
            } else if (type == 4) {//单
                arr = [1, 3, 5, 7, 9]
            } else if (type == 5) {//双
                arr = [0, 2, 4, 6, 8]
            }
            sum = this.tools(pn, e, arr)
            return sum
        },
        //工具类
        tools: function (pn, e, arr) {
            const _ = $(pn).parent().parent().find('.ball')
            _.removeClass('active')
            for (let i = 0; i < arr.length; i++) {
                _.eq(arr[i]).addClass('active')
            }
            return this.countNum(e)
        },
        addBet: function (e, betArr) {
            const ll = $('.balls').length
            if (e.betType == 'all') {//--组合
                let a_pids = [], a_contents = [], a_names = [], rates = []
                for (let i = 0; i < ll; i++) {
                    const ee = $('.balls').eq(i).find('.active')
                    let names = [], contents = [], pids = []
                    $.each(ee, (i, d) => {
                        const _ = $(d)
                        pids.push(_.attr('pid'))
                        contents.push(_.attr('code'))
                        names.push(_.attr('name'))
                        let rate = _.attr('rate')
                        if (rate != undefined && rate > 0) {
                            rates.push(rate)
                        }
                    })
                    a_pids.push(pids.join())
                    a_contents.push(contents.join())
                    a_names.push(names.join())
                }
                var bet = {
                    gid: e.gid,
                    tid: e.playInfo.id,
                    price: e.suData.txtmoney / e.suData.mtype,
                    counts: e.suData.sumbet,
                    price_sum: e.suData.txtmoney * e.suData.sumbet / e.suData.mtype,
                    rate: e.orate.join(),
                    rebate: e.rate.volume,
                    pids: a_pids.join('|'),
                    contents: a_contents.join('|'),
                    names: a_names.join('|'),
                    title: (e.playName ? e.playName : e.playInfo.ptitle) + '_' + e.playInfo.name
                }
                betArr.push(bet)
            } else {
                for (let i = 0; i < ll; i++) {
                    const ee = $('.balls').eq(i).find('.active')
                    let bet = {}
                    $.each(ee, function (i, d) {
                        bet = {
                            gid: e.gid,
                            tid: e.playInfo.id,
                            price: e.suData.txtmoney / e.suData.mtype,
                            counts: 1,
                            price_sum: e.suData.txtmoney / e.suData.mtype,
                            rate: e.orate[i],
                            rebate: e.rate.volume,
                            pids: $(d).attr('pid'),
                            contents: $(d).attr('code'),
                            names: $(d).attr('name'),
                            title: (e.playName ? e.playName : e.playInfo.ptitle) + '_' + e.playInfo.name
                        }
                        betArr.push(bet)
                    })
                }
            }
            return betArr
        },
        createArr: (num) => {
            return [...Array(num)].map(function (e, i) {
                return i
            })
        },
        randomOne: function (e) {
            var createArr = function (n) {
                return [...Array(n)].map(function (e, i) {
                    return i
                })
            }
            var baseBall = [], r = []
            var tid = e.tid == '' ? e.show : e.tid
            if (tid == 8 || tid == 108) {
                baseBall = createArr(10)
                r = Core.randomOne(baseBall, false, 1, 1, 1)
                this.setRandom(r, 1)
            } else if (tid == 10 || tid == 110) {
                baseBall = createArr(28)
                r = Core.randomOne(baseBall, false, 1, 1)
                this.setRandom(r, 1)
            } else if (tid == 11 || tid == 122) {
                baseBall = createArr(10)
                r = Core.randomOne(baseBall, false, 2)
                this.setRandom(r, 1)
            } else if (tid == 13) {
                baseBall = createArr(10)
                r = Core.randomOne(baseBall, false, 3)
                this.setRandom(r, 1)
            } else if (tid == 111) {
                baseBall = createArr(10)
                r = Core.randomOne(baseBall, false, 2)
                this.setRandom(r, 1)
            } else if (tid == 113) {
                baseBall = createArr(10)
                r = Core.randomOne(baseBall, false, 3)
                this.setRandom(r, 1)
            } else if (tid == 19 || tid == 119 || tid == 124) {
                baseBall = createArr(10)
                r = Core.randomOne(baseBall, false, 1, 1)
                this.setRandom(r, 1)
            } else if (tid == 21 || tid == 26 || tid == 121 || tid == 126) {
                baseBall = createArr(19)
                r = Core.randomOne(baseBall, false, 1)
                this.setRandom(r, 1)
            } else if (tid == 22 || tid == 27) {
                baseBall = createArr(10)
                r = Core.randomOne(baseBall, false, 2)
                this.setRandom(r, 1)
            } else if (tid == 24 || tid == 127) {
                baseBall = createArr(10)
                r = Core.randomOne(baseBall, false, 1, 1)
                this.setRandom(r, 1)
            } else if (tid == 29 || tid == 129) {
                baseBall = createArr(30)
                r = Core.randomOne(baseBall, false, 1)
                // this.setRandom(r, 3)
                this.setRandom(r, 1)
            } else if (tid == 30 || tid == 130) {
                baseBall = createArr(10)
                r = Core.randomOne(baseBall, false, 1)
                this.setRandom(r, 1)
            }
        }
    }
}