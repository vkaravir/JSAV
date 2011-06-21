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
  MessageHandler.prototype.umsg = JSAV.anim(function(msg, options) {
    if (!this.jsav.RECORD) { // trigger events only if not recording
      $(this.jsav.container).trigger("message", [msg, options]); 
    }
    var opts = $.extend({color: "black", preserve: false}, options);
    if (this.output) {
      if (this.output.hasClass("line") && opts.preserve) {
        this.output.find("div:last").append("<span style='color:" + opts.color + ";'>" + msg + "</span>");
      } else if (this.output.hasClass("line")) {
        this.output.html("<div style='color:" + opts.color + ";'>" + msg + "</div>");
      //} else if (this.output.hasClass("scroll")) {
      } else { // e.g. "scroll", which is default
        this.output.append("<div style='color:" + opts.color + ";'>" + msg + "</div>");
      }      
    }
    return this;
  });
  MessageHandler.prototype.clear = JSAV.anim(function() {
    if (this.output) {
      this.output.html("");
    }
  });
  
  MessageHandler.prototype.state = function(newValue) {
    if (newValue) {
      this.output.html(newValue);
    } else {
      return this.output.html();
    }
  };
  
  JSAV.ext.umsg = function(msg, options) {
    this._msg.umsg(msg, options);
  };
  JSAV.ext.clearMsgs = function(msg, options) {
    this._msg.clear();
  };
  
  JSAV.init(function(options) {
    var output = $(this.container).find(".output");
    this._msg = new MessageHandler(this, output);
  });
}(jQuery));