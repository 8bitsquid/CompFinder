angular.module('ualib.compfinder.service', [
    'ualib.compfinder.factory'
])

    .service('Computers', ['compSoftFactory', '$timeout', '$q', '$rootScope', function(compSoftFactory, $timeout, $q, $rootScope){
        var _params = {};
        var _options = {
            noRefresh: false
        };
        var _refresh = null;
        var _cancel = false;
        var self = this;

        this.buildings = [];
        this.unassigned = [];
        
        this.init = function(params, opt){
            var deferred = $q.defer();
            params = angular.isDefined(params) ? params : {};
            _params = params;
            opt = angular.isDefined(opt) ? opt : {};


            angular.extend(_options, opt);

            if (_refresh) {
                self.cancelRefresh();
            }
            
            getComputers().$promise.then(function(data){
                self.buildings = angular.copy(data.buildings);
                if (_options.noRefresh === false){
                    refresh();
                }
                else {
                    self.unassigned = angular.copy(data.unassigned);
                }
                deferred.resolve();
            });

            return deferred.promise;
        };

        this.cancelRefresh = function(){
            var _cancel = true;
        };
        
        function refresh(){
            if (!_cancel){
                _refresh = $timeout(function(){
                    getComputers().$promise.then(function(data){
                        self.buildings = angular.copy(data.buildings);
                        refresh();
                    });
                }, 8000);
            }
            else {
                $timeout.cancel(_refresh);
            }
        }
        
        function getComputers(){
            if (_options.hasOwnProperty('demo') && _options.demo === true){
                return compSoftFactory.demo().get(_params, function(data){
                    return data;
                }, function(data, status, headers, config) {
                    console.log('ERROR: Computers and Software');
                    console.log({
                        data: data,
                        status: status,
                        headers: headers,
                        config: config
                    });
                });
            }
            else if (_params.hasOwnProperty('floor')){
                return compSoftFactory.floors().get(_params, function(data){
                    return data;
                }, function(data, status, headers, config) {
                    console.log('ERROR: Computers and Software');
                    console.log({
                        data: data,
                        status: status,
                        headers: headers,
                        config: config
                    });
                });
            }
            else {
                return compSoftFactory.buildings().get(_params, function(data){
                    return data;
                }, function(data, status, headers, config) {
                    console.log('ERROR: Computers and Software');
                    console.log({
                        data: data,
                        status: status,
                        headers: headers,
                        config: config
                    });
                });
            }
        }
        
        

    }]);