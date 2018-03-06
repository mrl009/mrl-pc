import angular from 'angular'

export default function ($scope,
                         $rootScope,
                         Core,
                         $stateParams,
                         $timeout,
                         $location) {
    //获取游戏类型
    $scope.types = []
    //分类
    $scope.lotterys = []
    $scope.allGames = []
    const {$$url} = $location

    $scope.currTab = 0
    Core.get('Open_time/get_type_list', function (json) {
        const c = angular.fromJson(json)
        if (c.code == 200) {
            $scope.types = c.data.slice(1).filter((e) => {
                return e.type != 'sx'
            })
        }
    })

    $rootScope.$watch('ALLGAMES', function (newval) {
        if (newval != undefined) {
            $scope.allGames = newval.filter((e) => {
                return e.sname != 'ag' && e.sname != 'dg' && e.sname != 'mg' && e.sname != 'pt' && e.sname != 'lebo'
            })
            $scope.lotterys = newval.filter((e) => {
                return e.sname != 'ag' && e.sname != 'dg' && e.sname != 'mg' && e.sname != 'pt' && e.sname != 'lebo'
            })
        }
    })

    $scope.nextPath = /\/(\w+)\/?/.exec($$url)[1]

    $scope.changeTab = function (type, idx) {
        if (idx == 0) {
            $scope.lotterys = $scope.allGames.filter((e) => {
                return e.sname != 'ag' && e.sname != 'dg' && e.sname != 'mg' && e.sname != 'pt' && e.sname != 'lebo'
            })
        } else {
            $scope.lotterys = $scope.allGames.filter((e) => {
                return e.tmp == type && e.sname != 'ag' && e.sname != 'dg' && e.sname != 'mg' && e.sname != 'pt' && e.sname != 'lebo'
            })
        }
        $scope.currTab = idx
    }

    $scope.$watch('lotterys', function (newval) {
        if (newval && newval.length) {
            if ($stateParams.gid) {
                $scope.initHandle = $scope.initTab(newval)
            }
        }
    })

    $scope.$watch('types', function (newval) {
        if (newval && newval.length) {
            if ($stateParams.gid) {
                if (!$scope.initHandle) {
                    $timeout(function () {
                        $scope.initHandle(newval)
                    }, 100)
                } else {
                    $scope.initHandle(newval)
                }
            }
        }
    })

    $scope.initTab = function (lotterys) {
        return function (types) {
            $scope.gid = $stateParams.gid
            $scope.tmp = $stateParams.type
            $scope.currLottery = lotterys.filter((el) => {
                return el.gid == $scope.gid
            })
            $scope.lotterys = lotterys.filter((el) => {
                return el.tmp == $scope.tmp
            })
            $scope.currTab = (function () {
                for (let i = 0; i < types.length; i++) {
                    if (types[i].tmp == $scope.tmp) {
                        return i + 1
                    }
                }
                return 0
            })()
        }
    }
}