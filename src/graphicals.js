/**
* Module that contains the graphical primitive implementations.
* Depends on core.js, anim.js, jQuery, Raphael
*/
if (typeof Raphael !== "undefined") { // only execute if Raphael is loaded
(function($, R) {
 if (typeof JSAV === "undefined") { return; }
 var gp = {};

 gp.circle = function(raphael, x, y, r) {
   if (!raphael) { 
     return this; 
   }
   var c = raphael.circle(x, y, r),
      elem = c.node;
  $(elem).data("svgelem", c);
  console.log("svg circle", $(elem), elem);
  return $(elem);
 };
 
 JSAV.ext.circle = function(x, y, r) {
   console.log(this);
   return gp.circle(this.getSvg(), x, y, r);
 };
})(jQuery, Raphael);
}

(function($) {
  if (typeof JSAV === "undefined") { return; }
  
  var Label = function(jsav, text, options) {
    this.jsav = jsav;
    this.options = $.extend({display: true}, options);
    this.element = $('<div class="label" style="display:none;">' + text + '</div>');
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