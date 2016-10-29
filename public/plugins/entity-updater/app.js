var solumaxEntityUpdater = angular
	.module('Solumax.EntityUpdater', [])
	.directive('entityUpdaterModal', function(
		$sce, $http, $timeout) {


		var env = window.location.hostname == '192.168.0.227' ? 'dev' : 'prod'
		var domain = env == 'dev' ? 'http://192.168.0.227:10777/' : 'https://entity.hondagelora.com/'

		return {
			templateUrl: $sce.trustAsResourceUrl(domain + 'entity-updater-modal.html'),
			restrict: 'AE',
			scope: {
				entityObject: "=entity",
				entityId: "@",
				onEntityUpdated: "&",
				newPhoneNumber: "@",
			},
			link: function(scope, elem, attrs) {

				scope.modalId = "-" + Math.random().toString(36).substring(2, 7)

				if (scope.entityId) {

					$http.get(domain + 'entity/api/entity/' + scope.entityId)
					.success(function(data) {
						scope.entity = data.data
					})

				} else if (scope.entityObject) {
					scope.entity = scope.entityObject
				}

				scope.insertValues = function() {
					if (scope.newPhoneNumber) {
						scope.entity.phone_number = scope.newPhoneNumber;
					};
				}

				scope.registerNew = function() {
					window.open(domain + 'redirect-app/entity/new');
				}

				scope.openInApp = function(entity) {
					window.open(domain + 'redirect-app/entity/' + entity.id);
				}

				scope.update = function(entity) {

					$http.post(domain + 'entity/api/entity/' + entity.id, entity)
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