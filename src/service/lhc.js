import $ from 'jQuery'
import angular from 'angular'

export const Lhc = function($http, Core, Lottery, Layer, Util, $timeout) {
	return {
		// 开奖结果
        OpenResult: function(gid, func) {
            Core.get('Open_result?gid=' + gid, function (json) {
                let c = angular.fromJson(json)
                if (c.code == 200) {
                    $.each(c.data.rows, function (i, d) {
                        c.data.rows[i].number = d.number.split(',')
                        c.data.rows[i].shengxiao = d.shengxiao.split(',')
                        c.data.rows[i].color = d.color.split(',')
                    })
                    // 近一期
                    func(c.data.rows[0], c.data.rows.slice(0, 5))
                }
            }, false)
        },
		randomSx: function () {
			let sx = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
			return sx[Math.floor(Math.random() * 11)]
        },
		//单击选号
		setBalls: function (scope, target, tid, insertFn, deleteFn) {
        	const {playOneId, playTwoId} = scope
			if(target.tagName === 'DIV') {
				target = target.firstElementChild
			}
			if(target.tagName === 'SPAN') {
				target = $(target).prev()[0]
			}
			const balls = $('.icon-checkbox-checked')
			const $parent = $(target).parent()
			const code = $parent.attr('code')
			const rebate = $parent.attr('rebate')
			const pid = $parent.attr('id')
			const name = $parent.attr('name')
			const rate = $parent.attr('rate')
			if($(target).hasClass('icon-checkbox-checked')) {
				this.uncheckCb(target)
				deleteFn && deleteFn(code)
			} else {
				// if (tid >= 251 && tid <= 258) {
				// 连肖二到五
				if (playOneId == 'lx' && (playTwoId == '2xl' || playTwoId == '3xl' || playTwoId == '4xl' || playTwoId == '5xl')) {
					if (balls.length > 5) {
						return false
					}
				}
				// 连尾二到五
                if (playOneId == 'lw' && (playTwoId == '2wp' || playTwoId == '3wp' || playTwoId == '4wp' || playTwoId == '5wp')) {
                    if (balls.length > 5) {
                        return false
                    }
                }

				// if (tid >= 245 && tid <= 250) {
                // 连码
                if (playOneId == 'lm' && (playTwoId == '4qz' || playTwoId == '3qz' || playTwoId == '4z2' || playTwoId == '2qz' || playTwoId == '2zt' || playTwoId == 'tc')) {
					if (balls.length > 9) {
						return false
					}
				}

				// if (tid >= 259 && tid <= 261) {
				// 自选不中五到七
				if (playOneId == 'zxbz' && (playTwoId == '5bz' || playTwoId == '6bz' || playTwoId == '7bz')) {
					if (balls.length > 9) {
						return false
					}
				}

				// if (tid >= 292 && tid <= 294) {
				// 中一五到七
                if (playOneId == 'z1' && (playTwoId == '5z1' || playTwoId == '6z1' || playTwoId == '7z1')) {
					if (balls.length > 9) {
						return false
					}
				}

				// if (tid == 262 || tid == 295) {
                // 自选不中-八不中 中一-八中一
                if (playOneId == 'zxbz' && playTwoId == '8bz' || playOneId == 'z1' && playTwoId == '8z1') {
					if (balls.length > 10) {
						return false
					}
				}

				// if (tid == 263 || tid == 296) {
                // 自选不中-九不中 中一-九中一
                if (playOneId == 'zxbz' && playTwoId == '9bz' || playOneId == 'z1' && playTwoId == '9z1') {
					if (balls.length > 11) {
						return false
					}
				}

				// if (tid == 264 || tid == 265 || tid == 297) {
				// 自选不中-十、十一 中一-十中一
				if (playOneId == 'zxbz' && (playTwoId == '10bz' || playTwoId == '11bz') || playOneId == 'z1' && playTwoId == '10z1') {
					if (balls.length > 12) {
						return false
					}
				}

				// if (tid == 266) {
				// 自选不中十二
				if (playOneId == 'zxbz' && playTwoId == '12bz') {
					if (balls.length > 13) {
						return false
					}
				}

				// if (tid == 282 ) {
				// 合肖中
				if (playOneId == 'hx' && playTwoId == 'z') {
					if (balls.length > 10) {
						return false
					}
				}

				// if (tid == 283) {
                // 合肖不中
                if (playOneId == 'hx' && playTwoId == 'bz') {
					if (balls.length > 9) {
						return false
					}
				}
				this.checkCb(target)
				insertFn && insertFn(code, rebate, pid, name, rate)
			}
		},
		initHxTools: function() {
			return Util.convertFromObj2Arr({
				ys: {name: '野兽', type: 1},
				jq: {name: '家禽', type: 2},
				d: {name: '单', type: 3},
				s: {name: '双', type: 4},
				qx: {name: '前肖', type: 5},
				hx: {name: '后肖', type: 6},
				tx: {name: '天肖', type: 7},
				dx: {name: '地肖', type: 8}
			})
		},
		tools: function (t, gid, tid) {//t类型1
            var arr = []
            if (t == 1) {arr = [0, 2, 3, 4, 5, 8]}
            else if (t == 2) {arr = [1, 6, 7, 9, 10, 11]}
            //else if (t == 3) {arr = [1, 3, 5, 7, 9, 11]}
            else if (t == 3) {arr = [0, 2, 4, 6, 8, 10]}
            else if (t == 4) {arr = [1, 3, 5, 7, 9, 11]}
            //else if (t == 4) {arr = [0, 2, 4, 6, 8, 10]}
            else if (t == 5) {arr = [0, 1, 2, 3, 4, 5]}
            else if (t == 6) {arr = [6, 7, 8, 9, 10, 11]}
            else if (t == 7) {arr = [1, 3, 4, 6, 8, 11]}
            else if (t == 8) {arr = [0, 2, 5, 7, 9, 10]}
            const _this = this
        	let ret = {}
        	$('.cell').each(function(i) {
        		const target = $(this).find('.label')
        		if(arr.indexOf(i) >= 0) {
        			const code = target.attr('code')
        			const name = target.attr('name')
        			const rate = target.attr('rate')
        			const rebate = target.attr('rebate')
        			const pid = target.attr('id')
        			ret[code] = {
        				code,
        				name,
        				rate,
        				rebate,
        				pid,
        				gid,
        				tid
        			}
        			_this.addBalls(target[0])
        			_this.checkCb(target.find('i')[0])
        		} else {
        			_this.removeBalls(target[0])
        			_this.uncheckCb(target.find('i')[0])
        		}
        	})
        	return ret
        },
		//组合选号
		zuHeNums: function(balls, scope) {
            let num = 0
            const {playOneId, playTwoId} = scope
			if (playOneId == 'lm' && playTwoId == '4qz') {//连码四全中
            	num = 4
			} else if (playOneId == 'lm' && (playTwoId == '3qz' || playTwoId == '3z2')) {//连码三全中-三中二
                num = 3
			} else if (playOneId == 'lm' && (playTwoId == '2qz' || playTwoId == '2zt' || playTwoId == 'tc')) {//连码二全中-二中特-特串
                num = 2
            } else if (playOneId == 'lx' && playTwoId == '2xl') {//连肖二肖
                num = 2
            } else if (playOneId == 'lx' && playTwoId == '3xl') {//连肖三肖
                num = 3
            } else if (playOneId == 'lx' && playTwoId == '4xl') {//连肖四肖
                num = 4
            } else if (playOneId == 'lx' && playTwoId == '5xl') {//连肖五肖
                num = 5
            } else if (playOneId == 'lw' && playTwoId == '2wp') {//连尾二尾
                num = 2
            } else if (playOneId == 'lw' && playTwoId == '3wp') {//连尾三尾
                num = 3
            } else if (playOneId == 'lw' && playTwoId == '4wp') {//连尾四尾
                num = 4
            } else if (playOneId == 'lw' && playTwoId == '5wp') {//连尾五尾
                num = 5
            } else if (playOneId == 'zxbz' && playTwoId == '5bz') {//自选不中-五不中
                num = 5
            } else if (playOneId == 'zxbz' && playTwoId == '6bz') {//自选不中-六不中
                num = 6
            } else if (playOneId == 'zxbz' && playTwoId == '7bz') {//自选不中-七不中
                num = 7
            } else if (playOneId == 'zxbz' && playTwoId == '8bz') {//自选不中-八不中
                num = 8
            } else if (playOneId == 'zxbz' && playTwoId == '9bz') {//自选不中-九不中
                num = 9
            } else if (playOneId == 'zxbz' && playTwoId == '10bz') {//自选不中-十不中
                num = 10
            } else if (playOneId == 'zxbz' && playTwoId == '11bz') {//自选不中-十一不中
                num = 11
            } else if (playOneId == 'zxbz' && playTwoId == '12bz') {//自选不中-十二不中
                num = 12
            } else if (playOneId == 'z1' && playTwoId == '5z1') {//中一-五中一
                num = 5
            } else if (playOneId == 'z1' && playTwoId == '6z1') {//中一-六中一
                num = 6
            } else if (playOneId == 'z1' && playTwoId == '7z1') {//中一-七中一
                num = 7
            } else if (playOneId == 'z1' && playTwoId == '8z1') {//中一-八中一
                num = 8
            } else if (playOneId == 'z1' && playTwoId == '9z1') {//中一-九中一
                num = 9
            } else if (playOneId == 'z1' && playTwoId == '10z1') {//中一-十中一
                num = 10
            }
            return Core.arrange(balls, num)
			// let num = 0
			// switch(Number(tid)) {
			// 	case 245: num = 4; break
			// 	case 246:
			// 	case 247: num = 3; break
			// 	case 248:
			// 	case 249:
			// 	case 250:
			// 	case 251: num = 2; break
			// 	case 252: num = 3; break
			// 	case 253: num = 4; break
			// 	case 254: num = 5; break
			// 	case 255: num = 2; break
			// 	case 256: num = 3; break
			// 	case 257: num = 4; break
			// 	case 258: num = 5; break
			// 	case 259: num = 5; break
			// 	case 260: num = 6; break
			// 	case 261: num = 7; break
			// 	case 262: num = 8; break
			// 	case 263: num = 9; break
			// 	case 264: num = 10; break
			// 	case 265: num = 11; break
			// 	case 266: num = 12; break
			// 	case 292: num = 5; break
			// 	case 293: num = 6; break
			// 	case 294: num = 7; break
			// 	case 295: num = 8; break
			// 	case 296: num = 9; break
			// 	case 297: num = 10; break
			// 	default: num = 0
			// }
			// return Core.arrange(balls, num)
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
		    		const code = $(target).attr('code')
		    		const rate = $(target).attr('rate')
		    		const rebate = $(target).attr('rebate')
		    		const pid = $(target).attr('pid')
		    		const keyCode = $(target).attr('keyCode')
		    		const atitle = _this.gpt()
		    		const btitle = $(target).attr('btitle') || _this.gtl()
		    		const tid = $(target).attr('tid')
		    		const names = $(target).attr('name')
		    		//code, price, rate, rebate, contents, names, pid
		    		flag !== false && fn && fn(code, _val, rate, rebate, code, names, pid, keyCode, atitle, btitle, tid)
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
		sxNums: function(data) {
			let sxArr=[]
            let _arr=['鼠', '猪', '狗', '鸡', '猴', '羊', '马', '蛇', '龙', '兔', '虎', '牛']
            $.each(_arr, function(i, d) {
                var tmp=[]
                $.each(data, function(ii, dd) {
                    if(d==dd) {tmp.push(ii)}
                })
                sxArr[d]=tmp.join()
            })
            //尾几
            sxArr['尾1'] = '01 11 21 31 41'
            sxArr['尾2'] = '02 12 22 32 42'
            sxArr['尾3'] = '03 13 23 33 43'
            sxArr['尾4'] = '04 14 24 34 44'
            sxArr['尾5'] = '05 15 25 35 45'
            sxArr['尾6'] = '06 16 26 36 46'
            sxArr['尾7'] = '07 17 27 37 47'
            sxArr['尾8'] = '08 18 28 38 48'
            sxArr['尾9'] = '09 19 29 39 49'
            sxArr['尾0'] = '10 20 30 40'
            return sxArr
		},
		getNums: function(fn) {
			Core.get('games/lhc_sx', function(json) {
                const c = angular.fromJson(json)
                if (c.code == 200) {
                	fn && fn(c.data)
                }
            })
		},
		getLen: function(sname) {
			let ret = 0
			switch(sname) {
				case 'tmab':
				case 'ta':
				case 'tb':
				case 'zm':
				case 'z1t':
				case 'z2t':
				case 'z3t':
				case 'z4t':
				case 'z5t':
				case 'z6t':
				case 'zmt':
				case 'lm':
				case '4qz':
				case '3qz':
				case '3z2':
				case '2qz':
				case '2zt':
				case 'tc':
				case '5bz':
				case '6bz':
				case '7bz':
				case '8bz':
				case '9bz':
				case '10bz':
				case '11bz':
				case '12bz':
				case '5z1':
				case '6z1':
				case '7z1':
				case '8z1':
				case '9z1':
				case '10z1':
				case 'tws': ret = 5; break
				case 'zm16': ret = 6; break
				case 'zhongx':
				case '1x':
				case '12x':
				case 'z':
				case 'bz':
				case 'ztws':
				case 'wx':
				case '7m':
				case '2xl':
				case '3xl':
				case '4xl':
				case '5xl':
				case '2wp':
				case '3wp':
				case '4wp':
				case '5wp':
				case 'zx': ret = 2; break
				// case '3sb': ret = 3; break
				// case '7sb': ret = 4; break
				default: ret = 1
			}
			return ret
		},
		handleRadioChange: function(target, fn) {
			// let target = evt.target
	    	if(target.tagName === 'I') {
	    		target = target.parentNode
	    	}
	    	const code = $(target).attr('code')
	    	const keyCode = $(target).attr('keyCode')
	    	const $target = $(target).find('i')
			const rate = $(target).attr('rate')
			const rebate = $(target).attr('rebate')
			const contents = code
			const names = code
			const pid = $(target).attr('pid')
			const colName = $(target).attr('colName')
			const rowName = $(target).attr('rowName')
			this.checkRadio(keyCode, $target)
			fn && fn(
				rate,
				rebate,
				contents,
				names,
				pid,
				code,
				keyCode,
				colName,
				rowName
			)
		},
		checkRadio: function(keyCode, $target) {
			$(`.radio[keyCode="${keyCode}"]`)
				.find('i')
				.removeClass('icon-radio-check')
				.addClass('icon-radio-uncheck')
			$target
				.addClass('icon-radio-check')
				.removeClass('icon-radio-uncheck')
		},
		handleInputChange: function(fn1, fn2) {
			const _this = this
			$('.cell-input').bind('input porpertychange', function() {
	    		const code = $(this).attr('code')
	    		const keyCode = $(this).attr('keyCode')
	    		if($(this).val() == '') {
	    			fn1 && fn1(keyCode, code)
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
		    		const atitle = _this.gpt()
					const btitle = $(this).attr('btitle') || _this.gtl()
		    		_this.setInputVal(this, price)
		    		fn2 && fn2(
		    			code,
			    		price,
			    		price,
			    		rate,
			    		rebate,
			    		contents,
			    		names,
			    		pid,
			    		keyCode,
			    		atitle,
			    		btitle,
			    		tid
		    		)
	    		}
	    	})
		},
		//handleBallData
		hbData: function(data) {
			const objArr = Util.convertFromObj2Arr(data)
			let ret = null
			if(objArr.length) {
				ret = {
					code: [],
					name: []
				}
				objArr.forEach((e) => {
					ret.code.push(e.code)
					ret.name.push(e.name)
					ret.rate = e.rate
					ret.rebate = e.rebate
					ret.gid = e.gid
					ret.tid = e.tid
				})

				ret.code = ret.code.join(',')
				ret.name = ret.name.join(',')
				ret.rate = ret.rate.split(',')[objArr.length-1]
			}
			return ret
		},
		colorCache: {},
		addBalls: function(target) {
			const _this = this
			if(target.tagName === 'I' || target.tagName === 'SPAN') {
				target = target.parentNode
			}
			$(target)
				.siblings('.numbers')
				.children('.num-wrap')
				.children('span')
				.addClass('lball')
				.each(function() {
					$(this).addClass(`lball-${_this.colorCache[$(this).attr('ball')]}`)
				})
		},
		uncheckCb: function(target) {
			$(target)
				.removeClass('icon-checkbox-checked')
				.addClass('icon-checkbox-uncheck')
		},
		checkCb: function(target) {
			$(target)
				.removeClass('icon-checkbox-uncheck')
				.addClass('icon-checkbox-checked')
		},
		removeBalls: function(target) {
			if(target.tagName === 'I' || target.tagName === 'SPAN') {
				target = target.parentNode
			}
			$(target)
				.siblings('.numbers')
				.children('.num-wrap')
				.children('span')
				.removeClass('lball lball-red lball-blue lball-green')
		},
		removeAllBalls: function() {
			$('.num-wrap')
				.children('span')
				.removeClass('lball lball-red lball-blue lball-green')
		},
		clearRadio: function() {
			$('.icon-radio-check')
				.addClass('icon-radio-uncheck')
				.removeClass('icon-radio-check')
		},
		clearCheckbox: function() {
	    	$('.icon-checkbox-checked')
	    		.addClass('icon-checkbox-uncheck')
	    		.removeClass('icon-checkbox-checked')
	    },
	    clearInput: function() {
	    	$('.item-selected').find('input').val('')
	    	$('.item-selected').removeClass('item-selected')
	    },
		setColors: function(colors) {
			this.colorCache = colors
			return colors
		},
		splitArr: function(data) {
			let arr = [[], []]
			data.forEach(function(e, i) {
				if(i % 2 == 0) {
					arr[0].push(e)
				} else {
					arr[1].push(e)
				}
			})
			return arr
		},
		//正码过关数据处理
		//handleGGData
		ggd: function(data, len) {
			const _this = this
			const arr = Util.convertFromObj2Arr(data)
			const merge = function(key, _len, spector) {
				return Core.createArr(_len).map((e, i) => {
					return arr[i] ? arr[i][key] : ''
				}).join(spector)
			}
			const contents = merge('contents', len, '|')
			const names = merge('rowName', len, '|')
			const rate = merge('rate', len, ',')
			const pids = merge('pid', len, ',')
			return arr.length ? {
				gid: arr[0].gid,
				tid: arr[0].tid,
				contents,
				names,
				rate,
				pids,
				rebate: arr[0].rebate,
				counts: 1,
				atitle: _this.gpt()
			} : {}
		},
		/*
		 * handleParamsFn
		 */
		hpf: function(arr) {
			let names = []
			let contents = []
			let pids = []
			let rates = []
			arr.forEach(function(e) {
				names.push(e.name)
				contents.push(Number(e.code))
				pids.push(e.pid)
				if(e.rate) {
					if(e.rate.indexOf(',') <= 0) {
						rates.push(Number(e.rate))
					} else {
						rates = [e.rate.split(',')[arr.length-1]]
					}
				}
			})
			return {names, contents, pids, rates}
		},
		//handleDuoData
		hdData: function(data) {
			const _this = this
			const arr = $.isArray(data) ? data : Util.convertFromObj2Arr(data)
			const prms = _this.hpf(arr)
			const names = prms.names
			const contents = prms.contents
			const pids = prms.pids
			const rates = prms.rates
			const minRate = Math.min(...rates)
			return arr.length ? {
				gid: arr[0].gid,
				tid: arr[0].tid,
				rebate: arr[0].rebate,
				pids: pids.join(','),
				names: names.join(','),
				contents: contents.join(','),
				rate: !rates.length ? _this.gtr() : minRate,
				atitle: _this.gpt(),
				btitle: _this.gtl()
			} : {}
		},
		//getTabRate
		gtr: function() {
			return $.trim($('.tab-selected').find('.ts-rate').text())
		},
		//getTabLabel
		gtl: function() {
			return $('.ts-label').length ?
				$.trim($('.tab-selected').find('.ts-label').text()) :
				$.trim($('.tab-selected').find('label').text())
		},
		//getPlayTab
		gpt: function() {
			return $.trim($('.play-selected').text())
		},
		//duo1SubmitData
		d1sData: function(data) {
			const _this = this
			return data.map((e) => {
				let merge = _this.hdData(e)
				merge.counts = 1
				return merge
			})
		},
		submit: function(gid, params, counts, fn, cb) {
	    	if(!counts) {
	    		Layer.alert('请先添加投注内容')
	    		return false
	    	}

	    	const price = $('input[name="betMoney"]').val()
	    	if(!/^\d+$/.test(price)) {
	    		Layer.alert('请填写投注金额')
	    		return false
	    	}
	    	let data = fn && fn(params, price, counts)
	    	data = $.isArray(data) ? data : [data]
	    	//price_count
	    	const pc = data.map((e) => {
	    		return e.price_sum
	    	}).reduce((a, b) => Number(a) + Number(b))
	    	Lottery.betSubmit(gid, JSON.stringify(data), function() {
	    		cb && cb(pc)
	    	})
		},
		//timeoutFn
		tf: function(clazz, fn) {
			const ret = $(clazz)
			if(ret.length) {
				fn && fn(clazz)
			} else {
				const innerFn = function() {
					const ret = $(clazz)
					if(ret.length) {
						fn && fn(clazz)
					} else {
						const _t = $timeout(function() {
							$timeout.cancel(_t)
							innerFn()
						}, 10)
					}
				}
				innerFn()
			}
		}
	}
}