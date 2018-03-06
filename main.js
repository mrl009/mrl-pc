import angular from 'angular'
import $ from 'jQuery'
import service from './src/service'
import uirouter from 'uirouter'
import ngCookies from 'angular-cookies'

import {IMG_ROOT} from './src/config'

import './src/components/css/app.less'

import AdvController from './src/components/sideadv/side.controller'

// import directives from './src/directive'
import { paginate, numput, myquee } from './src/directive'

import Home from './src/components/home'
import Mobile from './src/components/mobile'
import Register from './src/components/register'
import Activity from './src/components/activity'
import Open from './src/components/open'
import OpenDetail from './src/components/open-detail'
import Trend from './src/components/trend'
import Trend_detail from './src/components/trend_detail'
import Rule_detail from './src/components/rule_detail'
import News from './src/components/news'
import News_detail from './src/components/news_detail'
import Help from './src/components/help'
import Member from './src/components/member'
import Wh from './src/components/wh'
import VIP from './src/components/vip'
// import Member_transaction from './src/components/member_transaction'
// import Member_detail_set from './src/components/member_detail_set'
// import Member_notice from './src/components/member_notice'
// import Member_top_up from './src/components/member_top_up'
// import Member_withdraw from './src/components/member_withdraw'
// import Member_top_up_record from './src/components/member_top_up_record'
// import Member_withdraw_record from './src/components/member_withdraw_record'
// import Member_top_up_company from './src/components/member_top_up_company'
// import Agent_apply from './src/components/agent_apply'
// import Agent_info from './src/components/agent_info'
// import Agent_bet_record from './src/components/agent_bet_record'
// import Agent_report from './src/components/agent_report'
// import Agent_user from './src/components/agent_user'
// import Agent_charge from './src/components/agent_charge'
// import Agent_account_detail from './src/components/agent_account_detail'

//import Buy from './src/lottery/buy'
import Lottery from './src/lottery/lottery'

const app = angular.module('main', [
    ngCookies,
    uirouter,
    service,
    Home,
    Mobile,
    //Buy,
    Activity,
    // Agent_apply,
    // Agent_info,
    // Agent_bet_record,
    // Agent_report,
    // Agent_user,
    // Agent_charge,
    // Agent_account_detail,
    Open,
    Trend,
    Trend_detail,
    Rule_detail,
    Register,
    OpenDetail,
    Member,
    Wh,
    VIP,
    // Member_transaction,
    // Member_detail_set,
    // Member_top_up_record,
    // Member_withdraw_record,
    // Member_top_up,
    // Member_top_up_company,
    // Member_withdraw,
    // Member_notice,
    News,
    News_detail,
    Help,
    Lottery
]).controller('AdvCtrl', AdvController)
    .directive('paginate', paginate)
    .directive('inputNumber', numput)
    .directive('myquee', myquee)

app.config((
    $stateProvider,
    $urlRouterProvider,
    $locationProvider,
    $httpProvider
) => {
    $locationProvider.html5Mode(true)
    $httpProvider.defaults.headers.common = {}
    $httpProvider.defaults.headers.post = {}
    $httpProvider.defaults.headers.put = {}
    $httpProvider.defaults.headers.patch = {}
    $urlRouterProvider.otherwise('/')
})

app.run(function ($rootScope, Core, $location, $timeout, $cookieStore) {
    $rootScope.IMG_ROOT = IMG_ROOT
    $rootScope.TPL_ROOT = 'src/components/'
    $rootScope.LTY_ROOT = 'src/lottery/'
    $rootScope.BY = '博友彩票'
    $rootScope.GF = '官方彩票'
    $rootScope.PUBAUTH = false
    Core.get('home/getHomeData?show_location=4', function(json) {
        const c = angular.fromJson(json)
        if(c.code == 200) {
            $rootScope.BY = c.data.sys_games || '博友彩票'
            $rootScope.WEBNAME = c.data.web_name || ''
            $rootScope.WAP_DOMAIN = c.data.wap_domain || ''
            $rootScope.IOS_QRCODE = c.data.ios_qrcode || ''
            $rootScope.ANDROID_QRCODE = c.data.android_qrcode || ''
            $rootScope.COPYRIGHT = c.data.copyright || ''
            $rootScope.LOGO = c.data.logo || ''
            $rootScope.lottery_auth = c.data.lottery_auth
            let cp = c.data.lottery_auth ? c.data.lottery_auth : '1,2'
            cp = cp.split(',')
            if($.inArray('1', cp)>-1 && $.inArray('2', cp)>-1) {
                $rootScope.PUBAUTH = true
            }
            let notice = ''
            if (c.data.new_notice.length > 0) {
                angular.forEach(c.data.new_notice, function (d) {
                    notice += d.content
                })
            } else {
                notice = '没有公告通知'
            }
            $rootScope.NOTICEMSG = notice
            $rootScope.COURSEDATA = c.data.pc_banner_img || []
            $rootScope.ONLINE_SERVICE = c.data.online_service || ''
            $rootScope.QQ = c.data.qq[0] || ''
            $rootScope.TEL = c.data.tel[0] || ''
            document.title = $rootScope.WEBNAME
            // 设置meta
            let keyword = c.data.keyword || ''
            let description = c.data.description || ''
            $('#ico').attr('href', c.data.logo_wap)
            //$('head').addend('<link rel="shortcut icon" href="'+$rootScope.H5_QRCODE+'" type="image/x-icon"/>')
            $('head').append('<meta name="keywords" content='+keyword+'>')
            $('head').append('<meta name="description" content='+description+'>')
            $('<img src="https://www.boyou.biz/piwik.php?idsite='+c.data.piwik+'&rec=1" style="border:0">').appendTo('body')

            Core.get('Open_time/get_games_list?ctg='+(c.data.cp_default == 0?'gc':'sc'), function (json) {
                const c = angular.fromJson(json)
                if (c.code == 200) {
                    $rootScope.ALLGAMES = c.data
                }
            })
        }
    })

    if(/Android|webOS|iPhone|Windows Phone|iPod|BlackBerry|SymbianOS/i.test(navigator.userAgent) || window.innerWidth <= 800) {
        const { $$search } = $location
        const search = $$search.intr ? '?intr=' + $$search.intr : ''
        //Core.get('?type=h5', function(json) {
        Core.get('welcome/index?type=h5', function(json) {
            const c = angular.fromJson(json)
            if(c.code == 200) {
                c.data && (location.href = c.data[0] + search)
                !c.data && $('ui-view').show()
            }
        })
    } else {
        $('ui-view').show()
    }

    $rootScope.doLogin = function () {
        var now = new Date().getTime()
        var loginData = $cookieStore.get('loginData') == undefined ? '' : JSON.parse($cookieStore.get('loginData'))
        if (now >= loginData.expires_time) {
            Core.get('login/get_token_private_key', function (json) {
                var t = angular.fromJson(json)
                if (t.code == 200) {
                    loginData.token_private_key = t.data.token_private_key
                    Core.post('login/token', loginData, function (json) {
                        var tt = angular.fromJson(json)
                        if (tt.code == 200) {
                            console.log('loop login success')
                            $cookieStore.put('token', tt.data.token)
                            loginData.expires_time = now + parseInt(loginData.refresh_time*1000)
                            $cookieStore.put('loginData', JSON.stringify(loginData))
                            $rootScope.loginLoop(loginData.refresh_time*1000)
                        }
                    })
                }
            }, false)
        } else {
            console.log('loop login continue')
            $rootScope.loginLoop(60*1000)
        }
    }

    $rootScope.loginLoop = function (time) {
        $rootScope.loginTimer = $timeout(function () {
            $rootScope.doLogin()
        }, time)
    }
})
