solumaxAuthClient
	.controller('TenantRegistrationController', function(
		TenantModel) {

		var vm = this

		vm.params = {}

		vm.execute = function() {
			TenantModel.register(vm.params)
			.then(function(res) {
				alert('Berhasil')
			}, function(res) {
				alert('Gagal')
			})
		}
	})