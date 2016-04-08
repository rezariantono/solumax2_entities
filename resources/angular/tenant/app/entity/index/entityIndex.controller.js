app
	.controller('EntityIndexController', function(
		EntityModel) {

		var vm = this;

		vm.filter = {
			paginate: 20,
			page: 1,
			pageIncrease: function() {
				this.page++;
			},
			pageDecrease: function() {
				this.page--;
			}
		};

		vm.search = function(filter) {

			$('#filterModal').modal('hide');
			vm.loading = true;

			EntityModel.index( _.omit(filter, ['pageIncrease', 'pageDecrease']) )
			.success(function(data) {
				
				vm.entities = data.data;
				vm.meta = data.meta;

				vm.loading = false;
			});

		}
	});