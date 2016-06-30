angular
	.module('SolumaxAppTransfer', [])
	.directive('appTransfer', function(
		LinkFactory, JwtValidator) {

		return {
			template: function() {
				return '<a style="text-decoration:none;" ng-href="{{url}}" target="_blank">{{text}}</a>';
			},
			restrict: 'AE',
			scope: {
				text: "@",
				linkFactoryPath: "@",
				resourceId: "=",
				params: "=",
			},
			link: function(scope, elem, attrs) {

				var baseLink = _.get(LinkFactory, scope.linkFactoryPath);

				if (!_.isObject(scope.params)) {
					scope.params = {};
				};

				scope.params.jwt = JwtValidator.encodedJwt;

				scope.url = new URI(baseLink + scope.resourceId).search(scope.params).toString();
			}
		};
	})