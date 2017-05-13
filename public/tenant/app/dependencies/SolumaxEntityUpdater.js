angular
	.module('Solumax.EntityUpdater', ['Solumax.AppTransfer'])
	.directive('entityUpdaterModal', function(
		$sce, $http, $timeout,
		LinkFactory, GenerateLink) {


		// This version 2 of entity updater supports only injecting entity id now
		// 
		return {
			templateUrl: $sce.trustAsResourceUrl(LinkFactory.entity.base + 'entity-updater-modal.html'),
			restrict: 'AE',
			scope: {
				selectedEntity: "=entity",
				entityId: "@",
				onEntityUpdated: "&",
				newPhoneNumber: "@",
			},
			link: function(scope, elem, attrs) {

				scope.modalId = "-" + Math.random().toString(36).substring(2, 7)

				if (typeof scope.selectedEntity != 'undefined') {

					scope.entity = scope.selectedEntity

				} else if (scope.entityId) {

					$http.get(LinkFactory.entity.base + 'entity/api/entity/' + scope.entityId)
					.success(function(data) {
						scope.entity = data.data
					})

				}

				scope.insertValues = function() {
					if (scope.newPhoneNumber) {
						scope.entity.phone_number = scope.newPhoneNumber;
					};
				}

				scope.registerNew = function() {
					window.open(LinkFactory.entity.base + 'redirect-app/entity/new');
				}

				scope.openInApp = function(entity) {
					window.open(GenerateLink.redirectWithJwt(LinkFactory.entity.base + 'redirect-app/entity/' + entity.id));
				}

				scope.update = function(entity) {

					$http.post(LinkFactory.entity.base + 'entity/api/entity/' + entity.id, entity)
					.success(function(data) {
						
						scope.entity = data.data;
						scope.selectedEntity = data.data;
						
						alert('Update berhasil');

						$timeout(function() {
							scope.onEntityUpdated();
						}, 250);


					});
				}


			}
		};
	});