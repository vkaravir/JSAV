/**
* Module that contains the graphical primitive implementations.
* Depends on core.js, anim.js, jQuery, Raphael
*/
if (typeof Raphael !== "undefined") { // only execute if Raphael is loaded
  (function($, R) {
    if (typeof JSAV === "undefined") { return; }
    
    var defaultVals = {
      "stroke-width": "1"
    };
    
    var common = {
      transform: function(transform) {
        var oldTrans = this.rObj.transform();
        if (!this.jsav.RECORD || !$.fx.off) { // only animate when playing, not when recording
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
      _setattrs: JSAV.anim(function(props) {
        var oldProps = $.extend(true, {}, props);
        for (var i in props) {
          oldProps[i] = this.rObj.attr(i) || defaultVals[i];
        }
        if (!this.jsav.RECORD || !$.fx.off) { // only animate when playing, not when recording
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
    };
    var copyCommon = function(proto) {
      for (var prop in common) {
        if (common.hasOwnProperty(prop)) {
          proto[prop] = common[prop];
        }
      }    
    }, 
    init = function(obj, jsav, props) {
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
          newPath += pathElem.join();
        }
      }
      this.rObj.animate({"path": newPath}, this.jsav.SPEED);
      return [point, 0-dx, 0-dy];
    };
    
    var Circle = function(jsav, raphael, x, y, r, props) {
      this.rObj = raphael.circle(x, y, r);
      init(this, jsav, props);
      return this;
    };
    copyCommon(Circle.prototype);
 
    var Rect = function(jsav, raphael, x, y, w, h, r, props) {
      this.rObj = raphael.rect(x, y, w, h, r);
      init(this, jsav, props);
      return this;
    };
    copyCommon(Rect.prototype);
 
    var Line = function(jsav, raphael, x1, y1, x2, y2, props) {
      this.rObj = raphael.path("M" + x1 + " "+ y1 + "L" + x2 + " " + y2);
      init(this, jsav, props);
      return this;
    };
    copyCommon(Line.prototype);
    Line.prototype.translatePoint = JSAV.anim(translatePoint);

    var Ellipse = function(jsav, raphael, x, y, rx, ry, props) {
      this.rObj = raphael.ellipse(x, y, rx, ry);
      init(this, jsav, props);
      return this;
    };
    copyCommon(Ellipse.prototype);
 
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
    copyCommon(Polyline.prototype);

    Polyline.prototype.translatePoint = JSAV.anim(translatePoint);


    JSAV.ext.g = {
      circle: function(x, y, r, props) {
        return new Circle(this, this.getSvg(), x, y, r, props);
      },
      rect: function(x, y, w, h, r, props) {
        return new Rect(this, this.getSvg(), x, y, w, h, r, props);
      },
      line: function(x1, y1, x2, y2, props) {
        return new Line(this, this.getSvg(), x1, y1, x2, y2, props);
      },
      ellipse: function(x, y, rx, ry, props) {
        return new Ellipse(this, this.getSvg(), x, y, rx, ry, props);
      },
      polyline: function(points, props) {
        return new Polyline(this, this.getSvg(), points, false, props);
      },
      polygon: function(points, props) {
        return new Polyline(this, this.getSvg(), points, true, props);
      }
    };
  })(jQuery, Raphael);
}

(function($) {
  if (typeof JSAV === "undefined") { return; }
  
  var Label = function(jsav, text, options) {
    this.jsav = jsav;
    this.options = $.extend({display: true}, options);
    this.element = $('<div class="jsavlabel" style="display:none;">' + text + '</div>');
    if (this.options.before) {
      this.element.insertBefore(this.options.before.element);
    } else if (this.options.after) {
      this.element.insertAfter(this.options.before.element);
    } else {
      $(this.jsav.container).append(this.element);
    }
    if (!(typeof options.display === "boolean" && options.display === true)) {
      this.show();
    }    
  };
  var labelproto = Label.prototype;
  labelproto.show = JSAV.anim(
    function() { this.element.fadeIn(this.jsav.SPEED); }, 
    function() { this.element.fadeOut(this.jsav.SPEED); }
  );
  labelproto.hide = JSAV.anim(
    function() { this.element.fadeOut(this.jsav.SPEED); }, 
    function() { this.element.fadeIn(this.jsav.SPEED); }
  );
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
  
  JSAV.ext.label = function(text, options) {
    return new Label(this, text, options);
  };
})(jQuery);