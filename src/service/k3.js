import $ from 'jQuery'

export const K3 = (Core) => {
    return {
        // 拖胆选号、二同号_二同单选_标准选号|手动选号
        tdxh: function (pn) {
            var _ = $(pn)
            var i = _.attr('code') - 1
            if (_.parent().attr('index') == 0) {
                _.parent().find('.ball').removeClass('active')
                $('.select-row').eq(1).find('.balls').find('div').eq(i).removeClass('active')
            } else if (_.parent().attr('index') == 1) {
                $('.select-row').eq(0).find('.balls').find('div').eq(i).removeClass('active')
            }
        },
        tx: function () {
            var _ = $('.ball').eq(0).hasClass('active')
            if (_) {
                $('.ball').removeClass('active')
            } else {
                $('.ball').addClass('active')
            }
        },
        //统计注数
        countNum: function (e) {
            //判断玩法对应的注数
            var l0 = this.arrBall(0)
            var l1 = this.arrBall(1)
            if (e.psname == '2bth' && e.sname == 'bzxh') {// 二不同号_标准选号
                var c = Core.arrange(l0, 2)
                return c.length
            } else if (e.psname == '2bth' && e.sname == 'tdxh') {// 二不同号_胆拖选号
                if (l0.length == 0 || l1.length == 0) {
                    return 0
                }
                return l1.length
            } else if (e.psname == '2th' && e.sname == 'bzxh') {// 二同号_二同单选_标准选号
                if (l0.length == 0 || l1.length == 0) {
                    return 0
                }
                return l1.length
            } else if (e.psname == '3bth' && e.sname == 'bzxh') {// 三不同号_标准选号
                var c = Core.arrange(l0, 3)
                return c.length
            } else if (e.sname == '3tdx') {// 三同号_三同单选
                return l0.length
            } else if (e.psname == '2th' && e.sname == '2tfx') {// 二同号_二同复选
                return l0.length
            } else if (e.sname == '3ltx' || e.sname == '3ttx') {// 三同号_三同通选|三连号_三连通选
                var _ = $('.ball').eq(0).hasClass('active')
                if (_) {
                    return 1
                } else {
                    return 0
                }
            } else if (e.sname == 'hz') {// 和值_和值
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
            if (e.sname == '3ltx' || e.sname == '3ttx') {
                this.tx()
            } else {
                if (e.sname == 'tdxh' || e.psname == '2th' && e.sname == 'bzxh') {
                    this.tdxh(pn, e)
                }
                this.addActive(pn)
            }
            return this.countNum(e)
        },
        //添加到购彩车
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
                            rate: e.orate[$(d).attr('index')],
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
        }
    }
}