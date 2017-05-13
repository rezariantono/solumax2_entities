var SolumaxFileManagerShow = angular
	.module('Solumax.FileManager', [])
	.directive('fileManagerIndexModal', function(
		FileFactory,
		$sce, $http, $timeout) {

		return {
			templateUrl: $sce.trustAsResourceUrl('/solumax/file-manager/v2/file-manager-index-modal.html'),
			restrict: 'AE',
			scope: {
				displayType: "@",
				fileUuid: "@",
				fileId: "@",
			},
			link: function(scope, elem, attrs) {

				scope.modalId = Math.random().toString(36).substring(2, 7)

				scope.search = function() {
					FileFactory.index(scope.filter)
					.then(function(res) {
						scope.files = res.data.data
						scope.meta = res.data.meta
					})
				}

				scope.copyLink = function(file) {
					window.prompt("Copy to clipboard: Ctrl+C, Enter", file.full_url);
				}


			}
		}
		
	})
	.directive('fileManagerIndex', function(
		FileFactory,
		$sce, $http, $timeout) {

		return {
			templateUrl: $sce.trustAsResourceUrl('/solumax/file-manager/v2/file-manager-index.html'),
			restrict: 'AE',
			scope: {
				fileableType: "@",
				fileableId: "@",
			},
			link: function(scope, elem, attrs) {

				scope.modalId = Math.random().toString(36).substring(2, 7)

				scope.load = function() {

					FileFactory.index({fileable_type: scope.fileableType, fileable_id: scope.fileableId})
					.then(function(res) {
						scope.files = res.data.data
						scope.meta = res.data.meta
					})
				}
				scope.load()

				scope.copyLink = function(file) {
					window.prompt("Copy to clipboard: Ctrl+C, Enter", file.full_url);
				}


			}
		}
		
	})
	.directive('fileManagerShow', function(
		FileFactory,
		$sce, $http, $timeout) {

		return {
			templateUrl: $sce.trustAsResourceUrl('/solumax/file-manager/v2/file-manager-show.html'),
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
						.then(function(res) {
							scope.file = res.data.data
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
						.then(function(res) {
							scope.file = res.data.data
							scope.file.full_url = $sce.trustAsResourceUrl(scope.file.full_url)
						})
					}
				}


			}
		}
		
	})
	.directive('fileManagerUpload', function(
		FileFactory,
		$sce, $http, $timeout) {

		return {
			templateUrl: $sce.trustAsResourceUrl('/solumax/file-manager/v2/file-manager-upload.html'),
			restrict: 'AE',
			scope: {
				displayedInput: "@",
				additionalData: "@",
				validations: "@",
				
				uploadedFile: "=",
				onFileUploaded: "&"
			},
			link: function(scope, elem, attrs) {

				scope.boxId = Math.random().toString(36).substring(2, 7)

				scope.formData = {
					name: '',
					description: ''
				}

				scope.validate = function() {

					var validations = JSON.parse(scope.validations)

					if (validations.fileSize) {
						var fileSize = document.getElementById('file-manager-file-'+scope.boxId).files[0].size / 1024;
						if (validations.fileSize < fileSize) {
							alert('Ukuran file maximal ' + validations.fileSize + ' KB')
							return false
						}
					}

					return true
				}

				scope.upload = function() {

					scope.uploading = true;
					var additionalData = JSON.parse(scope.additionalData)
					var fileManagerFile = document.getElementById('file-manager-file-'+scope.boxId).files[0]

					if (typeof fileManagerFile == 'undefined') {
						alert('File belum dipilih')
						scope.uploading = false;
						return 
					}

					if (scope.validations) {
						if (!scope.validate()) {
							scope.uploading = false
							return 
						}
					}

					if (!_.isUndefined(additionalData.image) && !_.isUndefined(additionalData.image.resize) && fileManagerFile.type != "image/jpeg") {

						alert('Image harus jpg supaya dapat menggunakan di resize')
						return

					} else if (!_.isUndefined(additionalData.image) && !_.isUndefined(additionalData.image.resize) && fileManagerFile.type == "image/jpeg") {

						$.getScript('/solumax/file-manager/v2/image-tool.js', function() {

							ImageTools.resize(fileManagerFile, {
								width: additionalData.image.resize.width,
								height: additionalData.image.resize.height 
						    }, function(blob, didItResize) {
						    	var fileManagerNewFile = new File([blob], fileManagerFile.name)
						    	upload(fileManagerNewFile, additionalData)
						    })

						})

					} else {

						upload(fileManagerFile, additionalData)
					}

				}

				scope.reset = function() {
					document.getElementById("file-manager-upload-form-"+scope.boxId).reset()
				}

				function upload(file, additionalData) {

					var fd = new FormData();
					fd.append('file', file);

					_.each(additionalData, function(item, key) {
						fd.append(key, item);
					})

					for (var key in scope.formData) {
						fd.append(key, scope.formData[key]);
					}

					var config = {
						transformRequest: angular.identity,
						headers: {'Content-Type': undefined}
					}

					FileFactory.store(fd, config)
					.then(function(res) {
						scope.uploadedFile = res.data.data

						$timeout(function() {
							scope.onFileUploaded()
							scope.uploading = false
							alert('Upload berhasil')
							scope.reset()
						}, 250)
					}, function() {
						scope.uploading = false
						alert('Upload gagal')
					})
				}

				scope.display = JSON.parse(scope.displayedInput)
			}
		}
		
	})
	.factory('FileFactory', function(
		$http) {

		var fileFactory = {}

		fileFactory.store = function(formData, config) {
			return $http.post('/file-manager/file/', formData, config)
		}

		fileFactory.index = function(params) {
			return $http.get('/file-manager/file/', {params: params})
		}

		fileFactory.get = function(id) {
			return $http.get('/file-manager/file/' + id)
		}

		fileFactory.getUuid = function(id) {
			return $http.get('/file-manager/file/uuid/' + id)
		}


		return fileFactory
	})