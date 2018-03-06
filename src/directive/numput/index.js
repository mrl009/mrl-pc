export default function() {
	return {
		scope: {
			initValue: '='
		},
		restrict: 'E',
		replace: true,
		template: '<input type="text" ng-model="initValue" ng-change="initChange()"/>',
		link: function($scope) {
			$scope.initChange = function() {
				if(/\D/g.test($scope.initValue)) {
					$scope.initValue = $scope.initValue || ''
					$scope.initValue = $scope.initValue.replace(/\D+/g, '')
				}
			}
		}
	}
}