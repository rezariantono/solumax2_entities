app
	.factory('EntityRelationshipModel', function(
		$http,
		LinkFactory) {

		var entityRelationshipModel = {};

		entityRelationshipModel.index = function(params) {
			return $http.get(LinkFactory.entityRelationship.api, {params: params});
		}

		entityRelationshipModel.store = function(entityRelationship) {
			return $http.post(LinkFactory.entityRelationship.api, entityRelationship);
		}

		entityRelationshipModel.delete = function(params) {
			return $http.delete(LinkFactory.entityRelationship.api, {params: params});
		}

		return entityRelationshipModel;
	});