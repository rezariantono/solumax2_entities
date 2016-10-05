var SolumaxLoggerApp = angular
	.module('Solumax.Logger', [])
SolumaxLoggerApp	
	.factory('LogModel', function(
		$http) {

		var logModel = {}

		var url = '/solumax/logger/api/log'

		logModel.index = function(query) {
			return $http.get(url, {params: query})
		}

		return logModel
	})