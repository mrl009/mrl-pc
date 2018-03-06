import $ from 'jQuery'
import './paginate.css'
export default function(
    $timeout,
    $compile,
    Core,
    $state,
    $httpParamSerializer,
    $rootScope
) {
    return {
        scope: {
        	pagesize: '@',
        	total: '@',
        	goparam: '@',
        	currentpage: '@'
        },
        restrict: 'E',
        template: '<ul class="pagination pagination-lg clearfix"></ul>',
        replace: true,
        link: function($scope, $elem, $attr) {
    		$attr.$observe('total', function(val) {
    			if(val) {
    				$scope.total = val
    			}
    		})
    		$attr.$observe('currentpage', function(val) {
    			if(val) {
    				$scope.currentpage = val
    			}
    		})
    		$attr.$observe('goparam', function(val) {
    			if(val) {
    				$scope.goparam = val
    			}
    		})
    		$attr.$observe('pagesize', function(val) {
    			if(val) {
    				$scope.pagesize = val
    			}
    		})

    		$scope.initPaginate = function() {
    			$scope.pageSize = Number($scope.pagesize)
	            $scope.currentPage = Number($scope.currentpage)
	            $scope.totalPage = $scope.total % $scope.pageSize == 0 ? $scope.total/$scope.pageSize : Math.ceil($scope.total/$scope.pageSize)
	            $scope.totalPageArr = Core.createArr($scope.totalPage)
	            $scope.goParam = JSON.parse($scope.goparam)
	            $scope.goNext = function(nextPage) {
	            	if(nextPage <= 0 || nextPage >= $scope.totalPage + 1) {
	            		return
	            	}

	            	$scope.goParam.page = nextPage
                    if($scope.goParam.mode == 'page') {
                        $state.go($scope.goParam.url, $scope.goParam)
                    } else if($scope.goParam.mode == 'datagrid') {
                        $scope.currentPage = nextPage
                        $scope.params = Object.assign({}, $scope.goParam)
                        delete $scope.params.url
                        delete $scope.params.mode
                        delete $scope.params.dataCache

                        Core.get($scope.goParam.url + '?' + $httpParamSerializer($scope.params), function(json) {
                            $rootScope[$scope.goParam.dataCache] = json
                        })
                    }
	            }
	            $scope.pageTpl = `
					<li class="page-btn page-pre">
						<a href="javascript:;" ng-click="goNext(currentPage - 1)" ng-disabled="currentPage == 1">«</a>
					</li>
					<li class="page-btn pbtn" ng-repeat="i in totalPageArr track by $index">
						<a href="javascript:;" ng-click="goNext(i+1)" ng-class="{current: i+1 == currentPage}">{{i + 1}}</a>
					</li>
					<li class="page-btn page-next">
						<a href="javascript:;" ng-click="goNext(currentPage + 1)" ng-disabled="currentPage == totalPage">»</a>
					</li>
	            `
               $elem.append($compile($scope.pageTpl)($scope))

	            $timeout(function() {
	            	$scope.width = 0
		            $($elem).find('.page-btn').each(function() {
		            	$scope.width += $(this).width()
		            })
		            $elem.css({width: $scope.width + 'px'})
	            })
    		}

    		const _innerFn = function() {
    			if(!$scope.pagesize || !$scope.total || !$scope.goparam || !$scope.currentpage) {
    				const _timer = $timeout(function() {
    					$timeout.cancel(_timer)
    					_innerFn()
    				}, 10)
    			} else {
    				$scope.initPaginate()
    			}
    		}
    		_innerFn()
        }
    }
}