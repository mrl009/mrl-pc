import angular from 'angular'
import $ from 'jQuery'
export default function ($scope, $sce, Core, $state) {
    Core.get('activity/promotion/get_activity_list?show_way=3', function (json) {
        const c = angular.fromJson(json)
        if (c.code == 200) {
            $.each(c.data.rows, function (i, d) {
                c.data.rows[i].content = $sce.trustAs($sce.HTML, d.content)
            })
            $scope.data = c.data.rows
            $scope.showHideAccrod = function (i) {
                if(i === 'vip') {
                    $state.go('vip')
                }
                $('.content_box').eq(i).slideToggle(500)
                $('.content_box').not($('.content_box').eq(i)).slideUp('normal')
            }
        }
    }, false)
}