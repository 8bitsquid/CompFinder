angular.module('ualib.compfinder.mapsDirective', [
    'ualib.compfinder.maps',
    'ualib.compfinder.mapTools',
    'ualib.compfinder.service'
])

    .directive('map', ['$timeout', '$rootScope', '$maps', '$mapTools','Computers', '$timeout', '$window',  function($timeout, $rootScope, $maps, $mapTools, Computers, $timeout, $window){
        return{
            restrict: 'EA',
            replace: true,
            scope: {
                mapdata: '='
            },
            template: '<canvas id="map" class="map" ng-class="mapTools.current" msd-wheel="mapTools.zoom($event, $delta)"></canvas>',
            link: function(scope, elm){
                
                scope.mapTools = $mapTools;
                console.log(scope);

                var resizeWindow = null;

                var mapWatcher = scope.$watch('mapdata', function(){
                    if (scope.mapdata){
                        $maps.init({
                            src: 'https://wwwdev2.lib.ua.edu/' + scope.mapdata.image.url,
                            canvas: elm[0],
                            objects: {
                                desktops: scope.mapdata.desktops
                            }
                        }).then(function(){
                            scope.mapTools.init();
                        });

                        scope.reset = function(){
                            $maps.setDefaults();
                            $maps.draw();
                            //$mapTools.zoomSlider.init();
                        };

                        resizeWindow = angular.element($window).bind('resize', function(){
                            $timeout(function(){
                                $maps.resizeCanvas();
                                $maps.setScale();
                                $maps.resizeImage();
                                $maps.posImage();
                                $maps.draw();
                            })
                        });


                    }


                });

                scope.$on('$destroy', function(){
                    mapWatcher();
                    resizeWindow();
                });

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



            }
        };
    }]);

