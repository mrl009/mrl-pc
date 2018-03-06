import angular from 'angular'
import $ from 'jQuery'

// import {API, IMG_ROOT} from '../../config'

const member_noticeCtrl = function ($scope, Core) {
    Core.get('home/getNotice?type=2&show_location=4', function (json) {
        const c = angular.fromJson(json)
        if (c.code == 200) {
            $scope.data = c.data
        }
    }, false)
    $scope.showTables = function (i) {
        $('.content').eq(i).toggle()
        $('.content').not($('.content').eq(i)).hide()
    }
}

export default member_noticeCtrl