angular
	.module('Solumax.TenantDatabaseConnection', ['Solumax.JwtManager'])
	.directive('tenantSelect', function($compile, $injector, 
		$location,
		AppFactory, LinkFactory, JwtValidator) {

		return {
			template: function() {

				return '<a style="text-decoration:none;" class="text-warning" ng-href="{{tenantSelectUrl}}">{{insideText}}</a>';
			},
			restrict: 'AE',
			link: function(scope, elem, attrs) {

				scope.tenantSelectUrl = LinkFactory.authentication.tenantSelect +
				'?redirect=' + encodeURIComponent(document.URL.replace(/#.*$/, "")) +
				'&module_id=' + AppFactory.moduleId +
				'&jwt=' + JwtValidator.encodedJwt;

				if (JwtValidator.decodedJwt) {
					
					if (JwtValidator.decodedJwt.selected_tenant_id) {
						scope.insideText = JwtValidator.decodedJwt.selected_tenant_name;
					} else {
						scope.insideText = 'Pilih Tenant'
					};

				} else {
					scope.insideText = 'Login'
					scope.tenantSelectUrl = LinkFactory.authentication.login + '?redirect=' +
						encodeURIComponent(document.URL.replace(/#.*$/, ""));
				};

			}
		};
	})
	.service('TenantSelectionInterceptor', function($q) {

		var interceptors = {};

		interceptors.responseError =  function(res) {

			if (res.status == 400 && res.data == 'Tenant belum dipilih') {
				alert('Tenant belum dipilih. Silahkan pilih tenant dahulu.');
			};

			return $q.reject(res);
		}

		return interceptors;

	})
	.config(function($httpProvider) {
		$httpProvider.interceptors.push('TenantSelectionInterceptor');		
	});;