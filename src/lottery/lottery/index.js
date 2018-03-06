import angular from 'angular'
import LotteryCtrl from './lottery.controller'
import BuyCtrl from '../buy/buy.controller'
import SscCtrl from '../ssc/ssc.controller'
import YbCtrl from '../yb/yb.controller'
import Pk10Ctrl from '../pk10/pk10.controller'
import PcddCtrl from '../pcdd/pcdd.controller'
import LhcCtrl from '../lhc/lhc.controller'
import K3Ctrl from '../k3/k3.controller'
import $11x5Ctrl from '../11x5/11x5.controller'
import SSscCtrl from '../s_ssc/s_ssc.controller'
import SYbCtrl from '../s_yb/s_yb.controller'
import SK3Ctrl from '../s_k3/s_k3.controller'
import S11x5Ctrl from '../s_11x5/s_11x5.controller'
import SPk10Ctrl from '../s_pk10/s_pk10.controller'
import SKl10Ctrl from '../s_kl10/s_kl10.controller'

import '../css/lottery.less'
import './lottery.less'
import '../ssc/ssc.lottery.less'
import '../cart/cart.less'
import '../announcement/announcement.lottery.less'
import 'animate.css/animate.min.css'

const lottery = angular.module('main.lottery', [])
    .config(function ($stateProvider) {
        $stateProvider
            .state('lottery', {
                url: '/lottery',
                abstract: true,
                controller: LotteryCtrl,
                templateUrl: 'src/lottery/lottery/lottery.tpl.html',
                cache: false
            })
            .state('lottery.buy', {
                url: '/buy',
                controller: BuyCtrl,
                templateUrl: 'src/lottery/buy/buy.tpl.html',
                cache: false
            })
            .state('lottery.ssc', {
                url: '/ssc/:type/:gid',
                controller: SscCtrl,
                templateUrl: 'src/lottery/ssc/ssc.tpl.html',
                cache: false
            })
            .state('lottery.yb', {
                url: '/yb/:type/:gid',
                controller: YbCtrl,
                templateUrl: 'src/lottery/yb/yb.tpl.html',
                cache: false
            })
            .state('lottery.pk10', {
                url: '/pk10/:type/:gid',
                controller: Pk10Ctrl,
                templateUrl: 'src/lottery/pk10/pk10.tpl.html',
                cache: false
            })
            .state('lottery.pcdd', {
                url: '/pcdd/:type/:gid',
                controller: PcddCtrl,
                templateUrl: 'src/lottery/pcdd/pcdd.tpl.html',
                cache: false
            })
            .state('lottery.lhc', {
                url: '/lhc/:type/:gid',
                controller: LhcCtrl,
                templateUrl: 'src/lottery/lhc/lhc.tpl.html',
                cache: false
            })
            .state('lottery.k3', {
                url: '/k3/:type/:gid',
                controller: K3Ctrl,
                templateUrl: 'src/lottery/k3/k3.tpl.html',
                cache: false
            })
            .state('lottery.11x5', {
                url: '/11x5/:type/:gid',
                controller: $11x5Ctrl,
                templateUrl: 'src/lottery/11x5/11x5.tpl.html',
                cache: false
            })
            .state('lottery.s_ssc', {
                url: '/s_ssc/:type/:gid',
                controller: SSscCtrl,
                templateUrl: 'src/lottery/s_ssc/s_ssc.tpl.html',
                cache: false
            })
            .state('lottery.s_yb', {
                url: '/s_yb/:type/:gid',
                controller: SYbCtrl,
                templateUrl: 'src/lottery/s_yb/s_yb.tpl.html',
                cache: false
            })
            .state('lottery.s_k3', {
                url: '/s_k3/:type/:gid',
                controller: SK3Ctrl,
                templateUrl: 'src/lottery/s_k3/s_k3.tpl.html',
                cache: false
            })
            .state('lottery.s_11x5', {
                url: '/s_11x5/:type/:gid',
                controller: S11x5Ctrl,
                templateUrl: 'src/lottery/s_11x5/s_11x5.tpl.html',
                cache: false
            })
            .state('lottery.s_pk10', {
                url: '/s_pk10/:type/:gid',
                controller: SPk10Ctrl,
                templateUrl: 'src/lottery/s_pk10/s_pk10.tpl.html',
                cache: false
            })
            .state('lottery.s_kl10', {
                url: '/s_kl10/:type/:gid',
                controller: SKl10Ctrl,
                templateUrl: 'src/lottery/s_kl10/s_kl10.tpl.html',
                cache: false
            })
    })
    .name

export default lottery
