app
	.controller('EntityReportController', function(
		LinkFactory, JwtValidator,
		EntityModel) {

		var vm = this

		vm.download = function(filter) {

			filter.jwt = JwtValidator.encodedJwt
			filter.limit = 300

			window.open(LinkFactory.entity.report + '?' + $.param(filter))

		}

	})