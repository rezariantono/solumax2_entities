angular
	.module('Solumax.AppTransfer', [])
	.directive('appTransfer', function(
		LinkFactory, JwtValidator) {

		return {
			template: function() {
				return '<a style="text-decoration:none;" ng-href="{{url}}" target="_blank"><ng-transclude></ng-transclude>{{text}}</a>';
			},
			restrict: 'AE',
			scope: {
				text: "@",
				linkFactoryPath: "@",
				resourceId: "=",
				params: "=",
			},
			transclude: true,
			link: function(scope, elem, attrs) {

				var baseLink = _.get(LinkFactory, scope.linkFactoryPath);

				console.log(baseLink)

				if (!_.isObject(scope.params)) {
					scope.params = {};
				};

				scope.params.jwt = JwtValidator.encodedJwt;

				scope.url = new URI(baseLink + scope.resourceId).search(scope.params).toString();
			}
		};
	})