app
	.factory('LinkFactory', function() {

		var domains = {
			base: 'http://base.hondagelora.com/',
			entity: window.location.protocol + '//' + window.location.host + '/',
		}

		var apps = {
			authentication: domains.base + 'base/',
			entity: domains.entity + 'entity/',
		};
		
		return {

			authentication: {
				login: apps.authentication + 'user/authentication/login',
				tenantSelect: apps.authentication + 'user/tenant-select/selecting/'
			},

			entity: {
				base: apps.entity + 'api/entity/'
			},


		};
	});