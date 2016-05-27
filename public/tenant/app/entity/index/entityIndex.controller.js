app
	.controller('EntityIndexController', function(
		$state,
		EntityModel) {

		var vm = this;

		vm.filter = {
			paginate: true,
			page: 1,
			order: 'desc',
		};

		vm.get = function() {

			EntityModel.index(vm.filter)
			.success(function(data) {

				vm.entities = data.data;
				vm.meta = data.meta;
			});

		}

		if ($state.params.encodedQuery) {

			_.assign(vm.filter, JSON.parse(decodeURI($state.params.encodedQuery)));

			vm.get();
		};



	});