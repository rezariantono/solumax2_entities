angular
    .module('Solumax.ErrorInterceptor', [])
    .service('ErrorInterceptorFactory', function($q) {

        var errorInterceptorFactory = {};

        function proccessArrayError(err, rejection) {

            switch (err.type) {
                case 'confirm':
                    if (confirm(err.text)) {

                    	rejection.userResponse = {}
                        rejection.userResponse[err.if_confirmed] = true

                        $q.reject(rejection)
                    }
            }
        }

        errorInterceptorFactory.responseError = function(rejection) {

            if (rejection.data && rejection.data.errors && rejection.status == 400) {

                if (rejection.data.errors.constructor === Array) {

                    var allString = true
                    rejection.data.errors.forEach(function(val) {
                        if (val.constructor !== String) {
                            allString = false
                            proccessArrayError(val, rejection)
                            return
                        }
                    })

                    if (allString) {
                        alert(rejection.data.errors.join('\n'))
                    }

                } else {

                    alert(rejection.data.errors)

                }
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
