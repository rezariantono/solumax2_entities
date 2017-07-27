// app
//     .directive('areaSelector', function(
//         $parse,
//         AreaModel) {

//         return {
//             templateUrl: 'app/area/selector/areaSelector.html',
//             scope: {
//                 innerprovinsi: '=provinsi',
//                 innerkota: '=kota',
//                 innerjeniskota: '=jenisKota',
//                 innerkecamatan: '=kecamatan',
//                 innerkelurahan: '=kelurahan',
//                 innerkodepos: '=kodePos',
//             },
//             link: function(scope, elem, attrs) {


//                 // _.each(['innerprovinsi', 'innerkota', 'innerkecamatan', 'innerkelurahan'], function(val) {
//                 //     scope.$watch(val, function(newValue) {
//                 //         scope[val.substring(5,100)] = newValue
//                 //     })
//                 // })

//                 scope.load = function(filter, value) {

//                     AreaModel.retrieve(filter, value)
//                         .then(function(res) {

//                             switch (filter) {
//                                 case "provinsi":
//                                     scope.cities = res.data.data
//                                     break
//                                 case "kota":
//                                     scope.kecamatans = res.data.data
//                                     break
//                                 case "kecamatan":
//                                     scope.kelurahans = res.data.data
//                                     break
//                                 case undefined:
//                                     scope.provinces = res.data.data
//                                     break
//                             }
//                         })

//                     scope['inner' + filter] = value
//                 }
//                 scope.load()


//             }
//         }

//     })
