app
	.factory('LogModel', function(
		$http,
		LinkFactory) {

		var logModel = {}

		logModel.index = function(query) {
			return $http.get(LinkFactory.log.base, {params: query})
		}

		return logModel
	})