angular
	.module('Solumax.Pagination', [])
	.directive('pagination', function(
		$timeout) {

		return {
			template: '<nav ng-if="pagination" class="text-center"><ul class="pagination"> <li ng-if="pagination.current_page > 1"><a ng-click="loadPage(pagination.current_page - 1)" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li> <li class="disabled"><span>Halaman ke <input class="form-not-applied" type="number" ng-model="pagination.current_page" ng-blur="loadPage(pagination.current_page)" style="max-width:5em;" min="1"> dari {{pagination.total_pages}} ({{pagination.total}} total data; {{pagination.per_page}} data per halaman)</span></li> <li ng-if="pagination.current_page < pagination.total_pages"><a ng-click="loadPage(pagination.current_page + 1)" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li></ul></nav>',
			restrict: 'E',
			scope: {
				pagination: '=', // pased from view to directive
				page: '=', // passed from directive to view
				onLoadPage: '&' // called by directive
			},
			transclude: true,
			link: function(scope, elem, attrs) {

				scope.previousPages = function() {

					var latestPage = 2
					var pages = [
					]
					
					while (scope.pagination.current_page > 1 && pages.length <= 5 && latestPage > 1) {

						if (pages.length == 0) {
							latestPage = scope.pagination.current_page
						}

						latestPage = latestPage - 1
						pages.unshift({page: latestPage})
					}

					console.log(pages)

					return pages
				}

				scope.loadPage = function(page) {

					scope.page = page

					$timeout(function() {
						scope.onLoadPage();
					}, 250);
				}

			}
		};
	})
	