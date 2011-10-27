/**
* Module that contains the graphical primitive implementations.
* Depends on core.js, anim.js, jQuery, Raphael
*/
if (typeof Raphael !== "undefined") { // only execute if Raphael is loaded
  (function($, R) {
    if (typeof JSAV === "undefined") { return; }
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
          oldProps[i] = this.rObj.attr(i);
        }
        console.log("oldprops", oldProps, "setattrs", props);
        if (!this.jsav.RECORD || !$.fx.off) { // only animate when playing, not when recording
          this.rObj.animate( props, this.jsav.SPEED);
        } else {
          this.rObj.attrs(props);
        }
        return oldProps;
      }),
      css: function(props) {
        console.log(this.rObj);
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
          console.log(attrs);
          return attrs;
        }
      }
    };
    var copyCommon = function(proto) {
      for (var prop in common) {
        if (common.hasOwnProperty(prop)) {
          proto[prop] = common[prop];
        }
      }    
    };
    
    var Circle = function(jsav, raphael, x, y, r) {
      this.jsav = jsav;
      this.rObj = raphael.circle(x, y, r);
      this.elem = $(this.rObj.node).data("svgelem", this.rObj);
      return this;
    };
    copyCommon(Circle.prototype);
 
    var Rect = function(jsav, raphael, x, y, w, h, r) {
      this.jsav = jsav;
      this.rObj = raphael.rect(x, y, w, h, r);
      this.elem = $(this.rObj.node).data("svgelem", this.rObj);
      return this;
    };
    copyCommon(Rect.prototype);
 
    var Line = function(jsav, raphael, x1, y1, x2, y2) {
      this.jsav = jsav;
      this.rObj = raphael.path("M" + x1 + ","+ y1 + "L" + x2 + "," + y2);
      this.elem = $(this.rObj.node).data("svgelem", this.rObj);
      return this;
    };
    copyCommon(Line.prototype);
 
    JSAV.ext.g = {
      circle: function(x, y, r) {
        return new Circle(this, this.getSvg(), x, y, r);
      },
      rect: function(x, y, w, h, r) {
        return new Rect(this, this.getSvg(), x, y, w, h, r);
      },
      line: function(x1, y1, x2, y2) {
        return new Line(this, this.getSvg(), x1, y1, x2, y2);
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