app
	.controller('EntityLogController', function(
		$state,
		LogModel) {

		var vm = this

		vm.entityId = $state.params.id;

		LogModel.index({loggable_type: 'Entity', loggable_id: vm.entityId})
		.success(function(data) {
			vm.logs = data.data
		})
	})