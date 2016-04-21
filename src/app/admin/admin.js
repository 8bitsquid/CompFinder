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
            .when('/computers/admin/', {
                reloadOnSearch: false,
                resolve: {
                    mapData: ['Computers', function(Computers){
                        return Computers.init({}, {noRefresh: true});
                    }],
                    userData: function(tokenReceiver){
                        return tokenReceiver.getPromise();
                    }
                },
                templateUrl: 'admin/admin.tpl.html',
                controller: 'ComputersAdminCtrl'
            });
    }])

    .controller('ComputersAdminCtrl', ['$scope', '$timeout', 'Computers', 'userData', 'SOFTWARE_GROUP', 'AuthService', 'compSoftFactory', 'Upload', 'SW_API',
    function($scope, $timeout, Computers, userData, SOFTWARE_GROUP, AuthService, compSoftFactory, Upload, API){
        $scope.userInfo = AuthService.isAuthorized();
        $scope.buildings = [];
        $scope.unassigned = [];
        $scope.newBldg = {};
        $scope.newBldg.name = "";
        $scope.newBldg.title = "";
        $scope.newFloor = {};
        $scope.newFloor.name = "";
        $scope.newFloor.title = "";
        $scope.newFloor.selectedFiles = [];

        $scope.hasAccess = false;
        if (angular.isDefined($scope.userInfo.group)) {
            /*jslint bitwise: true*/
            if ((parseInt($scope.userInfo.group) & SOFTWARE_GROUP) === SOFTWARE_GROUP) {
                $scope.hasAccess = true;
                $scope.buildings = Computers.buildings;
                $scope.unassigned = Computers.unassigned;
                $scope.selBldg = $scope.buildings[0];
                $scope.selFloor = $scope.selBldg.floors[0];
                console.dir(Computers);
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

        $scope.deleteComputer = function(computer, parentArray){
            if (confirm("Delete " + computer.name  + " permanently?") === true){
                $scope.uploading = true;
                compSoftFactory.computers().delete({compID: computer.compid})
                    .$promise.then(function(data){
                        $scope.uploading = false;
                        parentArray.splice(parentArray.indexOf(computer), 1);
                    }, function(data, status){
                        $scope.uploading = false;
                        $scope.formResponse = "Error: Could not delete computer! " + data;
                        console.dir(data);
                    });
            }
        };

        $scope.updateComputers = function(compArray){
            $scope.uploading = true;
            compSoftFactory.computers().save({}, compArray)
                .$promise.then(function(data){
                    $scope.uploading = false;
                    $scope.formResponse = data.message;
                }, function(data, status){
                    $scope.uploading = false;
                    $scope.formResponse = "Error: Could not update computers! " + data;
                    console.dir(data);
                });
        };

        $scope.validateBldg = function(building) {
            if (building.name.length < 1) {
                return "Form error: Please fill out building name!";
            }
            if (building.title.length < 1) {
                return "Form error: Please fill out building title!";
            }
            return "";
        };
        $scope.deleteBuilding = function(building, parentArray){
            if (confirm("Delete " + building.title  + " permanently?") === true){
                $scope.uploading = true;
                compSoftFactory.buildings().delete({buildingID: building.bid})
                    .$promise.then(function(data){
                        $scope.uploading = false;
                        parentArray.splice(parentArray.indexOf(building), 1);
                    }, function(data, status){
                        $scope.uploading = false;
                        $scope.formResponse = "Error: Could not delete building! " + data;
                        console.dir(data);
                    });
            }
        };
        $scope.updateBuilding = function(building){
            building.formResponse = $scope.validateBldg(building);
            if (building.formResponse.length < 1) {
                $scope.uploading = true;
                compSoftFactory.buildings().save({buildingID: building.bid}, building)
                    .$promise.then(function (data) {
                        $scope.uploading = false;
                        building.formResponse = data.message;
                    }, function (data, status) {
                        $scope.uploading = false;
                        building.formResponse = "Error: Could not update building! " + data;
                        console.dir(data);
                    });
            }
        };
        $scope.createBuilding = function(building){
            $scope.formResponse = $scope.validateBldg(building);
            if ($scope.formResponse.length < 1) {
                $scope.uploading = true;
                compSoftFactory.buildings().save({}, building)
                    .$promise.then(function (data) {
                        $scope.uploading = false;
                        $scope.formResponse = data.message;
                    }, function (data, status) {
                        $scope.uploading = false;
                        $scope.formResponse = "Error: Could not create building! " + data;
                        console.dir(data);
                    });
            }
        };

        $scope.validateFloor = function(floor) {
            if (floor.name.length < 1) {
                return "Form error: Please fill out floor name!";
            }
            if (floor.title.length < 1) {
                return "Form error: Please fill out floor title!";
            }
            return "";
        };
        $scope.deleteFloor = function(floor, parentArray){
            if (confirm("Delete " + floor.title  + " permanently?") === true){
                $scope.uploading = true;
                compSoftFactory.floors().delete({floorID: floor.fid})
                    .$promise.then(function(data){
                        $scope.uploading = false;
                        parentArray.splice(parentArray.indexOf(floor), 1);
                    }, function(data, status){
                        $scope.uploading = false;
                        $scope.formResponse = "Error: Could not delete floor! " + data;
                        console.dir(data);
                    });
            }
        };
        $scope.updateFloor = function(floor){
            floor.formResponse = $scope.validateFloor(floor);
            if (floor.formResponse.length > 0) {
                return false;
            }
            $scope.uploading = true;
            if (floor.selectedFiles.length < 1){
                compSoftFactory.floors().save({floorID: floor.fid}, floor)
                    .$promise.then(function(data){
                        $scope.uploading = false;
                        floor.formResponse = data.message;
                    }, function(data, status){
                        $scope.uploading = false;
                        floor.formResponse = data.message;
                        console.dir(data);
                    });
            } else {
                var names = [];
                for (var i = 0; i < floor.selectedFiles.length; i++) {
                    names.push(floor.selectedFiles[i].name);
                }
                floor.selectedFiles.upload = Upload.upload({
                    url: API + 'floors/' + floor.fid,
                    method: 'POST',
                    fields: {
                        floorMap: floor
                    },
                    file: floor.selectedFiles,
                    fileFormDataName: names
                });
                floor.selectedFiles.upload.then(function(response) {
                    $timeout(function() {
                        floor.selectedFiles.length = 0;
                        floor.picFile.length = 0;
                        floor.formResponse = response.data.message;
                        $scope.uploading = false;
                    });
                }, function(response) {
                    if (response.status > 0) {
                        floor.formResponse = response.status + ': ' + response.data;
                    }
                    $scope.uploading = false;
                });
                floor.selectedFiles.upload.progress(function(evt) {
                    // Math.min is to fix IE which reports 200% sometimes
                    floor.selectedFiles.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
        };
        $scope.createFloor = function(floor){
            $scope.formResponse = $scope.validateFloor(floor);
            if ($scope.formResponse.length > 0) {
                return false;
            }
            floor.bid = $scope.selBldg.bid;
            $scope.uploading = true;
            if (floor.selectedFiles.length < 1){
                compSoftFactory.floors().save({}, floor)
                    .$promise.then(function(data){
                        $scope.uploading = false;
                        if (angular.isDefined(data.fid) && angular.isDefined(data.map_file) &&
                            angular.isDefined(data.width) && angular.isDefined(data.height)) {
                            var newFloor = {};
                            newFloor.fid = data.fid;
                            newFloor.bid = $scope.selBldg.bid;
                            newFloor.map_file = data.map_file;
                            newFloor.width = data.width;
                            newFloor.height = data.height;
                            newFloor.name = floor.name;
                            newFloor.title = floor.title;
                            newFloor.show = false;
                            newFloor.selectedFiles = [];
                            $scope.buildings[$scope.buildings.indexOf($scope.selBldg)].floors.push(newFloor);
                        }
                        $scope.formResponse = data.message;
                    }, function(data, status){
                        $scope.uploading = false;
                        $scope.formResponse = data.message;
                        console.dir(data);
                    });
            } else {
                var names = [];
                for (var i = 0; i < floor.selectedFiles.length; i++) {
                    names.push(floor.selectedFiles[i].name);
                }
                floor.selectedFiles.upload = Upload.upload({
                    url: API + 'floors/',
                    method: 'POST',
                    fields: {
                        floorMap: floor
                    },
                    file: floor.selectedFiles,
                    fileFormDataName: names
                });
                floor.selectedFiles.upload.then(function(res) {
                    $timeout(function() {
                        $scope.uploading = false;
                        if (angular.isDefined(res.data.fid) && angular.isDefined(res.data.map_file) &&
                            angular.isDefined(res.data.width) && angular.isDefined(res.data.height)) {
                            var newFloor = {};
                            newFloor.fid = res.data.fid;
                            newFloor.bid = $scope.selBldg.bid;
                            newFloor.map_file = res.data.map_file;
                            newFloor.width = res.data.width;
                            newFloor.height = res.data.height;
                            newFloor.name = floor.name;
                            newFloor.title = floor.title;
                            newFloor.show = false;
                            newFloor.selectedFiles = [];
                            $scope.buildings[$scope.buildings.indexOf($scope.selBldg)].floors.push(newFloor);
                        }
                        $scope.formResponse = res.data.message;
                    });
                }, function(response) {
                    $scope.uploading = false;
                    if (response.status > 0) {
                        $scope.formResponse = response.status + ': ' + response.data;
                    }
                });
                floor.selectedFiles.upload.progress(function(evt) {
                    // Math.min is to fix IE which reports 200% sometimes
                    floor.selectedFiles.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
        };

    }]);