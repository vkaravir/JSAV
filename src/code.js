/**
* Module that contains support for program code constructs.
* Depends on core.js, anim.js
*/
/*global JSAV:true*/
(function($) {
  if (typeof JSAV === "undefined") { return; }
  var Variable = function(jsav, value, options) {
    this.jsav = jsav;
    this.options = $.extend({visible: false, type: typeof value}, options);
    this.element = $('<div class="jsavvariable">' +
                      '<span class="jsavvarlabel"></span> <span class="jsavvalue jsavvarvalue">' + 
                      value + '</span></div>');
    this.element.find(".jsavvarvalue").attr("data-value", value);
    if (this.options.before) {
      this.element.insertBefore(this.options.before.element);
    } else if (this.options.after) {
      this.element.insertAfter(this.options.before.element);
    } else {
      $(this.jsav.container).append(this.element);
    }
    if (this.options.label) {
      this.element.find(".jsavvarlabel").html(this.options.label);
    }
    if (this.options.name) {
      this.element.attr("data-varname", this.options.name);
    }
    if (!this.options.visible) {
      this.element.css("display", "none");
    }    
  };
  var varproto = Variable.prototype;
  varproto._toggleVisible = JSAV.anim(JSAV.ext.effects._toggleVisible);
  varproto.show = JSAV.ext.effects.show;
  varproto.hide = JSAV.ext.effects.hide;
  varproto._setValue = JSAV.anim(
    function(newValue) {
      this.element.find(".jsavvarvalue").html(newValue);
      this.element.find(".jsavvarvalue").attr("data-value", newValue);
    }
  );
  varproto.value = function(newValue) {
    if (typeof newValue === "undefined") {
      var val = this.element.find(".jsavvarvalue").attr("data-value");
      return JSAV.utils.value2type(val, this.options.type);
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
  varproto.equals = function(otherVariable) {
    if (!otherVariable || typeof otherVariable !== "object") { return false; }
    return this.value() == otherVariable.value();
  };
  
  JSAV.ext.variable = function(value, options) {
    return new Variable(this, value, options);
  };

})(jQuery);