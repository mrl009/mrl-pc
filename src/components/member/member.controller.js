import angular from 'angular'
const memberCtrl = function ($rootScope, $scope, $location, Core) {
    $scope.index = 0
    $scope.selectClass = ['user_usersafe', '' +
    '', 'user_usersafe', 'user_detail_conf', 'member_notice',
        'user_usersafe', 'user_usersafe', 'user_usersafe', 'user_usersafe', 'user_usersafe', 'user_topup', 'user_usersafe'
    ]
    Core.get('agent/check_agent_register', function (json) {
        var c = angular.fromJson(json)
        if (c.code == 200) {
            if (c.data.status == 4) {
                $scope.isProxy = true
            }
        }
    }, false)
    $scope.initIndex = function () {
        if (/user_center/i.test($location.url())) {
            $scope.class = $scope.selectClass[0]
        } else if (/member_top_up/i.test($location.url())) {
            $scope.class = $scope.selectClass[1]
        } else if (/member_transaction/i.test($location.url())) {
            $scope.class = $scope.selectClass[2]
        } else if (/member_detail_set/i.test($location.url())) {
            $scope.class = $scope.selectClass[3]
        } else if (/member_notice/i.test($location.url())) {
            $scope.class = $scope.selectClass[4]
        }
        else if (/agent_apply/i.test($location.url())) {
            $scope.class = $scope.selectClass[5]
        }
        else if (/agent_info/i.test($location.url())) {
            $scope.class = $scope.selectClass[6]
        }
        else if (/agent_report/i.test($location.url())) {
            $scope.class = $scope.selectClass[7]
        }
        else if (/agent_user/i.test($location.url())) {
            $scope.class = $scope.selectClass[8]
        }
        else if (/agent_account_detail/i.test($location.url())) {
            $scope.class = $scope.selectClass[9]
        }
        else if (/agent_bet_record/i.test($location.url())) {
            $scope.class = $scope.selectClass[10]
        }
        else if (/agent_charge/i.test($location.url())) {
            $scope.class = $scope.selectClass[11]
        }
    }
    $scope.initIndex()
    $scope.navIndex = 1
    $scope.setNavIndex = function (i) {
        $scope.navIndex = i
    }
    $scope.path = $location.$$url
    $rootScope.$on('$locationChangeSuccess', function () {
        $scope.path = $location.url()
        $scope.initIndex()
    })
}

export default memberCtrl
