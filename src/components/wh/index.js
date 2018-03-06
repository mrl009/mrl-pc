import angular from 'angular'
import Wh from './wh.controller'
import './wh.less'

const wh = angular.module('main.wh', [])
    .config(function ($stateProvider) {
        $stateProvider
            .state('wh', {
                url: '/wh',
                controller: Wh,
                templateUrl: 'src/components/wh/wh.tpl.html'
            })
    })
    .controller('Wh', Wh)
    .name

export default wh