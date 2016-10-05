app
	.config(function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/log/index');

		$stateProvider
		.state('index', {
			url: '/index',
  			templateUrl: 'index/index.html',
  			controller: 'IndexController as ctrl',
  			requireLogin: false,
  			pageTitle: 'Log Viewer'
		})

		.state('logIndex', {
			url: '/log/index',
  			templateUrl: 'log/index/logIndex.html',
  			controller: 'LogIndexController as ctrl',
  			pageTitle: 'Log Viewer'
		})

	});