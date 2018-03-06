import $ from 'jQuery'

export const S11x5 = function () {
    return {
        rx: function () {
            const ee = $('.item-selected')
            let ball = {'1z1': [], '2z2': [], '3z3': [], '4z4': [], '5z5': [], '6z5': [], '7z5': [], '8z5': []}
            $.each(ee, (i, d) => {
                ball[$(d).attr('sname')].push({
                    code: $(d).attr('code'),
                    name: $(d).attr('name'),
                    pid: $(d).attr('pid'),
                    rate: $(d).attr('rate'),
                    rebate: $(d).attr('rebate'),
                    tid: $(d).attr('tid')
                })
            })
            ball['1z1'].length != 1 && delete ball['1z1']
            ball['2z2'].length != 2 && delete ball['2z2']
            ball['3z3'].length != 3 && delete ball['3z3']
            ball['4z4'].length != 4 && delete ball['4z4']
            ball['5z5'].length != 5 && delete ball['5z5']
            ball['6z5'].length != 6 && delete ball['6z5']
            ball['7z5'].length != 7 && delete ball['7z5']
            ball['8z5'].length != 8 && delete ball['8z5']
            return ball
        },
        zx: function () {
            const ee = $('.item-selected')
            let ball = {'q2': [], 'q3': []}
            $.each(ee, (i, d) => {
                ball[$(d).attr('sname')].push({
                    code: $(d).attr('code'),
                    name: $(d).attr('name'),
                    pid: $(d).attr('pid'),
                    rate: $(d).attr('rate'),
                    rebate: $(d).attr('rebate'),
                    tid: $(d).attr('tid')
                })
            })
            ball.q2.length != 2 && delete ball.q2
            ball.q3.length != 3 && delete ball.q3
            return ball
        },
        zhx: function (isDelete = false) {
            const ee = $('.item-selected')
            let ball = {'q2-0': [], 'q2-1': [], 'q3-2': [], 'q3-3': [], 'q3-4': []}, tmpBall = []
            $.each(ee, (i, d) => {
                ball[$(d).attr('sname')].push({
                    code: $(d).attr('code'),
                    name: $(d).attr('name'),
                    pid: $(d).attr('pid'),
                    rate: $(d).attr('rate'),
                    rebate: $(d).attr('rebate'),
                    tid: $(d).attr('tid')
                })
            })
            if (!isDelete) {
                if (ball['q2-0'].length == 0 || ball['q2-1'].length == 0) {
                    delete ball['q2-0']
                    delete ball['q2-1']
                } else {
                    tmpBall.push([ball['q2-0'][0], ball['q2-1'][0]])
                }
                if (ball['q3-2'].length == 0 || ball['q3-3'].length == 0 || ball['q3-4'].length == 0) {
                    delete ball['q3-2']
                    delete ball['q3-3']
                    delete ball['q3-4']
                } else {
                    tmpBall.push([ball['q3-2'][0], ball['q3-3'][0], ball['q3-4'][0]])
                }
            }
            return tmpBall.length ? tmpBall : ball
        },
        clearAll: function () {
            $('.icon-checkbox-checked').removeClass('icon-checkbox-checked')
                .addClass('icon-checkbox-uncheck')
        },
        setBalls: function (e, target) {
            if (target.tagName === 'DIV') {
                target = $(target).parent()
            }
            if (target.tagName === 'SPAN') {
                target = $(target).parent().parent()
            }
            if ($(target).hasClass('item-selected')) {
                this.uncheckCb(target)
            } else {
                const flag = this.checkBall(e, target)
                flag && this.checkCb(target)
            }
            return this.countNum(e)
        },
        uncheckCb: function (target) {
            $(target).removeClass('item-selected')
        },
        checkCb: function (target) {
            $(target).addClass('item-selected')
        },
        checkBall: function (e, target) {
            const sname = $(target).attr('sname')
            const code = $(target).attr('code')
            const ee = $('.item-selected')
            let arr = []
            $.each(ee, (i, d) => {
                if ($(d).attr('sname') == sname) {
                    arr.push($(d).attr('sname'))
                }
            })
            if (e.sname == 'rx') {
                if (sname == '1z1' && arr.length >= 1) {
                    return false
                } else if (sname == '2z2' && arr.length >= 2) {
                    return false
                } else if (sname == '3z3' && arr.length >= 3) {
                    return false
                } else if (sname == '4z4' && arr.length >= 4) {
                    return false
                } else if (sname == '5z5' && arr.length >= 5) {
                    return false
                } else if (sname == '6z5' && arr.length >= 6) {
                    return false
                } else if (sname == '7z5' && arr.length >= 7) {
                    return false
                } else if (sname == '8z5' && arr.length >= 8) {
                    return false
                }
            } else if (e.sname == 'zx') {
                if (sname == 'q2' && arr.length >= 2) {
                    return false
                } else if (sname == 'q3' && arr.length >= 3) {
                    return false
                }
            } else if (e.sname == 'zhx') {
                const ball = this.zhx(true)
                if (sname == 'q2-0' && (ball[sname].length || ball['q2-1'][0] && ball['q2-1'][0].code == code)) {
                    return false
                } else if (sname == 'q2-1' && (ball[sname].length || ball['q2-0'][0] && ball['q2-0'][0].code == code)) {
                    return false
                } else if (sname == 'q3-2' && (ball[sname].length ||
                    ball['q3-3'][0] && ball['q3-3'][0].code == code ||
                    ball['q3-4'][0] && ball['q3-4'][0].code == code)) {
                    return false
                } else if (sname == 'q3-3' && (ball[sname].length ||
                    ball['q3-2'][0] && ball['q3-2'][0].code == code ||
                    ball['q3-4'][0] && ball['q3-4'][0].code == code)) {
                    return false
                } else if (sname == 'q3-4' && (ball[sname].length ||
                    ball['q3-2'][0] && ball['q3-2'][0].code == code ||
                    ball['q3-3'][0] && ball['q3-3'][0].code == code)) {
                    return false
                }
            }
            return true
        },
        countNum: function (e) {
            let ball = {}
            if (e.sname == 'rx') {
                ball = this.rx()
            } else if (e.sname == 'zx') {
                ball = this.zx()
            } else if (e.sname == 'zhx') {
                ball = this.zhx()
            }
            return Object.keys(ball).length
        },
        getBetList: function (e) {
            let betArr = [], ball = []
            if (e.sname == 'rx') {
                ball = this.rx()
            } else if (e.sname == 'zx') {
                ball = this.zx()
            } else if (e.sname == 'zhx') {
                ball = this.zhx()
            }
            $.each(ball, function (i, d) {
                const tid = d[0].tid
                const rate = d[0].rate
                const rebate = d[0].rebate
                let names = [], contents = [], pids = []
                $.each(d, function (ii, dd) {
                    pids.push(dd.pid)
                    contents.push(dd.code)
                    names.push(dd.name)
                })
                betArr.push({
                    gid: e.gid,
                    tid: tid,
                    price: e.suData.txtmoney,
                    counts: 1,
                    price_sum: e.suData.txtmoney * 1,
                    rate: rate,
                    rebate: rebate,
                    pids: e.sname == 'zhx' ? pids.join('|') : pids.join(','),
                    contents: e.sname == 'zhx' ? contents.join('|') : contents.join(','),
                    names: names.join(',')
                })
            })
            return betArr
        }
    }
}