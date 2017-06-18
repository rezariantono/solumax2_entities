app
    .factory('AreaModel', function(
        $http,
        LinkFactory) {

        var areaModel = {}

        areaModel.retrieve = function(filter, value) {
            return $http.get(LinkFactory.area.api, { params: { filter: filter, value: value } })
        }

        return areaModel
    })
