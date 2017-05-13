var SolumaxFileManagerShow = angular
	.module('Solumax.FileManagerShow', [])
	.directive('fileManagerShow', function(
		FileFactory,
		$sce, $http, $timeout) {

		return {
			templateUrl: $sce.trustAsResourceUrl('/solumax/file-manager/show/file-manager-show.html'),
			restrict: 'AE',
			scope: {
				displayType: "@",
				fileUuid: "@",
				fileId: "@",
			},
			link: function(scope, elem, attrs) {

				scope.$watch(function() {
					return scope.fileUuid
				}, function(value) {
					scope.loadByUuid()
				})

				scope.loadByUuid = function() {

					if (!_.isUndefined(scope.fileUuid) && !_.isEmpty(scope.fileUuid)) {

						FileFactory.getUuid(scope.fileUuid)
						.success(function(data) {
							scope.file = data.data
							scope.file.full_url = $sce.trustAsResourceUrl(scope.file.full_url)
						})
						
					} 
				}

				scope.$watch(function() {
					return scope.fileId
				}, function(value) {
					scope.loadById()
				})


				scope.loadById = function() {

					if (!_.isUndefined(scope.fileId) && !_.isEmpty(scope.fileId)) {
						
						FileFactory.get(scope.fileId)
						.success(function(data) {
							scope.file = data.data
							scope.file.full_url = $sce.trustAsResourceUrl(scope.file.full_url)
						})
					}
				}


			}
		}
		
	})
	.factory('FileFactory', function(
		$http) {

		var fileFactory = {}

		fileFactory.store = function(formData, config) {
			return $http.post('/file-manager/file/', formData, config)
		}

		fileFactory.get = function(id) {
			return $http.get('/file-manager/file/' + id)
		}

		fileFactory.getUuid = function(id) {
			return $http.get('/file-manager/file/uuid/' + id)
		}


		return fileFactory
	})