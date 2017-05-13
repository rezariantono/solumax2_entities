angular
	.module('Solumax.Pagination', [])
	.directive('pagination', function(
		$timeout) {

		return {
			template: '<nav ng-if="pagination" class="text-center"><ul class="pagination"><li ng-if="pagination.current_page > 1"><a ng-click="loadPage(pagination.current_page - 1)" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li><li class="disabled"><span>Halaman ke {{pagination.current_page}} dari {{pagination.total_pages}} ({{pagination.total}} total data; {{pagination.per_page}} data per halaman)</span></li><li ng-if="pagination.current_page < pagination.total_pages"><a ng-click="loadPage(pagination.current_page + 1)" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li></ul></nav>',
			restrict: 'E',
			scope: {
				pagination: '=', // pased from view to directive
				page: '=', // passed from directive to view
				onLoadPage: '&' // called by directive
			},
			transclude: true,
			link: function(scope, elem, attrs) {

				scope.loadPage = function(page) {

					scope.page = page

					$timeout(function() {
						scope.onLoadPage();
					}, 250);
				}

			}
		};
	})
	