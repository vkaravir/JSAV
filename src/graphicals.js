/**
* Module that contains the graphical primitive implementations.
* Depends on core.js, anim.js, jQuery, Raphael
*/
if (typeof Raphael !== "undefined") { // only execute if Raphael is loaded
  (function($, R) {
    "use strict";
    if (typeof JSAV === "undefined") { return; }

    var common = {
      // utility function that actually implements hide
      // animated show function
      show: function(options) {
        this.css({"opacity": 1}, options);
      },
      // animated hide function
      hide: function(options) {
        this.css({"opacity": 0}, options);
      },
      isVisible: function(options) {
        return (this.css("opacity") !== 0);
      },
      transform: function(transform, options) {
        var oldTrans = this.rObj.transform();
        if (this.jsav._shouldAnimate()) { // only animate when playing, not when recording
          this.rObj.animate( { transform: transform }, this.jsav.SPEED);
        } else {
          this.rObj.transform(transform, options);
        }
        return oldTrans;
      },
      rotate: JSAV.anim(function(deg) {
        this.transform("...r" + deg);
        return [0 - deg];
      }),
      scale: JSAV.anim(function(sx, sy) {
        this.transform("...S" + sx + "," + sy);
        return [1.0/sx, 1.0/sy];
      }),
      scaleX: function(sx, options) {
        return this.scale(sx, 1, options);
      },
      scaleY: function(sy, options) {
        return this.scale(1, sy, options);
      },
      translate: JSAV.anim(function(dx, dy, options) {
        this.transform("...T" + dx + "," + dy);
        return [0-dx, 0-dy];
      }),
      translateX: function(dx, options) {
        return this.translate(dx, 0, options);
      },
      translateY: function(dy, options) {
        return this.translate(0, dy, options);
      },
      _setattrs: JSAV.anim(function(props, options) {
        var oldProps = $.extend(true, {}, props);
        for (var i in props) {
          if (props.hasOwnProperty(i)) {
            oldProps[i] = this.rObj.attr(i);
          }
        }
        if (this.jsav._shouldAnimate() && (!options || !options.dontAnimate)) { // only animate when playing, not when recording
          this.rObj.animate( props, this.jsav.SPEED);
        } else {
          for (i in props) {
            if (props.hasOwnProperty(i)) {
              this.rObj.attr(i, props[i]);
            }
          }
        }
        return [oldProps];
      }),
      css: function(props, options) {
        if (typeof props === "string") {
          return this.rObj.attr(props);
        } else {
          return this._setattrs(props, options);
        }
      },
      state: function(newState) {
        if (typeof newState !== "undefined") {
          for (var i in newState) {
            if (newState.hasOwnProperty(i)) {
              this.rObj.attr(i, newState[i]);
            }
          }
          return this;
        } else {
          var attrs = $.extend(true, {}, this.rObj.attrs);
          return attrs;
        }
      },
      bounds: function() {
        var bbox = this.rObj.getBBox();
        return { left: bbox.x, top: bbox.y, width: bbox.width, height: bbox.height };
      }
    };
    var init = function(obj, jsav, props) {
      obj.jsav = jsav;
      obj.element = $(obj.rObj.node).data("svgelem", obj.rObj);
      for (var i in props) {
        if (props.hasOwnProperty(i)) {
          obj.rObj.attr(i, props[i]);
        }
      }
    };

    // Function for translating one point in a path object such as line or polyline.
    // Parameter point should be an index of a point, for example, 0 for the start
    // point of a line. Parameters dx and dy tell how much the point should be
    // translated.
    var translatePoint  = function(point, dx, dy, options) {
      var currPath = this.rObj.attrs.path,
          newPath = "",
          pathElem;
      if (point > currPath.length) { return this; }
      for (var i=0, l=currPath.length; i < l; i++) {
        pathElem = currPath[i];
        if (i === point) {
          newPath += pathElem[0] + " " + (+pathElem[1] + dx) + " " +
                    (+pathElem[2] + dy);
        } else {
          newPath += pathElem.join(' ');
        }
      }
      this._setattrs({"path": newPath}, options);
      return this;
    };

    // A function for changing the points of a path such as a line of polyline
    // Parameter points should be an array of points that should be changed.
    // For example, to change points 0 and 3 in a polyline points should be:
    //  [[0, new0X, new0Y], [3, new3X, new3Y]]
    var movePoints  = function(points, options) {
      var currPath = this.rObj.attrs.path,
          newPath = currPath.slice(),
          pathElem, i, l;
      for (i = 0, l = points.length; i < l; i++) {
        var p = points[i];
        pathElem = currPath[p[0]];
        newPath[p[0]] = [pathElem[0], p[1], p[2]];
      }
      var np = "";
      for (i = 0, l = newPath.length; i < l; i++) {
        pathElem = newPath[i];
        np += pathElem.join(' ');
      }
      this._setattrs({"path": np}, $.extend({dontAnimate: ("" + currPath) === "M-1,-1L-1,-1"}, options));
      return this;
    };

    var Circle = function(jsav, raphael, x, y, r, props) {
      this.rObj = raphael.circle(x, y, r);
      init(this, jsav, props);
      return this;
    };
    var cproto = Circle.prototype;
    $.extend(cproto, common);
    cproto.center = function(x, y, options) {
      if (typeof x === "undefined") { // getting center
        return this.rObj.attr(["cx", "cy"]);
      } else if ($.isArray(x) && x.length === 2) {
        this._setattrs({"cx": x[0], "cy": x[1]}, options);
      } else if (typeof y !== "undefined") {
        this._setattrs({"cx": x, "cy": y}, options);
      } else if ("cx" in x && "cy" in x) {
        this._setattrs(x, options);
      }
      return this;
    };
    cproto.radius = function(r, options) {
      if (typeof r === "undefined") {
        return this.rObj.attr("r");
      } else {
        this._setattrs({"r": r}, options);
        return this;
      }
    };

    var Rect = function(jsav, raphael, x, y, w, h, r, props) {
      this.rObj = raphael.rect(x, y, w, h, r);
      init(this, jsav, props);
      return this;
    };
    var rectproto = Rect.prototype;
    $.extend(rectproto, common);
    rectproto.width = function(w, options) {
      if (typeof w === "undefined") {
        return this.rObj.attr("width");
      } else {
        this._setattrs({"width": w}, options);
        return this;
      }
    };
    rectproto.height = function(h, options) {
      if (typeof h === "undefined") {
        return this.rObj.attr("height");
      } else {
        this._setattrs({"height": h}, options);
        return this;
      }
    };

    var Line = function(jsav, raphael, x1, y1, x2, y2, props) {
      this.rObj = raphael.path("M" + x1 + " "+ y1 + "L" + x2 + " " + y2);
      init(this, jsav, props);
      return this;
    };
    $.extend(Line.prototype, common);

    Line.prototype.translatePoint = translatePoint;
    Line.prototype.movePoints = movePoints;

    var Ellipse = function(jsav, raphael, x, y, rx, ry, props) {
      this.rObj = raphael.ellipse(x, y, rx, ry);
      init(this, jsav, props);
      return this;
    };
    var ellproto = Ellipse.prototype;
    $.extend(ellproto, common);
    ellproto.center = cproto.center;
    ellproto.radius = function(x, y, options) {
      if (typeof x === "undefined") { // getting radius
        return this.rObj.attr(["rx", "ry"]);
      } else if ($.isArray(x) && x.length === 2) {
        this._setattrs({"rx": x[0], "ry": x[1]}, options);
      } else if (typeof y !== "undefined") {
        this._setattrs({"rx": x, "ry": y}, options);
      } else if ("rx" in x && "ry" in x) {
        this._setattrs(x, options);
      }
      return this;
    };


    var Polyline = function(jsav, raphael, points, close, props) {
      var path = "M ";
      for (var i=0, l=points.length; i < l; i++) {
        if (i) { path += "L";}
        path += points[i][0] + " " + points[i][1];
      }
      if (close) {
        path += "Z";
      }
      this.rObj = raphael.path(path);
      init(this, jsav, props);
      return this;
    };
    $.extend(Polyline.prototype, common);

    Polyline.prototype.translatePoint = translatePoint;
    Polyline.prototype.movePoints = movePoints;

    var Path = function(jsav, raphael, path, props) {
      this.rObj = raphael.path(path);
      init(this, jsav, props);
      return this;
    };
    Path.prototype.path = function(newPath, options)  {
      if (typeof newPath === "undefined") {
        return this.rObj.attr("path");
      } else {
        return this._setattrs({ path: newPath }, options);
      }
    };
    $.extend(Path.prototype, common);

    var Set = function(jsav, raphael, props) {
      this.rObj = raphael.set();
      init(this, jsav, props);
      return this;
    };
    var setproto = Set.prototype;
    $.extend(setproto, common);
    setproto.push = function(g) {
      this.rObj.push(g.rObj);
      return this;
    };
    var getSvgCanvas = function(jsav, props) {
      if (typeof props === "undefined" || !props.container) {
        return jsav.getSvg();
      } else {
        return props.container.getSvg();
      }
    };
    JSAV.ext.g = {
      circle: function(x, y, r, props) {
        var svgCanvas = getSvgCanvas(this, props);
        return new Circle(this, svgCanvas, x, y, r, props);
      },
      rect: function(x, y, w, h, r, props) {
        var svgCanvas = getSvgCanvas(this, props);
        return new Rect(this, svgCanvas, x, y, w, h, r, props);
      },
      line: function(x1, y1, x2, y2, props) {
        var svgCanvas = getSvgCanvas(this, props);
        return new Line(this, svgCanvas, x1, y1, x2, y2, props);
      },
      ellipse: function(x, y, rx, ry, props) {
        var svgCanvas = getSvgCanvas(this, props);
        return new Ellipse(this, svgCanvas, x, y, rx, ry, props);
      },
      polyline: function(points, props) {
        var svgCanvas = getSvgCanvas(this, props);
        return new Polyline(this, svgCanvas, points, false, props);
      },
      polygon: function(points, props) {
        var svgCanvas = getSvgCanvas(this, props);
        return new Polyline(this, svgCanvas, points, true, props);
      },
      path: function(path, props) {
        var svgCanvas = getSvgCanvas(this, props);
        return new Path(this, svgCanvas, path, props);
      },
      set: function(props) {
        var svgCanvas = getSvgCanvas(this, props);
        return new Set(this, svgCanvas);
      }
    };

    // expose the types
    var gTypes = {
      Circle: Circle,
      Rect: Rect,
      Line: Line,
      Ellipse: Ellipse,
      Polyline: Polyline,
      Path: Path,
      Set: Set
    };
    JSAV._types.g = gTypes;

    // jQuery incorrectly returns 0 for width and height of SVG elements
    // this is a workaround for that bug and returns the correct values
    // for SVG elements and uses default jQuery implementation for other
    // elements. Note, that only get is fixed and set uses default jQuery
    // implementation.
    var svgElements = ["circle", "path", "rect", "ellipse", "line", "polyline", "polygon"],
        origWidthHook = $.cssHooks.width,
        origHeightHook = $.cssHooks.height;
    jQuery.cssHooks.width = {
      get: function( elem, computed, extra ) {
        // if an SVG element, handle getting the width properly
        if (svgElements.indexOf(elem.nodeName) !== -1) {
          return elem.getBoundingClientRect().width;
        }
        return origWidthHook.get(elem, computed, extra);
      },
      set: origWidthHook.set
    };
    jQuery.cssHooks.height = {
      get: function( elem, computed, extra ) {
        // if an SVG element, handle getting the height properly
        if (svgElements.indexOf(elem.nodeName) !== -1) {
          return elem.getBoundingClientRect().height;
        }
        return origHeightHook.get(elem, computed, extra);
      },
      set: origHeightHook.set
    };

  }(jQuery, Raphael));
}

(function($) {
  "use strict";
  if (typeof JSAV === "undefined") { return; }

  var Label = function(jsav, text, options) {
    this.jsav = jsav;
    this.options = $.extend({visible: true}, options);
    this.element = $('<div class="jsavlabel">' + text + '</div>');
    if (this.options.before) {
      this.element.insertBefore(this.options.before.element);
    } else if (this.options.after) {
      this.element.insertAfter(this.options.before.element);
    } else if (this.options.container) {
      this.options.container.append(this.element);
    } else {
      $(this.jsav.canvas).append(this.element);
    }
    JSAV.utils._helpers.handlePosition(this);
    JSAV.utils._helpers.handleVisibility(this, this.options);
  };
  var labelproto = Label.prototype;
  $.extend(labelproto, JSAV._types.common);
  labelproto._toggleVisible = JSAV.anim(JSAV.ext.effects._toggleVisible);
  labelproto.show = JSAV.ext.effects.show;
  labelproto.hide = JSAV.ext.effects.hide;
  labelproto._setText = JSAV.anim(
    function(newText) {
      this.element.html(newText);
    }
  );
  labelproto.text = function(newValue, options) {
    if (typeof newValue === "undefined") {
      return this.element.html();
    } else {
      this._setText(newValue, options);
      return this;
    }
  };
  labelproto.state = function(newstate) {
    if (newstate) {
      $(this.element).html(newstate);
    } else {
      return $(this.element).html();
    }
  };
  labelproto.css = JSAV.utils._helpers.css;
  labelproto._setcss = JSAV.anim(JSAV.utils._helpers._setcss);
  JSAV._types.Label = Label; // expose the label type

  JSAV.ext.label = function(text, options) {
    return new Label(this, text, options);
  };
}(jQuery));