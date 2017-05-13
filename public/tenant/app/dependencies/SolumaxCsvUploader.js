angular
	.module('Solumax.CsvUploader', [])
	.factory('CsvUploader', function(
		$q) {

		// Cara pakai uploader
		// 

		var csvUploader = {}

		csvUploader.results = null

		csvUploader.parse = function(file, injectedConfig) {

			var config = {
				header: true,
				skipEmptyLines: true
			}

			if (_.isObject(injectedConfig)) {
				_.assign(config, injectedConfig)
			}

			return $q(function(resolve, reject) {

				config.complete = function(results) {
					csvUploader.results = results
					resolve(results)
				}

				config.error = function(err) {
					reject(err)
				}

				Papa.parse(file, config)
			})
			
		}


		csvUploader.upload = function(data, config) {

			// Pass upload function in config with success / error callback

			csvUploader.uploading = true;

			csvUploader.data = data
			csvUploader.dataCount = data.length
			csvUploader.uploadCount = 0

			uploadSingleContinous(csvUploader.data[csvUploader.uploadCount], config);
		}

		uploadSingleContinous = function(data, config) {

			if (typeof data.validation_status != 'undefined' && !data.validation_status) {

				triggerNext(data, config)
			}

			config.upload(data)
			.success(function(response) {
				data.status = 1
				data.response = response

				triggerNext(data, config)
			})
			.error(function(errors) {
				data.status = 0
				data.errors = errors

				triggerNext(data, config)
			})
		}

		function triggerNext(data, config) {

			csvUploader.uploadCount += 1

			if (csvUploader.dataCount > csvUploader.uploadCount) {

				uploadSingleContinous(csvUploader.data[csvUploader.uploadCount], config);
			
			} else {

				csvUploader.uploading = false;
			}
		}

		return csvUploader
	})