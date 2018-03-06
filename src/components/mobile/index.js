import angular from 'angular'
// import MobileCtrl from './mobile.controller'
import MobileComponent from './mobile.component'

import HeadCtrl from '../head/head.controller'
import NavCtrl from '../nav/nav.controller'

import './mobile-buy.less'

// Mobile_buyComponent.controller = MobileCtrl

const mobile_buy = angular.module('main.mobile_buy', [])
    .config(function ($stateProvider) {
        $stateProvider.state('mobile', MobileComponent)
    })
    .controller('HeadCtrl', HeadCtrl)
    .controller('NavCtrl', NavCtrl)
    .name

export default mobile_buy