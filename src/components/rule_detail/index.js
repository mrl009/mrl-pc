import angular from 'angular'
import Rule_detailCtrl from './rule_detail.controller'
//import Rule_detailComponent from './rule_detail.component'

import HeadCtrl from '../head/head.controller'
import NavCtrl from '../nav/nav.controller'

import './rule.less'

//Rule_detailComponent.controller = Rule_detailCtrl

const rule_detail = angular.module('main.rule_detail', [])
	.config(function ($stateProvider) {
		//$stateProvider.state('rule_detail', Rule_detailComponent)
        $stateProvider
        .state('rule_detail', {
            url: '/rule_detail/:type/:id',
            controller: Rule_detailCtrl,
            templateUrl: 'src/components/rule_detail/rule_detail.tpl.html'
        })
	})
	.controller('HeadCtrl', HeadCtrl)
	.controller('NavCtrl', NavCtrl)
	.name

export default rule_detail