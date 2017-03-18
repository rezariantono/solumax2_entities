var solumaxEntityFinder = angular
	.module('Solumax.EntityFinder', [])
	.directive('entityFinderModal', function(
		$sce, $http, $timeout,
		ExternalEntityModel) {

		return {
			templateUrl: $sce.trustAsResourceUrl(ExternalEntityModel.links.domain + 'entity-finder-modal.html'),
			restrict: 'E',
			scope: {
				selectedEntity: "=",
				additionalParams: "@",
				onEntitySelected: "&",
				searchOnly: "@"
			},
			link: function(scope, elem, attrs) {

				scope.modalId = "-" + Math.random().toString(36).substring(2, 7)

				scope.registerNewEntity = function() {
					window.open(ExternalEntityModel.links.redirectApp.new);
				}

				scope.openInApp = function(entity) {
					window.open(ExternalEntityModel.links.redirectApp.openById + entity.id);
				}

				scope.select = function(entity) {

					scope.selectedEntity = entity;
					$timeout(function() {
						scope.onEntitySelected();
					}, 250);

					$('#entityFinderModal' + scope.modalId).modal('hide');
				}

				scope.search = function() {

					if (scope.additionalParams) {
						_.assign(scope.filter, JSON.parse(scope.additionalParams))
					}

					ExternalEntityModel.index(_.omit(scope.filter, ['pageIncrease', 'pageDecrease']))
					.success(function(data) {
						
						scope.entities = data.data;
						scope.meta = data.meta;
					});
				}

				scope.filter = {
					paginate: 20,
					page: 1,
					order: 'likeness',
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

		var env = window.location.hostname == '192.168.0.227' ? 'dev' : 'prod'
		var domain = env == 'dev' ? 'http://192.168.0.227:10777/' : 'https://entity.hondagelora.com/'

		var externalEntityModel = {};

		externalEntityModel.index = function(params) {
			return $http.get(domain + 'entity/api/entity/', {params: params});
		}

		externalEntityModel.get = function(id) {
			return $http.get(domain + 'entity/api/entity/' + id);
		}

		externalEntityModel.links = {
			domain: domain,
			redirectApp: {
				openById: domain + 'redirect-app/entity/',
				new: domain + 'redirect-app/entity/new',
			}
		}

		return externalEntityModel;
	});