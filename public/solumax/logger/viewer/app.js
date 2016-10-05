var app = angular
	.module('Solumax.LogViewer', ['ui.router', 'angular-jwt',
		'Solumax.ErrorInterceptor', 'Solumax.JwtManager', 'Solumax.Loading',
		'Solumax.TenantDatabaseConnection'])