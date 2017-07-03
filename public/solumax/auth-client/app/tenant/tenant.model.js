solumaxAuthClient
	.factory('TenantModel', function(
		$http) {

		var tenantModel = {}

		var  base = '/auth-client/api/tenant/'

		tenantModel.register = function(params) {
			return $http.post(base + 'migrate/', params)
		}

		return tenantModel
	})