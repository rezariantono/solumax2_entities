app
	.config(function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/index');

		$stateProvider
		.state('index', {
			url: '/index',
  			templateUrl: 'app/index/index.html',
  			controller: 'IndexController as ctrl',
  			requireLogin: false,
  			pageTitle: 'Contact Management'
		})


		.state('entityCreate', {
			url: '/entity/create',
  			templateUrl: 'app/entity/show/entityShow.html',
  			controller: 'EntityShowController as ctrl',
  			pageTitle: 'Contact'
		})
		.state('entityShow', {
			url: '/entity/show/:id?',
  			templateUrl: 'app/entity/show/entityShow.html',
  			controller: 'EntityShowController as ctrl',
  			pageTitle: 'Contact'
		})
		.state('entityIndex', {
			url: '/entity/index',
  			templateUrl: 'app/entity/index/entityIndex.html',
  			controller: 'EntityIndexController as ctrl',
  			pageTitle: 'Daftar Contact'
		});
	});