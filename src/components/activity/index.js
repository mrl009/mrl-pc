import angular from 'angular'
import ActivityCtrl from './activity.controller'
import ActivityComponent from './activity.component'

import './activity.less'

import HeadCtrl from '../head/head.controller'
import NavCtrl from '../nav/nav.controller'

ActivityComponent.controller = ActivityCtrl

const activity = angular.module('main.activity', [])
	.config(function ($stateProvider) {
		$stateProvider.state('activity', ActivityComponent)
	})
	.controller('HeadCtrl', HeadCtrl)
	.controller('NavCtrl', NavCtrl)
	.name

export default activity