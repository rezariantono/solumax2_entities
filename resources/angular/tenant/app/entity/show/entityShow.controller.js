app
	.controller('EntityShowController', function(
		$stateParams, $state,
		EntityModel) {

		var vm = this;

		vm.save = function(entity) {

			if ($stateParams.id) {

				EntityModel.update(entity)
				.success(function(data) {
					vm.entity = data.data;
					alert('Update berhasil');
				});

			} else {

				EntityModel.store(entity)
				.success(function(data) {
					$state.go('entityShow', {id: data.data.id});
				});
			};
		}

		vm.delete = function(entity) {

			EntityModel.delete(entity)
			.success(function() {
				alert('Berhasil dihapus');
				$state.go('entitySearch');
			});
		}

		if ($stateParams.id) {

			EntityModel.get($stateParams.id)
			.success(function(data) {
				vm.entity = data.data;
			});
		};
	});