angular.module('ualib.compfinder.admin', [
    'ualib.compfinder.mapsDirective',
    'ualib.compfinder.service',
    'ngFileUpload'
])
    .constant('SOFTWARE_GROUP', 64)

    .run(['$rootScope', function($rootScope) {
        $rootScope.userInfo = {};
    }])

    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/computers/admin/:building/:floor', {
                reloadOnSearch: false,
                resolve: {
                    mapdata: ['Computers', '$route', function(Computers, $route){
                        return Computers.init($route.current.params, {noRefresh: true});
                    }],
                    userData: function(tokenReceiver){
                        return tokenReceiver.getPromise();
                    }
                },
                templateUrl: 'admin/admin.tpl.html',
                controller: 'ComputersAdminCtrl'
            });
    }])

    .controller('ComputersAdminCtrl', ['$scope', 'Computers', '$mapObjects', 'userData', 'SOFTWARE_GROUP', 'AuthService',
    function($scope, Computers, $mapObjects, userData, SOFTWARE_GROUP, AuthService){
        $scope.userInfo = AuthService.isAuthorized();
        $scope.mapdata = {};
        $scope.mapObjects = {};

        $scope.hasAccess = false;
        if (angular.isDefined($scope.userInfo.group)) {
            /*jslint bitwise: true*/
            if ((parseInt($scope.userInfo.group) & SOFTWARE_GROUP) === SOFTWARE_GROUP) {
                $scope.hasAccess = true;
                $scope.mapdata = Computers;
                $scope.mapObjects = $mapObjects;
                console.dir($scope.mapdata);
                console.dir($scope.mapObjects);
            }
            /*jslint bitwise: false*/
        }

        $scope.tabs = [
            { name: 'Map',
                number: 0,
                active: true
            },
            { name: 'List',
                number: 1,
                active: false
            }
        ];



    }]);