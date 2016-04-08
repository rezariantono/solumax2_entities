app
	.factory('EntityModel', function(
		$http,
		LinkFactory) {

		var entityModel = {};

		entityModel.index = function(filter) {
			return $http.get(LinkFactory.entity.base, {
				params: filter
			});
		}

		entityModel.get = function(entityId) {
			return $http.get(LinkFactory.entity.base + entityId);
		}

		entityModel.store = function(entity) {
			return $http.post(LinkFactory.entity.base, entity);
		}

		entityModel.update = function(entity) {
			return $http.post(LinkFactory.entity.base + entity.id, entity);
		}

		return entityModel;
	});