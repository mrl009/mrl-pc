import angular from 'angular'
import HomeCtrl from './home.controller'
import HomeComponent from './home.component'

import './home.less'

import HeadCtrl from '../head/head.controller'
import NavCtrl from '../nav/nav.controller'

HomeComponent.controller = HomeCtrl

const home = angular.module('main.home', [])
	.config(function ($stateProvider) {
		$stateProvider.state('home', HomeComponent)
	})
	.controller('HeadCtrl', HeadCtrl)
	.controller('NavCtrl', NavCtrl)
	.name

export default home