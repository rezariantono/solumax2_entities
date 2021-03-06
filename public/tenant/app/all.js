var app = angular
	.module('Solumax.Entities', ['ui.router',
		'Solumax.ErrorInterceptor', 'Solumax.JwtManager', 'Solumax.Loading', 'Solumax.Pagination',
		'Solumax.TenantDatabaseConnection', 'Solumax.Entity', 'Solumax.DirectUser',
		'Solumax.Logger', 'Solumax.AccountPlugin', 'Solumax.FileManager'])
	.factory('AppFactory', function() {

		var appFactory = {};

		appFactory.moduleId = '10777';

		return appFactory;
	});

app
	.run(function($rootScope, $state) {

		$rootScope.$on('$stateChangeSuccess', function () {
			$rootScope.pageTitle = $state.current.pageTitle;
		});
	});
app
	.factory('LinkFactory', function() {

		var domains = {
			base: 'http://base.hondagelora.com/',
			account: 'https://accounts.xolura.com/',
			entity: window.location.protocol + '//' + window.location.host + '/',
		}

		var apps = {
			authentication: domains.account + 'views/user/',
			entity: domains.entity + 'entity/',
		};
		
		return {

			authentication: {
				login: apps.authentication + 'authentication/login',
				tenantSelect: apps.authentication + 'token-exchange/tenant-select'
			},

			area: {
				api: apps.entity + 'api/area/',
			},

			entity: {
				base: domains.entity,
				api: apps.entity + 'api/entity/',
				report: apps.entity + 'report/entity/',
			},

			relationship: {
				api: apps.entity + 'api/relationship/',
			},


			entityRelationship: {
				api: apps.entity + 'api/entity-relationship/',
			},


		};
	});
app
	.config(function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/index');

		$stateProvider
		.state('index', {
			url: '/index',
  			templateUrl: 'app/index/index.html',
  			controller: 'IndexController as ctrl',
  			requireLogin: false,
  			pageTitle: 'Contact Management'
		})


		.state('entityCreate', {
			url: '/entity/create',
  			templateUrl: 'app/entity/show/entityShow.html',
  			controller: 'EntityShowController as ctrl',
  			pageTitle: 'Contact'
		})
		.state('entityShow', {
			url: '/entity/show/:id?',
  			templateUrl: 'app/entity/show/entityShow.html',
  			controller: 'EntityShowController as ctrl',
  			pageTitle: 'Contact'
		})
		.state('entitySearch', {
			url: '/entity/search',
  			templateUrl: 'app/entity/search/entitySearch.html',
  			controller: 'EntitySearchController as ctrl',
  			pageTitle: 'Pencarian Contact'
		})
		.state('entityIndex', {
			url: '/entity/index/:encodedQuery',
  			templateUrl: 'app/entity/index/entityIndex.html',
  			controller: 'EntityIndexController as ctrl',
  			pageTitle: 'Daftar Contact'
		})
		.state('entityReport', {
			url: '/entity/report',
  			templateUrl: 'app/entity/report/entityReport.html',
  			controller: 'EntityReportController as ctrl',
  			pageTitle: 'Entity Report'
		})
		.state('entityLog', {
			url: '/entity/log/:id',
  			templateUrl: 'app/entity/log/entityLog.html',
  			controller: 'EntityLogController as ctrl',
  			pageTitle: 'Entity Log'
		})

		.state('relationshipIndex', {
			url: '/relationship/index/:encodedQuery',
  			templateUrl: 'app/relationship/index/relationshipIndex.html',
  			controller: 'RelationshipIndexController as ctrl',
  			pageTitle: 'Daftar Relations'
		})
	});
app
    .factory('AreaModel', function(
        $http,
        LinkFactory) {

        var areaModel = {}

        areaModel.retrieve = function(filter, value) {
            return $http.get(LinkFactory.area.api, { params: { filter: filter, value: value } })
        }

        return areaModel
    })

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
	.factory('GenerateLink', function(
		JwtValidator) {

		return {
			redirectWithJwt: function(url) {

				var obj = {
					'jwt': JwtValidator.encodedJwt
				}

				return url + '?' + $.param(obj);
			},
			directToPage: function(appIndex, state) {

				var obj = {
					'state': state,
					'jwt': JwtValidator.encodedJwt
				}

				return appIndex + '?' + $.param(obj);
			}
		}
	})
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
angular
	.module('Solumax.CsvUploader', [])
	.factory('CsvUploader', function(
		$q) {

		// Cara pakai uploader
		// 

		var csvUploader = {}

		csvUploader.results = null

		csvUploader.parse = function(file, injectedConfig) {

			var config = {
				header: true,
				skipEmptyLines: true
			}

			if (_.isObject(injectedConfig)) {
				_.assign(config, injectedConfig)
			}

			return $q(function(resolve, reject) {

				config.complete = function(results) {
					csvUploader.results = results
					resolve(results)
				}

				config.error = function(err) {
					reject(err)
				}

				Papa.parse(file, config)
			})
			
		}


		csvUploader.upload = function(data, config) {

			// Pass upload function in config with success / error callback

			csvUploader.uploading = true;

			csvUploader.data = data
			csvUploader.dataCount = data.length
			csvUploader.uploadCount = 0

			uploadSingleContinous(csvUploader.data[csvUploader.uploadCount], config);
		}

		uploadSingleContinous = function(data, config) {

			if (typeof data.validation_status != 'undefined' && !data.validation_status) {

				triggerNext(data, config)
			}

			return config.upload(data)
			.then(function(res) {

				data.status = 1
				
				if (typeof res != 'undefined') {
					data.response = res.data
				}

				triggerNext(data, config)

			}, function(res) {

				data.status = 0

				if (typeof res != 'undefined') {
					data.response = res.data
				}

				triggerNext(data, config)
			})
		}

		function triggerNext(data, config) {

			csvUploader.uploadCount += 1

			if (csvUploader.dataCount > csvUploader.uploadCount) {

				uploadSingleContinous(csvUploader.data[csvUploader.uploadCount], config);
			
			} else {

				csvUploader.uploading = false;
			}
		}

		return csvUploader
	})
angular
	.module('Solumax.DirectUser', [])
	.factory('DirectUserModel', function(
		$http) {

		var directUserModel= {};

		directUserModel.index = function(filter) {
			return $http.get('https://accounts.xolura.com/api/resources/tenant/user/profile/', {params: filter});
		}

		return directUserModel;
	})
angular
	.module('Solumax.EntityFinder', [])
	.directive('entityFinderModal', function(
		$sce, $http, $timeout,
		LinkFactory) {

		return {
			templateUrl: $sce.trustAsResourceUrl(LinkFactory.entity.base + 'entity-finder-modal.html'),
			restrict: 'AE',
			scope: {
				selectedEntity: "=",
				onEntitySelected: "&"
			},
			controller: function() {
				
			},
			link: function(scope, elem, attrs) {

				scope.modalId = "-" + Math.random().toString(36).substring(2, 7)

				scope.registerNewEntity = function() {
					window.open(LinkFactory.entity.base + 'redirect-app/entity/new');
				}

				scope.openInApp = function(entity) {
					window.open(LinkFactory.entity.base + 'redirect-app/entity/' + entity.id);
				}

				scope.select = function(entity) {

					scope.selectedEntity = entity;
					$timeout(function() {
						scope.onEntitySelected();
					}, 250);

					$('#entityFinderModal' + scope.modalId).modal('hide');
				}

				scope.search = function() {

					$http.get(LinkFactory.entity.base + 'entity/api/entity/', {
						params: _.omit(scope.filter, ['pageIncrease', 'pageDecrease'])
					})
					.then(function(res) {
						
						scope.entities = res.data.data;
						scope.meta = res.data.meta;
					});
				}

				scope.filter = {
					paginate: 20,
					page: 1,
					order: 'likeness',
					pageIncrease: function() {
						this.page++;
					},
					pageDecrease: function() {
						this.page--;
					}
				};

			}
		};
	})
	.factory('ExternalEntityModel', function(
		$http, LinkFactory) {

		var externalEntityModel = {};

		externalEntityModel.index = function(params) {
			return $http.get(LinkFactory.entity.base + 'entity/api/entity/', {params: params});
		}

		externalEntityModel.get = function(id) {
			return $http.get(LinkFactory.entity.base + 'entity/api/entity/' + id);
		}

		return externalEntityModel;
	})
	.run(function() {
		console.log('Masih menggunakan entity finder lama. Update sekarang')
	})
angular
	.module('Solumax.EntityUpdater', ['Solumax.AppTransfer'])
	.directive('entityUpdaterModal', function(
		$sce, $http, $timeout,
		LinkFactory, GenerateLink) {


		// This version 2 of entity updater supports only injecting entity id now
		// 
		return {
			templateUrl: $sce.trustAsResourceUrl(LinkFactory.entity.base + 'entity-updater-modal.html'),
			restrict: 'AE',
			scope: {
				selectedEntity: "=entity",
				entityId: "@",
				onEntityUpdated: "&",
				newPhoneNumber: "@",
				newEntityData: "="
			},
			link: function(scope, elem, attrs) {

				scope.modalId = "-" + Math.random().toString(36).substring(2, 7)

				if (typeof scope.selectedEntity != 'undefined') {

					scope.entity = scope.selectedEntity

				} else if (scope.entityId) {

					$http.get(LinkFactory.entity.base + 'entity/api/entity/' + scope.entityId)
					.then(function(res) {
						scope.entity = res.data.data
					})

				}

				scope.insertValues = function() {

					if (scope.newEntityData) {

						var updateableFields = ["phone_number", "address", "ktp"]

						updateableFields.forEach(function(updateableField) {
							if (scope.newEntityData[updateableField]) {
								scope.entity[updateableField] = scope.newEntityData[updateableField]
							}
						})
					}

					if (scope.newPhoneNumber) {
						scope.entity.phone_number = scope.newPhoneNumber
					}
				}


				scope.registerNew = function() {
					window.open(LinkFactory.entity.base + 'redirect-app/entity/new');
				}

				scope.openInApp = function(entity) {
					window.open(GenerateLink.redirectWithJwt(LinkFactory.entity.base + 'redirect-app/entity/' + entity.id));
				}

				scope.update = function(entity) {

					$http.post(LinkFactory.entity.base + 'entity/api/entity/' + entity.id, entity)
					.then(function(res) {
						
						scope.entity = res.data.data;
						scope.selectedEntity = res.data.data;
						
						alert('Update berhasil');

						$timeout(function() {
							scope.onEntityUpdated();
						}, 250);


					});
				}


			}
		};
	})
	.run(function() {
		console.log('Masih menggunakan entity updater lama. Update sekarang')
	})
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
                alert('Anda tidak memiliki access untuk fungsi ini\n' . rejection.data);
            };

            if (rejection.status == 404) {
                alert('Data yang Anda cari tidak tersedia');
            };

            document.dispatchEvent(new CustomEvent("stop-loading"))

            return $q.reject(rejection);
        }

        return errorInterceptorFactory;
    })
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('ErrorInterceptorFactory');
    });

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

	    	if (toState.requireTenantSelection) {

	    		if (typeof JwtValidator.decodedJwt.selected_tenant_id == 'undefined') {
	    			alert('Anda perlu pilih tenant dulu untuk menggunakan fitur ini.');
	    			event.preventDefault();
	    		}

	    	}
		    
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
			restrict: 'AE',
			scope: {
				'admins': '=',
				'moduleId': '@',
				'alg': '@'
			},
			link: function(scope, elem, attrs) {


				scope.login = function() {

					params = {
						scopes: ''
					};

					if (scope.admins) {
						params.scopes += "admins";
					}

					if (scope.alg) {
						params.alg = scope.alg;
					}

					if (scope.moduleId) {
						
						params.module_id = scope.moduleId;

					} else if (localStorage.getItem('module_id') != null) {
						
						params.module_id = localStorage.getItem('module_id');
					}


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
angular
    .module('Solumax.Loading', [])
    .directive('fullscreenLoading', function($window) {

        return {
            template: function() {
                return "<div class='text-center' style='z-index:100000;position:fixed;width:100%;height:100%;top:0;left:0;background:white;opacity:0.5;display:flex;align-items:center;vertical-align:middle;'><i class='fa fa-spinner fa-spin fa-5x' style='margin:auto;color:black;'></i></div>";
            },
            restrict: 'AE',
            link: function(scope, elem, attrs) {}
        };
    })
    .directive('elementLoading', function() {

        return {
            restrict: 'E',
            link: function(scope, elem, attrs) {

                scope.$watch(attrs.elementLoading, function(value) {
                    console.log(value);
                    if (value) {
                        attrs.$set('disabled', true);
                    } else {
                        elm.removeAttr('disabled');
                    };
                });

            }
        };
    })
    .run(function(
        $rootScope, $compile) {

        document.addEventListener("loading", function() {

            $('.solumax-loading').remove()
            $('section').append("<div class='solumax-loading text-center' style='z-index:100000;position:fixed;width:100%;height:100%;top:0;left:0;background:white;opacity:0.5;display:flex;align-items:center;vertical-align:middle;'><i class='fa fa-spinner fa-spin fa-5x' style='margin:auto;color:black;'></i></div>")
        })

        document.addEventListener("stop-loading", function() {

            $('.solumax-loading').remove()
        })

    })
    .factory('SolumaxLoading', function() {

        var solumaxLoading = {}

        solumaxLoading.start = function() {

            document.dispatchEvent(new CustomEvent("loading"))
        }

        solumaxLoading.stop = function() {

            document.dispatchEvent(new CustomEvent("stop-loading"))
        }

        return solumaxLoading
    })


// document.dispatchEvent(new CustomEvent("loading"))
// document.dispatchEvent(new CustomEvent("stop-loading"))

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
angular
	.module('Solumax.PageTitle', [])
	.run(function($rootScope, $state) {

		$rootScope.$on('$stateChangeSuccess', function () {
			$rootScope.pageTitle = $state.current.pageTitle;
		});


		$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {

			var elements = document.getElementsByClassName('modal');

			for (var i = elements.length - 1; i >= 0; i--) {

				if ($('#' + elements[i].id).hasClass('in')) {
					$('#' + elements[i].id).modal('hide')
					event.preventDefault()
				}
			}

		})
	});
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
	.filter('fromDateTimeString', function(){
		return function(text, format, initialFormat) {


			var date 
			
			if (!text) {
				return ''
			}

			date = moment(text, initialFormat || 'YYYY-MM-DD HH:mm:ss')

			if (!date.isValid()) {
				date = moment(text)
			}

			return date.format(format || 'YYYY-MM-DD')
		}
	})
	
angular
	.module('Solumax.TenantDatabaseConnection', ['Solumax.JwtManager'])
	.directive('tenantSelect', function($compile, $injector, 
		$location,
		AppFactory, LinkFactory, JwtValidator) {

		return {
			template: function() {

				return '<a style="text-decoration:none;" class="text-warning" ng-click="selectTenant()" ng-if="!notLoggedIn">{{insideText}}</a>';
			},
			restrict: 'AE',
			link: function(scope, elem, attrs) {

				scope.selectTenant = function() {

					if (!JwtValidator.decodedJwt) {
						JwtValidator.login();
						return;
					}

					var uri = new URI(window.location.href);
					var hash = uri.hash();

					var search = {
						'redirect': uri.fragment(""),
						'module_id': AppFactory.moduleId,
						'jwt': JwtValidator.encodedJwt,
						'state': hash
					};

					window.location.href = new URI(LinkFactory.authentication.tenantSelect).search(search).toString();

				}

				if (JwtValidator.decodedJwt) {
					
					if (JwtValidator.decodedJwt.selected_tenant_id) {
						scope.insideText = JwtValidator.decodedJwt.selected_tenant_name;
					} else {
						scope.insideText = 'Pilih Tenant'
					};

				} else {
					scope.notLoggedIn = true;
					scope.insideText = 'Login'
				};

			}
		};
	})
	.service('TenantSelectionInterceptor', function($q) {

		var interceptors = {};

		interceptors.responseError =  function(res) {

			if (res.status == 400 && res.data == 'Tenant belum dipilih') {
				alert('Tenant belum dipilih. Silahkan pilih tenant dahulu.');
			};

			return $q.reject(res);
		}

		return interceptors;

	})
	.config(function($httpProvider) {
		$httpProvider.interceptors.push('TenantSelectionInterceptor');		
	});;
app
	.factory('EntityModel', function(
		$http,
		LinkFactory) {

		var entityModel = {};

		entityModel.index = function(filter) {
			return $http.get(LinkFactory.entity.api, {
				params: filter
			});
		}

		entityModel.get = function(entityId) {
			return $http.get(LinkFactory.entity.api + entityId);
		}

		entityModel.store = function(entity, params) {
			return $http.post(LinkFactory.entity.api, entity, {params: params});
		}

		entityModel.update = function(entity) {
			return $http.post(LinkFactory.entity.api + entity.id, entity);
		}

		entityModel.delete = function(entity) {
			return $http.delete(LinkFactory.entity.api + entity.id);
		}

		entityModel.action = {
			editLock: function(id, data) {
				return $http.post(LinkFactory.entity.api + 'edit-lock/' + id, data);
			},
			requestDelete: function(id, data) {
				return $http.post(LinkFactory.entity.api + 'request-delete/' + id, data);
			}
		}

		return entityModel;
	});
app
	.factory('EntityRelationshipModel', function(
		$http,
		LinkFactory) {

		var entityRelationshipModel = {};

		entityRelationshipModel.index = function(params) {
			return $http.get(LinkFactory.entityRelationship.api, {params: params});
		}

		entityRelationshipModel.store = function(entityRelationship) {
			return $http.post(LinkFactory.entityRelationship.api, entityRelationship);
		}

		entityRelationshipModel.delete = function(params) {
			return $http.delete(LinkFactory.entityRelationship.api, {params: params});
		}

		return entityRelationshipModel;
	});
app
	.controller('IndexController', function() {

		var vm = this;
		
	});
app
	.factory('RelationshipModel', function(
		$http,
		LinkFactory) {

		var relationshipModel = {};

		relationshipModel.index = function(params) {
			return $http.get(LinkFactory.relationship.api, {params: params});
		}

		relationshipModel.get = function(relationshipId) {
			return $http.get(LinkFactory.relationship.api + relationshipId);
		}

		relationshipModel.store = function(relationship) {
			return $http.post(LinkFactory.relationship.api, relationship);
		}

		relationshipModel.update = function(id, relationship) {
			return $http.post(LinkFactory.relationship.api + id, relationship);
		}

		relationshipModel.delete = function(relationship) {
			return $http.delete(LinkFactory.relationship.api + relationship.id);
		}

		return relationshipModel;
	});
!function(){angular.module("angular-jwt",["angular-jwt.interceptor","angular-jwt.jwt"]),angular.module("angular-jwt.interceptor",[]).provider("jwtInterceptor",function(){this.urlParam=null,this.authHeader="Authorization",this.authPrefix="Bearer ",this.tokenGetter=function(){return null};var e=this;this.$get=["$q","$injector","$rootScope",function(r,t,a){return{request:function(a){if(a.skipAuthorization)return a;if(e.urlParam){if(a.params=a.params||{},a.params[e.urlParam])return a}else if(a.headers=a.headers||{},a.headers[e.authHeader])return a;var n=r.when(t.invoke(e.tokenGetter,this,{config:a}));return n.then(function(r){return r&&(e.urlParam?a.params[e.urlParam]=r:a.headers[e.authHeader]=e.authPrefix+r),a})},responseError:function(e){return 401===e.status&&a.$broadcast("unauthenticated",e),r.reject(e)}}}]}),angular.module("angular-jwt.jwt",[]).service("jwtHelper",function(){this.urlBase64Decode=function(e){var r=e.replace(/-/g,"+").replace(/_/g,"/");switch(r.length%4){case 0:break;case 2:r+="==";break;case 3:r+="=";break;default:throw"Illegal base64url string!"}return decodeURIComponent(escape(window.atob(r)))},this.decodeToken=function(e){var r=e.split(".");if(3!==r.length)throw new Error("JWT must have 3 parts");var t=this.urlBase64Decode(r[1]);if(!t)throw new Error("Cannot decode the token");return JSON.parse(t)},this.getTokenExpirationDate=function(e){var r;if(r=this.decodeToken(e),"undefined"==typeof r.exp)return null;var t=new Date(0);return t.setUTCSeconds(r.exp),t},this.isTokenExpired=function(e,r){var t=this.getTokenExpirationDate(e);return r=r||0,null===t?!1:!(t.valueOf()>(new Date).valueOf()+1e3*r)}})}();

/**
 * State-based routing for AngularJS
 * @version v0.4.2
 * @link http://angular-ui.github.com/
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"undefined"!=typeof module&&"undefined"!=typeof exports&&module.exports===exports&&(module.exports="ui.router"),function(a,b,c){"use strict";function d(a,b){return T(new(T(function(){},{prototype:a})),b)}function e(a){return S(arguments,function(b){b!==a&&S(b,function(b,c){a.hasOwnProperty(c)||(a[c]=b)})}),a}function f(a,b){var c=[];for(var d in a.path){if(a.path[d]!==b.path[d])break;c.push(a.path[d])}return c}function g(a){if(Object.keys)return Object.keys(a);var b=[];return S(a,function(a,c){b.push(c)}),b}function h(a,b){if(Array.prototype.indexOf)return a.indexOf(b,Number(arguments[2])||0);var c=a.length>>>0,d=Number(arguments[2])||0;for(d=d<0?Math.ceil(d):Math.floor(d),d<0&&(d+=c);d<c;d++)if(d in a&&a[d]===b)return d;return-1}function i(a,b,c,d){var e,i=f(c,d),j={},k=[];for(var l in i)if(i[l]&&i[l].params&&(e=g(i[l].params),e.length))for(var m in e)h(k,e[m])>=0||(k.push(e[m]),j[e[m]]=a[e[m]]);return T({},j,b)}function j(a,b,c){if(!c){c=[];for(var d in a)c.push(d)}for(var e=0;e<c.length;e++){var f=c[e];if(a[f]!=b[f])return!1}return!0}function k(a,b){var c={};return S(a,function(a){c[a]=b[a]}),c}function l(a){var b={},c=Array.prototype.concat.apply(Array.prototype,Array.prototype.slice.call(arguments,1));return S(c,function(c){c in a&&(b[c]=a[c])}),b}function m(a){var b={},c=Array.prototype.concat.apply(Array.prototype,Array.prototype.slice.call(arguments,1));for(var d in a)h(c,d)==-1&&(b[d]=a[d]);return b}function n(a,b){var c=R(a),d=c?[]:{};return S(a,function(a,e){b(a,e)&&(d[c?d.length:e]=a)}),d}function o(a,b){var c=R(a)?[]:{};return S(a,function(a,d){c[d]=b(a,d)}),c}function p(a){return a.then(c,function(){})&&a}function q(a,b){var d=1,f=2,i={},j=[],k=i,l=T(a.when(i),{$$promises:i,$$values:i});this.study=function(i){function n(a,c){if(t[c]!==f){if(s.push(c),t[c]===d)throw s.splice(0,h(s,c)),new Error("Cyclic dependency: "+s.join(" -> "));if(t[c]=d,P(a))r.push(c,[function(){return b.get(a)}],j);else{var e=b.annotate(a);S(e,function(a){a!==c&&i.hasOwnProperty(a)&&n(i[a],a)}),r.push(c,a,e)}s.pop(),t[c]=f}}function o(a){return Q(a)&&a.then&&a.$$promises}if(!Q(i))throw new Error("'invocables' must be an object");var q=g(i||{}),r=[],s=[],t={};return S(i,n),i=s=t=null,function(d,f,g){function h(){--v||(w||e(u,f.$$values),s.$$values=u,s.$$promises=s.$$promises||!0,delete s.$$inheritedValues,n.resolve(u))}function i(a){s.$$failure=a,n.reject(a)}function j(c,e,f){function j(a){l.reject(a),i(a)}function k(){if(!N(s.$$failure))try{l.resolve(b.invoke(e,g,u)),l.promise.then(function(a){u[c]=a,h()},j)}catch(a){j(a)}}var l=a.defer(),m=0;S(f,function(a){t.hasOwnProperty(a)&&!d.hasOwnProperty(a)&&(m++,t[a].then(function(b){u[a]=b,--m||k()},j))}),m||k(),t[c]=p(l.promise)}if(o(d)&&g===c&&(g=f,f=d,d=null),d){if(!Q(d))throw new Error("'locals' must be an object")}else d=k;if(f){if(!o(f))throw new Error("'parent' must be a promise returned by $resolve.resolve()")}else f=l;var n=a.defer(),s=p(n.promise),t=s.$$promises={},u=T({},d),v=1+r.length/3,w=!1;if(p(s),N(f.$$failure))return i(f.$$failure),s;f.$$inheritedValues&&e(u,m(f.$$inheritedValues,q)),T(t,f.$$promises),f.$$values?(w=e(u,m(f.$$values,q)),s.$$inheritedValues=m(f.$$values,q),h()):(f.$$inheritedValues&&(s.$$inheritedValues=m(f.$$inheritedValues,q)),f.then(h,i));for(var x=0,y=r.length;x<y;x+=3)d.hasOwnProperty(r[x])?h():j(r[x],r[x+1],r[x+2]);return s}},this.resolve=function(a,b,c,d){return this.study(a)(b,c,d)}}function r(){var a=b.version.minor<3;this.shouldUnsafelyUseHttp=function(b){a=!!b},this.$get=["$http","$templateCache","$injector",function(b,c,d){return new s(b,c,d,a)}]}function s(a,b,c,d){this.fromConfig=function(a,b,c){return N(a.template)?this.fromString(a.template,b):N(a.templateUrl)?this.fromUrl(a.templateUrl,b):N(a.templateProvider)?this.fromProvider(a.templateProvider,b,c):null},this.fromString=function(a,b){return O(a)?a(b):a},this.fromUrl=function(e,f){return O(e)&&(e=e(f)),null==e?null:d?a.get(e,{cache:b,headers:{Accept:"text/html"}}).then(function(a){return a.data}):c.get("$templateRequest")(e)},this.fromProvider=function(a,b,d){return c.invoke(a,null,d||{params:b})}}function t(a,b,e){function f(b,c,d,e){if(q.push(b),o[b])return o[b];if(!/^\w+([-.]+\w+)*(?:\[\])?$/.test(b))throw new Error("Invalid parameter name '"+b+"' in pattern '"+a+"'");if(p[b])throw new Error("Duplicate parameter name '"+b+"' in pattern '"+a+"'");return p[b]=new W.Param(b,c,d,e),p[b]}function g(a,b,c,d){var e=["",""],f=a.replace(/[\\\[\]\^$*+?.()|{}]/g,"\\$&");if(!b)return f;switch(c){case!1:e=["(",")"+(d?"?":"")];break;case!0:f=f.replace(/\/$/,""),e=["(?:/(",")|/)?"];break;default:e=["("+c+"|",")?"]}return f+e[0]+b+e[1]}function h(e,f){var g,h,i,j,k;return g=e[2]||e[3],k=b.params[g],i=a.substring(m,e.index),h=f?e[4]:e[4]||("*"==e[1]?".*":null),h&&(j=W.type(h)||d(W.type("string"),{pattern:new RegExp(h,b.caseInsensitive?"i":c)})),{id:g,regexp:h,segment:i,type:j,cfg:k}}b=T({params:{}},Q(b)?b:{});var i,j=/([:*])([\w\[\]]+)|\{([\w\[\]]+)(?:\:\s*((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,k=/([:]?)([\w\[\].-]+)|\{([\w\[\].-]+)(?:\:\s*((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,l="^",m=0,n=this.segments=[],o=e?e.params:{},p=this.params=e?e.params.$$new():new W.ParamSet,q=[];this.source=a;for(var r,s,t;(i=j.exec(a))&&(r=h(i,!1),!(r.segment.indexOf("?")>=0));)s=f(r.id,r.type,r.cfg,"path"),l+=g(r.segment,s.type.pattern.source,s.squash,s.isOptional),n.push(r.segment),m=j.lastIndex;t=a.substring(m);var u=t.indexOf("?");if(u>=0){var v=this.sourceSearch=t.substring(u);if(t=t.substring(0,u),this.sourcePath=a.substring(0,m+u),v.length>0)for(m=0;i=k.exec(v);)r=h(i,!0),s=f(r.id,r.type,r.cfg,"search"),m=j.lastIndex}else this.sourcePath=a,this.sourceSearch="";l+=g(t)+(b.strict===!1?"/?":"")+"$",n.push(t),this.regexp=new RegExp(l,b.caseInsensitive?"i":c),this.prefix=n[0],this.$$paramNames=q}function u(a){T(this,a)}function v(){function a(a){return null!=a?a.toString().replace(/(~|\/)/g,function(a){return{"~":"~~","/":"~2F"}[a]}):a}function e(a){return null!=a?a.toString().replace(/(~~|~2F)/g,function(a){return{"~~":"~","~2F":"/"}[a]}):a}function f(){return{strict:p,caseInsensitive:m}}function i(a){return O(a)||R(a)&&O(a[a.length-1])}function j(){for(;w.length;){var a=w.shift();if(a.pattern)throw new Error("You cannot override a type's .pattern at runtime.");b.extend(r[a.name],l.invoke(a.def))}}function k(a){T(this,a||{})}W=this;var l,m=!1,p=!0,q=!1,r={},s=!0,w=[],x={string:{encode:a,decode:e,is:function(a){return null==a||!N(a)||"string"==typeof a},pattern:/[^\/]*/},int:{encode:a,decode:function(a){return parseInt(a,10)},is:function(a){return a!==c&&null!==a&&this.decode(a.toString())===a},pattern:/\d+/},bool:{encode:function(a){return a?1:0},decode:function(a){return 0!==parseInt(a,10)},is:function(a){return a===!0||a===!1},pattern:/0|1/},date:{encode:function(a){return this.is(a)?[a.getFullYear(),("0"+(a.getMonth()+1)).slice(-2),("0"+a.getDate()).slice(-2)].join("-"):c},decode:function(a){if(this.is(a))return a;var b=this.capture.exec(a);return b?new Date(b[1],b[2]-1,b[3]):c},is:function(a){return a instanceof Date&&!isNaN(a.valueOf())},equals:function(a,b){return this.is(a)&&this.is(b)&&a.toISOString()===b.toISOString()},pattern:/[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])/,capture:/([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/},json:{encode:b.toJson,decode:b.fromJson,is:b.isObject,equals:b.equals,pattern:/[^\/]*/},any:{encode:b.identity,decode:b.identity,equals:b.equals,pattern:/.*/}};v.$$getDefaultValue=function(a){if(!i(a.value))return a.value;if(!l)throw new Error("Injectable functions cannot be called at configuration time");return l.invoke(a.value)},this.caseInsensitive=function(a){return N(a)&&(m=a),m},this.strictMode=function(a){return N(a)&&(p=a),p},this.defaultSquashPolicy=function(a){if(!N(a))return q;if(a!==!0&&a!==!1&&!P(a))throw new Error("Invalid squash policy: "+a+". Valid policies: false, true, arbitrary-string");return q=a,a},this.compile=function(a,b){return new t(a,T(f(),b))},this.isMatcher=function(a){if(!Q(a))return!1;var b=!0;return S(t.prototype,function(c,d){O(c)&&(b=b&&N(a[d])&&O(a[d]))}),b},this.type=function(a,b,c){if(!N(b))return r[a];if(r.hasOwnProperty(a))throw new Error("A type named '"+a+"' has already been defined.");return r[a]=new u(T({name:a},b)),c&&(w.push({name:a,def:c}),s||j()),this},S(x,function(a,b){r[b]=new u(T({name:b},a))}),r=d(r,{}),this.$get=["$injector",function(a){return l=a,s=!1,j(),S(x,function(a,b){r[b]||(r[b]=new u(a))}),this}],this.Param=function(a,d,e,f){function j(a){var b=Q(a)?g(a):[],c=h(b,"value")===-1&&h(b,"type")===-1&&h(b,"squash")===-1&&h(b,"array")===-1;return c&&(a={value:a}),a.$$fn=i(a.value)?a.value:function(){return a.value},a}function k(c,d,e){if(c.type&&d)throw new Error("Param '"+a+"' has two type configurations.");return d?d:c.type?b.isString(c.type)?r[c.type]:c.type instanceof u?c.type:new u(c.type):"config"===e?r.any:r.string}function m(){var b={array:"search"===f&&"auto"},c=a.match(/\[\]$/)?{array:!0}:{};return T(b,c,e).array}function p(a,b){var c=a.squash;if(!b||c===!1)return!1;if(!N(c)||null==c)return q;if(c===!0||P(c))return c;throw new Error("Invalid squash policy: '"+c+"'. Valid policies: false, true, or arbitrary string")}function s(a,b,d,e){var f,g,i=[{from:"",to:d||b?c:""},{from:null,to:d||b?c:""}];return f=R(a.replace)?a.replace:[],P(e)&&f.push({from:e,to:c}),g=o(f,function(a){return a.from}),n(i,function(a){return h(g,a.from)===-1}).concat(f)}function t(){if(!l)throw new Error("Injectable functions cannot be called at configuration time");var a=l.invoke(e.$$fn);if(null!==a&&a!==c&&!x.type.is(a))throw new Error("Default value ("+a+") for parameter '"+x.id+"' is not an instance of Type ("+x.type.name+")");return a}function v(a){function b(a){return function(b){return b.from===a}}function c(a){var c=o(n(x.replace,b(a)),function(a){return a.to});return c.length?c[0]:a}return a=c(a),N(a)?x.type.$normalize(a):t()}function w(){return"{Param:"+a+" "+d+" squash: '"+A+"' optional: "+z+"}"}var x=this;e=j(e),d=k(e,d,f);var y=m();d=y?d.$asArray(y,"search"===f):d,"string"!==d.name||y||"path"!==f||e.value!==c||(e.value="");var z=e.value!==c,A=p(e,z),B=s(e,y,z,A);T(this,{id:a,type:d,location:f,array:y,squash:A,replace:B,isOptional:z,value:v,dynamic:c,config:e,toString:w})},k.prototype={$$new:function(){return d(this,T(new k,{$$parent:this}))},$$keys:function(){for(var a=[],b=[],c=this,d=g(k.prototype);c;)b.push(c),c=c.$$parent;return b.reverse(),S(b,function(b){S(g(b),function(b){h(a,b)===-1&&h(d,b)===-1&&a.push(b)})}),a},$$values:function(a){var b={},c=this;return S(c.$$keys(),function(d){b[d]=c[d].value(a&&a[d])}),b},$$equals:function(a,b){var c=!0,d=this;return S(d.$$keys(),function(e){var f=a&&a[e],g=b&&b[e];d[e].type.equals(f,g)||(c=!1)}),c},$$validates:function(a){var d,e,f,g,h,i=this.$$keys();for(d=0;d<i.length&&(e=this[i[d]],f=a[i[d]],f!==c&&null!==f||!e.isOptional);d++){if(g=e.type.$normalize(f),!e.type.is(g))return!1;if(h=e.type.encode(g),b.isString(h)&&!e.type.pattern.exec(h))return!1}return!0},$$parent:c},this.ParamSet=k}function w(a,d){function e(a){var b=/^\^((?:\\[^a-zA-Z0-9]|[^\\\[\]\^$*+?.()|{}]+)*)/.exec(a.source);return null!=b?b[1].replace(/\\(.)/g,"$1"):""}function f(a,b){return a.replace(/\$(\$|\d{1,2})/,function(a,c){return b["$"===c?0:Number(c)]})}function g(a,b,c){if(!c)return!1;var d=a.invoke(b,b,{$match:c});return!N(d)||d}function h(d,e,f,g,h){function m(a,b,c){return"/"===q?a:b?q.slice(0,-1)+a:c?q.slice(1)+a:a}function n(a){function b(a){var b=a(f,d);return!!b&&(P(b)&&d.replace().url(b),!0)}if(!a||!a.defaultPrevented){p&&d.url()===p;p=c;var e,g=j.length;for(e=0;e<g;e++)if(b(j[e]))return;k&&b(k)}}function o(){return i=i||e.$on("$locationChangeSuccess",n)}var p,q=g.baseHref(),r=d.url();return l||o(),{sync:function(){n()},listen:function(){return o()},update:function(a){return a?void(r=d.url()):void(d.url()!==r&&(d.url(r),d.replace()))},push:function(a,b,e){var f=a.format(b||{});null!==f&&b&&b["#"]&&(f+="#"+b["#"]),d.url(f),p=e&&e.$$avoidResync?d.url():c,e&&e.replace&&d.replace()},href:function(c,e,f){if(!c.validates(e))return null;var g=a.html5Mode();b.isObject(g)&&(g=g.enabled),g=g&&h.history;var i=c.format(e);if(f=f||{},g||null===i||(i="#"+a.hashPrefix()+i),null!==i&&e&&e["#"]&&(i+="#"+e["#"]),i=m(i,g,f.absolute),!f.absolute||!i)return i;var j=!g&&i?"/":"",k=d.port();return k=80===k||443===k?"":":"+k,[d.protocol(),"://",d.host(),k,j,i].join("")}}}var i,j=[],k=null,l=!1;this.rule=function(a){if(!O(a))throw new Error("'rule' must be a function");return j.push(a),this},this.otherwise=function(a){if(P(a)){var b=a;a=function(){return b}}else if(!O(a))throw new Error("'rule' must be a function");return k=a,this},this.when=function(a,b){var c,h=P(b);if(P(a)&&(a=d.compile(a)),!h&&!O(b)&&!R(b))throw new Error("invalid 'handler' in when()");var i={matcher:function(a,b){return h&&(c=d.compile(b),b=["$match",function(a){return c.format(a)}]),T(function(c,d){return g(c,b,a.exec(d.path(),d.search()))},{prefix:P(a.prefix)?a.prefix:""})},regex:function(a,b){if(a.global||a.sticky)throw new Error("when() RegExp must not be global or sticky");return h&&(c=b,b=["$match",function(a){return f(c,a)}]),T(function(c,d){return g(c,b,a.exec(d.path()))},{prefix:e(a)})}},j={matcher:d.isMatcher(a),regex:a instanceof RegExp};for(var k in j)if(j[k])return this.rule(i[k](a,b));throw new Error("invalid 'what' in when()")},this.deferIntercept=function(a){a===c&&(a=!0),l=a},this.$get=h,h.$inject=["$location","$rootScope","$injector","$browser","$sniffer"]}function x(a,e){function f(a){return 0===a.indexOf(".")||0===a.indexOf("^")}function m(a,b){if(!a)return c;var d=P(a),e=d?a:a.name,g=f(e);if(g){if(!b)throw new Error("No reference point given for path '"+e+"'");b=m(b);for(var h=e.split("."),i=0,j=h.length,k=b;i<j;i++)if(""!==h[i]||0!==i){if("^"!==h[i])break;if(!k.parent)throw new Error("Path '"+e+"' not valid for state '"+b.name+"'");k=k.parent}else k=b;h=h.slice(i).join("."),e=k.name+(k.name&&h?".":"")+h}var l=A[e];return!l||!d&&(d||l!==a&&l.self!==a)?c:l}function n(a,b){B[a]||(B[a]=[]),B[a].push(b)}function q(a){for(var b=B[a]||[];b.length;)r(b.shift())}function r(b){b=d(b,{self:b,resolve:b.resolve||{},toString:function(){return this.name}});var c=b.name;if(!P(c)||c.indexOf("@")>=0)throw new Error("State must have a valid name");if(A.hasOwnProperty(c))throw new Error("State '"+c+"' is already defined");var e=c.indexOf(".")!==-1?c.substring(0,c.lastIndexOf(".")):P(b.parent)?b.parent:Q(b.parent)&&P(b.parent.name)?b.parent.name:"";if(e&&!A[e])return n(e,b.self);for(var f in D)O(D[f])&&(b[f]=D[f](b,D.$delegates[f]));return A[c]=b,!b[C]&&b.url&&a.when(b.url,["$match","$stateParams",function(a,c){z.$current.navigable==b&&j(a,c)||z.transitionTo(b,a,{inherit:!0,location:!1})}]),q(c),b}function s(a){return a.indexOf("*")>-1}function t(a){for(var b=a.split("."),c=z.$current.name.split("."),d=0,e=b.length;d<e;d++)"*"===b[d]&&(c[d]="*");return"**"===b[0]&&(c=c.slice(h(c,b[1])),c.unshift("**")),"**"===b[b.length-1]&&(c.splice(h(c,b[b.length-2])+1,Number.MAX_VALUE),c.push("**")),b.length==c.length&&c.join("")===b.join("")}function u(a,b){return P(a)&&!N(b)?D[a]:O(b)&&P(a)?(D[a]&&!D.$delegates[a]&&(D.$delegates[a]=D[a]),D[a]=b,this):this}function v(a,b){return Q(a)?b=a:b.name=a,r(b),this}function w(a,e,f,h,j,l,n,q,r){function u(b,c,d,f){var g=a.$broadcast("$stateNotFound",b,c,d);if(g.defaultPrevented)return n.update(),E;if(!g.retry)return null;if(f.$retry)return n.update(),F;var h=z.transition=e.when(g.retry);return h.then(function(){return h!==z.transition?(a.$broadcast("$stateChangeCancel",b.to,b.toParams,c,d),B):(b.options.$retry=!0,z.transitionTo(b.to,b.toParams,b.options))},function(){return E}),n.update(),h}function v(a,c,d,g,i,l){function m(){var c=[];return S(a.views,function(d,e){var g=d.resolve&&d.resolve!==a.resolve?d.resolve:{};g.$template=[function(){return f.load(e,{view:d,locals:i.globals,params:n,notify:l.notify})||""}],c.push(j.resolve(g,i.globals,i.resolve,a).then(function(c){if(O(d.controllerProvider)||R(d.controllerProvider)){var f=b.extend({},g,i.globals);c.$$controller=h.invoke(d.controllerProvider,null,f)}else c.$$controller=d.controller;c.$$state=a,c.$$controllerAs=d.controllerAs,c.$$resolveAs=d.resolveAs,i[e]=c}))}),e.all(c).then(function(){return i.globals})}var n=d?c:k(a.params.$$keys(),c),o={$stateParams:n};i.resolve=j.resolve(a.resolve,o,i.resolve,a);var p=[i.resolve.then(function(a){i.globals=a})];return g&&p.push(g),e.all(p).then(m).then(function(a){return i})}var w=new Error("transition superseded"),B=p(e.reject(w)),D=p(e.reject(new Error("transition prevented"))),E=p(e.reject(new Error("transition aborted"))),F=p(e.reject(new Error("transition failed")));return y.locals={resolve:null,globals:{$stateParams:{}}},z={params:{},current:y.self,$current:y,transition:null},z.reload=function(a){return z.transitionTo(z.current,l,{reload:a||!0,inherit:!1,notify:!0})},z.go=function(a,b,c){return z.transitionTo(a,b,T({inherit:!0,relative:z.$current},c))},z.transitionTo=function(b,c,f){c=c||{},f=T({location:!0,inherit:!1,relative:null,notify:!0,reload:!1,$retry:!1},f||{});var g,j=z.$current,o=z.params,q=j.path,r=m(b,f.relative),s=c["#"];if(!N(r)){var t={to:b,toParams:c,options:f},A=u(t,j.self,o,f);if(A)return A;if(b=t.to,c=t.toParams,f=t.options,r=m(b,f.relative),!N(r)){if(!f.relative)throw new Error("No such state '"+b+"'");throw new Error("Could not resolve '"+b+"' from state '"+f.relative+"'")}}if(r[C])throw new Error("Cannot transition to abstract state '"+b+"'");if(f.inherit&&(c=i(l,c||{},z.$current,r)),!r.params.$$validates(c))return F;c=r.params.$$values(c),b=r;var E=b.path,G=0,H=E[G],I=y.locals,J=[];if(f.reload){if(P(f.reload)||Q(f.reload)){if(Q(f.reload)&&!f.reload.name)throw new Error("Invalid reload state object");var K=f.reload===!0?q[0]:m(f.reload);if(f.reload&&!K)throw new Error("No such reload state '"+(P(f.reload)?f.reload:f.reload.name)+"'");for(;H&&H===q[G]&&H!==K;)I=J[G]=H.locals,G++,H=E[G]}}else for(;H&&H===q[G]&&H.ownParams.$$equals(c,o);)I=J[G]=H.locals,G++,H=E[G];if(x(b,c,j,o,I,f))return s&&(c["#"]=s),z.params=c,U(z.params,l),U(k(b.params.$$keys(),l),b.locals.globals.$stateParams),f.location&&b.navigable&&b.navigable.url&&(n.push(b.navigable.url,c,{$$avoidResync:!0,replace:"replace"===f.location}),n.update(!0)),z.transition=null,e.when(z.current);if(c=k(b.params.$$keys(),c||{}),s&&(c["#"]=s),f.notify&&a.$broadcast("$stateChangeStart",b.self,c,j.self,o,f).defaultPrevented)return a.$broadcast("$stateChangeCancel",b.self,c,j.self,o),null==z.transition&&n.update(),D;for(var L=e.when(I),M=G;M<E.length;M++,H=E[M])I=J[M]=d(I),L=v(H,c,H===b,L,I,f);var O=z.transition=L.then(function(){var d,e,g;if(z.transition!==O)return a.$broadcast("$stateChangeCancel",b.self,c,j.self,o),B;for(d=q.length-1;d>=G;d--)g=q[d],g.self.onExit&&h.invoke(g.self.onExit,g.self,g.locals.globals),g.locals=null;for(d=G;d<E.length;d++)e=E[d],e.locals=J[d],e.self.onEnter&&h.invoke(e.self.onEnter,e.self,e.locals.globals);return z.transition!==O?(a.$broadcast("$stateChangeCancel",b.self,c,j.self,o),B):(z.$current=b,z.current=b.self,z.params=c,U(z.params,l),z.transition=null,f.location&&b.navigable&&n.push(b.navigable.url,b.navigable.locals.globals.$stateParams,{$$avoidResync:!0,replace:"replace"===f.location}),f.notify&&a.$broadcast("$stateChangeSuccess",b.self,c,j.self,o),n.update(!0),z.current)}).then(null,function(d){return d===w?B:z.transition!==O?(a.$broadcast("$stateChangeCancel",b.self,c,j.self,o),B):(z.transition=null,g=a.$broadcast("$stateChangeError",b.self,c,j.self,o,d),g.defaultPrevented||n.update(),e.reject(d))});return p(O),O},z.is=function(a,b,d){d=T({relative:z.$current},d||{});var e=m(a,d.relative);return N(e)?z.$current===e&&(!b||g(b).reduce(function(a,c){var d=e.params[c];return a&&!d||d.type.equals(l[c],b[c])},!0)):c},z.includes=function(a,b,d){if(d=T({relative:z.$current},d||{}),P(a)&&s(a)){if(!t(a))return!1;a=z.$current.name}var e=m(a,d.relative);if(!N(e))return c;if(!N(z.$current.includes[e.name]))return!1;if(!b)return!0;for(var f=g(b),h=0;h<f.length;h++){var i=f[h],j=e.params[i];if(j&&!j.type.equals(l[i],b[i]))return!1}return g(b).reduce(function(a,c){var d=e.params[c];return a&&!d||d.type.equals(l[c],b[c])},!0)},z.href=function(a,b,d){d=T({lossy:!0,inherit:!0,absolute:!1,relative:z.$current},d||{});var e=m(a,d.relative);if(!N(e))return null;d.inherit&&(b=i(l,b||{},z.$current,e));var f=e&&d.lossy?e.navigable:e;return f&&f.url!==c&&null!==f.url?n.href(f.url,k(e.params.$$keys().concat("#"),b||{}),{absolute:d.absolute}):null},z.get=function(a,b){if(0===arguments.length)return o(g(A),function(a){return A[a].self});var c=m(a,b||z.$current);return c&&c.self?c.self:null},z}function x(a,b,c,d,e,f){function g(a,b,c){function d(b){return"search"!=a.params[b].location}var e=a.params.$$keys().filter(d),f=l.apply({},[a.params].concat(e)),g=new W.ParamSet(f);return g.$$equals(b,c)}if(!f.reload&&a===c&&(e===c.locals||a.self.reloadOnSearch===!1&&g(c,d,b)))return!0}var y,z,A={},B={},C="abstract",D={parent:function(a){if(N(a.parent)&&a.parent)return m(a.parent);var b=/^(.+)\.[^.]+$/.exec(a.name);return b?m(b[1]):y},data:function(a){return a.parent&&a.parent.data&&(a.data=a.self.data=d(a.parent.data,a.data)),a.data},url:function(a){var b=a.url,c={params:a.params||{}};if(P(b))return"^"==b.charAt(0)?e.compile(b.substring(1),c):(a.parent.navigable||y).url.concat(b,c);if(!b||e.isMatcher(b))return b;throw new Error("Invalid url '"+b+"' in state '"+a+"'")},navigable:function(a){return a.url?a:a.parent?a.parent.navigable:null},ownParams:function(a){var b=a.url&&a.url.params||new W.ParamSet;return S(a.params||{},function(a,c){b[c]||(b[c]=new W.Param(c,null,a,"config"))}),b},params:function(a){var b=l(a.ownParams,a.ownParams.$$keys());return a.parent&&a.parent.params?T(a.parent.params.$$new(),b):new W.ParamSet},views:function(a){var b={};return S(N(a.views)?a.views:{"":a},function(c,d){d.indexOf("@")<0&&(d+="@"+a.parent.name),c.resolveAs=c.resolveAs||a.resolveAs||"$resolve",b[d]=c}),b},path:function(a){return a.parent?a.parent.path.concat(a):[]},includes:function(a){var b=a.parent?T({},a.parent.includes):{};return b[a.name]=!0,b},$delegates:{}};y=r({name:"",url:"^",views:null,abstract:!0}),y.navigable=null,this.decorator=u,this.state=v,this.$get=w,w.$inject=["$rootScope","$q","$view","$injector","$resolve","$stateParams","$urlRouter","$location","$urlMatcherFactory"]}function y(){function a(a,b){return{load:function(a,c){var d,e={template:null,controller:null,view:null,locals:null,notify:!0,async:!0,params:{}};return c=T(e,c),c.view&&(d=b.fromConfig(c.view,c.params,c.locals)),d}}}this.$get=a,a.$inject=["$rootScope","$templateFactory"]}function z(){var a=!1;this.useAnchorScroll=function(){a=!0},this.$get=["$anchorScroll","$timeout",function(b,c){return a?b:function(a){return c(function(){a[0].scrollIntoView()},0,!1)}}]}function A(a,c,d,e,f){function g(){return c.has?function(a){return c.has(a)?c.get(a):null}:function(a){try{return c.get(a)}catch(a){return null}}}function h(a,c){var d=function(){return{enter:function(a,b,c){b.after(a),c()},leave:function(a,b){a.remove(),b()}}};if(k)return{enter:function(a,c,d){b.version.minor>2?k.enter(a,null,c).then(d):k.enter(a,null,c,d)},leave:function(a,c){b.version.minor>2?k.leave(a).then(c):k.leave(a,c)}};if(j){var e=j&&j(c,a);return{enter:function(a,b,c){e.enter(a,null,b),c()},leave:function(a,b){e.leave(a),b()}}}return d()}var i=g(),j=i("$animator"),k=i("$animate"),l={restrict:"ECA",terminal:!0,priority:400,transclude:"element",compile:function(c,g,i){return function(c,g,j){function k(){if(m&&(m.remove(),m=null),o&&(o.$destroy(),o=null),n){var a=n.data("$uiViewAnim");s.leave(n,function(){a.$$animLeave.resolve(),m=null}),m=n,n=null}}function l(h){var l,m=C(c,j,g,e),t=m&&a.$current&&a.$current.locals[m];if(h||t!==p){l=c.$new(),p=a.$current.locals[m],l.$emit("$viewContentLoading",m);var u=i(l,function(a){var e=f.defer(),h=f.defer(),i={$animEnter:e.promise,$animLeave:h.promise,$$animLeave:h};a.data("$uiViewAnim",i),s.enter(a,g,function(){e.resolve(),o&&o.$emit("$viewContentAnimationEnded"),(b.isDefined(r)&&!r||c.$eval(r))&&d(a)}),k()});n=u,o=l,o.$emit("$viewContentLoaded",m),o.$eval(q)}}var m,n,o,p,q=j.onload||"",r=j.autoscroll,s=h(j,c);g.inheritedData("$uiView");c.$on("$stateChangeSuccess",function(){l(!1)}),l(!0)}}};return l}function B(a,c,d,e){return{restrict:"ECA",priority:-400,compile:function(f){var g=f.html();return f.empty?f.empty():f[0].innerHTML=null,function(f,h,i){var j=d.$current,k=C(f,i,h,e),l=j&&j.locals[k];if(!l)return h.html(g),void a(h.contents())(f);h.data("$uiView",{name:k,state:l.$$state}),h.html(l.$template?l.$template:g);var m=b.extend({},l);f[l.$$resolveAs]=m;var n=a(h.contents());if(l.$$controller){l.$scope=f,l.$element=h;var o=c(l.$$controller,l);l.$$controllerAs&&(f[l.$$controllerAs]=o,f[l.$$controllerAs][l.$$resolveAs]=m),O(o.$onInit)&&o.$onInit(),h.data("$ngControllerController",o),h.children().data("$ngControllerController",o)}n(f)}}}}function C(a,b,c,d){var e=d(b.uiView||b.name||"")(a),f=c.inheritedData("$uiView");return e.indexOf("@")>=0?e:e+"@"+(f?f.state.name:"")}function D(a,b){var c,d=a.match(/^\s*({[^}]*})\s*$/);if(d&&(a=b+"("+d[1]+")"),c=a.replace(/\n/g," ").match(/^([^(]+?)\s*(\((.*)\))?$/),!c||4!==c.length)throw new Error("Invalid state ref '"+a+"'");return{state:c[1],paramExpr:c[3]||null}}function E(a){var b=a.parent().inheritedData("$uiView");if(b&&b.state&&b.state.name)return b.state}function F(a){var b="[object SVGAnimatedString]"===Object.prototype.toString.call(a.prop("href")),c="FORM"===a[0].nodeName;return{attr:c?"action":b?"xlink:href":"href",isAnchor:"A"===a.prop("tagName").toUpperCase(),clickable:!c}}function G(a,b,c,d,e){return function(f){var g=f.which||f.button,h=e();if(!(g>1||f.ctrlKey||f.metaKey||f.shiftKey||a.attr("target"))){var i=c(function(){b.go(h.state,h.params,h.options)});f.preventDefault();var j=d.isAnchor&&!h.href?1:0;f.preventDefault=function(){j--<=0&&c.cancel(i)}}}}function H(a,b){return{relative:E(a)||b.$current,inherit:!0}}function I(a,c){return{restrict:"A",require:["?^uiSrefActive","?^uiSrefActiveEq"],link:function(d,e,f,g){var h,i=D(f.uiSref,a.current.name),j={state:i.state,href:null,params:null},k=F(e),l=g[1]||g[0],m=null;j.options=T(H(e,a),f.uiSrefOpts?d.$eval(f.uiSrefOpts):{});var n=function(c){c&&(j.params=b.copy(c)),j.href=a.href(i.state,j.params,j.options),m&&m(),l&&(m=l.$$addStateInfo(i.state,j.params)),null!==j.href&&f.$set(k.attr,j.href)};i.paramExpr&&(d.$watch(i.paramExpr,function(a){a!==j.params&&n(a)},!0),j.params=b.copy(d.$eval(i.paramExpr))),n(),k.clickable&&(h=G(e,a,c,k,function(){return j}),e[e.on?"on":"bind"]("click",h),d.$on("$destroy",function(){e[e.off?"off":"unbind"]("click",h)}))}}}function J(a,b){return{restrict:"A",require:["?^uiSrefActive","?^uiSrefActiveEq"],link:function(c,d,e,f){function g(b){m.state=b[0],m.params=b[1],m.options=b[2],m.href=a.href(m.state,m.params,m.options),n&&n(),j&&(n=j.$$addStateInfo(m.state,m.params)),m.href&&e.$set(i.attr,m.href)}var h,i=F(d),j=f[1]||f[0],k=[e.uiState,e.uiStateParams||null,e.uiStateOpts||null],l="["+k.map(function(a){return a||"null"}).join(", ")+"]",m={state:null,params:null,options:null,href:null},n=null;c.$watch(l,g,!0),g(c.$eval(l)),i.clickable&&(h=G(d,a,b,i,function(){return m}),d[d.on?"on":"bind"]("click",h),c.$on("$destroy",function(){d[d.off?"off":"unbind"]("click",h)}))}}}function K(a,b,c){return{restrict:"A",controller:["$scope","$element","$attrs","$timeout",function(b,d,e,f){function g(b,c,e){var f=a.get(b,E(d)),g=h(b,c),i={state:f||{name:b},params:c,hash:g};return p.push(i),q[g]=e,function(){var a=p.indexOf(i);a!==-1&&p.splice(a,1)}}function h(a,c){if(!P(a))throw new Error("state should be a string");return Q(c)?a+V(c):(c=b.$eval(c),Q(c)?a+V(c):a)}function i(){for(var a=0;a<p.length;a++)l(p[a].state,p[a].params)?j(d,q[p[a].hash]):k(d,q[p[a].hash]),m(p[a].state,p[a].params)?j(d,n):k(d,n)}function j(a,b){f(function(){a.addClass(b)})}function k(a,b){a.removeClass(b)}function l(b,c){return a.includes(b.name,c)}function m(b,c){return a.is(b.name,c)}var n,o,p=[],q={};n=c(e.uiSrefActiveEq||"",!1)(b);try{o=b.$eval(e.uiSrefActive)}catch(a){}o=o||c(e.uiSrefActive||"",!1)(b),Q(o)&&S(o,function(c,d){if(P(c)){var e=D(c,a.current.name);g(e.state,b.$eval(e.paramExpr),d)}}),this.$$addStateInfo=function(a,b){if(!(Q(o)&&p.length>0)){var c=g(a,b,o);return i(),c}},b.$on("$stateChangeSuccess",i),i()}]}}function L(a){var b=function(b,c){return a.is(b,c)};return b.$stateful=!0,b}function M(a){var b=function(b,c,d){return a.includes(b,c,d)};return b.$stateful=!0,b}var N=b.isDefined,O=b.isFunction,P=b.isString,Q=b.isObject,R=b.isArray,S=b.forEach,T=b.extend,U=b.copy,V=b.toJson;b.module("ui.router.util",["ng"]),b.module("ui.router.router",["ui.router.util"]),b.module("ui.router.state",["ui.router.router","ui.router.util"]),b.module("ui.router",["ui.router.state"]),b.module("ui.router.compat",["ui.router"]),q.$inject=["$q","$injector"],b.module("ui.router.util").service("$resolve",q),b.module("ui.router.util").provider("$templateFactory",r);var W;t.prototype.concat=function(a,b){var c={caseInsensitive:W.caseInsensitive(),strict:W.strictMode(),squash:W.defaultSquashPolicy()};return new t(this.sourcePath+a+this.sourceSearch,T(c,b),this)},t.prototype.toString=function(){return this.source},t.prototype.exec=function(a,b){function c(a){function b(a){return a.split("").reverse().join("")}function c(a){return a.replace(/\\-/g,"-")}var d=b(a).split(/-(?!\\)/),e=o(d,b);return o(e,c).reverse()}var d=this.regexp.exec(a);if(!d)return null;b=b||{};var e,f,g,h=this.parameters(),i=h.length,j=this.segments.length-1,k={};if(j!==d.length-1)throw new Error("Unbalanced capture group in route '"+this.source+"'");var l,m;for(e=0;e<j;e++){for(g=h[e],l=this.params[g],m=d[e+1],f=0;f<l.replace.length;f++)l.replace[f].from===m&&(m=l.replace[f].to);m&&l.array===!0&&(m=c(m)),N(m)&&(m=l.type.decode(m)),k[g]=l.value(m)}for(;e<i;e++){for(g=h[e],k[g]=this.params[g].value(b[g]),l=this.params[g],m=b[g],f=0;f<l.replace.length;f++)l.replace[f].from===m&&(m=l.replace[f].to);N(m)&&(m=l.type.decode(m)),k[g]=l.value(m)}return k},t.prototype.parameters=function(a){return N(a)?this.params[a]||null:this.$$paramNames},t.prototype.validates=function(a){return this.params.$$validates(a)},t.prototype.format=function(a){function b(a){return encodeURIComponent(a).replace(/-/g,function(a){return"%5C%"+a.charCodeAt(0).toString(16).toUpperCase()})}a=a||{};var c=this.segments,d=this.parameters(),e=this.params;if(!this.validates(a))return null;var f,g=!1,h=c.length-1,i=d.length,j=c[0];for(f=0;f<i;f++){var k=f<h,l=d[f],m=e[l],n=m.value(a[l]),p=m.isOptional&&m.type.equals(m.value(),n),q=!!p&&m.squash,r=m.type.encode(n);if(k){var s=c[f+1],t=f+1===h;if(q===!1)null!=r&&(j+=R(r)?o(r,b).join("-"):encodeURIComponent(r)),j+=s;else if(q===!0){var u=j.match(/\/$/)?/\/?(.*)/:/(.*)/;j+=s.match(u)[1]}else P(q)&&(j+=q+s);t&&m.squash===!0&&"/"===j.slice(-1)&&(j=j.slice(0,-1))}else{if(null==r||p&&q!==!1)continue;if(R(r)||(r=[r]),0===r.length)continue;r=o(r,encodeURIComponent).join("&"+l+"="),j+=(g?"&":"?")+(l+"="+r),g=!0}}return j},u.prototype.is=function(a,b){return!0},u.prototype.encode=function(a,b){return a},u.prototype.decode=function(a,b){return a},u.prototype.equals=function(a,b){return a==b},u.prototype.$subPattern=function(){var a=this.pattern.toString();return a.substr(1,a.length-2)},u.prototype.pattern=/.*/,u.prototype.toString=function(){return"{Type:"+this.name+"}"},u.prototype.$normalize=function(a){return this.is(a)?a:this.decode(a)},u.prototype.$asArray=function(a,b){function d(a,b){function d(a,b){return function(){return a[b].apply(a,arguments)}}function e(a){return R(a)?a:N(a)?[a]:[]}function f(a){switch(a.length){case 0:return c;case 1:return"auto"===b?a[0]:a;default:return a}}function g(a){return!a}function h(a,b){return function(c){if(R(c)&&0===c.length)return c;c=e(c);var d=o(c,a);return b===!0?0===n(d,g).length:f(d)}}function i(a){return function(b,c){var d=e(b),f=e(c);if(d.length!==f.length)return!1;
for(var g=0;g<d.length;g++)if(!a(d[g],f[g]))return!1;return!0}}this.encode=h(d(a,"encode")),this.decode=h(d(a,"decode")),this.is=h(d(a,"is"),!0),this.equals=i(d(a,"equals")),this.pattern=a.pattern,this.$normalize=h(d(a,"$normalize")),this.name=a.name,this.$arrayMode=b}if(!a)return this;if("auto"===a&&!b)throw new Error("'auto' array mode is for query parameters only");return new d(this,a)},b.module("ui.router.util").provider("$urlMatcherFactory",v),b.module("ui.router.util").run(["$urlMatcherFactory",function(a){}]),w.$inject=["$locationProvider","$urlMatcherFactoryProvider"],b.module("ui.router.router").provider("$urlRouter",w),x.$inject=["$urlRouterProvider","$urlMatcherFactoryProvider"],b.module("ui.router.state").factory("$stateParams",function(){return{}}).constant("$state.runtime",{autoinject:!0}).provider("$state",x).run(["$injector",function(a){a.get("$state.runtime").autoinject&&a.get("$state")}]),y.$inject=[],b.module("ui.router.state").provider("$view",y),b.module("ui.router.state").provider("$uiViewScroll",z),A.$inject=["$state","$injector","$uiViewScroll","$interpolate","$q"],B.$inject=["$compile","$controller","$state","$interpolate"],b.module("ui.router.state").directive("uiView",A),b.module("ui.router.state").directive("uiView",B),I.$inject=["$state","$timeout"],J.$inject=["$state","$timeout"],K.$inject=["$state","$stateParams","$interpolate"],b.module("ui.router.state").directive("uiSref",I).directive("uiSrefActive",K).directive("uiSrefActiveEq",K).directive("uiState",J),L.$inject=["$state"],M.$inject=["$state"],b.module("ui.router.state").filter("isState",L).filter("includedByState",M)}(window,window.angular);
app
	.controller('EntityIndexController', function(
		$state,
		EntityModel) {

		var vm = this;

		vm.filter = {
			paginate: true,
			page: 1,
			order: 'desc',
		};

		vm.get = function() {

			EntityModel.index(vm.filter)
			.success(function(data) {

				vm.entities = data.data;
				vm.meta = data.meta;
			});

		}

		if ($state.params.encodedQuery) {

			_.assign(vm.filter, JSON.parse(decodeURI($state.params.encodedQuery)));

			vm.get();
		};



	});
app
	.controller('EntityLogController', function(
		$state,
		LogModel) {

		var vm = this

		vm.entityId = $state.params.id;

		LogModel.index({loggable_type: 'Entity', loggable_id: vm.entityId})
		.success(function(data) {
			vm.logs = data.data
		})
	})
app
	.controller('EntityReportController', function(
		LinkFactory, JwtValidator,
		EntityModel) {

		var vm = this

		vm.download = function(filter) {

			filter.jwt = JwtValidator.encodedJwt
			filter.limit = 300

			window.open(LinkFactory.entity.report + '?' + $.param(filter))

		}

	})
app
	.controller('EntitySearchController', function(
		$state,
		EntityModel) {

		var vm = this;

		vm.open = function(id) {
			$state.go('entityShow', {id: id});
		}
	});
app
    .controller('EntityShowController', function(
        $stateParams, $state, $scope,
        EntityModel, RelationshipModel, EntityRelationshipModel,
        DirectUserModel) {

        var vm = this;

        $('#entity-dob').datepicker({
            dateFormat: "yy-mm-dd",
            defaultDate: "-30y",
            changeYear: true,
            changeMonth: true,
        })


        vm.save = function(entity, params) {

            if ($stateParams.id) {

                EntityModel.update(entity)
                    .success(function(data) {
                        vm.entity = data.data;
                        alert('Update berhasil');
                    });

            } else {

                EntityModel.store(entity, params)
                    .then(function(res) {
                        $state.go('entityShow', { id: res.data.data.id });
                    }, function(res) {

                        if (res.userResponse) {
                            vm.save(entity, res.userResponse)
                        }

                    })
            };
        }

        vm.delete = function(entity) {

            EntityModel.delete(entity)
                .success(function() {
                    alert('Berhasil dihapus');
                    $state.go('entitySearch');
                });
        }

        vm.action = {
            requestDelete: function(entity, requestDelete) {
                EntityModel.action.requestDelete(entity.id, { request_delete: requestDelete })
                    .success(function(data) {
                        vm.entity = data.data
                    })
            },
            editLock: function(entity, editLock) {
                EntityModel.action.editLock(entity.id, { edit_lock: editLock })
                    .success(function(data) {
                        vm.entity = data.data
                    })
            }
        }

        vm.findDirectUser = function(email) {

            DirectUserModel.index({ email: email })
                .success(function(data) {

                    if (data.data.id) {

                        var foundUser = data.data

                        alert('User ditemukan dengan ID: ' + foundUser.id + ' Nama: ' + foundUser.name);
                        vm.entity.user_id = foundUser.id;
                    }
                })
        }

        vm.updateEntityRelationship = function(relationship) {

            if (relationship.assigned) {
                EntityRelationshipModel.store({ relationship_id: relationship.id, entity_id: vm.entity.id })
            } else {
                EntityRelationshipModel.delete({ relationship_id: relationship.id, entity_id: vm.entity.id })
            }
        }

        vm.coordinate = {
            set: function() {

                navigator.geolocation.getCurrentPosition(function(position) {

                    vm.entity.address_lng = position.coords.longitude
                    vm.entity.address_lat = position.coords.latitude

                    $scope.$apply()
                })
            },
            open: function() {
                var coordString = _.toString(vm.entity.address_lat) + ',' + _.toString(vm.entity.address_lng)
                var placeString = _.toString(vm.entity.address_lat) + '+' + _.toString(vm.entity.address_lng)
                window.open('https://www.google.co.id/maps/place/' + placeString + '/@' + coordString + ',20z?hl=en')
            }
        }

        function processRelationships() {

            _.each(vm.relationships, function(relationship) {

                var entityRelationship = _.find(vm.entity.entityRelationships, { relationship_id: relationship.id });

                if (_.isObject(entityRelationship)) {
                    relationship.assigned = true;
                    relationship.entityRelationship = entityRelationship;
                } else {
                    relationship.assigned = false;
                };
            });
        }

        vm.entity = {}
        if ($stateParams.id) {

            EntityModel.get($stateParams.id)
                .success(function(data) {
                    vm.entity = data.data;
                    vm.entity.entityRelationships = vm.entity.entityRelationships.data
                    processRelationships()
                });
        }

        RelationshipModel.index()
            .then(function(res) {
                vm.relationships = res.data.data
                processRelationships()
            })

        vm.fileManager = {
            ktp: {
                displayedInput: JSON.stringify({
                    file: { label: "KTP", show: true },
                }),
                additionalData: JSON.stringify({
                    image: { resize: { height: 1000, width: 1000 } },
                    path: 'entity',
                    subpath: $state.params.id + '/ktp',
                    fileable_type: 'Entity',
                    fileable_id: $state.params.id,
                    name: 'KTP'
                })
            },
        }
    });
app
    .controller('RelationshipIndexController', function(
        $state,
        RelationshipModel) {

        var vm = this;

        vm.filter = {}
        vm.relationships = []

        vm.get = function() {

            RelationshipModel.index(vm.filter)
                .then(function(res) {

                    vm.relationships = res.data.data;
                    vm.meta = res.data.meta;
                });
        }
        vm.get()

        vm.store = function(relationship) {

            if (relationship.id) {

                RelationshipModel.update(relationship.id, relationship)
                    .then(function(res) {
                        alert('Update berhasil')
                        relationship = res.data.data
                        vm.focused = null
                    })

            } else {


                RelationshipModel.store(relationship)
                    .then(function(res) {
                        relationship = res.data.data
                        vm.relationships.push(relationship)
                        vm.focused = null
                    })
            }
        }
    });

//# sourceMappingURL=all.js.map
