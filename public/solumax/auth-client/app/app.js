var solumaxAuthClient = angular
	.module('Solumax.AuthClient', ['ui.router',
		'Solumax.ErrorInterceptor', 'Solumax.JwtManager', 'Solumax.Loading',
		'Solumax.PageTitle'])
	.factory('AppFactory', function() {

		return {
			moduleId: '10000'
		}
	})