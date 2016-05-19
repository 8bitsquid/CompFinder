angular.module('ualib.compfinder.computers', [
    'ualib.compfinder.mapsDirective',
    'ualib.compfinder.service'
])

    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/computers/:building?', {
                reloadOnSearch: false,
                resolve: {
                    mapdata: ['Computers', '$route', function(Computers, $route){
                        return Computers.init($route.current.params, {noRefresh: true});
                    }],
                    lazyLoad: ['$ocLazyLoad', function($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load('angular.filter');
                    }]
                },
                templateUrl: 'computers/computers.tpl.html',
                controller: 'ComputersCtrl'
            })
            .when('/computers/:building/:floor', {
                reloadOnSearch: false,
                resolve: {
                    mapdata: ['Computers', '$route', function(Computers, $route){
                        return Computers.init($route.current.params, {noRefresh: true});
                    }],
                    lazyLoad: ['$ocLazyLoad', function($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load('angular.filter');
                    }]
                },
                templateUrl: 'computers/computers-floor.tpl.html',
                controller: 'ComputersFloorCtrl'
            });
    }])

    .controller('ComputersCtrl', ['$scope', 'Computers', '$route', function($scope, Computers, $route){
        $scope.mapdata = Computers;
        $scope.params = {};

        $scope.$on('$routeChangeSuccess', function(ev, current){
            $scope.params = angular.copy(current.params);
        });
    }])

    .controller('ComputersFloorCtrl', ['$scope', 'Computers', '$mapObjects',
        function($scope, Computers, $mapObjects){
            $scope.mapdata = Computers;
            $scope.mapObjects = $mapObjects;

        }]);