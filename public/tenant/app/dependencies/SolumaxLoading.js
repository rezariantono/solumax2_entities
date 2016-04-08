angular
	.module('Solumax.Loading', [])
	.directive('fullscreenLoading', function($window) {

		return {
			template: function() {

				return "<div class='text-center' style='position:fixed;width:100%;height:100%;top:0;left:0;background:white;opacity:0.5;display:flex;align-items:center;vertical-align:middle;'><i class='fa fa-spinner fa-spin fa-5x' style='margin:auto;color:black;'></i></div>";

			},
			restrict: 'AE',
			link: function(scope, elem, attrs) {
			}
		};
	});