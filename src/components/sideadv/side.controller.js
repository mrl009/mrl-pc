import $ from 'jQuery'
export default function($scope) {
	$scope.close = function() {
		$('.zs_box').remove()
	}
}