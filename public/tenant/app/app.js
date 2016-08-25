var app = angular
	.module('Solumax.Entities', ['ui.router',
		'Solumax.ErrorInterceptor', 'Solumax.JwtManager', 'Solumax.Loading',
		'Solumax.TenantDatabaseConnection', 'Solumax.EntityFinder', 'Solumax.DirectUser',
		'Solumax.Logger'])
	.factory('AppFactory', function() {

		var appFactory = {};

		appFactory.moduleId = '10777';

		return appFactory;
	});

app
	.run(function($rootScope, $state) {

		$rootScope.$on('$stateChangeSuccess', function () {
			$rootScope.pageTitle = $state.current.pageTitle;
		});
	});