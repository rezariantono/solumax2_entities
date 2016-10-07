angular
	.module('Solumax.JwtManager', ['angular-jwt'])
	.factory('JwtValidator', function(
		LinkFactory, jwtHelper) {
	
		/*
			This package REQUIRE Link Factory which have LinkFactory.authorization.login and  LinkFactory.authorization.logout links
			This package REQUIRE URI.js

		*/

		var jwtValidator = {};

		var jwtName = 'solumax_jwt_token';

		jwtValidator.decodeToken = function(token) {

			try	{

				return jwtHelper.decodeToken(jwtValidator.encodedJwt)

			} catch (e) {

				jwtValidator.unsetJwt()
				return null
			}
		}

		jwtValidator.isLoggedIn = function() {

			if (jwtValidator.encodedJwt == null) {
				return false;
			};
			
			try {

				if (jwtHelper.isTokenExpired(jwtValidator.encodedJwt)) {
					alert('Sesi sudah berakhir. Harap login ulang.')
					JwtValidator.unsetJwt();
					return false;
				};

			} catch (e) {

				jwtValidator.unsetJwt();
				location.reload();
			}
			
			return true;
		}

		jwtValidator.setJwt = function(jwt) {

			localStorage.setItem(jwtName, jwt);
		}

		jwtValidator.unsetJwt = function() {

			try	{
				localforage.clear();
			} catch (e) {
				console.log(e);
			}

			localStorage.clear();
		}

		jwtValidator.login = function(params) {

			var uri = new URI(window.location.href);
			var hash = uri.hash();

			params.redirect = uri.fragment(""); 
			params.state = hash;

			window.location.href = new URI(LinkFactory.authentication.login).search(params).toString();

		}

		jwtValidator.encodedJwt = localStorage.getItem(jwtName);

		jwtValidator.decodedJwt = jwtValidator.encodedJwt == null ? null : jwtValidator.decodeToken(jwtValidator.encodedJwt);

		return jwtValidator;
	})
	.run(function ($rootScope, $state, JwtValidator) {

		$rootScope.$on('$stateChangeStart', function (event, toState) {
	    	
	    	if (toState.requireLogin != false) {

	    		var isLoggedIn = JwtValidator.isLoggedIn();

	    		if (!isLoggedIn) {
	    			alert('Anda perlu login untuk menggunakan fitur ini.');
	    			event.preventDefault();
	    		};
	    	};
		    
		});


		var retrieveJwt = function() {

			var uri = new URI(window.location.href)

			if (typeof uri.search(true).jwt != 'undefined') {
				
				JwtValidator.setJwt(uri.search(true).jwt);
				var state = uri.search(true).state;
				uri.search('');


				if (typeof state != "undefined") {
	
					window.location.href = uri + state;					
				
				} else {

					window.location.href = uri;
				};

			};

		}

		retrieveJwt();

	})
	.directive('solAuth', function($compile, $injector, 
		$location, $timeout,
		JwtValidator, LinkFactory) {

		return {
			template: function() {

				var loggedIn = JwtValidator.isLoggedIn();

				if (loggedIn) {
					return '<a href="" ng-click="logout()">Logout (' + JwtValidator.decodedJwt.name + ')</a>';
				} else {
					return '<a href="" ng-click="login()">Login</a>';
				};
			},
			restrict: 'A',
			scope: {
				'admins': '='
			},
			link: function(scope, elem, attrs) {


				scope.login = function() {

					params = {
						scopes: ''
					};

					if (scope.admins) {
						params.scopes += "admins";
					};

					JwtValidator.login(params);
				}

				scope.logout = function() {
					if (confirm('Yakin logout?')) {
						JwtValidator.unsetJwt();

						$timeout(function() {
							location.reload();
						}, 1000);
					};
				}
			}
		};
	})
	.service('JwtInterceptor', function(JwtValidator) {

		this.request = function(config) {

			if (JwtValidator.encodedJwt != null) {
				config.headers['Authorization'] = 'Bearer ' + JwtValidator.encodedJwt;
			};

			return config;
		}
		
	})
	.service('JwtErrorInterceptor', function($q, JwtValidator) {

		var interceptors = {};

		interceptors.responseError =  function(res) {

			if (res.status == 401 && res.data == 'Session verification failed' && JwtValidator.encodedJwt != null) {
				alert('Maaf, sesi Anda telah habis. Silahkan login ulang.');
				JwtValidator.unsetJwt();
				location.reload();
			};

			return $q.reject(res);
		}

		return interceptors;
	})
	.config(function($httpProvider) {
		$httpProvider.interceptors.push('JwtInterceptor');
		$httpProvider.interceptors.push('JwtErrorInterceptor');
	});