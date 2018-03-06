import angular from 'angular'
import $ from 'jQuery'
import './buy.lottery.less'

export default function (
    $scope,
    $timeout,
    Core,
    Layer,
    Util
) {
    $('.content').removeClass('scroll-active')
    $scope.syTimeCache= {}
    $scope.upDateKithe = Util.upDateKithe()
    $('.category-show').removeClass('category-show category-select')
    Core.get('Open_time/get_games_list', function (json) {
        const c = angular.fromJson(json)
        if (c.code == 200) {
            for (let i = 0; i < c.data.length; i++) {
                c.data[i].number = c.data[i].number.split(',')
                $scope.timeRemain.push(c.data[i].kithe_time_second)
            }
            $scope.lotteryData = c.data
            angular.forEach($scope.lotteryData, function(e) {
                e.gid && $scope.upDateKithe(
                    e.gid,
                    e.kithe_time_second,
                    e.up_close_time,
                    $scope.syTimeCache,
                    function(data) {
                        e.number = data.number.split(',')
                        e.kithe = data.kithe
                    }
                )
            })
            $timeout(function() {
                Layer.closeLoading()
            }, 500)
        }
    }, false)

    $scope.$on('$destroy', function() {
        Util.clearCd()
    })
}
