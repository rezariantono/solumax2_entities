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

		entityModel.delete = function(entity) {
			return $http.delete(LinkFactory.entity.api + entity.id);
		}

		entityModel.action = {
			editLock: function(id, data) {
				return $http.post(LinkFactory.entity.api + 'edit-lock/' + id, data);
			},
			requestDelete: function(id, data) {
				return $http.post(LinkFactory.entity.api + 'request-delete/' + id, data);
			}
		}

		return entityModel;
	});