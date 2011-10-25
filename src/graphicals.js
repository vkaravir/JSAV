/**
* Module that contains the graphical primitive implementations.
* Depends on core.js, anim.js, jQuery, Raphael
*/
if (typeof Raphael !== "undefined") { // only execute if Raphael is loaded
  (function($, R) {
    if (typeof JSAV === "undefined") { return; }
    var common = {
      rotate: function(deg, cx, cy) {
        var centerX = cx || "",
            centerY = cy || "";
        this.rObj.animate({ rotation: deg + " " + centerX + " " + centerY }, this.jsav.SPEED);
        return this;
      },
      scale: function(sx, sy) {
        this.rObj.animate({ scale: sx + " " + sy }, this.jsav.SPEED);
        return this;
      },
      scaleX: function(sx) {
        return this.scale(sx, 0);
      },
      scaleY: function(sy) {
        return this.scale(0, sy);
      },
      translate: function(dx, dy) {
        this.rObj.animate({ translation: dx + " " + dy }, this.jsav.SPEED);
        return this;        
      },
      translateX: function(dx) {
        return this.translate(dx, 0);
      },
      translateY: function(dy) {
        return this.translate(0, dy);
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