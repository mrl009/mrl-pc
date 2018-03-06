import angular from 'angular'
import OpenCtrl from './open.controller'
import OpenComponent from './open.component'

import HeadCtrl from '../head/head.controller'
import NavCtrl from '../nav/nav.controller'
import ZsNavCtrl from '../open-nav/zsnav.controller'

import './open.less'

OpenComponent.controller = OpenCtrl

const register = angular.module('main.open.list', [])
	.config(function ($stateProvider) {
		$stateProvider.state('open', OpenComponent)
	})
	.controller('HeadCtrl', HeadCtrl)
	.controller('NavCtrl', NavCtrl)
	.controller('ZsNavCtrl', ZsNavCtrl)
	.name

export default register