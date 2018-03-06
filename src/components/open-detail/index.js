import angular from 'angular'

import OpenDetailCtrl from './detail.controller'

import './open-detail.less'

import HeadCtrl from '../head/head.controller'
import NavCtrl from '../nav/nav.controller'
import ZsNavCtrl from '../open-nav/zsnav.controller'

const register = angular.module('main.open.detail', [])
	.config(function ($stateProvider) {
		$stateProvider.state('opendetail', {
			url: '/open/:type/:gid',
			templateUrl: 'src/components/open-detail/open-detail.tpl.html'
		})
	})
	.controller('OpenDetailCtrl', OpenDetailCtrl)
	.controller('HeadCtrl', HeadCtrl)
	.controller('NavCtrl', NavCtrl)
	.controller('ZsNavCtrl', ZsNavCtrl)
	.name

export default register