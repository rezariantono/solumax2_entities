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

			entity: {
				base: domains.entity,
				api: apps.entity + 'api/entity/',
			},

			relationship: {
				api: apps.entity + 'api/relationship/',
			},


		};
	});