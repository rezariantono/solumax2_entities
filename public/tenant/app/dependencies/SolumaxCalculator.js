angular
	.module('Solumax.Calculator', [])
	.directive('autoCalculator', function() {

		// tinggal masukin seperti ini auto-calculator="ctrl.a+ctrl.b"

		return {
			restrict: 'A',
			scope: false,
			require: 'ngModel',
			link: function(scope, element, attrs, ngModel) {

				var controllerScope = attrs.controllerScope || 'ctrl'

				var arrayCalculations = _.split(attrs.autoCalculator, /([\+\*\-\/\(\)\|])+/g );

				function calculate() {

					var string = _.replace(attrs.autoCalculator, /(ctrl\.)/g, 'scope.ctrl.')
					return eval(string)

				}

				scope.$watchGroup(_.filter(arrayCalculations, function(calculation) { return _.startsWith(calculation, controllerScope) }), function(newVal, oldVal) {

					ngModel.$setViewValue(calculate())
					ngModel.$render() 

				})
			}
		}
	})
	.directive('manualCalculator', function() {

		return {
			restrict: 'A',
			scope: false,
			require: 'ngModel',
			link: function(scope, element, attrs, ngModel) {

				function calculate() {

					var string = _.replace(attrs.calculation, /(ctrl\.)/g, 'scope.ctrl.')
					return eval(string)

				}

				scope.$watch(attrs.trigger, function() {

					ngModel.$setViewValue(calculate())
					ngModel.$render() 

				}, true)
			
			}
		}
	})