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
  
  function backward() {
    if (this._undo.length === 0) { return; }
    var prev = this._undo.pop();
    this._redo.unshift(prev);
    prev[3].apply(prev[0], prev[2]);
  }
  
  function forward() {
    if (this._redo.length === 0) { return; }
    var next = this._redo.shift();
    if (!next[3]) {
      next[3] = function() {
        var obj = next[0],
          state = obj.state();
        return function() {
          obj.state(state);
        }
      }();
    }
    this._undo.push(next);
    next[1].apply(next[0], next[2]);
  }
  
  JSAV.init(function() {
    this._redo = [];
    this._undo = [];
    var that = this;
    $(this.container).bind("forward", function() {
      that.forward();
    });
    $(this.container).bind("backward", function() {
      that.backward();
    });
  });
  
  function anim(effect, undo) {
    // a function that can be used to provide function calls that are applied later
    // when viewing the visualization
    return function() {
      var obj = this;
      var back = undo || undefined;
      var jsav = this;
      if (!jsav.hasOwnProperty("forward")) { jsav = this.jsav; }
      if (jsav.RECORD) {
        jsav._redo.push([this, effect, arguments, back]);
        //effect.apply(this, arguments);
        jsav.forward();
      } else {
        jsav._redo.push([this, effect, arguments, back]);
      }
      return this;
    };
  }

  function begin() {
    var prevFx = $.fx.off;
    $.fx.off = true;
    while (this._undo.length) {
      this.backward();
    }
    $.fx.off = prevFx;
  }
  
  function end() {
    var prevFx = $.fx.off;
    $.fx.off = true;
    while (this._redo.length) {
      this.forward();
    }
    $.fx.off = prevFx;
  }
  
  /* Add the function effect to the animation queue */
  function queue(obj, effect) {
    if (!this._redo) { initQueue(this); }
    this._redo.push([obj, effect]);
  }
  JSAV.anim = anim;
  JSAV.ext.SPEED = 400;
  JSAV.ext.queue = queue;
  JSAV.ext.begin = begin;
  JSAV.ext.end = end;
  JSAV.ext.forward = forward;
  JSAV.ext.backward = backward;
  JSAV.ext.step = function(options) {
    if (options && this.message && options.message) {
      this.message(options.message);
    }
    return this;
  };
  JSAV.ext.substep = function(options) {
    // TODO: implement substep
    return this.step(options);
  };
  JSAV.ext.stepdone = function() {return this;};
  JSAV.ext.recorded = function() {
    this.RECORD = false;
    this.begin();
  };
})(jQuery);