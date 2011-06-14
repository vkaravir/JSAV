/*!
 * JSAV 0.0.01 - JavaScript Algorithm Visualization Library
 *
 * Copyright (c) 2011 Ville Karavirta (http://)
 * Licensed under the MIT license.
 */
(function() {
  var JSAV = function() {
    create['apply'](this, arguments);
  };
  JSAV.position = function(elem) {
    var $el = $(elem),
      offset = $el.offset(),
      translate = $el.css("transform").translate; // requires jquery.transform.light.js!!
    if (translate) {
      return {left: offset.left + translate[0], top: offset.top + translate[1]};
    } else { return offset; }
  };
  JSAV.dur = 2500;
  var jsavproto = JSAV.prototype;
  jsavproto.getSvg = function() {
    if (!this.svg) { // lazily create the SVG overlay only when needed
      this.svg = Raphael(this.container);
      // TODO: create a new SVG element and a Raphael paper
      // TODO: set pointer event handling for SVG
    }
    return this.svg;
  };
  JSAV.ext = {}; // for extensions
  
  var AV = function() {},
    create = function() {
      if (typeof arguments[0] == "string") {
        this.container = document.getElementById(arguments[0]);
      } else {
        this.container = arguments[0];
      }
      // initialize all plugins from ext namespace
      extensions.call(this, this, JSAV.ext);
    };
  function extensions(con, add) {
    var that = this;
    for (var prop in add) {
      if (add.hasOwnProperty(prop) && !(prop in con)) {
        switch (typeof add[prop]) {
        case "function":
          (function (f) {
            con[prop] = con === that ? f : function () { return f.apply(that, arguments); };
          })(add[prop]);
        break;
        case "object":
          con[prop] = con[prop] || {};
          extensions.call(this, con[prop], add[prop]);
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
  } else if (exports) { // CommonJS, no idea if this works, though :(
    exports['JSAV'] = JSAV;
  }
})();