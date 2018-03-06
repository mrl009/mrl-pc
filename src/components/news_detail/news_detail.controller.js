import angular from 'angular'
export default function ($scope, $stateParams, Core, $sce) {
    var id = $stateParams.id
    Core.get('content/content/getContentDetail?id='+id, function (json) {
        var c = angular.fromJson(json)
        if (c.code == 200) {
            $scope.news_detail = c.data
            $scope.news_detail.content = $sce.trustAs($sce.HTML, $scope.news_detail.content)
        }
    })
}