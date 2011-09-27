/**
* Module that contains support for program code constructs.
* Depends on core.js, anim.js
*/
(function($) {
  if (typeof JSAV === "undefined") { return; }
  var Variable = function(jsav, value, options) {
    this.jsav = jsav;
    this.options = $.extend({display: false}, options);
    this.element = $('<div class="jsavvariable" style="display:none;">' +
                      '<span class="jsavvarname"></span><span class="jsavvalue jsavvarvalue">' + 
                      value + '</span></div>');
    this.element.find(".jsavvarvalue").attr("data-value", value);
    if (this.options.before) {
      this.element.insertBefore(this.options.before.element);
    } else if (this.options.after) {
      this.element.insertAfter(this.options.before.element);
    } else {
      $(this.jsav.container).append(this.element);
    }
    if (this.options.name) {
      this.element.find(".jsavvarname").html(this.options.name);
    }
    if (this.options.display) {
      this.show();
    }    
  };
  var varproto = Variable.prototype;
  varproto.show = JSAV.anim(
    function() { this.element.fadeIn(this.jsav.SPEED); }, 
    function() { this.element.fadeOut(this.jsav.SPEED); }
  );
  varproto.hide = JSAV.anim(
    function() { this.element.fadeOut(this.jsav.SPEED); }, 
    function() { this.element.fadeIn(this.jsav.SPEED); }
  );
  varproto._setValue = JSAV.anim(
    function(newValue) {
      this.element.find(".jsavvarvalue").html(newValue);
      this.element.find(".jsavvarvalue").attr("data-value", newValue);
    }
  );
  varproto.value = function(newValue) {
    if (typeof newValue === "undefined") {
      return this.element.find(".jsavvarvalue").attr("data-value");
    } else {
      this._setValue(newValue);
      return this;
    }
  };
  varproto.state = function(newstate) {
    if (newstate) {
      this.element.html(newstate);
    } else {
      return this.element.html();
    }
  };
  
  JSAV.ext.variable = function(value, options) {
    return new Variable(this, value, options);
  };

})(jQuery);