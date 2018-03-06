import $ from 'jQuery'

export const Ssc = function ($http, Core) {
    return {
        /**
         * 五星组合
         * @param ARRAY   aa二重号数组
         * @param ARRAY   bb单号数组
         */
        //组120
        wxz120: function () {
            const aa = this.arrBall(0)
            return Core.combination(aa.length, 5)
        },
        //组60  //组60
        wxz60: function () {
            const aa = this.arrBall(0)
            const bb = this.arrBall(1)
            return aa.length * Core.combination(bb.length, 3) - Core.cfNum(aa, bb) * Core.combination(bb.length - 1, 2)
        },
        //组30
        wxz30: function () {
            const aa = this.arrBall(0)
            const bb = this.arrBall(1)
            return Core.combination(aa.length, 2) * Core.combination(bb.length, 1) - Core.cfNum(aa, bb) * Core.combination(aa.length - 1, 1)
        },
        //组20
        wxz20: function () {
            const aa = this.arrBall(0)
            const bb = this.arrBall(1)
            return Core.combination(aa.length, 1) * Core.combination(bb.length, 2) - Core.cfNum(aa, bb) * Core.combination(bb.length - 1, 1)
        },
        //组10
        wxz10: function () {
            const aa = this.arrBall(0)
            const bb = this.arrBall(1)
            return Core.combination(aa.length, 1) * Core.combination(bb.length, 1) - Core.cfNum(aa, bb)
        },
        //组5
        wxz5: function () {
            const aa = this.arrBall(0)
            const bb = this.arrBall(1)
            return this.wxz10(aa, bb)
        },
        /**
         * 后四-前四--组选
         * @param ARRAY   aa二重号数组
         * @param ARRAY   bb单号数组
         */
        h4z24: function () {
            const aa = this.arrBall(0)
            return Core.combination(aa.length, 4)
        },
        h4z12: function () {
            const aa = this.arrBall(0)
            const bb = this.arrBall(1)
            return Core.combination(aa.length, 1) * Core.combination(bb.length, 2) - Core.cfNum(aa, bb) * Core.combination(bb.length - 1, 1)
        },
        h4z6: function () {
            const aa = this.arrBall(0)
            return Core.combination(aa.length, 2)
        },
        h4z4: function () {
            const aa = this.arrBall(0)
            const bb = this.arrBall(1)
            return Core.combination(aa.length, 1) * Core.combination(bb.length, 1) - Core.cfNum(aa, bb)
        },
        /**
         * 后三-中三-前三--组选
         * @param INT 球号
         */
        h3hz: function () {
            //三星 和值 每个球对应的下注数表
            const aa = this.arrBall(0)
            let count = 0
            const arr = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 63, 69, 73, 75, 75, 73, 69, 63, 55, 45, 36, 28, 21, 15, 10, 6, 3, 1]
            aa.forEach((e) => {
                count += arr[e]
            })
            return count
        },
        /**
         * 二星--组选
         * @param INT 球号
         */
        exhz: function () {
            /* 二星 和值 每个球对应的下注数表 */
            const aa = this.arrBall(0)
            let count = 0
            const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
            aa.forEach(function (e) {
                count += arr[e]
            })
            return count
        },
        //二星不定胆二码
        ex2m: (n) => { //n选择球个数
            return Core.combination(n, 2)
        },
        /**
         * 任选--复式
         * @param ARRAY 选择球的二维数组
         */
        //任2复式
        rxr2fs: (arr) => {
            let count = 0
            for (let i = 0; i < arr.length; i++) {
                for (let j = i + 1; j < arr.length; j++) {
                    count += Core.zuHe(arr[i], arr[j])
                }
            }
            return count
        },
        //任2组选
        rxr2zx: (w, q) => {//w位置个数   q选择球数量
            return Core.combination(w, 2) * Core.combination(q, 2)
        },
        //任3复式
        rxr3fs: (arr) => {
            let count = 0
            for (var i = 0; i < arr.length; i++) {
                for (var j = i + 1; j < arr.length; j++) {
                    for (var d = j + 1; d < arr.length; d++) {
                        count += Core.zuHe(arr[i], arr[j], arr[d])
                    }
                }
            }
            return count
        },
        //任3组3
        rxr3z3: (w, q) => {//w位置个数   q选择球数量
            return Core.combination(w, 3) * Core.combination(q, 2) * 2
        },
        //任3组6
        rxr3z6: (w, q) => {//w位置个数   q选择球数量
            return Core.combination(w, 3) * Core.combination(q, 3)
        },
        //任4复式
        rxr4fs: (arr) => {
            let count = 0
            for (let i = 0; i < arr.length; i++) {
                for (let j = i + 1; j < arr.length; j++) {
                    for (let d = j + 1; d < arr.length; d++) {
                        for (let s = d + 1; s < arr.length; s++) {
                            count += Core.zuHe(arr[i], arr[j], arr[d], arr[s])
                        }
                    }
                }
            }
            return count
        },

        //统计注数
        countNum: function (e) {
            //判断玩法对应的注数
            const l0 = this.arrBall(0)
            const l1 = this.arrBall(1)
            const l2 = this.arrBall(2)
            const l3 = this.arrBall(3)
            const l4 = this.arrBall(4)
            if (e.cname == '5xzhx') {//五星直选
                if (l0.length == 0 || l1.length == 0 || l2.length == 0 || l3.length == 0 || l4.length == 0) {
                    return 0
                }
                if (e.sname == 'fs') {//复式
                    return Core.zuHe(l0, l1, l2, l3, l4)
                } else if (e.sname == 'zh') {//组合
                    return Core.xxZuHe(l0, l1, l2, l3, l4)
                }
            } else if (e.cname == '5xzx') {//五星组选
                if (e.sname == 'zx120') {
                    return this.wxz120()
                } else if (e.sname == 'zx60') {
                    return this.wxz60()
                } else if (e.sname == 'zx30') {
                    return this.wxz30()
                } else if (e.sname == 'zx20') {
                    return this.wxz20()
                } else if (e.sname == 'zx10') {
                    return this.wxz10()
                } else if (e.sname == 'zx5') {
                    return this.wxz5()
                }
            } else if (e.cname == 'dwd') { //定胆位
                return $('.balls .active').length
            } else if (e.cname == 'h4zhx' || e.cname == 'q4zhx') { //后四直选
                if (l0.length == 0 || l1.length == 0 || l2.length == 0 || l3.length == 0) {
                    return 0
                }
                if (e.sname == 'fs') {//复式
                    return Core.zuHe(l0, l1, l2, l3)
                } else if (e.sname == 'zh') {//组合
                    return Core.xxZuHe(l0, l1, l2, l3)
                }
            } else if (e.cname == 'h4zx' || e.cname == 'q4zx') {//四星组选
                if (e.sname == 'zx24') {
                    return this.h4z24()
                } else if (e.sname == 'zx12') {
                    return this.h4z12()
                } else if (e.sname == 'zx6') {
                    return this.h4z6()
                } else if (e.sname == 'zx4') {
                    return this.h4z4()
                }
            } else if (e.cname == 'h3zhx' || e.cname == 'z3zhx' || e.cname == 'q3zhx') {//后、中、前三直选
                if (e.sname == 'fs') {//复式
                    if (l0.length == 0 || l1.length == 0 || l2.length == 0) {
                        return 0
                    }
                    return Core.zuHe(l0, l1, l2)
                } else if (e.sname == 'zxhz') {//直选和值
                    return this.h3hz()
                }
            } else if (e.cname == 'h3zx' || e.cname == 'z3zx' || e.cname == 'q3zx') {//后、中、前三组选
                if (e.sname == 'zx3') {
                    return Core.permutation(l0.length, 2)
                } else if (e.sname == 'zx6') {
                    return Core.combination(l0.length, 3)
                }
            } else if (e.cname == 'h2zhx' || e.cname == 'q2zhx') {//前后二直选
                if (e.sname == 'fs') { //复式
                    if (l0.length == 0 || l1.length == 0) {
                        return 0
                    }
                    return Core.zuHe(l0, l1)
                } else if (e.sname == 'zxhz') {//组选和值
                    return this.exhz()
                } else if (e.sname == 'dxds') {//组选大小单双
                    return l0.length * l1.length
                }
            } else if (e.cname == 'h2zx' || e.cname == 'q2zx') {//前后二组选
                if (e.sname == 'fs') {
                    return Core.combination(l0.length, 2)
                }
            } else if (e.cname == '3x1m') { //不定位-三星一码
                return l0.length
            } else if (e.cname == '3x2m') { //不定位-三星一码
                return Core.combination(l0.length, 2)
            } else if (e.cname == 'rx2') { //任选-任二
                if (l0.length + l1.length + l2.length + l3.length + l4.length < 2) {
                    return 0
                }
                if (e.sname == 'fs') { //任选-任二-复式
                    let arr = []
                    for (let i = 0; i < 5; i++) {
                        if (this.arrBall(i).length != 0) {
                            arr.push(this.arrBall(i))
                        }
                    }
                    return this.rxr2fs(arr)
                } else if (e.sname == 'zx') {//任选-任二-组
                    return this.rxr2zx(this.arrBall(0).length, this.arrBall(1).length)
                }
            } else if (e.cname == 'rx3') {//任选-任三
                if (e.sname == 'fs') { //任选-任三-复式
                    let arr = []
                    for (let i = 0; i < 5; i++) {
                        if (this.arrBall(i).length != 0) {
                            arr.push(this.arrBall(i))
                        }
                    }
                    return this.rxr3fs(arr)
                } else if (e.sname == 'z3') {//任选-任三-组3
                    return this.rxr3z3(this.arrBall(0).length, this.arrBall(1).length)
                } else if (e.sname == 'z6') {//任选-任三-组6
                    return this.rxr3z6(this.arrBall(0).length, this.arrBall(1).length)
                }
            } else if (e.cname == 'rx4') {//任选-任四
                if (e.sname == 'fs') { //任选-任四-复式
                    let arr = []
                    for (let i = 0; i < 5; i++) {
                        if (this.arrBall(i).length != 0) {
                            arr.push(this.arrBall(i))
                        }
                    }
                    return this.rxr4fs(arr)
                }
            } else if (e.cname == 'kdq3' || e.cname == 'kdz3' || e.cname == 'kdh3') {//跨度-前三跨度
                return this.wxkd3(this.arrBall(0))
            } else if (e.cname == 'kdq2' || e.cname == 'kdh2' || e.cname == 'kdh3') {//跨度-前二跨度
                return this.wxkd2(this.arrBall(0))
            } else if (e.cname == 'ts') {//趣味
                return this.arrBall(0).length
            } else if (e.aname == 'lh') {//龙虎
                return this.arrBall(0).length
            }
            return 0
        },
        /**
         * 跨度
         * @param INT 球号
         */
        wxkd3: (arr) => {
            /* 跨度 前三 中三 后三 每个球对应的下注数表*/
            const rs = [10, 54, 96, 126, 144, 150, 144, 126, 96, 54]
            let count = 0
            for (let i = 0; i < arr.length; i++) {
                count += rs[arr[i]]
            }
            return count
        },
        wxkd2: (arr) => {
            /* 跨度 前二 后二 每个球对应的下注数表 */
            const rs = [10, 18, 16, 14, 12, 10, 8, 6, 4, 2]
            let count = 0
            for (let i = 0; i < arr.length; i++) {
                count += rs[arr[i]]
            }
            return count
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
        //全选
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
                        const ii = e.playInfo.aname == 'lh' ? $(d).attr('index') : i
                        bet = {
                            gid: e.gid,
                            tid: e.playInfo.id,
                            price: e.suData.txtmoney / e.suData.mtype,
                            counts: 1,
                            price_sum: e.suData.txtmoney / e.suData.mtype,
                            rate: e.orate[ii],
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
            //return JSON.stringify(betArr)
        },
        ranDom: function (l, dd, n) { //dd某个球 i循环次数 n一个位置上选几个号
            let t = $('.balls'), arr = []
            l = l == undefined ? 1 : l
            n = n == undefined ? 1 : n
            for (let i = 0; i < l; i++) {
                for (let j = 0; j < n; j++) {
                    arr.push({target: t.eq(i).find('.ball').eq(Math.floor(Math.random() * dd))})
                }
            }
            return arr
        },
        ranDomNoRepeat: function (pos, dd, n) {
            let t = $('.balls'), arr = [], number = [], isFlag = false
            pos = pos == undefined ? 0 : pos
            n = n == undefined ? 1 : n
            let count = n
            while (count) {
                let ranNum = Math.floor(Math.random() * dd)
                isFlag = false
                for (let j = 0; j < number.length; j++) {
                    if (ranNum == number[j]) {
                        isFlag = true
                        break
                    }
                }
                if (!isFlag) {
                    number.push(ranNum)
                    arr.push({target: t.eq(pos).find('.ball').eq(ranNum)})
                    count--
                }
            }
            return {
                randNum: number,
                arr: arr
            }
        },
        randRange: function (min, max) {
            let range = max - min
            let rand = Math.random()
            let num = min + Math.floor(rand * range) //舍去
            return num
        },
        randRx: function (l, dd, n) {
            let arr = []
            let num = []
            let flag = false
            while (n) {
                let pos = this.randRange(0, l)
                for (let i = 0; i < num.length; i++) {
                    flag = false
                    if (pos == num[i]) {
                        flag = true
                    }
                }
                if (!flag) {
                    num.push(pos)
                    arr = arr.concat(this.ranDomNoRepeat(pos, dd, 1).arr)
                    n--
                }
            }
            return arr
        },
        randZx: function (param) {
            let arr = []
            let result1 = []
            let result2 = []
            let flag = true
            if (param.length == 1) {
                arr = this.ranDomNoRepeat(param[0].pos, param[0].dd, param[0].n).arr
            } else {
                result2 = this.ranDomNoRepeat(param[1].pos, param[1].dd, param[1].n)
                while (flag) {
                    result1 = this.ranDomNoRepeat(param[0].pos, param[0].dd, param[0].n)
                    flag = false
                    for (let i = 0; i < result1.randNum.length; i++) {
                        for (let j = 0; j < result2.randNum.length; j++) {
                            if (result1.randNum[i] == result2.randNum[j]) {
                                flag = true
                            }
                        }
                    }
                }
                arr = result1.arr.concat(result2.arr)
            }
            return arr
        },
        //随机一注
        oneBet: function (e) {
            let t = $('.balls'), arr = []
            if (e.cname == '5xzhx') {//五星直选
                arr = this.ranDom(5, 9)
            } else if (e.cname == '5xzx') {//五星组选
                if (e.sname == 'zx120') {
                    let param = [
                        {pos: 0, dd: 9, n: 5}
                    ]
                    arr = this.randZx(param)
                } else if (e.sname == 'zx60') {
                    let param = [
                        {pos: 0, dd: 9, n: 1},
                        {pos: 1, dd: 9, n: 3}
                    ]
                    arr = this.randZx(param)
                } else if (e.sname == 'zx30') {
                    let param = [
                        {pos: 0, dd: 9, n: 2},
                        {pos: 1, dd: 9, n: 1}
                    ]
                    arr = this.randZx(param)
                } else if (e.sname == 'zx20') {
                    let param = [
                        {pos: 0, dd: 9, n: 1},
                        {pos: 1, dd: 9, n: 2}
                    ]
                    arr = this.randZx(param)
                } else if (e.sname == 'zx10') {
                    let param = [
                        {pos: 0, dd: 9, n: 1},
                        {pos: 1, dd: 9, n: 1}
                    ]
                    arr = this.randZx(param)
                } else if (e.sname == 'zx5') {
                    let param = [
                        {pos: 0, dd: 9, n: 1},
                        {pos: 1, dd: 9, n: 1}
                    ]
                    arr = this.randZx(param)
                }
            } else if (e.cname == 'dwd') { //定胆位
                arr.push({target: t.eq(Math.floor(Math.random() * 4)).find('.ball').eq(Math.floor(Math.random() * 9))})
            } else if (e.cname == 'h4zhx' || e.cname == 'q4zhx') { //后四直选
                arr = this.ranDom(4, 9)
            } else if (e.cname == 'h4zx' || e.cname == 'q4zx') {//四星组选
                if (e.sname == 'zx24') {
                    let param = [
                        {pos: 0, dd: 9, n: 4}
                    ]
                    arr = this.randZx(param)
                } else if (e.sname == 'zx12') {
                    let param = [
                        {pos: 0, dd: 9, n: 1},
                        {pos: 1, dd: 9, n: 2}
                    ]
                    arr = this.randZx(param)
                } else if (e.sname == 'zx6') {
                    let param = [
                        {pos: 0, dd: 9, n: 2}
                    ]
                    arr = this.randZx(param)
                } else if (e.sname == 'zx4') {
                    let param = [
                        {pos: 0, dd: 9, n: 1},
                        {pos: 1, dd: 9, n: 1}
                    ]
                    arr = this.randZx(param)
                }
            } else if (e.cname == 'h3zhx' || e.cname == 'z3zhx' || e.cname == 'q3zhx') {//后、中、前三直选
                if (e.sname == 'fs') {//复式
                    arr = this.ranDom(3, 9)
                } else if (e.sname == 'zxhz') {//直选和值
                    arr = this.ranDom(1, 27)
                }
            } else if (e.cname == 'h3zx' || e.cname == 'z3zx' || e.cname == 'q3zx') {//后、中、前三组选
                if (e.sname == 'zx3') {
                    let param = [
                        {pos: 0, dd: 9, n: 2}
                    ]
                    arr = this.randZx(param)
                } else if (e.sname == 'zx6') {
                    let param = [
                        {pos: 0, dd: 9, n: 3}
                    ]
                    arr = this.randZx(param)
                }
            } else if (e.cname == 'h2zhx' || e.cname == 'q2zhx') {//前后二直选
                if (e.sname == 'fs') { //复式
                    arr = this.ranDom(2, 9)
                } else if (e.sname == 'zxhz') {//组选和值
                    arr = this.ranDom(1, 18)
                } else if (e.sname == 'dxds') {//组选大小单双
                    arr = this.ranDom(2, 4)
                }
            } else if (e.cname == 'h2zx' || e.cname == 'q2zx') {//前后二组选
                if (e.sname == 'fs') {
                    let param = [
                        {pos: 0, dd: 9, n: 2}
                    ]
                    arr = this.randZx(param)
                }
            } else if (e.cname == '3x1m') { //不定位-三星一码
                let param = [
                    {pos: 0, dd: 9, n: 1}
                ]
                arr = this.randZx(param)
            } else if (e.cname == '3x2m') { //不定位-三星一码
                let param = [
                    {pos: 0, dd: 9, n: 2}
                ]
                arr = this.randZx(param)
            } else if (e.cname == 'rx2') { //任选-任二
                if (e.sname == 'fs') { //任选-任二-复式
                    arr = this.randRx(4, 9, 2)
                } else if (e.sname == 'zx') {//任选-任二-组
                    let param = [{pos: 0, dd: 5, n: 2}]
                    arr = this.randZx(param)
                    param = [{pos: 1, dd: 9, n: 2}]
                    arr = arr.concat(this.randZx(param))
                }
            } else if (e.cname == 'rx3') {//任选-任三
                if (e.sname == 'fs') { //任选-任三-复式
                    arr = this.randRx(4, 9, 3)
                } else if (e.sname == 'z3') {//任选-任三-组3
                    let param = [{pos: 0, dd: 5, n: 3}]
                    arr = this.randZx(param)
                    param = [{pos: 1, dd: 9, n: 2}]
                    arr = arr.concat(this.randZx(param))
                } else if (e.sname == 'z6') {//任选-任三-组6
                    let param = [{pos: 0, dd: 5, n: 3}]
                    arr = this.randZx(param)
                    param = [{pos: 1, dd: 9, n: 3}]
                    arr = arr.concat(this.randZx(param))
                }
            } else if (e.cname == 'rx4') {//任选-任四
                if (e.sname == 'fs') { //任选-任四-复式
                    arr = this.randRx(4, 9, 4)
                }
            } else if (e.cname == 'kdq3' || e.cname == 'kdz3' || e.cname == 'kdh3') {//跨度-前三跨度
                let param = [
                    {pos: 0, dd: 9, n: 1}
                ]
                arr = this.randZx(param)
            } else if (e.cname == 'kdq2' || e.cname == 'kdh2' || e.cname == 'kdh2') {//跨度-前二跨度
                let param = [
                    {pos: 0, dd: 9, n: 1}
                ]
                arr = this.randZx(param)
            } else if (e.cname == 'ts') {//趣味
                let param = [
                    {pos: 0, dd: 9, n: 1}
                ]
                arr = this.randZx(param)
            } else if (e.aname == 'lh') {//龙虎
                arr = this.ranDom(1, 3)
            }
            return arr
        },
        /*主页面缓存下注***/
        setSel: function (balls) {
            let t = $('.balls')
            let sel = []
            $.each(balls, function (i, d) {
                sel.push({target: t.eq(i).find('.ball').eq(d)})
            })
            return sel
        }
    }
}
