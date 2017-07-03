angular
	.module('Solumax.PageTitle', [])
	.run(function($rootScope, $state) {

		$rootScope.$on('$stateChangeSuccess', function () {
			$rootScope.pageTitle = $state.current.pageTitle;
		});


		$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {

			var elements = document.getElementsByClassName('modal');

			for (var i = elements.length - 1; i >= 0; i--) {

				if ($('#' + elements[i].id).hasClass('in')) {
					$('#' + elements[i].id).modal('hide')
					event.preventDefault()
				}
			}

		})
	});