import angular from 'angular'

import NewsDetailCtrl from './news_detail.controller'
import HeadCtrl from '../head/head.controller'
import NavCtrl from '../nav/nav.controller'
import './news-detail.less'

const news_detail = angular.module('main.news_detail', [])
    .config(function ($stateProvider) {
        //$stateProvider.state('news_detail', NewsDetailComponent)
        $stateProvider
            .state('news_detail', {
            url: '/news_detail/:id',
            controller: NewsDetailCtrl,
            templateUrl: 'src/components/news_detail/news_detail.tpl.html'
        })
    })
    .controller('HeadCtrl', HeadCtrl)
    .controller('NavCtrl', NavCtrl)
    .name

export default news_detail