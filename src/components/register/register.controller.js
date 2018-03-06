import $ from 'jQuery'
import angular from 'angular'
import {API} from '../../config'

export default function ($scope,
                         Core,
                         $state,
                         Layer,
                         $cookieStore,
                         Util,
                         CtrlUtil) {
    $scope.isLogin = !!Core.getToken()
    if ($scope.isLogin) {
        $state.go('home')
    }

    $scope.isAgreed = true
    $scope.isHover = false
    $scope.codeSrc = ''
    $scope.data = {}

    $scope.handleClick = function () {
        $scope.isAgreed = !$scope.isAgreed
    }

    $scope.handleME = function () {
        $scope.isHover = true
    }

    $scope.handleML = function () {
        $scope.isHover = false
    }

    $scope.getCapt = function () {
        Core.get('login/get_token_private_key', function (json) {
            const c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.private_key = c.data.token_private_key
                $scope.codeSrc = API + 'login/code?token_private_key=' + c.data.token_private_key
            }
        }, false)
    }

    $scope.getCapt()

    $scope.codeRefresh = function () {
        $('.code-img').attr('src', $scope.codeSrc + '&time=' + Math.random() + (new Date()).getTime())
    }

    $scope.initValid = function () {
        const $target = $('#reg_form')
        $target.children('.form_group').each(function () {
            const $input = $(this).find('input')
            const name = $input.attr('name')
            const $tip = $(this).find('.column_tip')
            $input.blur(function () {
                $tip.hide()
                const $val = $(this).val()
                const rule = name == 're_password' ? Util.rRules[name]($scope.data.password) : Util.rRules[name]
                let ret = null
                if (rule) {
                    if (typeof rule === 'function') {
                        if (name == 'password') {
                            ret = rule($val, $scope.strength_pwd)
                        } else if (name == 'reg_code') {
                            ret = rule($val, $scope.is_show_agent)
                        } else {
                            ret = rule($val)
                        }
                    } else {
                        ret = rule.test($val)
                    }
                    if (!ret) {
                        $tip.show()
                    }
                }
            })
        })
    }

    $scope.strength_pwd = 0
    $scope.data = {}
    $scope.is_agent_id = $cookieStore.get('intr') || false
    $scope.data.agent_id = $cookieStore.get('intr') || ''
    $scope.pwd_error = '密码格式为：6-12位，不能包含中文和空格！'
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
            if ($scope.strength_pwd == 1) {
                $scope.pwd_error = '密码格式为：6-12位，至少包含一个字母和一个数字，不能包含中文和空格！'
            }
            $scope.initValid()
        }
    })
    $scope.submit = function () {
        CtrlUtil.register({
            preFn: function () {
                $('.column_tip').hide()
            },
            valid: function () {
                const username = $('input[name="username"]')
                const password = $('input[name="password"]')
                const re_password = $('input[name="re_password"]')
                const verify_code = $('input[name="verify_code"]')
                const bank_name = $('input[name="bank_name"]')
                const agent_id = $('input[name="reg_code"]')

                if (username == '' || password == '' || re_password == '') {
                    Layer.alert('必填项不能为空')
                    return false
                }

                const valid = function (val, rule, target, strength_pwd, is_show_agent) {
                    let ret = true
                    if (is_show_agent == 2) {
                        ret = val && rule(val, is_show_agent)
                    } else if (strength_pwd) {
                        ret = val && rule(val, strength_pwd)
                    } else {
                        ret = typeof rule === 'function' ? val && rule(val) : val && rule.test(val)
                    }
                    return ret ? null : target
                }

                let msgs = [
                    valid($scope.data.username, Util.rRules.username, username),
                    valid($scope.data.password, Util.rRules.password, password, $scope.strength_pwd),
                    valid($scope.data.re_password, Util.rRules.re_password($scope.data.password), re_password)
                ]
                $scope.is_show_code == 1 && msgs.push(valid($scope.data.verify_code, Util.rRules.verify_code, verify_code))
                $scope.is_show_bankname == 1 && msgs.push(valid($scope.data.bank_name, Util.rRules.bank_name, bank_name))
                $scope.is_show_agent == 2 && msgs.push(valid($scope.data.agent_id, Util.rRules.reg_code, agent_id, '', $scope.is_show_agent))

                while (msgs.length) {
                    const el = msgs.shift()
                    if (el) {
                        el.parent().next('.column_tip').show()
                        return false
                    }
                }

                if (!$scope.isAgreed) {
                    Layer.alert('请先同意相关条款')
                    return false
                }

                if ($scope.data.reg_code) {
                    const reg = /^\d{1,}$/
                    if (!reg.test($scope.data.reg_code)) {
                        Layer.alert('代理号必须为数字')
                        return false
                    }
                }
            },
            data: {
                pwd: $scope.data.password,
                token_private_key: $scope.private_key,
                username: $scope.data.username,
                bank_name: $scope.data.bank_name,
                yzm: $scope.data.verify_code,
                agent_id: $scope.data.agent_id
            },
            success: function (c) {
                Core.setToken(c.data.token)
                $state.go('home')
            },
            nextFn: function () {
                $scope.codeRefresh()
            }
        })
    }

    $scope.showAgree = function () {
        Core.get('rules/game_rules/get_game_article_content?id=7', function (json) {
            const c = angular.fromJson(json)
            if (c.code == 200) {
                Layer.alert(c.data[0].content, '开户协议')
            }
        })
    }
}