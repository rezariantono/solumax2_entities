angular
	.module('Solumax.TenantDatabaseConnection', ['Solumax.JwtManager'])
	.directive('tenantSelect', function($compile, $injector, 
		$location,
		AppFactory, LinkFactory, JwtValidator) {

		return {
			template: function() {

				return '<a style="text-decoration:none;" class="text-warning" ng-click="selectTenant()" ng-if="!notLoggedIn">{{insideText}}</a>';
			},
			restrict: 'AE',
			link: function(scope, elem, attrs) {

				scope.selectTenant = function() {

					if (!JwtValidator.decodedJwt) {
						JwtValidator.login();
						return;
					}

					var uri = new URI(window.location.href);
					var hash = uri.hash();

					var search = {
						'redirect': uri.fragment(""),
						'module_id': AppFactory.moduleId,
						'jwt': JwtValidator.encodedJwt,
						'state': hash
					};

					window.location.href = new URI(LinkFactory.authentication.tenantSelect).search(search).toString();

				}

				if (JwtValidator.decodedJwt) {
					
					if (JwtValidator.decodedJwt.selected_tenant_id) {
						scope.insideText = JwtValidator.decodedJwt.selected_tenant_name;
					} else {
						scope.insideText = 'Pilih Tenant'
					};

				} else {
					scope.notLoggedIn = true;
					scope.insideText = 'Login'
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