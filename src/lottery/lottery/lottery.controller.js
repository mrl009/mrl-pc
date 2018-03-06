import angular from 'angular'
import $ from 'jQuery'

import {API} from '../../config'

import gf from '../../assets/img/gf.png'
import xy from '../../assets/img/xy.png'
import by from '../../assets/img/by.png'
import ne from '../../assets/img/new.gif'

//
export default function ($scope,
                         $rootScope,
                         $state,
                         $stateParams,
                         Core,
                         Layer,
                         $timeout,
                         $location,
                         $cookieStore,
                         Util,
                         CtrlUtil) {
    Layer.loading()

    $scope.timeRemain = []
    $scope.currType = $stateParams.type
    $scope.currGid = $stateParams.gid
    $scope.gtype = 'gc'
    $scope.tpic = gf
    $scope.ne = ne
    $scope.allauth = false

    Core.get('home/getHomeData?show_location=4', function(json) {
        const c = angular.fromJson(json)
        if(c.code == 200) {
            let cp = c.data.lottery_auth ? c.data.lottery_auth : '1,2'
            cp = cp.split(',')
            if($.inArray('1', cp)>-1 && $.inArray('2', cp)>-1) {
                $scope.allauth = true
            }else if($.inArray('1', cp)>-1) {
                $scope.gtype = 'gc'
            }else if($.inArray('2', cp) >-1) {
                $scope.gtype = 'sc'
            }
        }
    })

    Core.get('Open_time/get_games_list?use=all', function (json) {
        const c = angular.fromJson(json)
        if (c.code == 200) {
            $scope.game_all = c.data[0]
            let a = {}
            angular.forEach (c.data[0], (v, k) => {
                let newArr=[]
                angular.forEach (v, (vv) => {
                    if(vv.ctg == $scope.gtype) {
                        newArr.push(vv)
                    }
                })
                if(newArr.length > 0) {
                    a[k] = newArr
                }
            })
            $scope.game_data = a
        }
    }, false)

    $scope.changeType = function () {
        let tt = by
        if($rootScope.BY != '博友彩票') {
            tt = xy
        }
        $scope.gtype = $scope.gtype == 'gc' ? 'sc' : 'gc'
        $scope.tpic = $scope.gtype == 'gc' ? gf : tt
        let a = {}//$scope.game_all
        angular.forEach ($scope.game_all, (v, k) => {
            let newArr=[]
            angular.forEach (v, (vv) => {
                if(vv.ctg == $scope.gtype) {
                    newArr.push(vv)
                }
            })
            if(newArr.length > 0) {
                a[k] = newArr
            }
        })
        $scope.game_data = a
    }

    $scope.data = {}

    const token = Core.getToken()
    $scope.isLogin = !!token
    $scope.getInfo = function () {
        CtrlUtil.getInfo(token, function (c) {
            $scope.loginUser = c.data
        })
    }
    if ($scope.isLogin) {
        $scope.getInfo()
    }

    $scope.codeSrc = ''
    $scope.getCapt = function (fn) {
        CtrlUtil.getCapt(function (c) {
            fn(API + 'login/code?token_private_key=' + c.data.token_private_key)
            $scope.data.token_private_key = c.data.token_private_key
        })
    }

    $scope.getCapt(function (src) {
        $scope.codeSrc = src
    })

    $scope.needsCode = function () {
        Core.get('system/index?app_type=pc', function (json) {
            var c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.data.isCode = c.data.is_code == 1 ? true : false
            }
        })
    }
    $scope.needsCode()

    $scope.codeRefresh = function () {
        $('.verfy-code').children('img').attr('src', $scope.codeSrc + '&time=' + Math.random() + (new Date()).getTime())
    }
    $scope.pwd = {
        pwd: ''
    }
    $scope.login = function () {
        $scope.data.pwd = $scope.pwd.pwd
        CtrlUtil.login(
            $scope.data,
            'alert',
            function (code) {
                if (code == 425) {
                    $scope.data.isCode = true
                }
                $scope.codeRefresh()
            },
            function () {
                $scope.isLogin = true
                $scope.getInfo()
            }
        )
    }

    $scope.goPath = function (path) {
        $state.go(path)
    }

    $scope.showRegister = function () {
        $scope.getCapt(function (src) {
            $scope.regCodeSrc = src
        })
        Layer.modal({
            title: '用户注册',
            url: $rootScope.LTY_ROOT + 'lottery/register.tpl.html',
            scope: $scope
        })
    }

    $scope.regCodeSrc = ''
    $scope.regData = {}
    $scope.isAgree = true
    $scope.strength_pwd = 0
    $scope.pwd_error = '密码格式为：6-12位，不能包含汉字和空格'
    $scope.is_show_agent = 1
    $scope.is_show_code = 1
    $scope.is_show_bankname = 1
        // 是否开启密码强度校验
    Core.get('system/index?app_type=pc', function (json) {
        var c = angular.fromJson(json)
        if (c.code == 200) {
            $scope.strength_pwd = c.data.strength_pwd
            $scope.is_show_agent = c.data.is_agent
            $scope.is_show_code = c.data.register_open_verificationcode
            $scope.is_show_bankname = c.data.register_open_username
            if ($scope.strength_pwd) {
                $scope.pwd_error = '密码格式为：6-12位，且至少包含一个字母和一个数字！不能包含汉字和空格'
            }
        }
    })

    $scope.toggleAgree = function () {
        $scope.isAgree = !$scope.isAgree
    }

    $scope.isRegCode = $cookieStore.get('intr') || false
    $scope.regData.tcode = $cookieStore.get('intr') || ''
    $scope.register = function () {
        const username = $scope.regData.username
        const bank_name = $scope.regData.bank_name
        const password = $scope.regData.password
        const repassword = $scope.regData.repassword
        const vcode = $scope.regData.vcode
        const tcode = $scope.regData.tcode
        CtrlUtil.register({
            data: {
                pwd: password,
                token_private_key: $scope.data.token_private_key,
                username: username,
                bank_name: bank_name,
                yzm: vcode,
                agent_id: tcode
            },
            valid: function () {
                const valid = function (val, rule, msg, t) {
                    return rule(val, t) ? null : msg
                }
                const msgs = [
                    CtrlUtil.valid(username, Util.rRules.username, '请输入小写字母开头的6~16位用户名'),
                    valid(password, Util.rRules.password, $scope.pwd_error, $scope.strength_pwd),
                    CtrlUtil.valid(repassword, Util.rRules.re_password(password), '两次密码不一致')
                ]
                $scope.is_show_agent == 2 && msgs.push(valid(tcode, Util.rRules.reg_code, '仅限邀请注册,请输入邀请码', $scope.is_show_agent))
                $scope.is_show_bankname == 1 && msgs.push(valid(tcode, Util.rRules.reg_code, '仅限邀请注册,请输入邀请码', $scope.is_show_agent))
                $scope.is_show_code == 1 && msgs.push(CtrlUtil.valid(bank_name, Util.rRules.bank_name, '真實姓名格式不正确'))
                while (msgs.length) {
                    const msg = msgs.shift()
                    if (msg) {
                        Layer.alert(msg)
                        $scope.regCodeRefresh()
                        return false
                    }
                }
                if (!$scope.isAgree) {
                    Layer.alert('请先同意“开户协议”')
                    return false
                }
                return null
            },
            success: function (c) {
                $('.modal-close').trigger('click')
                Layer.headTip('注册成功')
                Core.setToken(c.data.token)
                $scope.isLogin = true
                $scope.getInfo()
            },
            nextFn: function () {
                $scope.regCodeRefresh()
            }
        })
    }

    $scope.regCodeRefresh = function () {
        $('.verfyCode').attr('src', $scope.regCodeSrc + '&time=' + Math.random() + (new Date()).getTime())
    }

    $scope.logout = function () {
        CtrlUtil.logout(function () {
            $scope.isLogin = false
            $scope.codeRefresh()
        })
    }

    $scope.isRotating = false
    $scope.refresh = function () {
        if (!$scope.isRotating) {
            $scope.isRotating = true
            $scope.getInfo()
            const _timer = $timeout(function () {
                $timeout.cancel(_timer)
                $scope.isRotating = false
            }, 2000)
        }
    }

    $scope.showAgree = function () {
        Core.get('rules/game_rules/get_game_article_content?id=7', function (json) {
            const c = angular.fromJson(json)
            if (c.code == 200) {
                Layer.alert(c.data[0].content, '开户协议')
            }
        })
    }

    $scope.handleMenu = function (evt) {
        let target = evt.target
        while (!$(target).hasClass('category')) {
            target = target.parentNode
        }
        const $parent = $(target)
        // $parent.siblings().removeClass('category-show')
        if ($parent.hasClass('category-show')) {
            $parent.removeClass('category-show')
        } else {
            $parent.addClass('category-show')
        }
    }

    $scope.handleSubmenu = function (evt) {
        let target = evt.target
        while (!$(target).hasClass('category-info')) {
            target = target.parentNode
        }
        if ($(target).hasClass('curr-submenu')) {
            return
        }

        $('.category')
            .removeClass('category-select')
            .find('.category-detail')
            .find('.category-info')
            .removeClass('curr-submenu')
        $(target).addClass('curr-submenu').parent().parent().addClass('category-select')
    }
    $scope.tempGid = 0
    $scope.goProd = function (type, gid) {
        if ($scope.tempGid != gid) {
            $scope.tempGid = gid
            Layer.loading()
        }
        $state.go(`lottery.${type}`, {
            type, gid
        })
    }
}

