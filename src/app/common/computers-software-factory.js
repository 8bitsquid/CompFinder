angular.module('ualib.compfinder.factory', [])

    .factory('compSoftFactory', ['$resource', '$http', function($resource, $http){
        var URL = 'https://wwwdev.lib.ua.edu/softwareList/api/buildings';

        function getTotalAvail(array, prop){
            prop = angular.isUndefined(prop) ? 'desktops' : prop;
            return array.filter(function(item){
                return prop === 'desktops' ? item.status === 3 : item.available === 0;
            }).length;
        }


        function appendTransform(defaults, transform) {

            // We can't guarantee that the default transformation is an array
            defaults = angular.isArray(defaults) ? defaults : [defaults];
            //console.log(defaults.concat(transform));
            // Append the new transformation to the defaults
            return defaults.concat(transform);
        }

        function buildingsTransform(data){
            var b = angular.fromJson(data);
            var buildings = [];

            angular.forEach(b.buildings, function(building, idx){
                var desktops = 0;
                var laptops = 0;

                for (var i = 0, len = building.floors.length; i < len; i++){
                    var floor = {available: {}};

                    if (building.floors[i].hasOwnProperty('desktops')){
                        var d = getTotalAvail(building.floors[i].desktops, 'desktops');
                        floor.available.desktops = d;
                        desktops += d;
                    }

                    if (building.floors[i].hasOwnProperty('laptops')){
                        var l = getTotalAvail(building.floors[i].laptops, 'laptops');
                        floor.available.laptops = l;
                        laptops += l;
                    }

                    building.floors[i] = angular.extend({}, building.floors[i], floor);

                }

                building.available = {
                    desktops: desktops,
                    laptops: laptops
                };

                buildings.push(building);
            });

            b.buildings = buildings;
            return b;
        }

        return {
            buildings: function(){

                return $resource(URL, {}, {
                    get: {
                        method: 'GET',
                        transformResponse: appendTransform($http.defaults.transformResponse, buildingsTransform)
                    }
                });
            },
            floors: function(){
                return $resource(URL + '/:building/floors/:floor', {}, {
                    get: {
                        method: 'GET',
                        transformResponse: appendTransform($http.defaults.transformResponse, buildingsTransform)
                    }
                });
            }
        };
    }]);