import $ from 'jQuery'

export const $11x5 = function (Core) {
    return {
        //统计注数
        countNum: function (e) {
            //判断玩法对应的注数
            var l0 = this.arrBall(0)
            var l1 = this.arrBall(1)
            var l2 = this.arrBall(2)
            var l3 = this.arrBall(3)
            var l4 = this.arrBall(4)
            if (e.cname == 'q3zhx' && e.sname == 'fs') {//三码_前三直选_复式
                if (l0.length == 0 || l1.length == 0 || l2.length == 0) {
                    return 0
                }
                return Core.zuHe2(l0, l1, l2)
            } else if (e.cname == 'q3zx' && e.sname == 'fs') {//三码_前三组选_复式
                var c = Core.arrange(l0, 3)
                return c.length
            } else if (e.psname == '2m' && e.cname == 'q2zhx' && e.sname == 'fs') {//二码_前二直选_复式
                if (l0.length == 0 || l1.length == 0) {
                    return 0
                }
                return Core.zuHe2(l0, l1)
            } else if (e.psname == '2m' && e.cname == 'q2zx' && e.sname == 'fs') {//二码_前二组选_复式
                var c = Core.arrange(l0, 2)
                return c.length
            } else if (e.psname == 'bdd' && e.sname == 'q3w') {//不定胆前三位
                return l0.length
            } else if (e.sname == 'dwd') {//定位胆定位胆
                return l0.length + l1.length + l2.length + l3.length + l4.length
            } else if (e.psname == 'rx' && e.sname == '1z1') {//任选复式一中一
                return l0.length
            } else if (e.psname == 'rx' && e.sname == '2z2') {//任选复式二中二
                var c = Core.arrange(l0, 2)
                return c.length
            } else if (e.psname == 'rx' && e.sname == '3z3') {//任选复式三中三
                var c = Core.arrange(l0, 3)
                return c.length
            } else if (e.psname == 'rx' && e.sname == '4z4') {//任选复式四中四
                var c = Core.arrange(l0, 4)
                return c.length
            } else if (e.psname == 'rx' && e.sname == '5z5') {//任选复式五中五
                var c = Core.arrange(l0, 5)
                return c.length
            } else if (e.psname == 'rx' && e.sname == '6z5') {//任选复式六中五
                var c = Core.arrange(l0, 6)
                return c.length
            } else if (e.psname == 'rx' && e.sname == '7z5') {//任选复式七中五
                var c = Core.arrange(l0, 7)
                return c.length
            } else if (e.psname == 'rx' && e.sname == '8z5') {//任选复式八中五
                var c = Core.arrange(l0, 8)
                return c.length
            }
            return 0
        },
        /***********操作选号**********************/
        //对象转数组
        arrBall: (v) => {
            let arr = []
            const e = $('.balls').eq(v).find('.active')
            $.each(e, (i, d) => {
                arr.push($(d).attr('name'))
            })
            return arr
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
        //单击选号
        selBalls: function (pn, e) {
            this.addActive(pn)
            return this.countNum(e)
        },
        //选择
        addActive: function (pn) {
            let _ = $(pn)
            if (_.hasClass('active')) {
                _.removeClass('active')
            } else {
                _.addClass('active')
            }
        },
        //选择方法
        toolXz: function (pn, e, type) {
            let arr = [], sum = 0
            if (type == 1) {
                arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
            } else if (type == 2) {//大
                arr = [6, 7, 8, 9, 10]
            } else if (type == 3) {//小
                arr = [0, 1, 2, 3, 4, 5]
            } else if (type == 4) {//单
                arr = [0, 2, 4, 6, 8, 10]
            } else if (type == 5) {//双
                arr = [1, 3, 5, 7, 9]
            }
            sum = this.tools(pn, e, arr)
            return sum
        },
        //添加到购彩车
        addBet: function (e, betArr) {
            const ll = $('.balls').length
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
            if (e.playInfo.cname == 'q3zhx') {
                e.playName = '前三直选'
            } else if (e.playInfo.cname == 'q3zx') {
                e.playName = '前三组选'
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
            return betArr
        }
    }
}