angular.module('compfinder.templates', ['admin/admin.tpl.html', 'admin/floorFields.tpl.html', 'common/maps/map.tpl.html', 'signage/signage.tpl.html']);

angular.module("admin/admin.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("admin/admin.tpl.html",
    "<tabset justified=\"true\" ng-if=\"hasAccess\">\n" +
    "    <tab ng-repeat=\"tab in tabs\" heading=\"{{tab.name}}\" active=\"tab.active\">\n" +
    "        <div ng-if=\"tab.number == 0\">\n" +
    "            <nav class=\"navbar navbar-default\">\n" +
    "                <div class=\"container\">\n" +
    "                    <ul class=\"nav navbar-nav\">\n" +
    "                        <li>\n" +
    "                            <button class=\"btn btn-default navbar-btn\" ng-click=\"mapTools.undo()\">\n" +
    "                                <span class=\"fa fa-reply\"></span> Undo\n" +
    "                            </button>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <button class=\"btn btn-default navbar-btn\" ng-click=\"mapTools.redo()\">\n" +
    "                                <span class=\"fa fa-share\"></span> Redo\n" +
    "                            </button>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                    <ul class=\"nav navbar-nav\" ng-show=\"mapTools.current == 'selector'\">\n" +
    "                        <li>\n" +
    "                            <button class=\"btn btn-default navbar-btn\" ng-click=\"mapTools.helper('hAlignCenter')\">\n" +
    "                                <span class=\"fa fa-align-center\"></span> Horizontal Align Center\n" +
    "                            </button>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <button class=\"btn btn-default navbar-btn\" ng-click=\"mapTools.helper('vAlignCenter')\">\n" +
    "                                <span class=\"fa fa-align-center fa-rotate-90\"></span> Vertical Align Center\n" +
    "                            </button>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "\n" +
    "\n" +
    "                </div>\n" +
    "            </nav>\n" +
    "\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-10\" style=\"height: 600px;\">\n" +
    "                    <map></map>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-if=\"tab.number == 1\" >\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-sm-12 col-md-6\">\n" +
    "                    <h3>Buildings</h3>\n" +
    "                    <div class=\"row sdOpen\">\n" +
    "                        <div class=\"col-md-4\">\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"gorgas\" ng-model=\"newBldg.name\"\n" +
    "                                   maxlength=\"20\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-6\">\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"Gorgas Library\" ng-model=\"newBldg.title\"\n" +
    "                                   maxlength=\"100\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2\">\n" +
    "                            <button type=\"button\" class=\"btn btn-success\" ng-click=\"createBuilding(newBldg)\" ng-disabled=\"uploading\">\n" +
    "                                <span class=\"fa fa-fw fa-plus\"></span> Add\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                        {{formResponse}}\n" +
    "                    </div>\n" +
    "                    <table class=\"table table-hover\">\n" +
    "                        <thead>\n" +
    "                        <tr>\n" +
    "                            <th>Name</th>\n" +
    "                            <th>Title</th>\n" +
    "                        </tr>\n" +
    "                        </thead>\n" +
    "                        <tbody>\n" +
    "                        <tr ng-repeat=\"building in buildings\">\n" +
    "                            <td class=\"clickable\" ng-if=\"selBldg !== $index\" ng-click=\"openBuilding($index)\">\n" +
    "                                <span>\n" +
    "                                    {{building.name}}\n" +
    "                                </span>\n" +
    "                            </td>\n" +
    "                            <td class=\"clickable\" ng-if=\"selBldg !== $index\" ng-click=\"openBuilding($index)\">\n" +
    "                                <span>\n" +
    "                                    {{building.title}}\n" +
    "                                </span>\n" +
    "                            </td>\n" +
    "                            <td class=\"sdOpen\" colspan=\"2\" ng-if=\"selBldg == $index\">\n" +
    "                                <h4>{{building.title}}</h4>\n" +
    "                                <table class=\"table\">\n" +
    "                                    <tbody>\n" +
    "                                    <tr>\n" +
    "                                        <td>\n" +
    "                                            <input type=\"text\" class=\"form-control\" placeholder=\"gorgas\" ng-model=\"building.name\"\n" +
    "                                                   maxlength=\"20\">\n" +
    "                                        </td>\n" +
    "                                        <td>\n" +
    "                                            <input type=\"text\" class=\"form-control\" placeholder=\"Gorgas Library\" ng-model=\"building.title\"\n" +
    "                                                   maxlength=\"100\">\n" +
    "                                        </td>\n" +
    "                                        <td style=\"width:120px;\">\n" +
    "                                            <button type=\"button\" class=\"btn btn-success\" ng-click=\"updateBuilding(building)\" ng-disabled=\"uploading\">\n" +
    "                                                <span class=\"fa fa-fw fa-edit\"></span>\n" +
    "                                            </button>\n" +
    "                                            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteBuilding(building)\" ng-disabled=\"uploading\">\n" +
    "                                                <span class=\"fa fa-fw fa-trash-o\"></span>\n" +
    "                                            </button>\n" +
    "                                            <div>\n" +
    "                                                {{building.formResponse}}\n" +
    "                                            </div>\n" +
    "                                        </td>\n" +
    "                                    </tr>\n" +
    "                                    </tbody>\n" +
    "                                </table>\n" +
    "\n" +
    "                                <h4>Floors <small>{{building.title}}</small></h4>\n" +
    "                                <h5>Create New Floor</h5>\n" +
    "                                <div class=\"row\">\n" +
    "                                    <div floor-fields-list floor=\"newFloor\">\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-4 form-group\">\n" +
    "                                        <button type=\"button\" class=\"btn btn-success\" ng-click=\"createFloor(newFloor)\" ng-disabled=\"uploading\">\n" +
    "                                            <span class=\"fa fa-fw fa-plus\"></span> Add New Floor\n" +
    "                                        </button>\n" +
    "                                    </div>\n" +
    "                                    {{formResponse}}\n" +
    "                                </div>\n" +
    "\n" +
    "                                <table class=\"table table-hover\">\n" +
    "                                    <tbody>\n" +
    "                                    <tr ng-repeat=\"floor in building.floors\">\n" +
    "                                        <td class=\"clickable\" ng-if=\"selFloor !== $index\" ng-click=\"openFloor($index)\">\n" +
    "                                            <span>\n" +
    "                                                {{floor.name}}\n" +
    "                                            </span>\n" +
    "                                        </td>\n" +
    "                                        <td class=\"clickable\" ng-if=\"selFloor !== $index\" ng-click=\"openFloor($index)\">\n" +
    "                                            <span>\n" +
    "                                                {{floor.title}}\n" +
    "                                            </span>\n" +
    "                                        </td>\n" +
    "                                        <td class=\"sdOpen\" colspan=\"2\" ng-if=\"selFloor == $index\">\n" +
    "                                            <h5>{{floor.title}}</h5>\n" +
    "                                            <div floor-fields-list floor=\"floor\">\n" +
    "                                            </div>\n" +
    "                                            <div class=\"col-md-4 form-group\">\n" +
    "                                                <button type=\"button\" class=\"btn btn-success\" ng-click=\"updateFloor(floor)\" ng-disabled=\"uploading\">\n" +
    "                                                    <span class=\"fa fa-fw fa-edit\"></span>\n" +
    "                                                </button>\n" +
    "                                                <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteFloor(floor)\" ng-disabled=\"uploading\">\n" +
    "                                                    <span class=\"fa fa-fw fa-trash-o\"></span>\n" +
    "                                                </button>\n" +
    "                                                <div ng-if=\"floor.formResponse\">\n" +
    "                                                    {{floor.formResponse}}\n" +
    "                                                </div>\n" +
    "                                            </div>\n" +
    "                                        </td>\n" +
    "                                    </tr>\n" +
    "                                    </tbody>\n" +
    "                                </table>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        </tbody>\n" +
    "                    </table>\n" +
    "                </div>\n" +
    "                <div class=\"col-sm-12 col-md-3\">\n" +
    "                    <h4>Computers <small>{{buildings[selBldg].name}}:{{buildings[selBldg].floors[selFloor].name}}</small></h4>\n" +
    "\n" +
    "                    <div class=\"row\" ng-repeat=\"comp in buildings[selBldg].floors[selFloor].desktops\">\n" +
    "                        {{comp.name}}\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "                <div class=\"col-sm-12 col-md-3\">\n" +
    "                    <h4>Unassigned Computers</h4>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </tab>\n" +
    "</tabset>\n" +
    "<div ng-if=\"!hasAccess\">\n" +
    "    <h3>Sorry, you don't have permissions to edit computers</h3>\n" +
    "</div>\n" +
    "");
}]);

angular.module("admin/floorFields.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("admin/floorFields.tpl.html",
    "<div class=\"col-md-6 form-group\">\n" +
    "    <input type=\"text\" class=\"form-control\" placeholder=\"first\" ng-model=\"floor.name\"\n" +
    "           maxlength=\"20\">\n" +
    "</div>\n" +
    "<div class=\"col-md-6 form-group\">\n" +
    "    <input type=\"text\" class=\"form-control\" placeholder=\"First Floor\" ng-model=\"floor.title\"\n" +
    "           maxlength=\"100\">\n" +
    "</div>\n" +
    "<div class=\"col-md-4 form-group\">\n" +
    "    <label for=\"browse\">Select Floor Plan</label>\n" +
    "    <div id=\"browse\">\n" +
    "        <button type=\"file\" ngf-select=\"\" ng-model=\"floor.picFile\" accept=\"image/*\" ngf-multiple=\"false\"\n" +
    "                ngf-change=\"generateThumb($files, slide)\" class=\"btn btn-primary\">\n" +
    "            <span class=\"fa fa-fw fa-plus\"></span>Browse\n" +
    "        </button>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"col-md-4 form-group\">\n" +
    "    <label for=\"selected\">Selected Floor Plan Image</label>\n" +
    "    <div id=\"selected\">\n" +
    "        <div ng-repeat=\"img in floor.selectedFiles\">\n" +
    "            <img ngf-src=\"img\" width=\"150px\" height=\"100px\">\n" +
    "            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"floor.selectedFiles.splice($index,1)\">\n" +
    "                <span class=\"fa fa-fw fa-close\"></span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/maps/map.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/maps/map.tpl.html",
    "<canvas id=\"map\" class=\"map\"></canvas>");
}]);

angular.module("signage/signage.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("signage/signage.tpl.html",
    "<header class=\"page-row\">\n" +
    "    <nav class=\"navbar navbar-static-top navbar-mega\">\n" +
    "        <div class=\"container-fluid\">\n" +
    "            <div class=\"navbar-header\">\n" +
    "                <p class=\"navbar-text lead\">\n" +
    "                    <strong>Floor {{computers.buildings[0].floors[0].name}}</strong>\n" +
    "                </p>\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "            <div class=\"navbar-header navbar-right\">\n" +
    "                <p class=\"navbar-text lead\">\n" +
    "                    <strong>Available Computers:</strong>\n" +
    "                </p>\n" +
    "                <p class=\"navbar-text lead\">\n" +
    "                    {{computers.buildings[0].available.desktops}}\n" +
    "                </p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "</header>\n" +
    "\n" +
    "<div class=\"wrap page-row page-row-expanded comp-signage-body\">\n" +
    "    <canvas id=\"asset_image\" class=\"asset-image\"></canvas>\n" +
    "</div>\n" +
    "<footer class=\"page-row\">\n" +
    "    <nav class=\"navbar navbar-static-bottom navbar-mega\">\n" +
    "        <div class=\"container-fluid\">\n" +
    "            <div class=\"nav navbar-nav\">\n" +
    "                <p class=\"navbar-text\">\n" +
    "                    <img src=\"ualib-computers-qr.jpg\" style=\"height: 50px;\"/>\n" +
    "\n" +
    "                </p>\n" +
    "                <p class=\"navbar-text\">\n" +
    "                    For computer availability in all libraries<br> visit <a href=\"#\">www.lib.ua.edu/computers</a>\n" +
    "                </p>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"nav navbar-nav navbar-right\">\n" +
    "                <p class=\"navbar-text lead\">\n" +
    "                    <strong>Apple:</strong>\n" +
    "                </p>\n" +
    "                <p class=\"navbar-text\">\n" +
    "                    <span class=\"apple available\"></span> available<br> <span class=\"apple taken\"></span> taken\n" +
    "                </p>\n" +
    "            </div>\n" +
    "            <div class=\"nav navbar-nav navbar-right\">\n" +
    "                <p class=\"navbar-text lead\">\n" +
    "                    <strong>Windows:</strong>\n" +
    "                </p>\n" +
    "                <p class=\"navbar-text\">\n" +
    "                    <span class=\"windows available\"></span> available<br> <span class=\"windows taken\"></span> taken\n" +
    "                </p>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "</footer>\n" +
    "");
}]);

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
        $scope.selBldg = 0;
        $scope.selFloor = 0;

        $scope.hasAccess = false;
        if (angular.isDefined($scope.userInfo.group)) {
            /*jslint bitwise: true*/
            if ((parseInt($scope.userInfo.group) & SOFTWARE_GROUP) === SOFTWARE_GROUP) {
                $scope.hasAccess = true;
                $scope.buildings = Computers.buildings;
                $scope.unassigned = Computers.unassigned;
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
            floor.bid = $scope.buildings[$scope.selBldg].bid;
            $scope.uploading = true;
            if (floor.selectedFiles.length < 1){
                compSoftFactory.floors().save({}, floor)
                    .$promise.then(function(data){
                        $scope.uploading = false;
                        if (angular.isDefined(data.fid) && angular.isDefined(data.map_file) &&
                            angular.isDefined(data.width) && angular.isDefined(data.height)) {
                            var newFloor = {};
                            newFloor.fid = data.fid;
                            newFloor.bid = floor.bid;
                            newFloor.map_file = data.map_file;
                            newFloor.width = data.width;
                            newFloor.height = data.height;
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
                            newFloor.map_file = res.data.map_file;
                            newFloor.width = res.data.width;
                            newFloor.height = res.data.height;
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

angular.module('ualib.compfinder', [
    'ngRoute',
    'ngResource',
    'oc.lazyLoad',
    'compfinder.templates',
    'ualib.compfinder.admin',
    'ualib.compfinder.signage'
])

    .value('mapStyles', {
        desktops: {
            available: {
                shape: 'fillRect',
                color: '#61a661'
            },
            taken: {
                shape: 'strokeRect',
                color: '#eee'
            }
        }
    })

    .config(['$routeProvider', '$ocLazyLoadProvider', function($routeProvider, $ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            modules: [
                {
                    name: 'angular.filter',
                    files: ['//cdnjs.cloudflare.com/ajax/libs/angular-filter/0.5.8/angular-filter.min.js']
                },
                {
                    name: 'monospaced.mousewheel',
                    files: [
                        'vendor/hamster.js',
                        'vendor/mousewheel.js'
                    ]
                }
            ]
        });

    }]);

angular.module('compfinder', ['ualib.compfinder']);
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
            if (_params.hasOwnProperty('floor')){
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
                    var floor = {available: {}, selectedFiles: []};

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
                return $resource(API + 'computers/:compID', {compID:'@compID'});
            }
        };
    }]);
angular.module('ualib.compfinder.mapsDirective', [
    'ualib.compfinder.maps',
    'ualib.compfinder.mapTools',
    'ualib.compfinder.service'
])

    .directive('map', ['$maps', '$mapTools','Computers', '$timeout', '$window',  function($maps, $mapTools, Computers, $timeout, $window){
        return{
            restrict: 'EA',
            replace: true,
            template: '<canvas id="map" class="map" ng-class="mapTools.current" msd-wheel="mapTools.zoom($event, $delta)"></canvas>',
            link: function(scope, elm){
                
                scope.mapTools = $mapTools;

                $maps.init({
                    src: 'https://wwwdev2.lib.ua.edu/' + scope.buildings[scope.selBldg].floors[scope.selFloor].image.url,
                    canvas: elm[0], 
                    objects: {
                        desktops: scope.buildings[scope.selBldg].floors[scope.selFloor].desktops
                    }
                }).then(function(){
                    scope.mapTools.init();
                });

                scope.reset = function(){
                    $maps.setDefaults();
                    $maps.draw();
                    //$mapTools.zoomSlider.init();
                };


                /*scope.$on('detail-toggle', function(){
                 $timeout(function(){
                 $maps.refactor({width: detailElm.offsetWidth});
                 }, 100);
                 });

                 scope.reset = function(){
                 $maps.setDefaults();
                 $maps.draw();
                 $mapTools.zoomSlider.init();
                 };

                 scope.mouseZoom = function(event, delta){
                 if (zooming){
                 scope.mapTools.current = delta > 0 ? 'zoom-in' : 'zoom-out';
                 scope.mapTools.zoom(event, delta);
                 }
                 };*/

                angular.element($window).bind('resize', function(){
                    $maps.resizeCanvas();
                    $maps.resizeImage();
                    $maps.posImage();
                    $maps.draw();
                });

            }
        };
    }]);


angular.module('ualib.compfinder.mapObjects', [])

    .service('$mapObjects', ['$maps', '$q', '$filter', '$rootScope', function($maps, $q, $filter, $rootScope){
        var self = this;
        var undoStates = [];
        var redoStates = [];
        this.selected = [];
        this.state = [];
       

        this.selectBounds = {};

        this.init = function(objects){
            self.state = collapseObjects(objects);
        };

        this.select = function(func){
            self.state = self.state.map(function(o){
                o.selected = func(o);
                return o;
            });
            return self.getSelected();
        };

        this.getSelected = function(){
            return self.selected.length > 0 ? self.selected : self.state.filter(function(obj){
                return obj && obj.hasOwnProperty('selected') && obj.selected;
            });
        };

        this.update = function(objects){
            objects = objects ? objects : self.getSelected();
            self.state = angular.extend([], objects, self.state);
            var expanded = expandObjects(self.state);
            angular.copy(expanded, $maps.objects);
            console.log(angular.copy($maps.objects));
            $rootScope.$broadcast('mapObjectsUpdated');

        };

        this.recordState = function(objects){
            objects = objects ? objects : self.getSelected();
            undoStates.push(angular.copy(objects));
        };

        this.undo = function(){
            console.log('undo????');
            if (undoStates.length > 0){
                console.log('UNDOOOO!!!!');
                redoStates.push(self.getSelected());
                var undo = undoStates.pop();
                self.update(undo);
            }
        };

        this.redo = function(){
            if (redoState.length > 0){
                undoStates.push(angular.copy(self.state));
                angular.copy(redoStates.pop(), self.state);
            }
        };

        this.centerOfSelection = function(objects){
            objects = objects ? objects : self.getSelected();

            var maxX = getMax(objects, 'x');
            var maxY = getMax(objects, 'y');
            var minX = getMin(objects, 'x');
            var minY = getMin(objects, 'y');

            //self.selectBounds = self.boundsOfSelection(objects);

            var vcenter = ((maxX - minX)/2) + minX;
            var hcenter = ((maxY - minY)/2) + minY;
            return {
                x: vcenter,
                y: hcenter
            };
        };

        this.setSelectionBounds = function(objects){
            objects = objects ? objects : self.getSelected();

            var maxX = getMax(objects, 'x');
            var maxY = getMax(objects, 'y');
            var minX = getMin(objects, 'x');
            var minY = getMin(objects, 'y');

            self.selectBounds = {x: minX, y: minY, w: (maxX - minX + 15), h: (maxY - minY + 15)};
        };

        function getSelected(obj){
            if (angular.isObject(obj)){
                return getSelected();
            }

            return obj.filter(function(comp){
                return comp.selected;
            });
        }

        // Adopted from http://stackoverflow.com/questions/11149843/get-largest-value-in-multi-dimensional-array-javascript-or-coffeescript
        function getMax(objects, coord){
            return objects.reduce(function(max, arr) {
                return max >= parseInt(arr.coordinates[coord]) ? max : parseInt(arr.coordinates[coord]);
            }, -Infinity);
        }

        function getMin(objects, coord){
            return objects.reduce(function(min, arr) {
                return arr.coordinates[coord] < min ? arr.coordinates[coord] : min;
            }, Infinity);
        }

        function collapseObjects(objects){
            var collapsed = [];

            function collapseMapper(o){
                o.oType = obj;
                return o;
            }

            for (var obj in objects){
                if (objects.hasOwnProperty(obj)){
                    var newObj = objects[obj].map(collapseMapper);
                    collapsed = collapsed.concat(newObj);
                }
            }
            return collapsed;
        }

        function expandObjects(objects){
            var expanded = {};
            objects.map(function(obj){
                var newObj = {};
                for (var p in obj){
                    if (obj.hasOwnProperty(p) && p !== 'oType'){
                        newObj[p] = obj[p];
                    }
                }
                if (expanded.hasOwnProperty(obj.oType)){
                    expanded[obj.oType].push(newObj);
                }
                else {
                    expanded[obj.oType] = [];
                    expanded[obj.oType].push(newObj);
                }
            });
            return expanded;
        }

    }]);
angular.module('ualib.compfinder.mapTools', [
    'ualib.compfinder.mapObjects'
])
    .service('$mapTools', ['$maps', '$mapObjects', '$document', '$window', '$location', function MapTools($maps, $mapObjects, $document, $window, $location){
        var self = this;
        var offset;
        var tool;
        var canvas;
        this.canvasEventPause = false;

        this.current = null;
        this.prev = null;

        this.mapUndoStates = [];

        this.init = function(){
            var defaultTool = $location.search().tool || 'selector';
            $mapObjects.init($maps.objects);
            canvas = angular.element($maps.canvas);
            offset = getOffset($maps.canvas);
            self.select(defaultTool);
            readyCanvas();
        };

        this.destroy = function(){
            canvas.unbind();
            $document.unbind();
        };

        this.select = function(newTool){
            if (newTool !== self.current){
                self.prev = self.current;
                tool = new Tools[newTool]();
                self.current = newTool;
                $location.search('tool', self.current);
                $location.replace();
            }
        };

        this.prevTool = function(){
            if (angular.isDefined(self.prev)){
                self.select(self.prev);
            }
        };

        this.helper = function(helper){
            if (angular.isObject(tool) && tool.hasOwnProperty(helper) && angular.isFunction(tool[helper])){
                tool[helper]();
            }
        };

        function readyCanvas(){
            canvas.bind('mousedown', function(ev){
                canvasEvent(ev);
                $document.bind('mousedown', toolCursor);
                $document.bind('mouseup', toolCursor);
                $document.bind('mouseup', toolChangedImage);
            });
            /*canvas.bind('mousemove', function(ev){
             ev = self.mouseLoc(ev);
             if (mouseInBounds($maps.x, $maps.y, $maps.x2, $maps.y2, ev.mx, ev.my)){
             if (!hover) hover = true;
             angular.element('body').addClass(self.current);
             canvas.bind('mousedown', canvasEvent);
             }
             else if (hover){
             hover = false;
             angular.element('body').removeClass(self.current);
             }
             });
             canvas.bind('mouseup', toolChangedImage);*/
        }

        function toolCursor(ev){
            if (ev.type === 'mousedown'){
                $document.find('body').addClass(self.current);
            }
            else if (ev.type === 'mouseup'){
                $document.find('body').removeClass(self.current);
                $document.unbind('mousedown', toolCursor);
            }
        }

        function canvasEvent(ev){
            if (!self.canvasEventPause){
                ev = self.mouseLoc(ev); //set current mouse (mx, my)
                var func = tool[ev.type];
                if (func){
                    func(ev);
                }
            }
            return ev.preventDefault() && false;
        }

        function toolChangedImage(){
            $maps.changed = true;
            canvas.unbind('mouseup', toolChangedImage);
        }

        this.mouseLoc = function(ev){
            ev.mx = ev.pageX - offset.left;
            ev.my = ev.pageY - offset.top;
            return ev;
        };

        function getBounds(x, y, w, h){
            var x1, y1, x2, y2;

            if (w < 0){
                x1 = x + w;
                x2 = x;
            }
            else {
                x1 = x;
                x2 = x + w;
            }

            if (h < 0){
                y1 = y + h;
                y2 = y;
            }
            else {
                y1 = y;
                y2 = y + h;
            }

            return {x1: x1, y1: y1, x2: x2, y2: y2};

        }

        function mouseInBounds(x1, y1, w, h, mx, my){
            var x2 = x1+w;
            var y2 = y1+h;
            //console.log(mx +' > '+ x1 +' && '+ my +' > '+ y1 +' && '+ mx +' < '+ x2 +' && '+ my +' < '+ y2);
            return (mx > x1 && my > y1 && mx < x2 && my < y2);
        }

        function inRectBounds(x1, y1, w1, h1, rx, ry, rw, rh){
            // get x2,y2 of object being checked
            var x2 = w1+x1;
            var y2 = h1+y1;
            // get bounds of select rect
            var bounds = getBounds(rx, ry, rw, rh);
            //console.log(bounds.x1 +' < '+ x1 +' && '+ bounds.y1 +' < '+ y1 +' && '+ bounds.x2 +' > '+ x2 +' && '+ bounds.y2 +' > '+ y2);
            return (bounds.x1 < x1 && bounds.y1 < y1 && bounds.x2 > x2 && bounds.y2 > y2);

        }

        function getOffset(elm){
            var rect = elm.getBoundingClientRect();
            //return {top: rect.top, left: rect.left};
            var doc = elm.ownerDocument;
            var docElem = doc.documentElement;

            return {
                top: rect.top + $window.pageYOffset - docElem.clientTop,
                left: rect.left + $window.pageXOffset - docElem.clientLeft
            };
        }

        this.map = function(val, xMin, xMax, yMin, yMax) {
            return (val - xMax) / (xMin - xMax) * (yMax - yMin) + yMin;
        };

        //Buttons - these are not selectable tools, but perform a single redefined function
        this.zoomSlider = {
            height: 0,
            pos: 0,
            elm: null,
            init: function(){
                self.zoomSlider.height = self.zoomSlider.elm.offsetHeight-2;
                self.zoomSlider.defaultPos();
            },
            defaultPos: function(){ self.zoomSlider.pos = self.map($maps.scalar, $maps.maxScale, $maps.minScale, self.zoomSlider.height, 0); }
        };

        this.zoom = function(ev, delta, deltaX, deltaY){
            // extend event variable with mouse location
            ev = self.mouseLoc(ev);
            var slideBarY;
            var dScale;
            var zoomCenter = true;

            if (!delta){
                var pos = ev.my - self.zoomSlider.height;
                dScale = self.map(pos, 0, self.zoomSlider.height, $maps.minScale, $maps.maxScale);
                delta = dScale - $maps.scalar;
            }
            else{
                delta = delta/10;
                dScale = Math.round(($maps.scalar + delta) * 1e1) / 1e1;

                zoomCenter = mouseInBounds($maps.x, $maps.y, $maps.x2, $maps.y2, ev.mx, ev.my) ? false : true;
            }

            // If mouse is not over the image, zoom from the center of the image instead of mouse location (ev.mx, ev.my)
            if (zoomCenter){
                ev.mx = ($maps.x + $maps.x2)/2;
                ev.my = ($maps.y + $maps.y2)/2;
            }
            //var clipScale = Math.min(Math.max($maps.minScale, dScale), $maps.maxScale);
            //If dScale is within scale limits
            if (!(dScale < $maps.minScale || dScale > $maps.maxScale)){

                $maps.x = ev.mx - ($maps.scalar + delta) * ((ev.mx-$maps.x) / $maps.scalar);
                $maps.y = ev.my - ($maps.scalar + delta) * ((ev.my-$maps.y) / $maps.scalar);

                $maps.scalar = dScale;
                $maps.width = $maps.image.width*$maps.scalar;
                $maps.height = $maps.image.height*$maps.scalar;

                $maps.draw();
            }
            //set slideBarY position
            slideBarY = self.map(dScale, $maps.maxScale, $maps.minScale, self.zoomSlider.height, 0);

            //zoom slider bar position - always changes, but differently depending on mousewheel or slider zoom
            self.zoomSlider.pos = Math.min(Math.max(slideBarY, 0), self.zoomSlider.height);
            return ev.preventDefault() && false;
        };

        this.undo = function(){
            $mapObjects.undo();
            $maps.draw();
        };

        this.redo = function(){
            $mapObjects.redo();
            $maps.draw();
        };


        //Tools - only one can be selected at a time
        var Tools = {
            selector: function () {
                var self = this;
                var mox = 0;
                var moy = 0;
                var ox = 0;
                var oy = 0;
                var offsets = [];
                var selected = [];
                var selectRectOffset = {};

                this.mousedown = function (ev) {
                    mox = ev.mx;
                    moy = ev.my;

                    ox = (ev.mx - $maps.x) / $maps.scalar;
                    oy = (ev.my - $maps.y) / $maps.scalar;

                    if (($maps.objects.hasOwnProperty('selectRect') && !mouseInBounds($maps.objects.selectRect.x, $maps.objects.selectRect.y, $maps.objects.selectRect.w, $maps.objects.selectRect.h, ox, oy)) || !$maps.objects.hasOwnProperty('selectRect')) {
                        selected = $mapObjects.select(function (obj) {
                            return mouseInBounds(obj.mapX, obj.mapY, 10, 10, (ev.mx - $maps.x) / $maps.scalar, (ev.my - $maps.y) / $maps.scalar);
                        });
                    }
                    else {
                        selectRectOffset = {
                            x: ev.mx - $maps.objects.selectRect.x,
                            y: ev.my - $maps.objects.selectRect.y
                        };
                    }

                    offsets = selected.map(function (obj) {
                        return {
                            x: ev.mx - obj.mapX,
                            y: ev.my - obj.mapY
                        };
                    });

                    $maps.draw();

                    $document.bind('mousemove', canvasEvent);
                    $document.bind('mouseup', canvasEvent);

                };

                this.mousemove = function (ev) {
                    var dx = (ev.mx - mox) / $maps.scalar;
                    var dy = (ev.my - moy) / $maps.scalar;

                    if (selected.length > 0) {
                        if ($maps.objects.hasOwnProperty('selectRect')) {
                            console.log(selectRectOffset);
                            $maps.objects.selectRect.x = mox + dx - selectRectOffset.x;
                            $maps.objects.selectRect.y = moy + dy - selectRectOffset.y;
                        }
                        selected = selected.map(function (obj, i) {
                            obj.mapX = (mox + dx - offsets[i].x);
                            obj.mapY = (moy + dy - offsets[i].y);
                            return obj;
                        });

                        $mapObjects.update(selected);
                    }
                    else {
                        if (!$maps.objects.hasOwnProperty('selectRect')) {

                            $maps.objects.selectRect = {
                                x: (ev.mx - $maps.x) / $maps.scalar,
                                y: (ev.my - $maps.y) / $maps.scalar,
                                w: 0,
                                h: 0
                            };
                        }
                        $maps.objects.selectRect.w = dx;
                        $maps.objects.selectRect.h = dy;

                        $mapObjects.select(function (obj) {
                            return inRectBounds(obj.mapX, obj.mapY, 10, 10, $maps.objects.selectRect.x, $maps.objects.selectRect.y, $maps.objects.selectRect.w, $maps.objects.selectRect.h);
                        });
                    }

                    $maps.draw();
                };

                this.mouseup = function () {
                    if ($maps.objects.hasOwnProperty('selectRect') && selected.length < 1) {
                        selected = $mapObjects.getSelected();
                        if (selected.length > 0) {
                            $mapObjects.setSelectionBounds(selected);
                            console.log($mapObjects.selectBounds);
                            angular.copy($mapObjects.selectBounds, $maps.objects.selectRect);
                        }
                        else {
                            var objects = {};
                            for (var prop in $maps.objects) {
                                if ($maps.objects.hasOwnProperty(prop) && prop !== 'selectRect') {
                                    objects[prop] = $maps.objects[prop];
                                }
                            }
                            $maps.objects = objects;
                        }
                    }

                    $mapObjects.recordState(selected);
                    $maps.draw();
                    $document.unbind('mousemove', canvasEvent);
                    $document.unbind('mouseup', canvasEvent);
                };

                /**
                 * noncanvas event sub tools for the selector tool
                 */

                this.hAlignCenter = function () {
                    var selected = $mapObjects.getSelected();
                    var center = $mapObjects.centerOfSelection(selected);

                    for (var i = 0, len = selected.length; i < len; i++) {
                        selected[i].mapX = center.x;
                    }

                    $mapObjects.merge(selected);
                    $maps.draw();
                };

                this.vAlignCenter = function () {
                    var selected = $mapObjects.getSelected();
                    var center = $mapObjects.centerOfSelection(selected);

                    for (var i = 0, len = selected.length; i < len; i++) {
                        selected[i].mapY = center.y;
                    }

                    $mapObjects.merge(selected);
                    $maps.draw();
                };
            },
            move: function () {
                var mox = 0;
                var moy = 0;
                var ox = 0;
                var oy = 0;

                this.mousedown = function (ev) {
                    mox = ev.mx;
                    moy = ev.my;

                    ox = ev.mx - $maps.x;
                    oy = ev.my - $maps.y;

                    $document.bind('mousemove', canvasEvent);
                    $document.bind('mouseup', canvasEvent);
                };

                this.mousemove = function (ev) {
                    var dx = ev.mx - mox;
                    var dy = ev.my - moy;

                    $maps.x = mox + dx - ox;
                    $maps.y = moy + dy - oy;

                    $maps.draw();
                };

                this.mouseup = function () {
                    $document.unbind('mousemove', canvasEvent);
                    $document.unbind('mouseup', canvasEvent);
                };
            },
            rotate: function () {
                var cX;
                var cY;
                var clickAngle;

                this.mousedown = function (ev) {
                    cX = $maps.x + ($maps.width / 2);
                    cY = $maps.y + ($maps.height / 2);
                    clickAngle = getAngle(cX, cY, ev.mx, ev.my) - $maps.angle;

                    $document.bind('mousemove', canvasEvent);
                    $document.bind('mouseup', canvasEvent);
                };

                this.mousemove = function (ev) {
                    $maps.angle = getAngle(cX, cY, ev.mx, ev.my) - clickAngle;
                    $maps.draw();
                };

                this.mouseup = function (ev) {
                    $document.unbind('mousemove', canvasEvent);
                    $document.unbind('mouseup', canvasEvent);
                };

                /**
                 * angle helper function
                 */
                function getAngle(cX, cY, mx, my) {
                    var angle = Math.atan2(my - cY, mx - cX);
                    return angle;
                }
            }
        };

    }]);
angular.module('ualib.compfinder.maps', [])

    .factory('loadMap', ['$q', function($q){
        return function(src){
            var deferred = $q.defer();
            var map = new Image();

            map.onload = function(){
                deferred.resolve(map);
            };
            map.src = src;

            return deferred.promise;
        };
    }])

    .service('$maps', ['$q', 'mapStyles', function($q, styles){
        var self = this;
        this.canvas = null;
        this.ctx = null;
        this.image = null;
        this.changed = false;
        this.prev = {};
        this.objects = {};

        this.margin = {
            width: 0,
            height: 0
        };
        this.offset = {
            width: 0,
            height: 0
        };

        this.x = 0;
        this.y = 0;
        this.x2 = 0;
        this.y2 = 0;
        this.width = 0;
        this.height = 0;
        this.scalar = 0.4;
        this.minScale = 0.2;
        this.maxScale = 1.4;
        this.angle = 0;

        this.setDefaults = function(){
            self.resizeCanvas();
            self.changed = false;
            self.x = 0;
            self.y = 0;
            self.angle = 0;
            self.setScale();
            self.resizeImage();
            self.center();
            //console.log({changed: self.changed});
        };

        this.refactor = function(offset){
            if (offset.width !== self.width){
                self.setOffset(offset);
                if (!self.changed){
                    self.setDefaults();
                }
                else{
                    var x = self.x + (self.prev.canvas_width - self.canvas.width)/2;
                    var y = self.y + (self.prev.canvas_height - self.canvas.height)/2;
                    if (x > 0 && (self.x+self.width) < (self.canvas.width - self.margin.width - self.offset.width)) {
                        self.x = x;
                    }
                    if (y > 0 && (self.y+self.height) < (self.canvas.height - self.margin.height - self.offset.height)) {
                        self.y = y;
                    }
                    //if ((self.x - dx) > 0 && dx < (self.x+self.width)) self.x -= dx;
                    //if ((self.y - dy) > 0 && dy < (self.y+self.height)) self.y -= dy;

                }
                self.draw();
            }
        };

        this.init = function(params){
            var deferred = $q.defer();
            if (params.src){
                if (params.offset) {
                    self.setOffset(params.offset);
                }
                if (params.objects){
                    self.objects = angular.copy(params.objects);
                }
                self.canvas = params.canvas;
                self.ctx = self.canvas.getContext('2d');
                self.loadImage(params.src).then(function(){
                    self.setDefaults();
                    self.draw();
                    deferred.resolve();
                });
            }
            else{
                deferred.reject('No image src given.');
            }
            return deferred.promise;
        };

        this.setOffset = function(offset){
            if (self.offset.width !== offset.width) {
                self.offset.width = offset.width;
            }
        };

        this.loadImage = function(src){
            var deferred = $q.defer();
            self.image = new Image();

            self.image.onload = function(){
                deferred.resolve();
            };
            self.image.src = src;
            return deferred.promise;
        };

        this.draw = function(){
            //console.log(self.scalar);
            // Clear the canvas
            self.clear();
            // Save matrix state
            self.ctx.save();

            // Translate matrix to (x, y) then scale matrix
            self.ctx.translate(self.x, self.y);
            self.ctx.scale(self.scalar, self.scalar);

            // Translate matrix to (x, y) values representing the distance to the image's center
            self.ctx.translate(self.image.width/2, self.image.height/2);
            // Rotate matrix
            self.ctx.rotate(self.angle);
            // Translate matrix back to state before it was translated to the (x, y) matching the image's center
            self.ctx.translate(-self.image.width/2, -self.image.height/2);

            // Draw image to canvas
            self.ctx.drawImage(self.image, 0, 0);
            self.drawObjects();

            // Restore matrix to it's saved state.
            // If the matrix was not saved, then altered, then restored
            // 	for every draw, then the transforms would stack (i.e., without save/restore
            //	and image at scale 1, scaled to 1.2, then scale to 1 would result in a final scale
            // 	of 1.2 - because (1 * 1.2) * 1 = 1.2
            self.ctx.restore();

            self.x2 = self.x + self.width;
            self.y2 = self.y + self.height;
        };

        this.drawObjects = function(){

            if (self.objects.hasOwnProperty('desktops')){
                self.ctx.fillStyle = styles.desktops.available.color;

                for (var i = 0, len = self.objects.desktops.length; i < len; i++){
                    var comp = self.objects.desktops[i];
                    var x = comp.mapX;
                    var y = comp.mapY;

                    self.ctx.save();
                    self.ctx.translate(x, y);
                    if (comp.status !== 3){
                        self.ctx.fillStyle = styles.desktops.taken.color;
                    }

                    if (comp.os === 1){
                        self.ctx.fillRect(2, 2, 13, 13);
                        /*if (parseInt(comp.monitors) > 1){
                            self.ctx.fillRect(x+5, y-5, 15, 15);
                            self.ctx.clearRect(x+5, y, 10, 10);
                        }*/
                        if (comp.selected){
                            self.ctx.lineWidth = 5;
                            self.ctx.strokeStyle = '#00ff00';
                            self.ctx.strokeRect(0, 0, 13, 13);
                        }
                    }
                    else if (comp.os === 2){

                        self.ctx.beginPath();
                        self.ctx.arc(7, 7, 7, 0, 2*Math.PI);
                        self.ctx.fill();
                        if (comp.selected){
                            self.ctx.lineWidth = 5;
                            self.ctx.strokeStyle = '#00ff00';
                            self.ctx.stroke();
                        }
                    }
                    self.ctx.restore();

                }
            }
            if (self.objects.hasOwnProperty('selectRect')){
                var rect = angular.copy(self.objects.selectRect);
                self.ctx.save();
                self.ctx.setLineDash([6, 4]);
                self.ctx.strokeStyle = '#333';
                self.ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
                self.ctx.restore();

            }
        };

        this.setScale = function(){
            var width_ratio = (self.canvas.width - self.margin.width - self.offset.width) / self.image.width;
            var height_ratio = (self.canvas.height - self.margin.height - self.offset.height) / self.image.height;
            self.scalar = Math.min(width_ratio, height_ratio);
            /*console.log({w_ratio: width_ratio, h_ratio: height_ratio});
             console.log('width_ratio = ('+self.canvas.width+' - ('+self.margin.width+' + '+self.offset.width+')) / '+self.image.width);
             console.log('height_ratio = ('+self.canvas.height+' - ('+self.margin.height+' + '+self.offset.height+')) / '+self.image.height);*/
        };

        this.clear = function(){
            self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
        };

        this.resizeCanvas = function(){
            self.prev.canvas_width = self.canvas.width;
            self.prev.canvas_height = self.canvas.height;

            self.canvas.style.width = '100%';
            self.canvas.style.height = '100%';

            self.canvas.width = self.canvas.offsetWidth;
            self.canvas.height = self.canvas.offsetHeight;

        };

        this.resizeImage = function(){
            self.width = self.image.width*self.scalar;
            self.height = self.image.height*self.scalar;
        };

        this.center = function(){
            self.x = ((self.canvas.width - self.offset.width) - self.width)/2;
            self.y = ((self.canvas.height) - self.height)/2;
        };

        this.scaleXY = function(newWidth, newHeight){
            self.x = newWidth/self.canvas.width;
            self.y = newHeight/self.canvas.height;
        };

        this.posImage = function(){
            if (!self.changed){
                self.center();
            }
            else{
                self.x *= self.canvas.width/self.prev.canvas_width;
                self.y *= self.canvas.height/self.prev.canvas_height;
            }
        };

        this.getSelectedObjects = function(){
            self.objects.filter(function(comp){
                return comp.selected;
            });
        };
    }]);

angular.module('ualib.compfinder.signage', [
    'ualib.compfinder.service',
    'ualib.compfinder.maps'
])

    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/computers/signage/:building/:floor', {
                reloadOnSearch: false,
                resolve: {
                    floors: ['Computers', '$route', function(Computers, $route){

                        return Computers.init($route.current.params).then(function(){
                            return true;
                        });
                        /*console.log($route);
                        return CFF.floors().get($route.current.params, function(data){
                            return data;
                        }, function(data, status, headers, config) {
                            console.log('ERROR: Computers and Software');
                            console.log({
                                data: data,
                                status: status,
                                headers: headers,
                                config: config
                            });
                        });*/
                    }]
                },
                templateUrl: 'signage/signage.tpl.html',
                controller: 'SignageCtrl'
            });
    }])

    .controller('SignageCtrl', ['$scope', 'Computers', function($scope, Computers){
        $scope.computers = Computers;

    }])

    .directive('assetImage', ['$maps', '$timeout', '$window',  function($maps, $timeout, $window){
        return{
            restrict: 'AC',
            link: function(scope, elm){


                var scalar = 0.27;
                var yOffset = 60;
                var floor = parseInt(scope.computers.buildings[0].floors[0].name);

                if (floor === 3){
                    scalar = 0.14;
                    yOffset = 85;
                }
                else if(floor === 2){
                    scalar = 0.14;
                    yOffset = 85;
                }

                $maps.init({
                 src: 'http://wwwdev.lib.ua.edu/' + scope.computers.buildings[0].floors[0].image.url,
                 canvas: elm[0], objects: {desktops: scope.computers.buildings[0].floors[0].desktops},
                 width: scope.computers.buildings[0].floors[0].image.width,
                 height: scope.computers.buildings[0].floors[0].image.height,
                 scalar: scalar,
                 yOffset: yOffset
                 });

                angular.element($window).bind('resize', function(){
                    $maps.resizeCanvas();
                    $maps.setScale();
                    $maps.resizeImage();
                    $maps.posImage();
                    $maps.draw();
                });

                scope.$on('$destroy', function(){
                    angular.element($window).unbind('resize');
                });

            }
        };
    }]);