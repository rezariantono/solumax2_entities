angular
	.module('Solumax.EntityUpdater', [])
	.directive('entityUpdaterModal', function(
		$sce, $http, $timeout,
		LinkFactory) {

		return {
			templateUrl: $sce.trustAsResourceUrl(LinkFactory.entity.base + 'entity-updater-modal.html'),
			restrict: 'AE',
			scope: {
				entity: "=",
				entityId: "@",
				onEntityUpdated: "&",
				newPhoneNumber: "@",
			},
			link: function(scope, elem, attrs) {

				scope.modalId = "-" + Math.random().toString(36).substring(2, 7)

				if (scope.entityId) {

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
					window.open(LinkFactory.entity.base + 'redirect-app/entity/' + entity.id);
				}

				scope.update = function(entity) {

					$http.post(LinkFactory.entity.base + 'entity/api/entity/' + entity.id, entity)
					.success(function(data) {
						
						scope.entity = data.data;
						
						alert('Update berhasil');

						$timeout(function() {
							scope.onEntityUpdated();
						}, 250);


					});
				}


			}
		};
	});