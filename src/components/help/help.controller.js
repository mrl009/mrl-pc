import angular from 'angular'
import $ from 'jQuery'

export default function ($scope, Core, $stateParams, $sce) {
    var parent_id = $stateParams.parent_id
    var category_id = $stateParams.category_id
    $scope.id = $stateParams.id
    if (category_id == 0 && $scope.id == 0) {
        $scope.isAll = true
    } else {
        $scope.isAll = false
        Core.get('content/content/getContentList?parent_id='+parent_id+'&category_id='+category_id+'&page=-1', function (json) {
            var c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.news = c.data.rows
                $.each($scope.news, function (i, d) {
                    $scope.news[i].content = $sce.trustAs($sce.HTML, d.content)
                })
            }
        })
    }
    $scope.setId = function (e, id) {
        var _v= $(e.target).parent().next('.accordion-content')
        if (_v.hasClass('hidden')) {
            $('.accordion-content').addClass('hidden')
            _v.removeClass('hidden')
        } else {
            $('.accordion-content').addClass('hidden')
        }
        $scope.id = id
    }
}