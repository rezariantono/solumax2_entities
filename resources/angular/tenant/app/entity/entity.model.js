app
	.factory('EntityModel', function(
		$http,
		LinkFactory) {

		var entityModel = {};

		entityModel.index = function(filter) {
			return $http.get(LinkFactory.entity.api, {
				params: filter
			});
		}

		entityModel.get = function(entityId) {
			return $http.get(LinkFactory.entity.api + entityId);
		}

		entityModel.store = function(entity) {
			return $http.post(LinkFactory.entity.api, entity);
		}

		entityModel.update = function(entity) {
			return $http.post(LinkFactory.entity.api + entity.id, entity);
		}

		return entityModel;
	});