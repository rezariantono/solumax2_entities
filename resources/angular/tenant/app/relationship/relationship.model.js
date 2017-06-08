app
	.factory('RelationshipModel', function(
		$http,
		LinkFactory) {

		var relationshipModel = {};

		relationshipModel.index = function(params) {
			return $http.get(LinkFactory.relationship.api, {params: params});
		}

		relationshipModel.get = function(relationshipId) {
			return $http.get(LinkFactory.relationship.api + relationshipId);
		}

		relationshipModel.store = function(relationship) {
			return $http.post(LinkFactory.relationship.api, relationship);
		}

		relationshipModel.update = function(id, relationship) {
			return $http.post(LinkFactory.relationship.api + id, relationship);
		}

		relationshipModel.delete = function(relationship) {
			return $http.delete(LinkFactory.relationship.api + relationship.id);
		}

		return relationshipModel;
	});