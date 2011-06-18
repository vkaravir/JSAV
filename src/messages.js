/*
 * JSAV 0.0.01 - JavaScript Algorithm Visualization Library
 *
 * Copyright (c) 2011 Ville Karavirta (http://)
 * Licensed under the MIT license.
 */

/**
* Module that contains the animator implementations.
* Depends on core.js
*/
(function($) {
  if (typeof JSAV === "undefined") { return; }
  
  var MessageHandler = function(jsav, output) {
    this.jsav = jsav;
    this.output = output;
  };
  MessageHandler.prototype.message = JSAV.anim(function(msg, options) {
    if (!this.jsav.RECORD) { // trigger events only if not recording
      $(this.jsav.container).trigger("message", [msg, options]); 
    }
    if (this.output) {
      var col = "black";
      if (options) {
        col = options.color || "black";
      }
      var msgelem = "<div style='color:" + col + ";'>" + msg + "</div>";
      if (this.output.hasClass("line")) {
        this.output.html(msgelem);
      } else if (this.output.hasClass("scroll")) {
        this.output.html(this.output.html() + msgelem);
      }      
    }
    return this;
  });
  
  MessageHandler.prototype.state = function(newValue) {
    if (newValue) {
      this.output.html(newValue);
    } else {
      return this.output.html();
    }
  };
  
  JSAV.ext.message = function(msg, options) {
    this._msg.message(msg, options);
  };
  
  JSAV.init(function(options) {
    var output = $(this.container).find(".output");
    this._msg = new MessageHandler(this, output);
  });
}(jQuery));