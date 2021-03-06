angular.module('ualib.compfinder.admin', [
    'ualib.compfinder.mapsDirective',
    'ualib.compfinder.service',
    'ualib.compfinder.maps',
    'ngFileUpload',
    'ui.layout'
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
                        //return tokenReceiver.getPromise();
                        return true;
                    }
                },
                templateUrl: 'admin/admin.tpl.html',
                controller: 'ComputersAdminCtrl'
            });
    }])

    .controller('ComputersAdminCtrl', ['$scope', '$timeout', '$window', '$maps', 'Computers', 'userData', 'SOFTWARE_GROUP', 'AuthService', 'compSoftFactory', 'Upload', 'SW_API',
    function($scope, $timeout, $window, $maps, Computers, userData, SOFTWARE_GROUP, AuthService, compSoftFactory, Upload, API){
        //$scope.userInfo = AuthService.isAuthorized();
        $scope.buildings = [];
        $scope.unassigned = [];
        $scope.newBldg = {};
        $scope.newBldg.name = "";
        $scope.newBldg.title = "";
        $scope.newFloor = {};
        $scope.newFloor.name = "";
        $scope.newFloor.title = "";
        $scope.newFloor.selectedFiles = [];
        $scope.selBldg = 0;
        $scope.selFloor = 0;

        $scope.hasAccess = true;
        $scope.buildings = Computers.buildings;
        $scope.unassigned = Computers.unassigned;

        /*$scope.hasAccess = false;
        if (angular.isDefined($scope.userInfo.group)) {
            /!*jslint bitwise: true*!/
            if ((parseInt($scope.userInfo.group) & SOFTWARE_GROUP) === SOFTWARE_GROUP) {
                $scope.hasAccess = true;
                $scope.buildings = Computers.buildings;
                $scope.unassigned = Computers.unassigned;
                console.dir(Computers);
            }
            /!*jslint bitwise: false*!/
        }*/

        $scope.layout = {
            map: false
        };
        $scope.layoutConfig = {
            disableToggle: true
        };

        $scope.$on('ui.layout.loaded', function(){
            resizeContainer();
            $timeout(function(){
                $scope.layout.map = true;
            });
        });

        $scope.$on('ui.layout.toggle', function(e, container){
            console.log(container);
            if (container.layoutId < 2){
                //$maps.clear();
                $timeout(function(){
                    resizeMap();
                }, 10);
            }
        });

        $scope.$on('ui.layout.resize', function(e, before, after){
            console.log({before: before, after: after});
            if (before.layoutId < 2){
                resizeMap();
            }
        });

        angular.element($window).bind('resize', function(){
            resizeContainer();
        });

        function resizeContainer(){
            var elm = document.querySelector('.comp-admin-container');
            var h = ($window.innerHeight - elm.offsetTop)+"px";
            elm.style.height = h;
        }

        function resizeMap(){
            $maps.resizeCanvas();
            $maps.setScale();
            $maps.resizeImage();
            $maps.posImage();
            $maps.draw();
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

        $scope.selectBuilding = function(building){
            $scope.layout.map = true;
            $scope.bid = building.bid;
            $scope.building = angular.copy(building);    
        };
        $scope.selectFloor = function(floor){
            $scope.layout.map = false;
            $scope.floor = angular.copy(floor);    
        };

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
        $scope.updateComputer = function(computer) {
            var compArray = [];
            compArray.push(computer);
            $scope.updateComputers(compArray);
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
        $scope.deleteBuilding = function(building){
            if (confirm("Delete " + building.title  + " permanently?") === true){
                $scope.uploading = true;
                compSoftFactory.buildings().delete({buildingID: building.bid})
                    .$promise.then(function(data){
                        $scope.uploading = false;
                        $scope.buildings.splice($scope.buildings.indexOf(building), 1);
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
                        if (angular.isDefined(data.bid) ) {
                            var newBldg = {};
                            newBldg.bid = data.bid;
                            newBldg.name = building.name;
                            newBldg.title = building.title;
                            $scope.buildings.push(newBldg);
                        }
                        $scope.formResponse = data.message;
                    }, function (data, status) {
                        $scope.uploading = false;
                        $scope.formResponse = "Error: Could not create building! " + data;
                        console.dir(data);
                    });
            }
        };
        $scope.openBuilding = function(index) {
            $scope.selBldg = index;
        };
        $scope.openFloor = function(index) {
            $scope.selFloor = index;
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
        $scope.deleteFloor = function(floor){
            if (confirm("Delete " + floor.title  + " permanently?") === true){
                $scope.uploading = true;
                compSoftFactory.floors().delete({floorID: floor.fid})
                    .$promise.then(function(data){
                        $scope.uploading = false;
                        $scope.buildings[$scope.selBldg].floors.splice($scope.selFloor, 1);
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
                floor.selectedFiles.upload.then(function(res) {
                    $timeout(function() {
                        floor.selectedFiles.length = 0;
                        floor.picFile.length = 0;
                        if (angular.isDefined(res.data.map_file) && angular.isDefined(res.data.width) && angular.isDefined(res.data.height)) {
                            floor.image.url = res.data.map_file;
                            floor.image.width = res.data.width;
                            floor.image.height = res.data.height;
                        }
                        floor.formResponse = res.data.message;
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
            floor.bid = $scope.buildings[$scope.selBldg].bid;
            $scope.uploading = true;
            if (floor.selectedFiles.length < 1){
                compSoftFactory.floors().save({}, floor)
                    .$promise.then(function(data){
                        $scope.uploading = false;
                        if (angular.isDefined(data.fid)) {
                            var newFloor = {};
                            newFloor.fid = data.fid;
                            newFloor.bid = floor.bid;
                            newFloor.image = {};
                            newFloor.image.url = "";
                            newFloor.image.width = 0;
                            newFloor.image.height = 0;
                            newFloor.name = floor.name;
                            newFloor.title = floor.title;
                            newFloor.selectedFiles = [];
                            $scope.buildings[$scope.selBldg].floors.push(newFloor);
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
                            newFloor.bid = floor.bid;
                            newFloor.image = {};
                            newFloor.image.url = res.data.map_file;
                            newFloor.image.width = res.data.width;
                            newFloor.image.height = res.data.height;
                            newFloor.name = floor.name;
                            newFloor.title = floor.title;
                            newFloor.selectedFiles = [];
                            $scope.buildings[$scope.selBldg].floors.push(newFloor);
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

    }])

    .controller('floorFieldsCtrl', ['$scope', '$timeout', 'Upload',
        function floorFieldsCtrl($scope, $timeout, Upload){
            $scope.generateThumb = function(files) {
                if (files.length > 0 && files !== null) {
                    $scope.floor.selectedFiles.push(files[0]);
                    if ($scope.fileReaderSupported && files[0].type.indexOf('image') > -1) {
                        $timeout(function() {
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL(files[0]);
                            fileReader.onload = function(e) {
                                $timeout(function() {
                                    files[0].dataUrl = e.target.result;
                                });
                            };
                        });
                    }
                }
            };
        }])

    .directive('floorFieldsList', ['$timeout', function($timeout) {
        return {
            restrict: 'AC',
            scope: {
                floor: '='
            },
            controller: 'floorFieldsCtrl',
            link: function(scope, elm, attrs){
            },
            templateUrl: 'admin/floorFields.tpl.html'
        };
    }]);
