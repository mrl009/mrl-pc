import angular from 'angular'
import Trend_detailCtrl from './trend_detail.controller'

import template from './trend_detail.tpl.html'

import HeadCtrl from '../head/head.controller'
import NavCtrl from '../nav/nav.controller'

import './trend_detail.less'

const trend_detail = angular.module('main.trend_detail', [])
	.config(function ($stateProvider) {
		$stateProvider.state('trend_detail', {
			url: '/trend_detail/:type/:gid',
			template,
			controller: Trend_detailCtrl
		})
	})
	.controller('HeadCtrl', HeadCtrl)
	.controller('NavCtrl', NavCtrl)
	.name

export default trend_detail