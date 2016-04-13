angular
	.module('Solumax.EntityFinder', [])
	.directive('entityFinderModal', function(
		$sce, $http, $timeout,
		LinkFactory) {

		return {
			templateUrl: $sce.trustAsResourceUrl(LinkFactory.entity.base + 'entity-finder-modal.html'),
			restrict: 'AE',
			scope: {
				selectedEntity: "=",
				onEntitySelected: "&"
			},
			link: function(scope, elem, attrs) {

				scope.registerNewEntity = function() {
					window.open(LinkFactory.entity.base + 'redirect-app/entity/new');
				}

				scope.openInApp = function(entity) {
					window.open(LinkFactory.entity.base + 'redirect-app/entity/' + entity.id);
				}

				scope.select = function(entity) {

					scope.selectedEntity = entity;
					$timeout(function() {
						scope.onEntitySelected();
					}, 250);

					$('#entityFinderModal').modal('hide');
				}

				scope.search = function() {

					$http.get(LinkFactory.entity.base + 'entity/api/entity/', {
						params: _.omit(scope.filter, ['pageIncrease', 'pageDecrease'])
					})
					.success(function(data) {
						
						scope.entities = data.data;
						scope.meta = data.meta;
					});
				}

				scope.filter = {
					paginate: 20,
					page: 1,
					pageIncrease: function() {
						this.page++;
					},
					pageDecrease: function() {
						this.page--;
					}
				};

			}
		};
	})
	.factory('ExternalEntityModel', function(
		$http, LinkFactory) {

		var externalEntityModel = {};

		externalEntityModel.get = function(id) {
			return $http.get(LinkFactory.entity.base + 'entity/api/entity/' + id);
		}

		return externalEntityModel;
	});