var solumaxEntityFinder = angular
    .module('Solumax.Entity', [])
    .directive('entityFinderModal', function(
        $sce, $http, $timeout,
        ExternalEntityModel, ExternalRelationshipModel) {

        return {
            templateUrl: $sce.trustAsResourceUrl(ExternalEntityModel.links.files + 'entity-finder-modal.html'),
            restrict: 'E',
            scope: {
                selectedEntity: "=",
                additionalParams: "@",
                onEntitySelected: "&",
                searchOnly: "@"
            },
            link: function(scope, elem, attrs) {

                scope.modalId = Math.random().toString(36).substring(2, 7)

                scope.registerNewEntity = function() {
                    window.open(ExternalEntityModel.links.redirectApp.new);
                }

                scope.openInApp = function(entity) {
                    window.open(ExternalEntityModel.links.redirectApp.openById + entity.id);
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

                    ExternalEntityModel.index(_.omit(scope.filter, ['pageIncrease', 'pageDecrease']))
                        .then(function(res) {

                            scope.entities = res.data.data;
                            scope.meta = res.data.meta;
                        });
                }

                ExternalRelationshipModel.index()
                    .then(function(res) {
                        scope.relationships = res.data.data
                    })

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
    }).directive('entityUpdaterModal', function(
        $sce, $http, $timeout,
        ExternalEntityModel,
        LinkFactory) {

        return {
            templateUrl: $sce.trustAsResourceUrl(ExternalEntityModel.links.files + 'entity-updater-modal.html'),
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

                if (typeof scope.selectedEntity != 'undefined') {

                    scope.entity = scope.selectedEntity

                } else if (scope.entityId) {

                    attrs.$observe('entityId', function(newValue) {

                        ExternalEntityModel.get(newValue)
                            .then(function(res) {
                                scope.entity = res.data.data
                            })
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
                    window.open(ExternalEntityModel.links.domain + 'redirect-app/entity/new');
                }

                scope.openInApp = function(entity) {
                    window.open(ExternalEntityModel.links.domain + 'redirect-app/entity/' + entity.id);
                }

                scope.update = function(entity) {

                    ExternalEntityModel.update(entity.id, entity)
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
    .factory('ExternalEntityModel', function(
        $http, LinkFactory) {

        var env = (window.location.hostname == '192.168.0.227' || window.location.hostname == 'local-xolura.com') ? 'dev' : 'prod'
        var domain = env == 'dev' ? ('http://' + window.location.hostname + ':10777/') : 'https://entity.hondagelora.com/'

        var externalEntityModel = {};

        externalEntityModel.index = function(params) {
            return $http.get(domain + 'entity/api/entity/', { params: params });
        }

        externalEntityModel.get = function(id) {
            return $http.get(domain + 'entity/api/entity/' + id);
        }

        externalEntityModel.update = function(id, entity) {
            return $http.post(domain + 'entity/api/entity/' + id, entity);
        }

        externalEntityModel.links = {
            domain: domain,
            redirectApp: {
                openById: domain + 'redirect-app/entity/',
                new: domain + 'redirect-app/entity/new',
            },
            files: domain + 'plugins/v2/files/'
        }

        return externalEntityModel;
    })
    .factory('ExternalRelationshipModel', function(
        $http, LinkFactory, ExternalEntityModel) {

        var externalRelationshipModel = {};

        externalRelationshipModel.index = function(params) {
            return $http.get(ExternalEntityModel.links.domain + 'entity/api/relationship/', { params: params });
        }

        return externalRelationshipModel;
    })
