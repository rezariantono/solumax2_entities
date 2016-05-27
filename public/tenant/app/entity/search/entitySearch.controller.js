app
	.controller('EntitySearchController', function(
		$state,
		EntityModel) {

		var vm = this;

		vm.open = function(id) {
			$state.go('entityShow', {id: id});
		}
	});