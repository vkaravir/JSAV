/**
* Module that contains the graphical primitive implementations.
* Depends on core.js, anim.js, jQuery, Raphael
*/
if (typeof Raphael !== "undefined") { // only execute if Raphael is loaded
  (function($, R) {
    if (typeof JSAV === "undefined") { return; }
    
    var common = {
      // utility function that actually implements hide
      // animated show function
      show: function() {
        this.css({"opacity": 1});
      },
      // animated hide function
      hide: function() { 
        this.css({"opacity": 0});
      },
      transform: function(transform) {
        var oldTrans = this.rObj.transform();
        if (this.jsav._shouldAnimate()) { // only animate when playing, not when recording
          this.rObj.animate( { transform: transform }, this.jsav.SPEED);
        } else {
          this.rObj.transform(transform);
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
      scaleX: function(sx) {
        return this.scale(sx, 1);
      },
      scaleY: function(sy) {
        return this.scale(1, sy);
      },
      translate: JSAV.anim(function(dx, dy) {
        this.transform("...T" + dx + "," + dy);
        return [0-dx, 0-dy];
      }),
      translateX: function(dx) {
        return this.translate(dx, 0);
      },
      translateY: function(dy) {
        return this.translate(0, dy);
      },
      _setattrs: JSAV.anim(function(props, dontAnimate) {
        var oldProps = $.extend(true, {}, props);
        for (var i in props) {
          oldProps[i] = this.rObj.attr(i);
        }
        if (this.jsav._shouldAnimate() && !dontAnimate) { // only animate when playing, not when recording
          this.rObj.animate( props, this.jsav.SPEED);
        } else {
          for (var i in props) {
            this.rObj.attr(i, props[i]);
          }
        }
        return [oldProps];
      }),
      css: function(props) {
        if (typeof props === "string") {
          return this.rObj.attr(props);
        } else {
          return this._setattrs(props);
        }
      },
      state: function(newState) {
        if (typeof newState !== "undefined") {
          for (var i in newState) {
            this.rObj.attr(i, newState[i]);
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
      obj.elem = $(obj.rObj.node).data("svgelem", obj.rObj);
      for (var i in props) {
        if (props.hasOwnProperty(i)) {
          obj.rObj.attr(i, props[i]);
        }
      }
    };

    var translatePoint  = function(point, dx, dy) {
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
      this._setattrs({"path": newPath});
      return this;
    };

    var movePoints  = function(points) {
      var currPath = this.rObj.attrs.path,
          newPath = currPath.slice(),
          pathElem;
      for (var i=0, l=points.length; i < l; i++) {
        var p = points[i];
        pathElem = currPath[p[0]];
        newPath[p[0]] = [pathElem[0], p[1], p[2]];
      }
      var np = "";
      for (var i=0, l=newPath.length; i < l; i++) {
        pathElem = newPath[i];
        np += pathElem.join(' ');
      }
      this._setattrs({"path": np}, ("" + currPath) === "M-1,-1L-1,-1");
      return this;
    };
    
    var Circle = function(jsav, raphael, x, y, r, props) {
      this.rObj = raphael.circle(x, y, r);
      init(this, jsav, props);
      return this;
    };
    var cproto = Circle.prototype;
    $.extend(cproto, common);
    cproto.center = function(x, y) {
      if (typeof x === "undefined") { // getting center
        return this.rObj.attr(["cx", "cy"]);
      } else if ($.isArray(x) && x.length == 2) {
        this._setattrs({"cx": x[0], "cy": x[1]});
      } else if (typeof y !== "undefined") {
        this._setattrs({"cx": x, "cy": y});
      } else if ("cx" in x && "cy" in x) {
        this._setattrs(x)
      }
      return this;
    };
    cproto.radius = function(r) {
      if (typeof r === "undefined") {
        return this.rObj.attr("r");
      } else {
        this._setattrs({"r": r});
        return this;
      }
    }
 
    var Rect = function(jsav, raphael, x, y, w, h, r, props) {
      this.rObj = raphael.rect(x, y, w, h, r);
      init(this, jsav, props);
      return this;
    };
    var rectproto = Rect.prototype;
    $.extend(rectproto, common);
    rectproto.width = function(w) {
      if (typeof w === "undefined") {
        return this.rObj.attr("width");
      } else {
        this._setattrs({"width": w});
        return this;
      }
    };
    rectproto.height = function(h) {
      if (typeof h === "undefined") {
        return this.rObj.attr("height");
      } else {
        this._setattrs({"height": h});
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
    ellproto.radius = function(x, y) {
      if (typeof x === "undefined") { // getting center
        return this.rObj.attr(["rx", "ry"]);
      } else if ($.isArray(x) && x.length == 2) {
        this._setattrs({"rx": x[0], "ry": x[1]});
      } else if (typeof y !== "undefined") {
        this._setattrs({"rx": x, "ry": y});
      } else if ("rx" in x && "ry" in x) {
        this._setattrs(x)
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
      set: function() {
        var svgCanvas = getSvgCanvas(this, props);
        return new Set(this, svgCanvas);
      }
    };
  })(jQuery, Raphael);
}

(function($) {
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
    JSAV.utils._helpers.handleVisibility(this, this.options)
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
  labelproto.text = function(newValue) {
    if (typeof newValue === "undefined") {
      return this.element.html();
    } else {
      this._setText(newValue);
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
  
  JSAV.ext.label = function(text, options) {
    return new Label(this, text, options);
  };
})(jQuery);