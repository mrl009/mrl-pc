import angular from 'angular'

const member_detail_setCtrl = function ($scope, Core) {
    Core.get('Open_time/get_type_list', function (json) {
        const c = angular.fromJson(json)
        if (c.code == 200) {
            $scope.data = c.data.filter((e) => {
                return e.type != 'sx'
            })
            $scope.gameType = 'lhc'
        }
    }, false)
    Core.get('user/detailed_set/get_list?type=lhc', function (json) {
        const c = angular.fromJson(json)
        if (c.code == 200) {
            $scope.settingData = c.data
            for (let i = 0; i < $scope.settingData.rows.length; i++) {
                $scope.settingData.rows[i] = $scope.settingData.rows[i].split(':')
                for (let j in $scope.settingData.vals) {
                    if ($scope.settingData.rows[i][1] == j) {
                        $scope.settingData.rows[i][1] = $scope.settingData.vals[j]
                    }
                }
            }
        }
    }, false)
    $scope.gameSelect = function () {
        Core.get('user/detailed_set/get_list?type=' + $scope.gameType, function (json) {
            const c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.settingData = c.data
                for (let i = 0; i < $scope.settingData.rows.length; i++) {
                    $scope.settingData.rows[i] = $scope.settingData.rows[i].split(':')
                    for (let j in $scope.settingData.vals) {
                        if ($scope.settingData.rows[i][1] == j) {
                            $scope.settingData.rows[i][1] = $scope.settingData.vals[j]
                        }
                    }
                }
            }
        }, false)
    }
}


export default member_detail_setCtrl