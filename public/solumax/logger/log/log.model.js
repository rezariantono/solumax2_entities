SolumaxLoggerApp	
	.factory('LogModel', function(
		$http) {

		var logModel = {}

		var url = '/solumax/logger/log'

		logModel.index = function(query) {
			return $http.get(url, {params: query})
		}

		return logModel
	})