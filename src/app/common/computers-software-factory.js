angular.module('ualib.compfinder.factory', [])
    .constant('DOMAIN', 'https://wwwdev2.lib.ua.edu/')
    .constant('WP_API', 'https://wwwdev2.lib.ua.edu/wp-json/wp/v2/')
    .constant('SW_API', 'https://wwwdev2.lib.ua.edu/softwareList/api/')

    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    }])

    .factory('AuthInterceptor', ['AuthService', 'DOMAIN', function (AuthService, DOMAIN) {
        return {
            // automatically attach Authorization header
            request: function(config) {
                config.headers = config.headers || {};

                //interceptor for UALib JWT tokens
                var token = AuthService.getToken();
                if(config.url.indexOf(DOMAIN) === 0 && token) {
                    config.headers.Authorization = "Bearer " + token;
                }

                //interceptor for WordPress nonce headers
                if (typeof myLocalized !== 'undefined') {
                    config.headers['X-WP-Nonce'] = myLocalized.nonce;
                } else {
                    console.log("myLocalized script is not defined, cannot read WP nonce.");
                }
                return config;
            },

            // If a token was sent back, save it
            response: function(res) {
                if(res.config.url.indexOf(DOMAIN) === 0 && angular.isDefined(res.data.token)) {
                    AuthService.saveToken(res.data.token);
                }
                return res;
            }
        };
    }])

    .service('AuthService', ['$window', function($window){
        var self = this;

        self.parseJWT = function(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse($window.atob(base64));
        };
        self.saveToken = function(token) {
            $window.localStorage['ualibweb.Token'] = token;
            console.log('Token saved');
        };
        self.getToken = function() {
            return $window.localStorage['ualibweb.Token'];
        };
        self.isAuthorized = function() {
            var token = self.getToken();
            if (token) {
                var params = self.parseJWT(token);
                if (Math.round(new Date().getTime() / 1000) <= params.exp) {
                    console.log('Authenticated.');
                    return params.user;
                }
            }
            console.log('Authentication failed.');
            return false;
        };
        self.logout = function() {
            $window.localStorage.removeItem('ualibweb.Token');
            console.log('Token deleted');
        };
    }])

    .service('tokenReceiver', ['$http', 'WP_API', function($http, API){
        this.promise = null;
        function makeRequest() {
            return $http.get(API + 'users/me')
                .then(function(r1){
                    if (angular.isDefined(r1.data.id)) {
                        $http.get(API + 'users/' + r1.data.id, {context: 'edit'})
                            .then(function (r2) {
                                return r2.data;
                            });
                    }
                });
        }
        this.getPromise = function(update){
            if (update || !this.promise) {
                this.promise = makeRequest();
            }
            return this.promise;
        };
    }])

    .factory('compSoftFactory', ['$resource', '$http', 'SW_API', function($resource, $http, API){

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
                console.log("compSoftFactory.Buildings");
                return $resource(API + 'buildings/:buildingID', {buildingID:'@buildingID'}, {
                    get: {
                        method: 'GET',
                        transformResponse: appendTransform($http.defaults.transformResponse, buildingsTransform)
                    }
                });
            },
            floors: function(){
                console.log("compSoftFactory.Floors");
                return $resource(API + 'floors/:floorID', {floorID:'@floorID'}, {
                    get: {
                        method: 'GET',
                        url: API + 'buildings/:building/floors/:floor',
                        transformResponse: appendTransform($http.defaults.transformResponse, buildingsTransform)
                    }
                });
            },
            computers: function(){
                console.log("compSoftFactory.Computers");
                return $resource(API + 'computers', {});
            }
        };
    }]);