angular
	.module('Solumax.Messenger', [])
	.directive('whatsappMessenger', function() {

		return {
			template: '<button ng-show="phone" class="btn btn-block btn-success" style="background-color: #42f4c2; color: #000000; border-radius: 5px; border: 0px;" ng-click="send()"> <i class="fa fa-whatsapp" aria-hidden="true"></i> Kirim WA ke {{ phone }}</button>',
			scope: {
				innerPhone: '@phone',
				innerText: '@text'
			},
			link: function(scope, elem, attrs) {

				attrs.$observe('phone', function(val) { scope.phone = String(val) })
				attrs.$observe('text', function(val) { scope.text = val })

				function formatPhoneNumber(phoneNumber) {

					switch (true) {
						case phoneNumber.substring(0, 1) == 0:
							return '62' + phoneNumber.substring(1)
						case phoneNumber.substring(0, 3) == '+62':
							return '62' + phoneNumber.substring(3)
						default:
							return phoneNumber
					}
				}

				scope.send = function() {

					var params = $.param({
						phone: formatPhoneNumber(scope.phone),
					})

					if (scope.text) {
						params = params + '&text=' + encodeURIComponent(scope.text)
					}

					window.open("https://api.whatsapp.com/send?" + params)
				}
			}
		}
	})