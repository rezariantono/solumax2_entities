angular
	.module('Solumax.PageTitle', [])
	.run(function($rootScope, $state) {

		$rootScope.$on('$stateChangeSuccess', function () {
			$rootScope.pageTitle = $state.current.pageTitle;
		});
	});