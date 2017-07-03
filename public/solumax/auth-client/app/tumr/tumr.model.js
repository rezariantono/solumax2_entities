solumaxAuthClient
	.factory('TumrModel', function(
		$http) {

		var tumrModel = {}

		var  base = '/auth-client/api/tumr/'

		tumrModel.index = function(params) {
			return $http.get(base, params)
		}

		tumrModel.delete = function(key) {
			return $http.delete(base + key)
		}

		return tumrModel
	})