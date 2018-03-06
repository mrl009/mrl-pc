import $ from 'jQuery'

export const Sc = function(Layer) {
    return {
        handleInputChange: function(fn1, fn2) {
            const _this = this
            $('.cell-input').bind('input porpertychange', function() {
                const keyCode = $(this).attr('keyCode')
                const code = $(this).attr('code')
                if($(this).val() == '') {
                    fn1 && fn1(keyCode)
                    _this.removeInputVal(this)
                } else if (/\D/g.test($(this).val())) {
                    const _price = /\d+/.exec($(this).val()) || []
                    _this.setInputVal(this, _price.length ? _price[0] : '')
                } else {
                    const price = $(this).val()
                    const rate = $(this).attr('rate')
                    const rebate = $(this).attr('rebate')
                    const contents = code
                    const names = $(this).attr('name')
                    const pid = $(this).attr('pid')
                    const tid = $(this).attr('tid')
                    _this.setInputVal(this, price)
                    fn2 && fn2(
                        keyCode,
                        price,
                        price,
                        rate,
                        rebate,
                        contents,
                        names,
                        pid,
                        tid
                    )
                }
            })
        },
        setInputVal: function(target, val) {
            if(val) {
                $(target)
                    .val(val)
                    .parent()
                    .addClass('item-selected')
                    .parent()
                    .children('.odds')
                    .addClass('item-selected')
            }
            else {
                $(target)
                    .val(val)
            }
        },
        removeInputVal: function(target) {
            $(target)
                .parent()
                .parent()
                .children('.item-selected')
                .removeClass('item-selected')
        },
        showTooltip: function(fn) {
            const _this = this
            return function(evt, flag) {
                const target = evt.target
                const success = function(val) {
                    const _val = val.match(/\d+/g)[0]
                    flag !== false ? _this.setInputVal(target, _val) : $(target).val(_val)
                    const keyCode = $(target).attr('keyCode')
                    const code = $(target).attr('code')
                    const rate = $(target).attr('rate')
                    const rebate = $(target).attr('rebate')
                    const pid = $(target).attr('pid')
                    const tid = $(target).attr('tid')
                    const names = $(target).attr('name')
                    //code, price, rate, rebate, contents, names, pid
                    flag !== false && fn && fn(keyCode, _val, rate, rebate, code, names, pid, tid)
                }
                Layer.tooltip({
                    mode: 'inner',
                    target: target,
                    content: `
		    			<ul class="qp-list">
							${
                        ['1', '5', '10', '20'].map((e) => {
                            return `<li class="qp-item"><a class="qp-link">${e} 元</a></li>`
                        }).join('')
                        }
						</ul>
		    		`,
                    success: function() {
                        $('.qp-link').click(function() {
                            success($(this).text())
                        })
                    }
                })
            }
        },
        clearInput: function() {
            $('.item-selected').find('input').val('')
            $('.item-selected').removeClass('item-selected')
        },
        sellBalls: function (e) {
            let ball = '', tmp = [], num = 0
            const ee = $(`.${e.type}`)
            if (e.type == 's_ssc' || e.type == 's_pk10') {
                num = Math.floor(Math.random() * 4)
            } else if (e.type == 's_kl10') {
                num = Math.floor(Math.random() * 3)
            }
            $.each(ee, (i, d) => {
                if ($(d).find('.cell-input').attr('name') == e.number[0]) {
                    tmp.push($(d).find('.cell-input'))
                }
            })
            ball = tmp[num]
            this.setInputVal(ball, e.multiple*2)
            return [{
                gid: e.gid,
                tid: $(ball).attr('tid'),
                price: e.multiple*2,
                counts: 1,
                price_sum: e.multiple*2,
                rate: $(ball).attr('rate'),
                rebate: $(ball).attr('rebate'),
                pids: $(ball).attr('pid'),
                contents: $(ball).attr('code'),
                names: $(ball).attr('name')
            }]
        }
    }
}