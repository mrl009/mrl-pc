import angular from 'angular'
import HelpCtrl from './help.controller'
import HeadCtrl from '../head/head.controller'
import NavCtrl from '../nav/nav.controller'
import './help.less'

const help = angular.module('main.help', [])
    .config(function ($stateProvider) {
        $stateProvider
            .state('help', {
                url: '/help/:parent_id/:category_id/:id',
                controller: HelpCtrl,
                templateUrl: 'src/components/help/help.tpl.html'
            })
    })
    .controller('HeadCtrl', HeadCtrl)
    .controller('NavCtrl', NavCtrl)
    .name

export default help