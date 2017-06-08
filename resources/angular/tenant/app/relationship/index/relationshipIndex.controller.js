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
