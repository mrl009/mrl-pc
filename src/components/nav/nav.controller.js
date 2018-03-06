import $ from 'jQuery'
import angular from 'angular'
// import {IMG_ROOT} from '../../config'
import './side-nav.less'

export default function (
  $scope,
  $location,
  Core,
  $rootScope
) {
	const { $$path } = $location
    $scope.isHome = $$path == '/'
    $scope.path = $$path
    $scope.allauth = false //是否开通多个彩票分类
    Core.get('home/getHomeData?show_location=4', function(json) {
        const c = angular.fromJson(json)
        if(c.code == 200) {
            let cp = c.data.lottery_auth ? c.data.lottery_auth : '1,2'
            cp = cp.split(',')
            if($.inArray('1', cp)>-1 && $.inArray('2', cp)>-1) {
                $scope.allauth = true
            }
        }
    })

  // $('head').find('link').each(function() {
  //   if($(this).attr('href').indexOf('buy.css')>=0) {
  //     $(this).remove()
  //   }
  // })

  $scope.showMenu = function() {
  	const $target = $('#wrap-sort-all')
  	if($target.hasClass('nav-show')) {
  		return
  	}
  	$target.addClass('nav-show-sub')
  }

  $scope.hideMenu = function() {
  	const $target = $('#wrap-sort-all')
    $target.removeClass('nav-show-sub')
  }
  $scope.showPlay = function() {
     if($scope.allauth) {
        $('#lot_sec_menu').show()
     }
  }
  $scope.hidePlay = function() {
      $('#lot_sec_menu').hide()
  }
    //获取国私彩
  $scope.getGamesList = function() {
        Core.get('open_time/get_games_list?ctg=gc', function(json) {
            const c = angular.fromJson(json)
            if(c.code == 200 ) {
                $scope.glist = c.data
            }
        })
        Core.get('open_time/get_games_list?ctg=sc', function(json) {
            const c = angular.fromJson(json)
            if(c.code == 200 ) {
                $scope.slist = c.data
            }
        })
  }
  $scope.getGamesList()
  $scope.mouseOver = function() {
    $scope.isShowing = true
  }

  $scope.mouseLeave = function() {
    $scope.isShowing = false
    $('#wrap-sort-all').removeClass('nav-show-sub')
  }

  $scope.data = null

  //获取所有游戏数据

  $scope.dpcSub = [] //低频彩显示的数量
  $rootScope.$watch('ALLGAMES', function(newData) {
    if(newData && newData.length) {
      $scope.allSub = newData.slice(0, 4)
      $scope.data1 = newData.slice(0, 7)
      const jd = [4, 6] //经典
      const ks = [10] //快速
      //const hb = [4, 6] //火爆
      const gl = [] //给力
      angular.forEach($scope.data1, function(v, k) {
          $scope.data1[k].memo = '最火爆'
          if(v.cptype == 'ssc') {
              $scope.data1[k].memo = '最火爆'
          }
          else if($.inArray(v.id, jd)) {
              $scope.data1[k].memo = '最经典'
          }
          else if($.inArray(v.id, ks)) {
              $scope.data1[k].memo = '最快速'
          }else if($.inArray(v.id, gl)) {
              //$scope.data1[k].memo = '最给力'
          }else{
              $scope.data1[k].memo = '最给力'
          }
      })
      $scope.dpcSub = newData.filter((el) => {
        return el.tmp == 'yb'
      })
    }
  })

  $scope.data1 = []

  $scope.initShowSub = function() {
    $('.sortMain').mouseenter(function() {
      if($(this).find('.sortArrow').length) {
        $(this).find('.secondNav').show()
      }
    }).mouseleave(function() {
      $(this).find('.secondNav').hide()
    })
  }

  $scope.initShowSub()
}