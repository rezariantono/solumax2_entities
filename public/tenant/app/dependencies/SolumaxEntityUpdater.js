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
				onEntityUpdated: "&",
				newPhoneNumber: "@",
			},
			link: function(scope, elem, attrs) {

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
						
						$timeout(function() {
							scope.onEntityUpdated();
						}, 250);

						alert('Update berhasil');
					});
				}


			}
		};
	});