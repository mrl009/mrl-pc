import angular from 'angular'
import $ from 'jQuery'

export const Pcdd = (Core, Layer) => {
    return {
        //获取对应玩法的球及赔率信息
        getColors: function (type) {
            let color = {
                'tm': [
                    '153, 153, 153', '56, 190, 79', '28, 142, 230', '241, 23, 23', '56, 190, 79', '28, 142, 230',
                    '241, 23, 23', '56, 190, 79', '28, 142, 230', '241, 23, 23', '56, 190, 79', '28, 142, 230',
                    '241, 23, 23', '153, 153, 153', '153, 153, 153', '241, 23, 23', '56, 190, 79', '28, 142, 230',
                    '241, 23, 23', '56, 190, 79', '28, 142, 230', '241, 23, 23', '56, 190, 79', '28, 142, 230',
                    '241, 23, 23', '56, 190, 79', '28, 142, 230', '153, 153, 153'
                ],
                'tmb3': [
                    '153, 153, 153', '56, 190, 79', '28, 142, 230', '241, 23, 23', '56, 190, 79', '28, 142, 230',
                    '241, 23, 23', '56, 190, 79', '28, 142, 230', '241, 23, 23', '56, 190, 79', '28, 142, 230',
                    '241, 23, 23', '153, 153, 153', '153, 153, 153', '241, 23, 23', '56, 190, 79', '28, 142, 230',
                    '241, 23, 23', '56, 190, 79', '28, 142, 230', '241, 23, 23', '56, 190, 79', '28, 142, 230',
                    '241, 23, 23', '56, 190, 79', '28, 142, 230', '153, 153, 153'
                ],
                'hh': [
                    '241, 23, 23', '241, 23, 23', '241, 23, 23', '241, 23, 23', '28, 142, 230',
                    '28, 142,230', '28, 142, 230', '28, 142, 230', '56, 190, 79', '56, 190, 79'
                ],
                'bs': ['241, 23, 23', '56, 190, 79', '28, 142, 230'],
                'bz': ['56, 190, 79']
            }
            return type ? color[type] : color
        },
        getSum: function (arr) {
            let r = 0
            $.each(arr, function (i, d) {
                r += parseInt(d)
            })
            arr.push(r)
            return arr
        },
        setColor: function (arr, num) {
            const colors = this.getColors('tmb3')
            arr.color = colors[num]
            return arr
        },
        getPinfo: function (playList, pros, fun) {
            let temp = {}
            const colors = this.getColors()
            var setBallsColor = function (balls, type) {
                let color = colors[type]
                $.each(balls, function (i) {
                    balls[i].color = color[i]
                })
                return balls
            }
            $.each(playList.play, function (i, d) {
                $.each(pros, function (ii, dd) {
                    if (d.sname == 'hh' && d.id == ii) {
                        dd.title = '混合'
                        dd.tid = d.id
                        dd.balls = setBallsColor(dd.balls, 'hh')
                        dd.balls = Core.splitArr(dd.balls, 5)
                        temp.hh = dd
                    } else if (d.sname == 'tm' && d.id == ii) {
                        dd.title = '特码'
                        dd.tid = d.id
                        dd.balls = setBallsColor(dd.balls, 'tm')
                        dd.balls = Core.splitArr(dd.balls, 7)
                        temp.tm = dd
                    } else if (d.sname == 'tmb3' && d.id == ii) {
                        dd.title = '特码包三'
                        dd.tid = d.id
                        dd.balls = setBallsColor(dd.balls, 'tmb3')
                        temp.tmb3 = dd
                    } else if (d.sname == 'bs' && d.id == ii) {
                        dd.title = '波色'
                        dd.tid = d.id
                        dd.balls = setBallsColor(dd.balls, 'bs')
                        temp.bs = dd
                    } else if (d.sname == 'bz' && d.id == ii) {
                        dd.title = '豹子'
                        dd.tid = d.id
                        dd.balls = setBallsColor(dd.balls, 'bz')
                        temp.bz = dd
                    }
                })
            })
            fun(temp)
        },
        OpenResult: function (gid, func) {
            const _this = this
            Core.get('Open_result?gid=' + gid, function (json) {
                let c = angular.fromJson(json)
                if (c.code == 200) {
                    $.each(c.data.rows, function (i, d) {
                        c.data.rows[i].number = _this.getSum(d.number.split(','))
                        c.data.rows[i] = _this.setColor(c.data.rows[i], c.data.rows[i].number[3])
                    })
                    // 近一期
                    func(c.data.rows[0], c.data.rows.slice(0, 5))
                }
            }, false)
        },
        filterNum: function (e) {
            const val = $(e.target).val()
            const t = $(e.target).parent().parent().hasClass('active')
            if (val == 0 || /[^\d]/.test(val)) {
                $(e.target).val('')
                t && $(e.target).parent().parent().removeClass('active')
            } else {
                !t && $(e.target).parent().parent().addClass('active')
            }
        },
        getTmb3Select: function (type) {
            if (type == 0) {
                $('.select-list').css('left', '0px')
            } else if (type == 1) {
                $('.select-list').css('left', '98px')
            } else if (type == 2) {
                $('.select-list').css('left', '196px')
            }
        },
        setTmb3Ball: function (e, type, tmb3, fun) {
            const _ = $(e.target)
            let flag = true
            const ee = _.parent().parent().parent().find('.tmb3')
            $.each(ee, function (i, d) {
                if (i != type && $(d).find('div').text() == _.text()) {
                    Layer.alert('请重新选择号码（不可出现相同号码）')
                    flag = false
                }
            })
            if (flag) {
                tmb3[type] = {
                    code: _.attr('code'),
                    color: _.attr('color'),
                    pids: _.attr('id'),
                    name: _.attr('name')
                }
                fun(tmb3)
            }
        },
        //添加到购彩车
        addBet: function (e, betArr) {
            const ee = $('.ball')
            let bet = {}
            let flag = false
            $.each(ee, function (i, d) {
                if ($(d).val()) {
                    if ($(d).attr('ltype') == 'tmb3') {
                        const c = $('.tmb3')
                        let temp = {pids: [], contents: [], names: []}
                        $.each(c, function (i, d) {
                            temp.pids.push($(d).find('div').attr('pid'))
                            temp.contents.push($(d).find('div').attr('code'))
                            temp.names.push($(d).find('div').attr('name'))
                        })
                        bet = {
                            gid: e.gid,
                            tid: $(d).attr('tid'),
                            price: $(d).val(),
                            counts: 1,
                            price_sum: $(d).val(),
                            rate: $(d).attr('rate'),
                            rebate: $(d).attr('rebate'),
                            pids: temp.pids.join(','),
                            contents: temp.contents.join(','),
                            names: temp.names.join(','),
                            title: $(d).attr('title')
                        }
                    } else {
                        bet = {
                            gid: e.gid,
                            tid: $(d).attr('tid'),
                            price: $(d).val(),
                            counts: 1,
                            price_sum: $(d).val(),
                            rate: $(d).attr('rate'),
                            rebate: $(d).attr('rebate'),
                            pids: $(d).attr('pid'),
                            contents: $(d).attr('code'),
                            names: $(d).attr('name'),
                            title: $(d).attr('title')
                        }
                    }
                    flag = true
                    betArr.push(bet)
                }
            })
            if (!flag) {
                Layer.alert('您还没有选择号码或所选号码不全')
            }
            return betArr
        },
        clearBet: function () {
            const ee = $('.ball')
            $.each(ee, function (i, d) {
                if ($(d).val()) {
                    $(d).val('')
                    $(d).parent().parent().removeClass('active')
                }
            })
        }
    }
}
