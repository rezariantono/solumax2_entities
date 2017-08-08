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
		.state('entitySearch', {
			url: '/entity/search',
  			templateUrl: 'app/entity/search/entitySearch.html',
  			controller: 'EntitySearchController as ctrl',
  			pageTitle: 'Pencarian Contact'
		})
		.state('entityIndex', {
			url: '/entity/index/:encodedQuery',
  			templateUrl: 'app/entity/index/entityIndex.html',
  			controller: 'EntityIndexController as ctrl',
  			pageTitle: 'Daftar Contact'
		})
		.state('entityReport', {
			url: '/entity/report',
  			templateUrl: 'app/entity/report/entityReport.html',
  			controller: 'EntityReportController as ctrl',
  			pageTitle: 'Entity Report'
		})
		.state('entityLog', {
			url: '/entity/log/:id',
  			templateUrl: 'app/entity/log/entityLog.html',
  			controller: 'EntityLogController as ctrl',
  			pageTitle: 'Entity Log'
		})

		.state('relationshipIndex', {
			url: '/relationship/index/:encodedQuery',
  			templateUrl: 'app/relationship/index/relationshipIndex.html',
  			controller: 'RelationshipIndexController as ctrl',
  			pageTitle: 'Daftar Relations'
		})
	});