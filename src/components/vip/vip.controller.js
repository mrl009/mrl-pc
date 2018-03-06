import angular from 'angular'

export default function ($scope, Core, Layer) {
    if(Core.getToken()) {
        Core.get('user/grade_mechanism/getUserGrade', function (json) {
            const c = angular.fromJson(json)
            if (c.code == 200) {
                $scope.info = c.data
            }
        }, false)
    }

    Core.get('index.php/activity/Promotion/getGradeList', function (json) {
        const c = angular.fromJson(json)
        if (c.code == 200) {
            $scope.vipList = c.data
        }
    }, false)
    $scope.getAward = function() {
        if(!Core.getToken()) {
            Layer.alert('请先登录', '提示')
            return false
        }
        if ($scope.info.is_reward == 0 || $scope.info.is_reward === undefined) {
            Layer.alert('您没有可领取的奖励', '温馨提示')
            return false
        }else {
            Core.get('user/grade_mechanism/rewardDo', function(json) {
                const c = angular.fromJson(json)
                if (c.code == 200) {
                    $scope.info.is_reward = false
                    $scope.info.money = 0
                    Layer.alert('恭喜你,领取成功!', '温馨提示')
                }else {
                    Layer.alert(c.msg, '提示')
                }
            })
        }
    }
}