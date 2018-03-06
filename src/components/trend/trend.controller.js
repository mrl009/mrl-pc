import angular from 'angular'
export default function ($scope, $sce, Core) {
    Core.get('Open_time/get_games_list?use=main', function (json) {
        const c = angular.fromJson(json)
        if (c.code == 200) {
            $scope.hotData = c.data
        }
    }, false)

    Core.get('Open_time/get_games_list?use=all', function (json) {
        const c = angular.fromJson(json)
        if (c.code == 200) {
            $scope.allData = c.data
        }
    }, false)
}