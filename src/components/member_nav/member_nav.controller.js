// import $ from 'jQuery'
import angular from 'angular'
// import {IMG_ROOT} from '../../config'
import './member_nav.less'

export default function ($scope, $location, Core) {
    $scope.path = $location.$$url
    Core.get('agent/check_agent_register', function (json) {
        var c = angular.fromJson(json)
        if (c.code == 200) {
            if (c.data.status == 4) {
                $scope.isProxy = true
            }
        }
    }, false)
}