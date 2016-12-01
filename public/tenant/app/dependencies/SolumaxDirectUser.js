angular
	.module('Solumax.DirectUser', [])
	.factory('DirectUserModel', function(
		$http) {

		var directUserModel= {};

		directUserModel.index = function(filter) {
			return $http.get('https://accounts.xolura.com/api/resources/tenant/user/profile/', {params: filter});
		}

		return directUserModel;
	})