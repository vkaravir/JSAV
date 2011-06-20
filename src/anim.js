/**
* Module that contains the animator implementations.
* Depends on core.js
*/
(function($) {
  if (typeof JSAV === "undefined") { return; }
  
  function backward() {
    if (this._undo.length === 0) { return; }
    var ops = this._undo.pop();
    for (var i = ops.length - 1; i >= 0; i--) {
      var prev = ops[i];
      prev[3].apply(prev[0], prev[2]);
    }
    this._redo.unshift(ops);
  }

  function forward() {
    if (this._redo.length === 0) { return; }
    var ops = this._redo.shift();
    for (var i = 0; i < ops.length; i++) {
      var next = ops[i];
      if (!next[3]) {
        next[3] = function() {
          var obj = next[0],
            state = obj.state();
          return function() {
            obj.state(state);
          };
        }();
      } 
      next[1].apply(next[0], next[2]);
    }
    this._undo.push(ops);
  }
  
  JSAV.init(function() {
    this._redo = [];
    this._undo = [];
    var that = this,
      $controls = $(".controls", $(this.container));
    if ($controls.size() === 0) {
      return; // no controls, no need to proceed
    }
    $("<a class='begin' href='#'>Begin</a>").click(function() {
      that.begin();
    }).appendTo($controls);
    $("<a class='backward' href='#'>Backward</a>").click(function() {
      that.backward();
    }).appendTo($controls);
    $("<a class='forward' href='#'>Forward</a>").click(function() {
      that.forward();
    }).appendTo($controls);
    $("<a class='end' href='#'>End</a>").click(function() {
      that.end();
    }).appendTo($controls);
  });
  
  function anim(effect, undo) {
    // a function that can be used to provide function calls that are applied later
    // when viewing the visualization
    return function() {
      var obj = this;
      var back = undo || undefined;
      var jsav = this;
      if (!jsav.hasOwnProperty("forward")) { jsav = this.jsav; }
      var stackTop = jsav._redo[0];
      if (!stackTop) {
        stackTop = [];
        jsav._redo.push(stackTop);
      }
      if (jsav.options.animationMode == 'none') {
        effect.apply(this, arguments);
      } else {
        stackTop.push([this, effect, arguments, back]);
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
    $.fx.off = false;
    return this;
  }
  
  function end() {
    var prevFx = $.fx.off;
    $.fx.off = true;
    while (this._redo.length) {
      this.forward();
    }
    $.fx.off = false;
    return this;
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
    this.forward();
    this._redo.push([]); // add new empty step to oper. stack
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
    this.forward(); // apply the last steps
    this.RECORD = false;
    this.begin();
  };
})(jQuery);