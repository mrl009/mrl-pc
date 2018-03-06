import angular from 'angular'
import $ from 'jQuery'

export default function ($scope, Core, $stateParams) {
    $scope.type = $stateParams.type
    $scope.id = $stateParams.id

    Core.get('home/get_game_opt', function (json) {
        const c = angular.fromJson(json)
        if (c.code == 200) {
            $scope.allLottery = c.data.rows.filter((e) => {
                if (e.sname == 'lhc') {
                    $scope.name = e.name
                }
                return e.sname != 'ag' && e.sname != 'dg' && e.sname != 'mg' && e.sname != 'pt' && e.sname != 'lebo'
            })
        }

        $scope.getTitle = function () {
            $.each($scope.allLottery, function (i, d) {
                if (d.id == $scope.id) {
                    $scope.name = d.name
                }
            })
        }
        $scope.getTitle()

        $scope.getGame = function (id, type) {
            $scope.id = id
            $scope.getTitle()
            Core.get('rules/game_rules/get_games_rules_content?type=' + type, function (json) {
                const c = angular.fromJson(json)
                if (c.code == 200) {
                    $scope.introduction = c.data.introduction
                    $scope.contents = c.data.rows
                }
            }, false)
        }
        $scope.getGame($scope.id, $scope.type)
    }, false)
}
