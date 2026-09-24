/**
 * Module that contains the graphical primitive implementations.
 * Depends on core.js, anim.js, jQuery, Raphael, d3
 */
/*global JSAV, jQuery, Raphael, d3 */

// if (typeof Raphael !== "undefined") { // only execute if Raphael is loaded
if (typeof d3 !== "undefined") {
  (function ($, R) {
    "use strict";
    if (typeof JSAV === "undefined") {
      return;
    }

    var JSAVGraphical = function () {};
    JSAVGraphical.prototype = {
      // utility function that actually implements hide
      // animated show function
      show: function (options) {
        var opa = parseInt(this.css("opacity"));
        if (opa !== 1) {
          this.css({ opacity: 1 }, options);
        }
      },
      // animated hide function
      hide: function (options) {
        var opa = parseInt(this.css("opacity"));
        if (opa !== 0) {
          this.css({ opacity: 0 }, options);
        }
      },
      isVisible: function (options) {
        var opa = parseInt(this.css("opacity"));
        return opa !== 0;
      },
      transform: function (transform, options) {
        // var oldTrans = this.rObj.transform();
        const oldTrans = d3.select(this.rObj).attr('transform');

        const raphaelToD3Transform = (transformStr) => {

          const bbox = this.rObj.getBBox();
          const centerX = bbox.x + bbox.width / 2;
          const centerY = bbox.y + bbox.height / 2;
        
          let d3TransformStr = transformStr.replace(/r(-?\d+)/g, (match, degrees) => {
            return `rotate(${degrees},${centerX},${centerY})`;
          });

          d3TransformStr = d3TransformStr.replace(/S(-?\d*\.?\d+),(-?\d*\.?\d+)/g, (match, sx, sy) => {
            return `scale(${sx},${sy})`;
          });
        
          d3TransformStr = d3TransformStr.replace(/T(-?\d*\.?\d+),(-?\d*\.?\d+)/g, (match, tx, ty) => {
            return `translate(${tx},${ty})`;
          });

          return d3TransformStr;
        };

        const applyTransform = (originalTransform, newTransform, position) => {
          if (position === 'prepend') {
            return newTransform + ' ' + originalTransform;
          } else if (position === 'append') {
            return originalTransform + ' ' + newTransform;
          } else {
            return newTransform;
          }
        };

        const parts = transform.split('...');
        let d3Transform = raphaelToD3Transform(parts[0]);

        for (let i = 1; i < parts.length; i++) {
          const position = i % 2 === 1 ? 'prepend' : 'append';
          d3Transform = applyTransform(d3Transform, raphaelToD3Transform(parts[i]), position);
        }

        if (this.jsav._shouldAnimate()) {
          // only animate when playing, not when recording
          // this.rObj.animate({ transform: transform }, this.jsav.SPEED);
          

          d3.select(this.rObj).transition()
            .attr("transform", d3Transform)
            .duration(this.jsav.SPEED);
        } else {
          d3.select(this.rObj).transition()
            .attr("transform", d3Transform);
        }
        return oldTrans;
      },
      rotate: JSAV.anim(function (deg) {
        this.transform("...r" + deg);
        return [0 - deg];
      }),
      scale: JSAV.anim(function (sx, sy) {
        this.transform("...S" + sx + "," + sy);
        return [1.0 / sx, 1.0 / sy];
      }),
      scaleX: function (sx, options) {
        return this.scale(sx, 1, options);
      },
      scaleY: function (sy, options) {
        return this.scale(1, sy, options);
      },
      translate: JSAV.anim(function (dx, dy, options) {
        const tagname = d3.select(this.rObj).node().tagName;

        if (tagname === "set") {
          const children = d3.select(this.rObj).selectChildren('*');
          const childnodes = children.nodes();

          childnodes.forEach(function (child, i) {
            child.__parent.transform("...T" + dx + "," + dy);
          });
        }
        else {
          this.transform("...T" + dx + "," + dy);
        }
        return [0 - dx, 0 - dy];
      }),
      translateX: function (dx, options) {
        return this.translate(dx, 0, options);
      },
      translateY: function (dy, options) {
        return this.translate(0, dy, options);
      },
      _setattrs: JSAV.anim(function (props, options) {
        var oldProps = $.extend(true, {}, props);
        for (var i in props) {
          if (props.hasOwnProperty(i)) {
            // oldProps[i] = this.rObj.attr(i);
            oldProps[i] = d3.select(this.rObj).attr(i);
          }
        }
        if (this.jsav._shouldAnimate() && (!options || !options.dontAnimate)) {
          // only animate when playing, not when recording
          // this.rObj.animate( props, this.jsav.SPEED);
          for (i in props) {
            d3.select(this.rObj).attr(i, props[i]);
          }
          d3.select(this.rObj).transition().duration(this.jsav.SPEED);
        } else {
          for (i in props) {
            if (props.hasOwnProperty(i)) {
              // this.rObj.attr(i, props[i]);
              d3.select(this.rObj).attr(i, props[i]);
            }
          }
        }
        return [oldProps];
      }),
      css: function (props, options) {
        if (typeof props === "string") {
          // return this.rObj.attr(props);
          return d3.select(this.rObj).attr(props);
        } else {
          return this._setattrs(props, options);
        }
      },
      state: function (newState) {
        if (typeof newState !== "undefined") {
          for (var i in newState) {
            if (newState.hasOwnProperty(i)) {
              // this.rObj.attr(i, newState[i]);
              d3.select(this.rObj).attr(i, newState[i]);
            }
          }
          return this;
        } else {
          var attrs = $.extend(true, {}, d3.select(this.rObj).attr());
          return attrs;
        }
      },
      bounds: function () {
        // var bbox = this.rObj.getBBox();
        var bbox = this.rObj.getBBox();
        return {
          left: bbox.x,
          top: bbox.y,
          width: bbox.width,
          height: bbox.height,
        };
      },
      id: JSAV._types.JSAVObject.prototype.id,
      clear: function () {
        //this.rObj.remove();
        d3.select(this.rObj).remove();
      },
    };
    var graphicalproto = JSAVGraphical.prototype;
    graphicalproto.addClass = JSAV.utils._helpers.addClass;
    graphicalproto.removeClass = JSAV.utils._helpers.removeClass;
    graphicalproto.hasClass = JSAV.utils._helpers.hasClass;
    graphicalproto.toggleClass = JSAV.anim(JSAV.utils._helpers._toggleClass);

    // events to register as functions on the graphical primitive "super"prototype
    var events = [
      "click",
      "dblclick",
      "mousedown",
      "mousemove",
      "mouseup",
      "mouseenter",
      "mouseleave",
    ];
    // returns a function for the passed eventType that binds a passed
    // function to that eventType for the graphical primitive
    var eventhandler = function (eventType) {
      return function (data, handler) {
        // store reference to this, needed when executing the handler
        var self = this;
        // bind a jQuery event handler, limit to .jsavindex
        this.element.on(eventType, function (e) {
          // log the event
          self.jsav.logEvent({type: "jsav-graphical-" + eventType, objid: self.id()});
          if (typeof data === "function") { // if no custom data..
            // ..bind this to the graphical primitive and call handler
            // with the event as param
            data.call(self, e);
          } else if (typeof handler === "function") { // if custom data is passed
            // ..bind this to the graphical primitive and call handler
            var params = Array.isArray(data)?data.slice(0):[data]; // get a cloned data array or data as array
            params.push(e); // jQuery event as the last
            handler.apply(self, params); // apply the function
          }
        });
        return this;
      };
    };
    // create the event binding functions and add to the prototype
    for (var i = events.length; i--; ) {
      graphicalproto[events[i]] = eventhandler(events[i]);
    }
    // a function to bind any other events then the ones specially registered
    graphicalproto.on = function (eventName, data, handler) {
      eventhandler(eventName).call(this, data, handler);
      return this;
    };

    var init = function (obj, jsav, props) {
      obj.jsav = jsav;
      // obj.element = $(obj.rObj.node).data("svgelem", obj.rObj);
      obj.element = $(obj.rObj).data("svgelem", obj.rObj);

      // obj.element = $(d3.select(obj.rObj).node()).data('svgelem', obj.rObj);
      var prop = $.extend({'visible': true}, props);
      for (var i in prop) {
        if (prop.hasOwnProperty(i)) {
          // obj.rObj.attr(i, prop[i]);
          d3.select(obj.rObj).attr(i, prop[i]);
        }
      }
      // if opacity not set manually, we'll hide the object and show it if it
      // should be visible
      if (!("opacity" in prop)) {
        // obj.rObj.attr('opacity', 0);
        d3.select(obj.rObj).attr("opacity", 0);

        var visible =
          typeof prop.visible === "boolean" && prop.visible === true;
        if (visible) {
          obj.show(prop);
        }
      }
    };

    // Function for translating one point in a path object such as line or polyline.
    // Parameter point should be an index of a point, for example, 0 for the start
    // point of a line. Parameters dx and dy tell how much the point should be
    // translated.
    var translatePoint = function (point, dx, dy, options) {
      // var currPath = this.rObj.attrs.path,

      var pathString = d3.select(this.rObj)._groups[0][0].getAttribute("path");
      var currPath = pathString.split(",").map(function (substring) {
          return substring.trim().split(" ");
        }),
        newPath = "",
        pathElem;

      var path_string = "";
      if (point > currPath.length) {
        return this;
      }
      for (var i = 0, l = currPath.length; i < l; i++) {
        pathElem = currPath[i];
        if (i){
          path_string += ",";
        }
        if (i === point) {
          var movedElem = pathElem[0] + " " + (+pathElem[1] + dx) + " " + (+pathElem[2] + dy);
          newPath += movedElem;
          path_string += movedElem;
        } else {
          newPath += pathElem.join(" ");
          path_string += pathElem.join(" ");
        }
      }

      this._setattrs({ d: newPath, path: path_string }, options);
      return this;
    };

    // A function for changing the points of a path such as a line of polyline
    // Parameter points should be an array of points that should be changed.
    // For example, to change points 0 and 3 in a polyline points should be:
    //  [[0, new0X, new0Y], [3, new3X, new3Y]]
    var movePoints = function (points, options) {
      // var currPath = this.rObj.attrs.path,

      var obj_id = d3.select(this.rObj).attr('id');
      if (obj_id !== null && obj_id !== undefined) {
        if (obj_id.includes("arrow-style")) {
          return this;
        }
      }

      var pathString = d3.select(this.rObj)._groups[0][0].getAttribute("path");
      var currPath = pathString.split(",").map(function (substring) {
          return substring.trim().split(" ");
        }),
        newPath = currPath.slice(),
        newPoints = this.points(),
        pathElem,
        i,
        l;

      for (i = 0, l = points.length; i < l; i++) {
        var p = points[i];
        pathElem = currPath[p[0]];
        newPath[p[0]] = [pathElem[0], p[1], p[2]];
        newPoints[p[0]] = p.slice(1);
      }

      var np = "";
      for (i = 0, l = newPath.length; i < l; i++) {
        pathElem = newPath[i];
        np += pathElem.join(" ");
      }

      var path_string = "";
      for (i = 0, l = newPath.length; i < l; i++) {
        if (i){
          path_string += ",";
        }
        path_string += newPath[i].join(" ");
      }

      this._setpoints(newPoints);
      this._setattrs(
        { d: np, path: path_string },
        $.extend({ dontAnimate: "" + currPath === "M-1,-1L-1,-1" }, options)
      );
      return this;
    };
    var _setpoints = JSAV.anim(function (newPoints) {
      var oldPoints = $.extend(true, [], this._points);
      this._points = newPoints;
      return [oldPoints];
    });
    // A function for getting the points of a path such as a line or polyline
    var points = function () {
      return $.extend(true, [], this._points); // deep copy of points
    };

    // var Circle = function(jsav, raphael, x, y, r, props) {
    var Circle = function (jsav, canvas, x, y, r, props) {

      this.rObj = d3.select(canvas)
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("fill", "none")
        .attr("opacity", 1)
        .attr("r", r)
        .node();
      init(this, jsav, props);

      return this;
    };
    JSAV.utils.extend(Circle, JSAVGraphical);
    var cproto = Circle.prototype;
    cproto.center = function (x, y, options) {
      if (typeof x === "undefined") {
        // getting center
        // return this.rObj.attr(["cx", "cy"]);
        return {
          cx: d3.select(this.rObj).attr("cx"),
          cy: d3.select(this.rObj).attr("cy"),
        };
      } else if (Array.isArray(x) && x.length === 2) {
        this._setattrs({ cx: x[0], cy: x[1] }, options);
      } else if (typeof y !== "undefined") {
        this._setattrs({ cx: x, cy: y }, options);
      } else if ("cx" in x && "cy" in x) {
        this._setattrs(x, options);
      }
      return this;
    };
    cproto.radius = function (r, options) {
      if (typeof r === "undefined") {
        // return this.rObj.attr("r");
        return d3.select(this.rObj).attr("r");
      } else {
        this._setattrs({ r: r }, options);
        return this;
      }
    };

    // var Rect = function(jsav, raphael, x, y, w, h, r, props) {
    var Rect = function (jsav, canvas, x, y, w, h, r, props) {
      // this.rObj = raphael.rect(x, y, w, h, r);

      this.rObj = d3.select(canvas)
        .append("rect")
        .attr("x", x)
        .attr("y", y)
        .attr("width", w)
        .attr("height", h)
        .attr("rx", r)
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("opacity", 1)
        .attr("fill", "none")
        .node();
      init(this, jsav, props);
      return this;
    };
    JSAV.utils.extend(Rect, JSAVGraphical);
    var rectproto = Rect.prototype;
    rectproto.width = function (w, options) {
      if (typeof w === "undefined") {
        // return this.rObj.attr("width");
        return d3.select(this.rObj).attr("width");
      } else {
        this._setattrs({ width: w }, options);
        return this;
      }
    };
    rectproto.height = function (h, options) {
      if (typeof h === "undefined") {
        // return this.rObj.attr("height");
        return d3.select(this.rObj).attr("height");
      } else {
        this._setattrs({ height: h }, options);
        return this;
      }
    };

    // var Line = function(jsav, raphael, x1, y1, x2, y2, props) {
    var Line = function Line(jsav, canvas, x1, y1, x2, y2, props) {
      // this.rObj = raphael.path("M" + x1 + " "+ y1 + "L" + x2 + " " + y2);
      if (Array.isArray(x1)){
        var coords = x1;
        props = y1;
        x1 = coords[0];
        y1 = coords[1];
        x2 = coords[2];
        y2 = coords[3];
      }
      
      var path = "M" + x1 + " " + y1 + "L" + x2 + " " + y2;
      var path_string =
        "M" + " " + x1 + " " + y1 + "," + "L" + " " + x2 + " " + y2;

      var markerId = ["arrow-end", "arrow-start"];

      if (props !== null && props !== undefined) {
        for (let i = 0; i < 2; i++){
          if (props[markerId[i]] !== null && props[markerId[i]] !== undefined) {
            markerId[i] = "arrow-style-" + props[markerId[i]];
            var existingMarker = d3.select(canvas).select("#" + markerId[i]);

            if (existingMarker.empty()) {
              d3.select(canvas).append("marker")
                .attr("id", markerId[i])
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 5)
                .attr("refY", 0)
                .attr("markerWidth", 4)
                .attr("markerHeight", 4)
                .attr("orient", "auto")
                .append("path")
                .attr("id", markerId[i] + "path")
                .attr("d", "M0,-5 L10,0 L0,5")
                .attr("path", "M 0 -5, L 10 0")
                .attr("fill", "gray");
            }

          }
        }
        
      }

      
      this.rObj = d3.select(canvas)
        .append("path")
        .attr("d", path)
        .attr("path", path_string)
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("opacity", 1)
        .attr("stroke-width", 1)
        .attr("marker-start", markerId[1].includes("arrow-style-")  ? "url(#" + markerId[1] + ")" : null)
        .attr("marker-end", markerId[0].includes("arrow-style-")  ? "url(#" + markerId[0] + ")" : null)
        .node();

      init(this, jsav, props);
      this._points = [
        [x1, y1],
        [x2, y2],
      ];
      return this;
    };
    JSAV.utils.extend(Line, JSAVGraphical);

    Line.prototype.translatePoint = translatePoint;
    Line.prototype._polylineMovePoints = movePoints;
    Line.prototype.movePoints = function(newx1, newy1, newx2, newy2) {
      if (Array.isArray(newx1)) {
        // assume it's an array suitable for "general" movePoints
        return this._polylineMovePoints(newx1);
      } else {
        // otherwise create an array suitable for "general" movePoints
        return this._polylineMovePoints([
          [0, newx1, newy1],
          [1, newx2, newy2],
        ]);
      }
    };
    Line.prototype.points = points;
    Line.prototype._setpoints = _setpoints;

    // var Ellipse = function(jsav, raphael, x, y, rx, ry, props) {
    var Ellipse = function Ellipse(jsav, canvas, x, y, rx, ry, props) {
      // this.rObj = raphael.ellipse(x, y, rx, ry);
      this.rObj = d3.select(canvas)
          .append("ellipse")
          .attr("cx", x)
          .attr("cy", y)
          .attr("rx", rx)
          .attr("ry", ry)
          .attr("stroke", "#000")
          .attr("stroke-width", 1)
          .attr("opacity", 1)
          .attr("fill", "none")
          .node();
      init(this, jsav, props);
      return this;
    };
    JSAV.utils.extend(Ellipse, JSAVGraphical);
    var ellproto = Ellipse.prototype;
    ellproto.center = cproto.center;
    ellproto.radius = function (x, y, options) {
      if (typeof x === "undefined") {
        // getting radius
        // return this.rObj.attr(["rx", "ry"]);
        return {
          rx: d3.select(this.rObj).attr("rx"),
          ry: d3.select(this.rObj).attr("ry"),
        };
      } else if (Array.isArray(x) && x.length === 2) {
        this._setattrs({ rx: x[0], ry: x[1] }, options);
      } else if (typeof y !== "undefined") {
        this._setattrs({ rx: x, ry: y }, options);
      } else if ("rx" in x && "ry" in x) {
        this._setattrs(x, options);
      }
      return this;
    };

    // var Polyline = function(jsav, raphael, points, close, props) {
    var Polyline = function Polyline(jsav, canvas, points, close, props) {
      var path = "M ";
      var path_string = "M ";
      for (var i = 0, l = points.length; i < l; i++) {
        if (i) {
          path += "L";
          path_string += ",L ";
        }
        path += points[i][0] + " " + points[i][1];
        path_string += points[i][0] + " " + points[i][1];
      }
      if (close) {
        path += "Z";
        path_string += ",Z ";
      }
      // this.rObj = raphael.path(path);

      this.rObj = d3.select(canvas)
        .append("path")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("fill", "none")
        .attr("d", path)
        .attr("opacity", 1)
        .attr("path", path_string)
        .node();

      init(this, jsav, props);
      this._points = points;
      return this;
    };
    JSAV.utils.extend(Polyline, JSAVGraphical);

    Polyline.prototype.translatePoint = translatePoint;
    Polyline.prototype.movePoints = movePoints;
    Polyline.prototype.points = points;
    Polyline.prototype._setpoints = _setpoints;

    // var Path = function(jsav, raphael, path, props) {
    var Path = function (jsav, canvas, path, props) {
      // this.rObj = raphael.path(path);

      console.log(path);

      this.rObj = d3.select(canvas)
        .append("path")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("fill", "none")
        .attr("opacity", 1)
        .attr("d", path)
        .node();

      init(this, jsav, props);
      return this;
    };
    JSAV.utils.extend(Path, JSAVGraphical);
    Path.prototype.path = function (newPath, options) {
      if (typeof newPath === "undefined") {
        // return this.rObj.attr("d");
        return d3.select(this.rObj).attr("d");
      } else {
        return this._setattrs({ d: newPath }, options);
      }
    };

    // var Set = function(jsav, raphael, props) {
    var Set = function Set(jsav, canvas, props) {
      // this.rObj = raphael.set();

      this.rObj = d3.select(canvas).append("set").node();
      init(this, jsav, props);
      return this;
    };
    JSAV.utils.extend(Set, JSAVGraphical);
    var setproto = Set.prototype;
    setproto.push = function (g) {
      // this.rObj.push(g.rObj);
      g.rObj.__parent = g;
      d3.select(this.rObj).append(() => g.rObj);
      // this.rObj.node().appendChild(g.rObj);
      return this;
    };
    var getSvgCanvas = function (jsav, props) {
      if (typeof props === "undefined" || !props.container) {
        return jsav.getSvg();
      } else {
        return props.container.getSvg();
      }
    };
    JSAV.ext.g = {
      circle: function (x, y, r, props) {
        var svgCanvas = getSvgCanvas(this, props);
        return new Circle(this, svgCanvas, x, y, r, props);
      },
      rect: function (x, y, w, h, r, props) {
        // if border-radius not given, assume r is options and radius is 0
        if (typeof r === "object") {
          props = r;
          r = 0;
        }
        var svgCanvas = getSvgCanvas(this, props);
        return new Rect(this, svgCanvas, x, y, w, h, r, props);
      },
      line: function (x1, y1, x2, y2, props) {
        var svgCanvas = getSvgCanvas(this, props);
        return new Line(this, svgCanvas, x1, y1, x2, y2, props);
      },
      ellipse: function (x, y, rx, ry, props) {
        var svgCanvas = getSvgCanvas(this, props);
        return new Ellipse(this, svgCanvas, x, y, rx, ry, props);
      },
      polyline: function (points, props) {
        var svgCanvas = getSvgCanvas(this, props);
        return new Polyline(this, svgCanvas, points, false, props);
      },
      polygon: function (points, props) {
        var svgCanvas = getSvgCanvas(this, props);
        return new Polyline(this, svgCanvas, points, true, props);
      },
      path: function (path, props) {
        var svgCanvas = getSvgCanvas(this, props);
        return new Path(this, svgCanvas, path, props);
      },
      set: function (props) {
        var svgCanvas = getSvgCanvas(this, props);
        return new Set(this, svgCanvas);
      },
    };

    // expose the types
    var gTypes = {
      JSAVGraphical: JSAVGraphical,
      Circle: Circle,
      Rect: Rect,
      Line: Line,
      Ellipse: Ellipse,
      Polyline: Polyline,
      Path: Path,
      Set: Set,
    };
    JSAV._types.g = gTypes;

    // jQuery incorrectly returns 0 for width and height of SVG elements
    // this is a workaround for that bug and returns the correct values
    // for SVG elements and uses default jQuery implementation for other
    // elements. Note, that only get is fixed and set uses default jQuery
    // implementation.
    var svgElements = [
        "circle",
        "path",
        "rect",
        "ellipse",
        "line",
        "polyline",
        "polygon",
      ],
      origWidthHook = $.cssHooks.width,
      origHeightHook = $.cssHooks.height;
    $.cssHooks.width = {
      get: function (elem, computed, extra) {
        // if an SVG element, handle getting the width properly
        if (svgElements.indexOf(elem.nodeName) !== -1) {
          return elem.getBoundingClientRect().width;
        }
        return origWidthHook.get(elem, computed, extra);
      },
      set: origWidthHook.set,
    };
    $.cssHooks.height = {
      get: function (elem, computed, extra) {
        // if an SVG element, handle getting the height properly
        if (svgElements.indexOf(elem.nodeName) !== -1) {
          return elem.getBoundingClientRect().height;
        }
        return origHeightHook.get(elem, computed, extra);
      },
      set: origHeightHook.set,
    };

    /*!
    Following utility functions for handling SVG elements add/remove/toggle/hasClass
    functions are implemented by Keith Wood. See:
   http://keith-wood.name/svg.html
   jQuery DOM compatibility for jQuery SVG
   Written by Keith Wood (kbwood{at}iinet.com.au) April 2009.
   Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and 
   MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses. 
   Please attribute the author if you use it. */
    $.svg = {
      isSVGElem: function (node) {
        return (
          node.nodeType == 1 &&
          node.namespaceURI == "http://www.w3.org/2000/svg"
        );
      },
    };
    /* Support adding class names to SVG nodes. */
    $.fn.addClass = (function (origAddClass) {
      return function (classNames) {
        classNames = classNames || "";
        return this.each(function () {
          if ($.svg.isSVGElem(this)) {
            var node = this;
            $.each(classNames.split(/\s+/), function (i, className) {
              var classes = node.className
                ? node.className.baseVal
                : node.getAttribute("class");
              if ($.inArray(className, classes.split(/\s+/)) == -1) {
                classes += (classes ? " " : "") + className;
                node.className
                  ? (node.className.baseVal = classes)
                  : node.setAttribute("class", classes);
              }
            });
          } else {
            origAddClass.apply($(this), [classNames]);
          }
        });
      };
    })($.fn.addClass);

    /* Support removing class names from SVG nodes. */
    $.fn.removeClass = (function (origRemoveClass) {
      return function (classNames) {
        classNames = classNames || "";
        return this.each(function () {
          if ($.svg.isSVGElem(this)) {
            var node = this;
            $.each(classNames.split(/\s+/), function (i, className) {
              var classes = node.className
                ? node.className.baseVal
                : node.getAttribute("class");
              classes = $.grep(classes.split(/\s+/), function (n, i) {
                return n != className;
              }).join(" ");
              node.className
                ? (node.className.baseVal = classes)
                : node.setAttribute("class", classes);
            });
          } else {
            origRemoveClass.apply($(this), [classNames]);
          }
        });
      };
    })($.fn.removeClass);

    /* Support toggling class names on SVG nodes. */
    $.fn.toggleClass = (function (origToggleClass) {
      return function (className, state) {
        return this.each(function () {
          if ($.svg.isSVGElem(this)) {
            if (typeof state !== "boolean") {
              state = !$(this).hasClass(className);
            }
            $(this)[(state ? "add" : "remove") + "Class"](className);
          } else {
            origToggleClass.apply($(this), [className, state]);
          }
        });
      };
    })($.fn.toggleClass);

    /* Support checking class names on SVG nodes. */
    $.fn.hasClass = (function (origHasClass) {
      return function (className) {
        className = className || "";
        var found = false;
        this.each(function () {
          if ($.svg.isSVGElem(this)) {
            var classes = (
              this.className
                ? this.className.baseVal
                : this.getAttribute("class")
            ).split(/\s+/);
            found = $.inArray(className, classes) > -1;
          } else {
            found = origHasClass.apply($(this), [className]);
          }
          return !found;
        });
        return found;
      };
    })($.fn.hasClass);
    /*! End Keith Wood's utilities */
  })(jQuery, d3);
  // (jQuery, Raphael));
} else {
  // end if d3 !== "undefined"
  // if d3 is not loaded, create dummy functions which warn when using primitives without Raphael
  var error = function () {
    console.error(
      "You are trying to use graphical primitives but forgot to load d3.js."
    );
  };
  var g = {};
  var names = [
    "circle",
    "rect",
    "line",
    "ellipse",
    "polyline",
    "polygon",
    "path",
    "set",
  ];
  for (var i = names.length; i--; ) {
    g[names[i]] = error;
  }
  JSAV.ext.g = g;
}

(function ($) {
  "use strict";
  if (typeof JSAV === "undefined") {
    return;
  }

  var Label = function (jsav, text, options) {
    this.jsav = jsav;
    this.options = $.extend({ visible: true }, options);
    this.element = $('<div class="jsavlabel">' + text + "</div>");
    if (this.options.before) {
      this.element.insertBefore(this.options.before.element);
    } else if (this.options.after) {
      this.element.insertAfter(this.options.after.element);
    } else if (this.options.container) {
      this.options.container.append(this.element);
    } else {
      $(this.jsav.canvas).append(this.element);
    }
    JSAV.utils._helpers.handlePosition(this);
    JSAV.utils._helpers.handleVisibility(this, this.options);
  };
  JSAV.utils.extend(Label, JSAV._types.JSAVObject);
  var labelproto = Label.prototype;
  labelproto._toggleVisible = JSAV.anim(JSAV.ext.effects._toggleVisible);
  labelproto.show = JSAV.ext.effects.show;
  labelproto.hide = JSAV.ext.effects.hide;
  labelproto._setText = JSAV.anim(function (newText) {
    this.element.html(newText);
  });
  labelproto.text = function (newValue, options) {
    if (typeof newValue === "undefined") {
      return this.element.html();
    } else {
      this._setText(newValue, options);
      return this;
    }
  };
  // add value(..) function as an alias for text
  labelproto.value = labelproto.text;
  labelproto.state = function (newState) {
    if (typeof newState !== "undefined") {
      this.text(newState.t, { record: false });
      JSAV.utils._helpers.setElementClasses(this.element, newState.cls || []);
      this.element.attr("style", newState.css || "");
    } else {
      var state = { t: this.text() },
        style = this.element.attr("style");
      var cls = JSAV.utils._helpers.elementClasses(this.element);
      if (cls.length > 0) {
        state.cls = cls;
      }
      if (style) {
        state.css = style;
      }
      return state;
    }
  };
  labelproto.equals = function (otherLabel, options) {
    if (
      !otherLabel ||
      !(otherLabel instanceof Label) ||
      this.text() !== otherLabel.text()
    ) {
      return false;
    }
    // compare styling of the variables
    if (options && "css" in options) {
      // if comparing css properties
      var cssEquals = JSAV.utils._helpers.cssEquals(
        this,
        otherLabel,
        options.css
      );
      if (!cssEquals) {
        return false;
      }
    }

    if (options && "class" in options) {
      // if comparing class attributes
      var classEquals = JSAV.utils._helpers.classEquals(
        this,
        otherLabel,
        options["class"]
      );
      if (!classEquals) {
        return false;
      }
    }
    return true;
  };
  labelproto.css = JSAV.utils._helpers.css;
  labelproto._setcss = JSAV.anim(JSAV.utils._helpers._setcss);
  labelproto.addClass = JSAV.utils._helpers.addClass;
  labelproto.removeClass = JSAV.utils._helpers.removeClass;
  labelproto.hasClass = JSAV.utils._helpers.hasClass;
  labelproto.toggleClass = JSAV.anim(JSAV.utils._helpers._toggleClass);
  JSAV._types.Label = Label; // expose the label type

  JSAV.ext.label = function (text, options) {
    return new Label(this, text, options);
  };
})(jQuery);
