import angular from 'angular'
export default function ($scope, Core, $stateParams) {
    var parent_id = $stateParams.parent_id
    $scope.page = parseInt($stateParams.page) || 1
    $scope.pageList = []
    Core.get('content/content/getContentList?parent_id=' + parent_id + '&page=' + $scope.page, function (json) {
        var c = angular.fromJson(json)
        if (c.code == 200) {
            $scope.news = c.data.rows
            $scope.total = c.data.total
            $scope.pageSize = 16
            $scope.numberOfPages = Math.ceil(c.data.total / 16)
            $scope.prePage = $scope.page == 1 ? 1 : $scope.page - 1
            $scope.nextPage = $scope.page == $scope.numberOfPages ? $scope.numberOfPages : $scope.page + 1
            for (var i = 1; i <= $scope.numberOfPages; i++) {
                $scope.pageList.push(i)
            }
        }
    })

    $scope.goParam = {
        mode: 'page',
        url: 'news',
        parent_id,
        category_id: $stateParams.category_id
    }
}