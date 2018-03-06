import angular from 'angular'

export default function ($scope, $rootScope, Core) {
    $scope.initOpen = function () {
        Core.get('Open_time/get_games_list?use=kj', function (json) {
            const c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.openList = c.data.map((e) => {
                    e.number = e.number.split(',')
                    e.color && (e.color = e.color.split(','))
                    e.shengxiao && (e.shengxiao = e.shengxiao.split(','))
                    e.total = e.number.reduce((a, b) => {
                        return Number(a) + Number(b)
                    })
                    return e
                }).filter((e) => {
                    return e.sname != 'ag' && e.sname != 'dg' && e.sname != 'mg' && e.sname != 'pt' && e.sname != 'lebo'
                })
            }
        })
    }

    $scope.initOpen()
}