import angular from 'angular'
import RegisterCtrl from './register.controller'
import RegisterComponent from './register.component'

import './register.less'

import HeadCtrl from '../head/head.controller'
import NavCtrl from '../nav/nav.controller'

RegisterComponent.controller = RegisterCtrl

const register = angular.module('main.register', [])
	.config(function ($stateProvider) {
		$stateProvider.state('register', RegisterComponent)
	})
	.controller('HeadCtrl', HeadCtrl)
	.controller('NavCtrl', NavCtrl)
	.name

export default register