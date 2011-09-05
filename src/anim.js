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
    // trigger an event on the container to update the counter
    this.container.trigger("jsav-updatecounter");
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
    // trigger an event on the container to update the counter
    this.container.trigger("jsav-updatecounter");
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
      $controls = $(".jsavcontrols", this.container),
      playingCl = "jsavplaying"; // class used to mark controls when playing
    if ($controls.size() === 0) {
      return; // no controls, no need to proceed
    }

    // function for clearing the playing flag
    function clearPlaying() {
      // check to see if some elements are still animated
      if (!that.container.find(":animated").size()) {
        // if not, clear the playing flag
        $controls.removeClass(playingCl);
      } else {
        // if still animating, set a new timeout
        setTimeout(clearPlaying, 50);
      }
    }
    // reqister event handlers for the control buttons
    var beginHandler = function(e) {
      e.preventDefault();
      e.stopPropagation();
      // if playing flag is set, don't respond
      if ($controls.hasClass(playingCl)) { return; }
      // set the playing flag, that is, a class on the controls
      $controls.addClass(playingCl);
      that.begin(); // go to beginning
      clearPlaying(); // clear the flag
    };
    var backwardHandler = function(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopPropagation();
      if ($controls.hasClass(playingCl)) { return; }
      $controls.addClass(playingCl);
      that.backward();
      // clear playing flag after a timeout for animations to end
      setTimeout(clearPlaying, 50);
    };
    var forwardHandler = function(e) {
      e.preventDefault();
      e.stopPropagation();
      if ($controls.hasClass(playingCl)) { return; }
      $controls.addClass(playingCl);
      that.forward();
      setTimeout(clearPlaying, 50);
    };
    var endHandler = function(e) {
      e.preventDefault();
      e.stopPropagation();
      if ($controls.hasClass(playingCl)) { return; }
      $controls.addClass(playingCl);
      that.end();
      clearPlaying();
    };
    $("<a class='jsavbegin' href='#' title='Begin'>Begin</a>").click(beginHandler).appendTo($controls);
    $("<a class='jsavbackward' href='#' title='Backward'>Backward</a>").click(backwardHandler).appendTo($controls);
    $("<a class='jsavforward' href='#' title='Forward'>Forward</a>").click(forwardHandler).appendTo($controls);
    $("<a class='jsavend' href='#' title='End'>End</a>").click(endHandler).appendTo($controls);
    // bind the handlers to events to enable control by triggering events
    this.container.bind({ "jsav-forward": forwardHandler, 
                          "jsav-backward": backwardHandler,
                          "jsav-begin": beginHandler,
                          "jsav-end": endHandler });
                          
    // add slideshow counter if an element with class counter exists
    var counter = $(".jsavcounter", this.container);
    // register an event to be triggered on container to update the counter
    if (counter.size() > 0) {
      this.container.bind("jsav-updatecounter", function() { 
        counter.text(that.currentStep() + 1 + " / " + (that.totalSteps() + 1));
      });
    }
    
    // register a listener for the speed change event
    $(document).bind("jsav-speed-change", function(e, args) {
      that.SPEED = args;
    });
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
  JSAV.ext.totalSteps = function() {
    return this._undo.length + this._redo.length;
  };
  JSAV.ext.animInfo = function() {
    // get some "size" info about the animation, namely the number of steps
    // and the total number of effects (or operations) in the animation
    var info = { steps: this.totalSteps()},
      i,
      effects = 0;
    for (i = this._undo.length; i--; ) {
      effects += this._undo[i].length;
    }
    for (i = this._redo.length; i--; ) {
      effects += this._redo[i].length;
    }
    info.effects = effects;
    return info;
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
    this.forward(); // apply the last steps
    this.begin();
    this.RECORD = false;
  };
})(jQuery);
