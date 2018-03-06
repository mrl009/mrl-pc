import angular from 'angular'
import WH_IMG from '../../assets/img/wh.png'

export default function ($scope, Core, $cookieStore, $state) {
    Core.get('home/getHomeData', function (json) {
        const c = angular.fromJson(json)
        if (c.code != 403) {
            $cookieStore.remove('wh')
            $state.go('home')
        } else {
            $scope.WH_IMG = WH_IMG
            $scope.data = JSON.parse($cookieStore.get('wh'))
        }
    })
}