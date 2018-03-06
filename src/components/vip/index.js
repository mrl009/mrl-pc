import angular from 'angular'
import vip from './vip.controller'
import './vip.less'

const VIP = angular.module('main.vip', [])
    .config(function ($stateProvider) {
        $stateProvider
            .state('vip', {
                url: '/vip',
                controller: vip,
                templateUrl: 'src/components/vip/vip.tpl.html'
            })
    })
    .controller('vip', vip)
    .name

export default VIP