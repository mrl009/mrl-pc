// import $ from 'jQuery'
import angular from 'angular'
import md5 from 'md5'

export const CtrlUtil = function (Core,
                                  $location,
                                  $state,
                                  Layer,
                                  $cookieStore,
                                  $timeout,
                                  $rootScope,
                                  Util) {
    return {
        getInfo: function (token, fn) {
            Core.get('user/user/user_balance?token=' + token, function (json) {
                var c = angular.fromJson(json)
                if (c.code == 200) {
                    fn && fn(c)
                }
            }, false)
        },
        getCapt: function (fn) {
            Core.get('login/get_token_private_key', function (json) {
                const c = angular.fromJson(json)
                if (c.code == 200) {
                    fn && fn(c)
                }
            }, false)
        },
        /*
         * data：{
         * 	username,
         * 	pwd,
         * 	code,
         *	token_private_key
         *}
         */
        login: function (data, tipName, rf, fn) {
            let msgs = ''
            if (data.isCode) {
                msgs = [
                    this.valid(data.username, Util.lRules.username, '请输入正确的用户名'),
                    this.valid(data.pwd, Util.lRules.password, '请输入6~12位密码'),
                    this.valid(data.code, Util.lRules.vcode, '请输入正确的验证码')
                ]
            } else {
                msgs = [
                    this.valid(data.username, Util.lRules.username, '请输入正确的用户名'),
                    this.valid(data.pwd, Util.lRules.password, '请输入6~12位密码')
                ]
            }
            while (msgs.length) {
                const msg = msgs.shift()
                if (msg) {
                    Layer[tipName](msg)
                    rf(0)
                    return false
                }
            }
            data.pwd = md5(data.pwd)
            // const params = $httpParamSerializer(data)
            Core.post('login/token', data, function (json) {
                const c = angular.fromJson(json)
                var param = {
                    username: data.username,
                    pwd: data.pwd,
                    code: data.code,
                    token_private_key: data.token_private_key
                }
                if (c.code == 200) {
                    Core.setToken(c.data.token)
                    Layer.headTip('登陆成功')
                    fn()
                    $timeout(function () {
                        Core.get('user/user/refresh', function (json) {
                            var cc = angular.fromJson(json)
                            if (cc.code == 200 && cc.data.refresh_token) {
                                $cookieStore.put('token', cc.data.token)
                                // 设置过期时间跟刷新时间
                                param.refresh_time = cc.data.refresh_token
                                param.expires_time = new Date().getTime() + parseInt(param.refresh_time*1000)
                                param.auto_login = md5('username=' + param.username + '&pwd=' + param.pwd)
                                $cookieStore.put('loginData', JSON.stringify(param))
                                $rootScope.loginLoop(param.refresh_time*1000)
                            }
                        }, false)
                    }, 3000)
                    if ($location.$$url === '/register') {
                        $timeout(function () {
                            $state.go('home')
                        }, 300)
                    }
                } else {
                    Layer.headTip(c.msg)
                }
                rf(c.code)
            })
            return null
        },
        isFunc: function (fname) {
            return typeof fname === 'function'
        },
        valid: function (val, rule, msg) {
            return val && (this.isFunc(rule) ? rule(val) : rule.test(val)) ? null : msg
        },
        logout: function (fn) {
            Layer.confirm({
                title: '提示',
                msg: '确定要退出吗?',
                okFn: function () {
                    Core.get('login/logout', function (json) {
                        var c = angular.fromJson(json)
                        if (c.code == 604) {
                            Core.removeToken()
                            fn && fn()
                        }
                        Layer.headTip(c.msg)
                    }, false)
                    return
                }
            })
        },
        register: function (opts) {
            opts.preFn && opts.preFn()
            const flag = opts.valid && opts.valid()
            if (flag === false) {
                return false
            }

            let params = Object.assign({}, opts.data)
            params.ip = '192.168.8.192'
            params.pwd = md5(params.pwd)

            // params = $httpParamSerializer(params)
            Core.post('login/user_add', params, function (json) {
                const c = angular.fromJson(json)
                if (c.code == 200) {
                    opts.success && opts.success(c)
                } else {
                    Layer.alert(c.msg)
                }

                opts.nextFn && opts.nextFn()
            })

            // return null
        },
        initPage: function (gid, success, flag, error) {
            Core.get('games/play/' + gid, function (json) {
                const c = angular.fromJson(json)
                if (c.code == 200) {
                    success && success(c.data)
                } else {
                    error && error(c)
                }
            }, flag)
        },
        initProduct: function (gid, success, flag, error) {
            Core.get('games/products/' + gid, function (json) {
                const c = angular.fromJson(json)
                if (c.code == 200) {
                    success && success(c.data)
                } else {
                    error && error(c)
                }
            }, flag)
        }
    }
}