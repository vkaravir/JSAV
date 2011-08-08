/**
* Module that contains the animator implementations.
* Depends on core.js
*/
(function($) {
  if (typeof JSAV === "undefined") { return; }
  
  function backward() {
    if (this._undo.length === 0) { return; }
    var ops = this._undo.pop(); // get the operations in the step we're about to undo
    for (var i = ops.length - 1; i >= 0; i--) { // iterate the operations
      // operation contains: [target object, effect function, arguments, undo function]
      var prev = ops[i];
      prev[3].apply(prev[0], prev[2]);
    }
    this._redo.unshift(ops);
  }

  function forward() {
    if (this._redo.length === 0) { return; }
    var ops = this._redo.shift(); // get the operations in the step we're about to undo
    for (var i = 0; i < ops.length; i++) {
      // operation contains: [target object, effect function, arguments, undo function]
      var next = ops[i];
      if (typeof next[3] === "undefined" || !$.isFunction(next[3])) { // if no undo function
        next[3] = function() {
          var obj = next[0],
            state = obj.state();
          return function() { // we create one that will set the state of obj to its current state
            obj.state(state);
          };
        }();
      } 
      next[1].apply(next[0], next[2]);
    }
    this._undo.push(ops);
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
  
  JSAV.init(function() {
    this._redo = []; // stack for operations to redo
    this._undo = []; // stack for operations to undo
    var that = this,
      $controls = $(".controls", $(this.container));
    if ($controls.size() === 0) {
      return; // no controls, no need to proceed
    }
    // reqister event handlers for the control buttons
    var beginHandler = function(e) {
      e.preventDefault();
      that.begin();
    };
    var backwardHandler = function(e) {
      e.preventDefault();
      that.backward();
    };
    var forwardHandler = function(e) {
      e.preventDefault();
      that.forward();
    };
    var endHandler = function(e) {
      e.preventDefault();
      that.end();
    };
    $("<a class='begin' href='#' title='Begin'>Begin</a>").click(beginHandler).appendTo($controls);
    $("<a class='backward' href='#' title='Backward'>Backward</a>").click(backwardHandler).appendTo($controls);
    $("<a class='forward' href='#' title='Forward'>Forward</a>").click(forwardHandler).appendTo($controls);
    $("<a class='end' href='#' title='End'>End</a>").click(endHandler).appendTo($controls);
    // bind the handlers to events to enable control by triggering events
    this.container.bind({ "forward": forwardHandler, 
                          "backward": backwardHandler,
                          "begin": beginHandler,
                          "end": endHandler });
  });
  
  // this function can be used to "decorate" effects to be applied when moving forward
  // in the animation
  function anim(effect, undo) {
    // returns a function that can be used to provide function calls that are applied later
    // when viewing the visualization
    return function() {
      var jsav = this; // this points to the objects whose function was decorated
      if (!jsav.hasOwnProperty("_redo")) { jsav = this.jsav; }
      var stackTop = jsav._redo[0];
      if (!stackTop) {
        stackTop = [];
        jsav._redo.push(stackTop);
      }
      if (jsav.options.animationMode == 'none') { // if not recording, apply immediately
        effect.apply(this, arguments);
      } else {
        // add to stack: [target object, effect function, arguments, undo function]
        stackTop.push([this, effect, arguments, undo]);
      }
      return this;
    };
  }
 
  JSAV.anim = anim;
  JSAV.ext.SPEED = 400;
  JSAV.ext.begin = begin;
  JSAV.ext.end = end;
  JSAV.ext.forward = forward;
  JSAV.ext.backward = backward;
  JSAV.ext.currentStep = function() {
    return this._undo.length;
  };
  JSAV.ext.step = function(options) {
    if (this._redo.length === 0 || this._redo[0].length === 0) { // ignore step if no operations in it
      return this;
    }
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
    if (console) { console.log("Number of steps: ", this._undo.length); }
    this.forward(); // apply the last steps
    this.RECORD = false;
    this.begin();
  };
})(jQuery);
