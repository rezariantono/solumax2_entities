solumaxAuthClient
	.config(function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/index');

		$stateProvider
		.state('index', {
			url: '/index',
  			templateUrl: 'app/index/index.html',
  			controller: 'IndexController as ctrl',
  			requireLogin: false,
  			pageTitle: 'Index'
		})

		.state('tumrIndex', {
			url: '/tumr/index',
  			templateUrl: 'app/tumr/index/tumrIndex.html',
  			controller: 'TumrIndexController as ctrl',
  			pageTitle: 'TUMR Index'
		})

		.state('tenantRegistration', {
			url: '/tenant/registration',
  			templateUrl: 'app/tenant/registration/tenantRegistration.html',
  			controller: 'TenantRegistrationController as ctrl',
  			pageTitle: 'Tenant Registration'
		})
	});