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


        vm.save = function(entity) {

            console.log(entity)

            if ($stateParams.id) {

                EntityModel.update(entity)
                    .success(function(data) {
                        vm.entity = data.data;
                        alert('Update berhasil');
                    });

            } else {

                EntityModel.store(entity)
                    .success(function(data) {
                        $state.go('entityShow', { id: data.data.id });
                    });
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
                    vm.entity.address_lat =position.coords.latitude

                    $scope.$apply()
                })
            },
            open: function() {
                var coordString = _.toString(vm.entity.address_lat) + ',' + _.toString(vm.entity.address_lng)
                window.open('https://maps.googleapis.com/maps/api/staticmap?center='+coordString+'&markers='+coordString+'&zoom=16&size=600x300')
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