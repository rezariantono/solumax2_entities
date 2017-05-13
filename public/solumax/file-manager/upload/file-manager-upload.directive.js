var SolumaxFileManagerUpload = angular
	.module('Solumax.FileManagerUpload', [])
	.directive('fileManagerUpload', function(
		FileFactory,
		$sce, $http, $timeout) {

		return {
			templateUrl: $sce.trustAsResourceUrl('/solumax/file-manager/upload/file-manager-upload.html'),
			restrict: 'AE',
			scope: {
				displayedInput: "@",
				additionalData: "@",
				validations: "@",
				
				uploadedFile: "=",
				onFileUploaded: "&"
			},
			link: function(scope, elem, attrs) {

				scope.boxId = "-" + Math.random().toString(36).substring(2, 7)

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

					if (typeof document.getElementById('file-manager-file-'+scope.boxId).files[0] == 'undefined') {
						alert('File belum dipilih')
						return 
					}

					if (scope.validations) {
						if (!scope.validate()) {
							scope.uploading = false
							return 
						}
					}

					var fd = new FormData();
					fd.append('file', document.getElementById('file-manager-file-'+scope.boxId).files[0]);

					_.each(JSON.parse(scope.additionalData), function(item, key) {
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
					.success(function(data) {
						scope.uploadedFile = data.data

						$timeout(function() {
							scope.onFileUploaded()
							scope.uploading = false
							alert('Upload berhasil')
						}, 250)
					})
					.error(function() {
						scope.uploading = false
						alert('Upload gagal')
					})
				}

				scope.reset = function() {
					document.getElementById("file-manager-upload-form-"+scope.boxId).reset()
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

		fileFactory.get = function(id) {
			return $http.get('/file-manager/file/' + id)
		}

		fileFactory.getUuid = function(formData, config) {
			return $http.get('/file-manager/file/uuid/' + id)
		}


		return fileFactory
	})


	// Setting

	// var x = {
	// 	displayedInput: JSON.stringify({
	// 		name: { label : "Nama", show : true },
	// 		file: { label : "Invoice", show : true },
	// 		reset: {show: true}
	// 	}),
	// 	additionalData: JSON.stringify({
	// 		image: JSON.stringify({ resize: {height: 500, width: 500}}),
	// 		path: 'purchases',
	// 		subpath: $stateParams.purchaseHeaderId,
	// 		filename: 'invoice',
	// 	})
	// }