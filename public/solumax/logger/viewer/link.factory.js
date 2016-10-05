app
	.factory('LinkFactory', function() {

		var env = window.location.hostname == '192.168.0.227' ? 'dev' : 'prod';

		var domains = {
			account: 'https://accounts.xolura.com/',
			log: window.location.protocol + '//' + window.location.host + '/',
		}

		var apps = {
			authentication: domains.account + 'views/user/',
			log: domains.log + 'api/viewer/',
		};
		
		return {

			authentication: {
				login: apps.authentication + 'authentication/login',
				tenantSelect: apps.authentication + 'token-exchange/tenant-select'
			},

			log: {
				base: apps.log + 'log/',
			}
		};
	});