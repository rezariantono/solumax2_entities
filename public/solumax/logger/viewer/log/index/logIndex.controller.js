app
	.controller('LogIndexController', function(
		LogModel) {

		var vm = this

		vm.filter = {
			from: moment().format("YYYY-MM-DD"),
			until: moment().format("YYYY-MM-DD"),
		}

		$( "#filter_from" ).datepicker({ dateFormat: "yy-mm-dd" });
		$( "#filter_until" ).datepicker({ dateFormat: "yy-mm-dd" });
		
	})