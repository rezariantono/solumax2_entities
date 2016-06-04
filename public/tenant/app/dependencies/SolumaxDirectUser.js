angular
	.module('Solumax.DirectUser', [])
	.factory('DirectUserModel', function(
		$http) {

		var directUserModel= {};

		directUserModel.index = function(filter) {
			return $http.get('http://base.hondagelora.com/base/api/user/', {params: filter});
		}

		return directUserModel;
	})