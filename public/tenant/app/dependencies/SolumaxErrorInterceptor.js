angular
	.module('Solumax.ErrorInterceptor', [])
	.service('ErrorInterceptorFactory', function($q) {

		var errorInterceptorFactory = {};

		errorInterceptorFactory.responseError =  function(rejection) {

			if (rejection.data.errors && rejection.status == 400) {

				var errorString = rejection.data.errors.join(', ');
				alert(errorString);
			};

			if (rejection.status == 500) {
				alert('Server Error. Hubungi Admin.')
			};

			if (rejection.status == 401 && rejection.data != 'Session verification failed') {
				alert('Anda perlu login dahulu untuk menggunakan fungsi ini')
			};

			if (rejection.status == 403) {
				alert('Anda tidak memiliki fungsi untuk access ini')
			};

			return $q.reject(rejection);
		}

		return errorInterceptorFactory;
	})
	.config(function($httpProvider) {
		$httpProvider.interceptors.push('ErrorInterceptorFactory');		
	});
