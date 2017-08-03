var solumaxEntityFinder = angular
    .module('Solumax.Entity', [])
    .factory('EntityPluginsFactory', function(
        $http) {

        var entityPluginsFactory = {};

        var env = (window.location.hostname == '192.168.0.227' || window.location.hostname == 'localvagrant') ? 'dev' : 'prod'
        var domain = env == 'dev' ? ('http://' + window.location.hostname + ':10777/') : 'https://entity.hondagelora.com/'

        entityPluginsFactory.links = {
            domain: domain,
            redirectApp: {
                entity: {
                    openById: domain + 'redirect-app/entity/',
                    new: domain + 'redirect-app/entity/new',
                }
            },
            files: domain + 'plugins/v2/files/',
            areasByProvince: domain + 'hot/areasByProvince/'
        }

        entityPluginsFactory.models = {
            entity: {
                index: function(params) {
                    return $http.get(domain + 'entity/api/entity/', { params: params });
                },
                get: function(id) {
                    return $http.get(domain + 'entity/api/entity/' + id);
                },
                update: function(id, entity) {
                    return $http.post(domain + 'entity/api/entity/' + id, entity);
                },
            },
            relationship: {
                index: function(params) {
                    return $http.get(domain + 'entity/api/relationship/', { params: params });
                }
            },
            area: {
                retrieve: function(filter, value) {
                    return $http.get(domain + 'entity/api/area/', { params: { filter: filter, value: value } })
                }
            }
        }

        return entityPluginsFactory;
    })