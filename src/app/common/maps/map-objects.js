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