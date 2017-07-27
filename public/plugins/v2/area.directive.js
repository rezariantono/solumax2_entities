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
                scope.load()


            }
        }

    })