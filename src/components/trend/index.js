import angular from 'angular'
import TrendCtrl from './trend.controller'
import TrendComponent from './trend.component'

import HeadCtrl from '../head/head.controller'
import NavCtrl from '../nav/nav.controller'

TrendComponent.controller = TrendCtrl

const trend = angular.module('main.trend', [])
	.config(function ($stateProvider) {
		$stateProvider.state('trend', TrendComponent)
	})
	.controller('HeadCtrl', HeadCtrl)
	.controller('NavCtrl', NavCtrl)
	.name

export default trend