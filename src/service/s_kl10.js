import $ from 'jQuery'

export const SKl10 = function (Core, Layer) {
    return {
        arrBall: function () {
            let arr = []
            const e = $('.icon-checkbox-checked')
            $.each(e, (i, d) => {
                arr.push($(d).parent('div').attr('name'))
            })
            return arr
        },
        clearAll: function () {
            $('.icon-checkbox-checked').removeClass('icon-checkbox-checked')
                .addClass('icon-checkbox-uncheck')
        },
        setBalls: function (e, target) {
            const checked = $('.icon-checkbox-checked')
            if (target.tagName === 'DIV') {
                target = target.firstElementChild
            }
            if (target.tagName === 'SPAN') {
                target = $(target).prev()[0]
            }
            if ($(target).hasClass('icon-checkbox-checked')) {
                this.uncheckCb(target)
            } else {
                if (e.sname == 'rx2' && checked.length >= 10) {
                    Layer.alert('最多只能选10个球')
                    return this.countNum(e)
                }
                if ((e.sname == 'rx2z' || e.sname == 'rx3') && checked.length >= 6) {
                    Layer.alert('最多只能选6个球')
                    return this.countNum(e)
                }
                if (e.sname == 'rx4' && checked.length >= 7) {
                    Layer.alert('最多只能选7个球')
                    return this.countNum(e)
                }
                if (e.sname == 'rx5' && checked.length >= 8) {
                    Layer.alert('最多只能选8个球')
                    return this.countNum(e)
                }
                this.checkCb(target)
            }
            return this.countNum(e)
        },
        uncheckCb: function (target) {
            $(target)
                .removeClass('icon-checkbox-checked')
                .addClass('icon-checkbox-uncheck')
        },
        checkCb: function (target) {
            $(target)
                .removeClass('icon-checkbox-uncheck')
                .addClass('icon-checkbox-checked')
        },
        countNum: function (e) {
            const l = this.arrBall()
            if (e.sname == 'rx2') {
                return Core.combination(l.length, 2)
            } else if (e.sname == 'rx2z') {
                return Core.combination(l.length, 2)
            } else if (e.sname == 'rx3') {
                return Core.combination(l.length, 3)
            } else if (e.sname == 'rx4') {
                return Core.combination(l.length, 4)
            } else if (e.sname == 'rx5') {
                return Core.combination(l.length, 5)
            }
        },
        getBetList: function (e) {
            const ee = $('.icon-checkbox-checked')
            let names = [], contents = [], pids = []
            $.each(ee, (i, d) => {
                const _ = $(d).parent('div')
                pids.push(_.attr('pid'))
                contents.push(_.attr('code'))
                names.push(_.attr('name'))
            })
            return [{
                gid: e.gid,
                tid: e.suData.tid,
                price: e.suData.txtmoney,
                counts: e.betNum,
                price_sum: e.suData.txtmoney * e.betNum,
                rate: e.suData.rate,
                rebate: e.suData.rebate,
                pids: pids.join(','),
                contents: contents.join(','),
                names: names.join(',')
            }]
        }
    }
}