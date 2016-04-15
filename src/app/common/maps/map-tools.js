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
                            return mouseInBounds(obj.coordinates.x, obj.coordinates.y, 10, 10, (ev.mx - $maps.x) / $maps.scalar, (ev.my - $maps.y) / $maps.scalar);
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
                            x: ev.mx - obj.coordinates.x,
                            y: ev.my - obj.coordinates.y
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
                            obj.coordinates.x = (mox + dx - offsets[i].x);
                            obj.coordinates.y = (moy + dy - offsets[i].y);
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
                            return inRectBounds(obj.coordinates.x, obj.coordinates.y, 10, 10, $maps.objects.selectRect.x, $maps.objects.selectRect.y, $maps.objects.selectRect.w, $maps.objects.selectRect.h);
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
                        selected[i].coordinates.x = center.x;
                    }

                    $mapObjects.merge(selected);
                    $maps.draw();
                };

                this.vAlignCenter = function () {
                    var selected = $mapObjects.getSelected();
                    var center = $mapObjects.centerOfSelection(selected);

                    for (var i = 0, len = selected.length; i < len; i++) {
                        selected[i].coordinates.y = center.y;
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