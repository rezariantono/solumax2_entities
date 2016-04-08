var app = angular
	.module('TenantApp', ['ui.router', 'Solumax.ErrorInterceptor', 'Solumax.JwtManager', 'Solumax.Loading', 'Solumax.TenantDatabaseConnection'])
	.factory('AppFactory', function() {

		var appFactory = {};

		appFactory.moduleId = '10777';

		return appFactory;
	});