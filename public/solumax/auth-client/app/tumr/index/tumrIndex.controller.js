solumaxAuthClient
	.controller('TumrIndexController', function(
		TumrModel) {

		var vm = this

		vm.load = function(withUser) {

			var params = {}

			if (withUser) {
				params.with_user = true
			}

			TumrModel.index(params)
			.success(function(data) {
				vm.tumrs = data.data
			})
		}
		vm.load()

		vm.delete = function(tumr) {

			TumrModel.delete(tumr.key)
			.success(function(data) {
				alert('Berhasil')
			})
		}
	})