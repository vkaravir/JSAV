/**
* Module that contains JSAV core.
*/
(function($) {
  "use strict";
  var JSAV = function() {
    create.apply(this, arguments);
  };
  JSAV.position = function(elem) {
    var $el = $(elem),
      offset = $el.position(),
      translate = $el.css("transform").translate; // requires jquery.transform.light.js!!
    if (translate) {
      return {left: offset.left + translate[0], top: offset.top + translate[1]};
    } else { return offset; }
  };
  var jsavproto = JSAV.prototype;
  jsavproto.getSvg = function() {
    if (!this.svg) { // lazily create the SVG overlay only when needed
      this.svg = Raphael(this.canvas[0]);
//      this.svg.renderfix();
      var style = this.svg.canvas.style;
      style.position = "absolute";
    }
    return this.svg;
  };
  JSAV._types = {}; // for exposing types of JSAV for customization
  JSAV.ext = {}; // for extensions
  JSAV.init = function(f) { // for initialization functions
    JSAV.init.functions.push(f);
  };
  JSAV.init.functions = [];
  
  var AV = function() {},
    create = function() {
      if (typeof arguments[0] === "string") {
        this.container = $(document.getElementById(arguments[0]));
      } else {
        this.container = $(arguments[0]); // make sure it is jQuery object
      }
      this.container.addClass("jsavcontainer");
      this.canvas = this.container.find(".jsavcanvas");
      if (this.canvas.size() === 0) {
        this.canvas = $("<div />").addClass("jsavcanvas").appendTo(this.container);
      }
      this.options = arguments[1] || { };
      this.RECORD = true;
      jQuery.fx.off = true; // by default we are recording changes, not animating them
      var options = arguments[1] || { }; // TODO: default options
      // initialize stuff from init namespace
      initializations(this, options);
      // add all plugins from ext namespace
      extensions(this, this, JSAV.ext);
    };
  function initializations(jsav, options) {
    var fs = JSAV.init.functions;
    for (var i = 0; i < fs.length; i++) {
      if ($.isFunction(fs[i])) {
        fs[i].call(jsav, options);
      }
    }
  }
  function extensions(jsav, con, add) {
    for (var prop in add) {
      if (add.hasOwnProperty(prop) && !(prop in con)) {
        switch (typeof add[prop]) {
          case "function":
            (function (f) {
              con[prop] = con === jsav ? f : function () { return f.apply(jsav, arguments); };
            }(add[prop]));
            break;
          case "object":
            con[prop] = con[prop] || {};
            extensions(jsav, con[prop], add[prop]);
            break;
          default:
            con[prop] = add[prop];
            break;
        }
      }
    }
  }
  if (window) {
    window.JSAV = JSAV;
  }
}(jQuery));