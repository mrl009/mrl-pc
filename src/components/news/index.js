import angular from 'angular'
import NewsCtrl from './news.controller'
import HeadCtrl from '../head/head.controller'
import NavCtrl from '../nav/nav.controller'

const news = angular.module('main.news', [])
    .config(function ($stateProvider) {
        $stateProvider
            .state('news', {
                url: '/news/:parent_id/:category_id/:page',
                controller: NewsCtrl,
                templateUrl: 'src/components/news/news.tpl.html'
            })
    })
    .controller('HeadCtrl', HeadCtrl)
    .controller('NavCtrl', NavCtrl)
    .name

export default news