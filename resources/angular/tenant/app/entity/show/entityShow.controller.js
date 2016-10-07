app
	.controller('EntityShowController', function(
		$stateParams, $state,
		EntityModel, DirectUserModel) {

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

		vm.action = {
			requestDelete: function(entity, requestDelete) {
				EntityModel.action.requestDelete(entity.id, {request_delete: requestDelete})
				.success(function(data) {
					vm.entity = data.data
				})
			},
			editLock: function(entity, editLock) {
				EntityModel.action.editLock(entity.id, {edit_lock: editLock})
				.success(function(data) {
					vm.entity = data.data
				})
			}
		}

		vm.findDirectUser = function(email) {

			DirectUserModel.index({email: email})
			.success(function(data) {
				if (data.data.length > 0) {
					var foundUser = data.data[0];
					alert('User ditemukan dengan ID: ' + foundUser.id + ' Nama: ' + foundUser.name);
					vm.entity.user_id = foundUser.id;
				};
			})
		}

		if ($stateParams.id) {

			EntityModel.get($stateParams.id)
			.success(function(data) {
				vm.entity = data.data;
			});
		};
	});