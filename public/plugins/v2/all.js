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
solumaxEntityFinder
    .directive('areaSelector', function(
        $sce,
        EntityPluginsFactory) {

        return {
            templateUrl: $sce.trustAsResourceUrl(EntityPluginsFactory.links.files + 'area-selector.html'),
            scope: {
                innerprovinsi: '=provinsi',
                innerkota: '=kota',
                innerjeniskota: '=jenisKota',
                innerkecamatan: '=kecamatan',
                innerkelurahan: '=kelurahan',
                innerkodepos: '=kodePos',
            },
            link: function(scope, elem, attrs) {

                scope.load = function(filter, value) {

                    if (!filter && scope.provinces) {
                        return;
                    }

                    EntityPluginsFactory.models.area.retrieve(filter, value)
                        .then(function(res) {

                            switch (filter) {
                                case "provinsi":
                                    scope.cities = res.data.data
                                    break
                                case "kota":
                                    scope.kecamatans = res.data.data
                                    break
                                case "kecamatan":
                                    scope.kelurahans = res.data.data
                                    break
                                case undefined:
                                    scope.provinces = res.data.data
                                    break
                            }
                        })

                    scope['inner' + filter] = value
                }
            }
        }

    })
    .directive('areaSelectorByProvince', function(
        $sce, $http,
        EntityPluginsFactory) {

        return {
            templateUrl: $sce.trustAsResourceUrl(EntityPluginsFactory.links.files + 'area-selector-by-province.html'),
            scope: {
                directiveSelected: '=selected',
            },
            link: function(scope, elem, attrs) {

                scope.provinces = [
                    { name: 'Jawa Barat', file: 'jawaBarat.json' }
                ]

                scope.loadByProvince = function(provinceFile) {

                    $http.get(EntityPluginsFactory.links.areasByProvince + provinceFile)
                        .then(function(res) {
                            scope.data = res.data

                            scope.data.kota = transform(scope.data.kota)
                            scope.data.kecamatan = transform(scope.data.kecamatan)
                            scope.data.kelurahan = transform(scope.data.kelurahan)
                        })
                }

                scope.$watch('selected', function(newValue, oldValue) {
                    if (typeof scope.directiveSelected != 'undefined') {
                        scope.directiveSelected = newValue
                    }
                }, true)

                scope.$watch('directiveSelected', function(newValue, oldValue) {
                    if (typeof newValue != 'undefined') {
                        scope.selected = newValue
                    }
                    if (typeof newValue != 'undefined' && typeof oldValue == 'undefined') {
                        scope.loadByProvince(newValue.provinsi.file)
                    }
                }, true)

                function transform(array) {
                    return _.map(array, function(val, key) {
                        return {
                            code: key,
                            name: val
                        }
                    })
                }
            }
        }

    })
solumaxEntityFinder
    .directive('entityFinderModal', function(
        $sce, $http, $timeout,
        EntityPluginsFactory) {

        return {
            templateUrl: $sce.trustAsResourceUrl(EntityPluginsFactory.links.files + 'entity-finder-modal.html'),
            restrict: 'E',
            scope: {
                selectedEntity: "=",
                additionalParams: "@",
                onEntitySelected: "&",
                searchOnly: "@",
                relationshipIds: '@',
            },
            link: function(scope, elem, attrs) {

                scope.modalId = Math.random().toString(36).substring(2, 7)

                scope.relationshipIdsChecked = {}
                scope.checkRelationship = function(relationship) {
                    if (!_.get(scope.relationshipIdsChecked[relationship.id], 'checked')) {
                        scope.relationshipIdsChecked[relationship.id] = {
                            id: relationship.id,
                            checked: true
                        }
                    } else {
                        scope.relationshipIdsChecked[relationship.id] = {
                            id: relationship.id,
                            checked: false
                        }
                    }
                }

                scope.registerNewEntity = function() {
                    window.open(EntityPluginsFactory.links.redirectApp.entity.new);
                }

                scope.openInApp = function(entity) {
                    window.open(EntityPluginsFactory.links.redirectApp.entity.openById + entity.id);
                }

                scope.select = function(entity) {

                    scope.selectedEntity = entity;
                    $timeout(function() {
                        scope.onEntitySelected();
                    }, 250);

                    $('#entity-finder-modal-' + scope.modalId).modal('hide');
                }

                scope.search = function() {

                    if (scope.additionalParams) {
                        _.assign(scope.filter, JSON.parse(scope.additionalParams))
                    }

                    scope.filter.relationship_ids = _.flatMap(_.filter(scope.relationshipIdsChecked, { checked: true }), 'id').join(',')

                    EntityPluginsFactory.models.entity.index(_.omit(scope.filter, ['pageIncrease', 'pageDecrease']))
                        .then(function(res) {

                            scope.entities = res.data.data;
                            scope.meta = res.data.meta;
                        });
                }
                
                scope.loadRelationships = function() {
                    
                    if (!scope.relationships) {

                        EntityPluginsFactory.models.relationship.index()
                            .then(function(res) {
                                scope.relationships = res.data.data
                            })
                    }
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
                }

                scope.$watch('relationshipIds', function(newVal) {
                    if (newVal) {
                        _.forEach(newVal.split(','), function(id) {
                            scope.checkRelationship({ id: id })
                        })
                    }
                })
            }
        };
    })
    .directive('entityRedirect', function(
        EntityPluginsFactory) {

        return {
            template: '<a class="btn btn-xs btn-primary" ng-click="open(entity)">{{ entity.id || "Belum Terdaftar. Klik Untuk Buat Baru" }}</a>',
            restrict: 'E',
            scope: {
                innerEntity: '=entity',
                entityId: '@'
            },
            link: function(scope, elem, attrs) {

                scope.$watch('innerEntity', function(newValue) {
                    if (newValue) {
                        scope.entity = scope.innerEntity
                    }
                })

                attrs.$observe('entityId', function(newValue) {
                    if (newValue) {
                        scope.entity = {
                            id: newValue
                        }
                    }
                })

                scope.open = function(entity) {
                    if (entity) {
                        window.open(EntityPluginsFactory.links.redirectApp.entity.openById + entity.id);
                    } else {
                        window.open(EntityPluginsFactory.links.redirectApp.entity.openById + entity.id);
                    }
                }
            }
        }
    })
    .directive('entityRetriever', function(
        $timeout,
        EntityPluginsFactory) {

        return {
            template: '<a ng-show="entityId" class="btn btn-xs btn-primary" ng-click="retrieve(entityId)">Refresh Data</a>',
            restrict: 'E',
            scope: {
                entityId: '@',
                entity: '=',
                onEntityRetrieved: '&',
            },
            link: function(scope, elem, attrs) {

                scope.retrieve = function(entityId) {

                    EntityPluginsFactory.models.entity.get(entityId)
                        .then(function(res) {

                            scope.entity = res.data.data;
                            alert('Entity data berhasil direfresh');

                            $timeout(function() {
                                scope.onEntityRetrieved();
                            }, 250);


                        });

                }
            }
        }
    })
    .directive('entityUpdaterModal', function(
        $sce, $http, $timeout,
        EntityPluginsFactory) {

        return {
            templateUrl: $sce.trustAsResourceUrl(EntityPluginsFactory.links.files + 'entity-updater-modal.html'),
            restrict: 'AE',
            scope: {
                selectedEntity: "=entity",
                entityId: "@",
                onEntityUpdated: "&",
                newPhoneNumber: "@",
                newEntityData: "="
            },
            link: function(scope, elem, attrs) {

                scope.modalId = Math.random().toString(36).substring(2, 7)

                if (scope.entityId) {

                    attrs.$observe('entityId', function(newValue) {

                        EntityPluginsFactory.models.entity.get(newValue)
                            .then(function(res) {
                                scope.entity = res.data.data
                            })
                    })

                } else {
                    scope.$watch('selectedEntity', function(newValue) {
                        if (newValue) {
                            scope.entity = newValue
                        }
                    })
                }

                scope.insertValues = function() {

                    var updateableFields = ["phone_number", "address", "ktp", "email"]

                    updateableFields.forEach(function(updateableField) {

                        if (scope.newEntityData[updateableField]) {
                            scope.entity[updateableField] = scope.newEntityData[updateableField]
                        }
                    })

                    if (scope.newPhoneNumber) {
                        scope.entity.phone_number = scope.newPhoneNumber
                    }
                }


                scope.registerNew = function() {
                    window.open(EntityPluginsFactory.links.domain + 'redirect-app/entity/new');
                }

                scope.openInApp = function(entity) {
                    window.open(EntityPluginsFactory.links.domain + 'redirect-app/entity/' + entity.id);
                }

                scope.update = function(entity) {

                    EntityPluginsFactory.models.entity.update(entity.id, entity)
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
//# sourceMappingURL=all.js.map
