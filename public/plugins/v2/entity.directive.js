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
    .directive('entityFilter', function(
        $sce,
        EntityPluginsFactory) {

        return {
            templateUrl: $sce.trustAsResourceUrl(EntityPluginsFactory.links.files + 'entity-filter.html'),
            restrict: 'E',
            scope: {
                filter: '='
            },
            link: function(scope, elem, attrs) {

                $('.date').datepicker({
                    dateFormat: "yy-mm-dd",
                })

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
                    order: 'desc',
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