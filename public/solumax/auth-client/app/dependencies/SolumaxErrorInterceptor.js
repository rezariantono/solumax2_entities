angular
	.module('Solumax.ErrorInterceptor', [])
	.service('ErrorInterceptorFactory', function($q) {

		var errorInterceptorFactory = {};

		errorInterceptorFactory.responseError =  function(rejection) {

			if (rejection.data.errors && rejection.status == 400) {

				var errorString = rejection.data.errors.join('\n');
				alert(errorString);
			};

			if (rejection.status == 500) {
				alert('Error. Harap hubungi system admin.')
			};

			if (rejection.status == 401 && rejection.data != 'Session verification failed') {
				alert('Anda perlu login dahulu untuk menggunakan fungsi ini')
			};

			if (rejection.status == 403) {
				alert('Anda tidak memiliki access untuk fungsi ini');
			};

			if (rejection.status == 404) {
				alert('Data yang Anda cari tidak tersedia');
			};

			return $q.reject(rejection);
		}

		return errorInterceptorFactory;
	})
	.config(function($httpProvider) {
		$httpProvider.interceptors.push('ErrorInterceptorFactory');		
	});
