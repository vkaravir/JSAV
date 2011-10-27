/**
* Module that contains the animator implementations.
* Depends on core.js
*/
(function($) {
  if (typeof JSAV === "undefined") { return; }

  var AnimatableOperation = function(opts) {
    this.obj = opts.obj;
    this.effect = opts.effect;
    this.args = opts.args;
    this.undoeffect = opts.undo;
    this.undoargs = opts.undoargs;
    console.log(this);
  };
  AnimatableOperation.prototype.apply = function() {
    var undoFunction = undefined,
        self = this;
    if (typeof this.undoeffect === "undefined" || !$.isFunction(this.undoeffect)) { // if no undo function
      undoFunction = function() {
        var obj = self.obj,
          state = obj.state();
        return function() { // we create one that will set the state of obj to its current state
          obj.state(state);
        };
      }();
    } 
    var retVal = this.effect.apply(this.obj, this.args);
    if (typeof retVal === "undefined" || retVal === this.obj) {
      if (typeof this.undoeffect === "undefined" || !$.isFunction(this.undoeffect)) {
        this.undoeffect = undoFunction;
      }
    } else {
      this.undoArgs = retVal;
    }
  };
  AnimatableOperation.prototype.undo = function() {
    if (typeof this.undoArgs === "undefined") {
      this.undoeffect.apply(this.obj, this.args);
    } else {
      console.log("applying undoArgs", this.undoArgs);
      this.effect.apply(this.obj, this.undoArgs);
    }
  };

  var AnimStep = function(options) {
    this.operations = [];
    this.options = options || {};
  };
  AnimStep.prototype.add = function(oper) {
    this.operations.push(oper);
  };

  function backward(filter) {
    if (this._undo.length === 0) { return; }
    var step = this._undo.pop();
    var ops = step.operations; // get the operations in the step we're about to undo
    for (var i = ops.length - 1; i >= 0; i--) { // iterate the operations
      // operation contains: [target object, effect function, arguments, undo function]
      var prev = ops[i];
      prev.undo();
    }
    this._redo.unshift(step);
    // if a filter function is given, check if this step matches
    // if not, continue moving backward
    if (filter && $.isFunction(filter) && !filter(step)) {
      this.backward(filter);
    }
    // trigger an event on the container to update the counter
    this.container.trigger("jsav-updatecounter", [this.currentStep() + 1, this.totalSteps() + 1]);
    return step;
  }

  function forward() {
    if (this._redo.length === 0) { return; }
    var step = this._redo.shift();
    var ops = step.operations; // get the operations in the step we're about to undo
    for (var i = 0; i < ops.length; i++) {
      var next = ops[i];
      next.apply();
    }
    this._undo.push(step);
    // trigger an event on the container to update the counter
    this.container.trigger("jsav-updatecounter", [this.currentStep() + 1, this.totalSteps() + 1]);
    return step; // return the just applied step
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
    if ($controls.size() !== 0) {
      $("<a class='jsavbegin' href='#' title='Begin'>Begin</a>").click(beginHandler).appendTo($controls);
      $("<a class='jsavbackward' href='#' title='Backward'>Backward</a>").click(backwardHandler).appendTo($controls);
      $("<a class='jsavforward' href='#' title='Forward'>Forward</a>").click(forwardHandler).appendTo($controls);
      $("<a class='jsavend' href='#' title='End'>End</a>").click(endHandler).appendTo($controls);
    }
    // bind the handlers to events to enable control by triggering events
    this.container.bind({ "jsav-forward": forwardHandler, 
                          "jsav-backward": backwardHandler,
                          "jsav-begin": beginHandler,
                          "jsav-end": endHandler });
                          
    // add slideshow counter if an element with class counter exists
    var counter = $(".jsavcounter", this.container);
    // register an event to be triggered on container to update the counter
    if (counter.size() > 0) {
      this.container.bind("jsav-updatecounter", function(evet, current, total) { 
        counter.text(current + " / " + total);
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
      if (jsav.options.animationMode == 'none') { // if not recording, apply immediately
        effect.apply(this, arguments);
      } else {
        var stackTop = jsav._redo[0];
        if (!stackTop) {
          stackTop = new AnimStep();
          jsav._redo.push(stackTop);
        }
        // add to stack: [target object, effect function, arguments, undo function]
        stackTop.add(new AnimatableOperation({obj: this, effect: effect, 
          args: arguments, undo: undo}));
      }
      return this;
    };
  }
  function moveWrapper(func, filter) {
    var origStep = this.currentStep(),
      step = func.call(this);
    if (!step) {
      return false;
    }
    if (filter) {
      if ($.isFunction(filter)) {
        var filterMatch = filter(step),
          matched = filterMatch;
        while (!filterMatch && this.currentStep() < this.totalSteps()) {
          step = func.call(this);
          if (!step) { break; }
          filterMatch = filter(step);
          matched = matched || filterMatch;
        }
        if (!matched) {
          this.jumpToStep(origStep);
          return false;
        }
      }
    }
    return true;
  };
  JSAV.anim = anim;
  JSAV.ext.SPEED = 400;
  JSAV.ext.begin = begin;
  JSAV.ext.end = end;
  JSAV.ext.forward = function(filter) {
    return moveWrapper.call(this, forward, filter);
  };
  JSAV.ext.backward = function(filter) {
    return moveWrapper.call(this, backward, filter);
  };
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
    if (this._redo.length === 0 || this._redo[0].operations.length === 0) { // ignore step if no operations in it
      return this;
    }
    this.forward();
    this._redo.push(new AnimStep(options)); // add new empty step to oper. stack
    if (options && this.message && options.message) {
      this.message(options.message);
    }
    return this;
  };
  JSAV.ext.clear = function(options) {
    var opts = $.extend({undo: true, redo: true}, options);
    if (opts.undo) {
      this._undo = [];
    }
    if (opts.redo) {
      this._redo = [];
    }
  };
  /** Jumps to step number step. */
  JSAV.ext.jumpToStep = function(step) {
    var stepCount = this.totalSteps(),
        jsav = this,
        stepFunction = function(stp) {
          return jsav.currentStep() === step;
        };
    $.fx.off = true;
    if (step >= stepCount) {
      this.end();
    } else if (step < 0) {
      this.begin();
    } else if (step < this.currentStep()) {
      this.backward(stepFunction);
    } else {
      this.forward(stepFunction);
    }
    $.fx.off = false;
    return this;
  };
  JSAV.ext.substep = function(options) {
    // TODO: implement substep
    return this.step(options);
  };
  JSAV.ext.stepdone = function() {return this;};
  JSAV.ext.stepOption = function(name, value) {
    var step = this._redo[0];
    if (value !== undefined) { // set named property
      if (step) {
        step.options[name] = value;
      }
    } else if (typeof name === "string") { // get named property
      if (step) {
        return step.options[name];
      } else {
        return undefined;
      }
    } else { // assume an object
      for (var item in name) {
        if (name.hasOwnProperty(item)) {
          this.stepOption(item, name[item]);
        }
      }
    }
  };
  JSAV.ext.recorded = function() {
    this.forward(); // apply the last steps
    this.begin();
    this.RECORD = false;
  };
})(jQuery);