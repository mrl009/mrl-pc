import $ from 'jQuery'

export const Pk10 = (Core) => {
    return {
        //统计注数
        countNum: function (e) {
            //判断玩法对应的注数
            var l0 = this.arrBall(0)
            var l1 = this.arrBall(1)
            var l2 = this.arrBall(2)
            var l3 = this.arrBall(3)
            var l4 = this.arrBall(4)
            if (e.sname == 'q1') {// 前一_前一
                return l0.length
            } else if (e.sname == 'q2fs') {// 前二_前二复式
                if (l0.length == 0 || l1.length == 0) {
                    return 0
                }
                return Core.zuHe2(l0, l1)
            } else if (e.sname == 'q3fs') {// 前三_前三复式
                if (l0.length == 0 || l1.length == 0 || l2.length == 0) {
                    return 0
                }
                return Core.zuHe2(l0, l1, l2)
            } else if (e.sname == 'dwd1' || e.sname == 'dwd6') {// 定位胆_第1-5名|定位胆_第6-10名
                return l0.length + l1.length + l2.length + l3.length + l4.length
            } else if (e.sname == 'd1' || e.sname == 'd2' || e.sname == 'd3') {// 所有大小单双
                return l0.length
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
                arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            } else if (type == 2) {//大
                arr = [5, 6, 7, 8, 9]
            } else if (type == 3) {//小
                arr = [0, 1, 2, 3, 4]
            } else if (type == 4) {//单
                arr = [0, 2, 4, 6, 8]
            } else if (type == 5) {//双
                arr = [1, 3, 5, 7, 9]
            }
            sum = this.tools(pn, e, arr)
            return sum
        },
        //添加到购彩车
        addBet: function (e, betArr) {
            const ll = $('.balls').length
            let a_pids =[], a_contents =[], a_names =[], rates = []
            for (let i = 0; i < ll; i++) {
                const ee = $('.balls').eq(i).find('.active')
                let names =[], contents =[], pids = []
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
                title: e.p2.d.name+'_'+e.playInfo.name
            }
            betArr.push(bet)
            return betArr
        },
        /*主页面缓存下注***/
        setSel: function (balls) {
            let t = $('.balls')
            let sel = []
            $.each(balls, function (i, d) {
                sel.push({target: t.eq(0).find('.ball').eq(d - 1)})
            })
            return sel
        }
    }
}