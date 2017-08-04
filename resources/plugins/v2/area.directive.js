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
                selected: '=selected',
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
                    if (typeof newValue != 'undefined' && typeof oldValue == 'undefined' && !_.isUndefined(newValue.provinsi) && !_.isUndefined(newValue.provinsi.file)) {
                        scope.loadByProvince(newValue.provinsi.file)
                    }
                })

                function transform(array) {
                    return _.orderBy(_.map(array, function(val, key) {
                        return {
                            code: key,
                            name: val
                        }
                    }), 'name')
                }
            }
        }

    })
    .directive('areaDisplay', function(
        $sce,
        EntityPluginsFactory) {

        return {
            templateUrl: $sce.trustAsResourceUrl(EntityPluginsFactory.links.files + 'area-display.html'),
            scope: {
                entity: '='
            },
            link: function(scope, elem, attrs) {

            }
        }

    })