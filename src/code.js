/**
* Module that contains support for program code constructs.
* Depends on core.js, anim.js
*/
/*global JSAV:true*/
(function($) {
  "use strict";
  if (typeof JSAV === "undefined") { return; }

  var getIndices = JSAV.utils._helpers.getIndices;

  var Variable = function(jsav, value, options) {
    this.jsav = jsav;
    this.options = $.extend({visible: false, type: typeof value}, options);
    this.element = $('<div class="jsavvariable">' +
                      '<span class="jsavvarlabel"></span> <span class="jsavvalue">' +
                      '<span class="jsavvaluelabel jsavvarvalue">' + value + '</span></span></div>');
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
    JSAV.utils._helpers.handlePosition(this);
    JSAV.utils._helpers.handleVisibility(this, this.options);
  };
  var varproto = Variable.prototype;
  $.extend(varproto, JSAV._types.common);
  varproto._toggleVisible = JSAV.anim(JSAV.ext.effects._toggleVisible);
  varproto.show = JSAV.ext.effects.show;
  varproto.hide = JSAV.ext.effects.hide;
  varproto._setValue = JSAV.anim(
    function(newValue, options) {
      var oldValue = this.value();
      this.element.find(".jsavvarvalue").html(newValue);
      this.element.find(".jsavvarvalue").attr("data-value", newValue);
      return [oldValue, options];
    }
  );
  varproto.value = function(newValue, options) {
    if (typeof newValue === "undefined") {
      var val = this.element.find(".jsavvarvalue").attr("data-value");
      return JSAV.utils.value2type(val, this.options.type);
    } else {
      this._setValue(newValue, options);
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
    return this.value() === otherVariable.value();
  };
  varproto.css = JSAV.utils._helpers.css;
  varproto._setcss = JSAV.anim(JSAV.utils._helpers._setcss);
  varproto.addClass = JSAV.utils._helpers.addClass;
  varproto.removeClass = JSAV.utils._helpers.removeClass;
  varproto.hasClass = JSAV.utils._helpers.hasClass;
  varproto.toggleClass = JSAV.anim(JSAV.utils._helpers._toggleClass);

  JSAV.ext.variable = function(value, options) {
    return new Variable(this, value, options);
  };


  // helper function to create the arrow for the pointer
  var _createArrow = function(pointer, options) {
    var arrowPoints = pointer._arrowPoints();
    var arrow = pointer.jsav.g.line(arrowPoints[0][1], arrowPoints[0][2],
                              arrowPoints[1][1], arrowPoints[1][2],
                              {"arrow-end": "classic-wide",
                                "stroke-width": 2,
                                "opacity": 0});
    if (pointer.isVisible()) {
      arrow.show();
    }
    // set up an event handler to update the arrow position whenever the target
    // changes or the target moves
    pointer.jsav.container.on("jsav-updaterelative", function() {
      if (!pointer.isVisible()) { return; }
      pointer.arrow.movePoints(pointer._arrowPoints(options), options);
    });
    return arrow;
  };

  // A pointer object that can have a name and a target that it points to.
  var Pointer = function(jsav, name, options) {
    this.jsav = jsav;
    var defaultOptions = {visible: true, // visible by default
                          // positioned 20px above the object pointed to
                          anchor: "left top",
                          myAnchor: "left bottom",
                          left: 0,
                          top: "-20px" };
    this.options = $.extend(defaultOptions, options);
    this.element = $('<div class="jsavlabel jsavpointer">' + name + '</div>');
    if (this.options.before) {
      this.element.insertBefore(this.options.before.element);
    } else if (this.options.after) {
      this.element.insertAfter(this.options.before.element);
    } else if (this.options.container) {
      this.options.container.append(this.element);
    } else {
      $(this.jsav.canvas).append(this.element);
    }
    if (typeof(this.options.targetIndex) !== "undefined") {
      this.options.relativeIndex = this.options.targetIndex;
    }
    JSAV.utils._helpers.handlePosition(this);
    JSAV.utils._helpers.handleVisibility(this, this.options);
    this._target = options.relativeTo;
    if (this._target) {
      this.arrow = _createArrow(this);
    }
  };
  var pointerproto = Pointer.prototype;
  // Extend the Label type
  $.extend(pointerproto, JSAV._types.Label.prototype);
  // Helper function to record the change of the pointer target.
  pointerproto._setTarget = JSAV.anim(
    function(newTarget, options) {
      var oldTarget = this.target();
      this._target = newTarget;
      return [oldTarget];
    }
  );
  // Calculates the start and end points of the arrow to be drawn for this pointer.
  // Returns a structure compatible with the line.movePoints(..) function. That is,
  // an array like [[0, startX, startY], [1, endX, endY]]
  // Note, that this assumes that both the pointer and the target are inside the
  // jsavcanvas HTML element.
  pointerproto._arrowPoints = function(options) {
    var opts = $.extend({}, this.options, options),
        myBounds = this.bounds(),
        targetElem;

    // if targetting null, make the arrow 0 length
    if (this._target === null) {
      return [[0, myBounds.left + myBounds.width/2,
                  myBounds.top + myBounds.height],
              [1, myBounds.left + myBounds.width/2,
                  myBounds.top + myBounds.height]];
    }
    if (typeof(opts.targetIndex) !== "undefined") {
      opts.relativeIndex = opts.targetIndex;
    }
    // If target is an array index, find the DOM element for that index
    if (typeof(opts.relativeIndex) !== "undefined") {
      targetElem = this._target.element.find(".jsavindex:eq(" + opts.relativeIndex + ") .jsavvalue");
    } else {
      targetElem = this._target.element;
    }
    var targetOffset = targetElem.offset(),
        canvasOffset = this.jsav.canvas.offset(),
        targetBounds = {width: targetElem.outerWidth(),
                                 height: targetElem.outerHeight,
                                 left: targetOffset.left - canvasOffset.left,
                                 top: targetOffset.top - canvasOffset.top},
        newPoints = [[0, myBounds.left + myBounds.width/2,
                        myBounds.top + myBounds.height],
                     [1, targetBounds.left + targetBounds.width/2,
                        targetBounds.top]];
    return newPoints;
  };
  // Update the target of this pointer. Argument newTarget should be a JSAV object.
  // Options available are the same as when positioning elements relative to each other.
  pointerproto.target = function(newTarget, options) {
    if (typeof newTarget === "undefined") {
      return this._target;
    } else {
      this._setTarget(newTarget, options);
      // if setting target to null, hide the arrow
      if (newTarget === null) {
        if (this.arrow) { this.arrow.hide(); }
        return this;
      }
      if (!this.arrow) {
        this.arrow = _createArrow(this, options);
      } else if (!this.arrow.isVisible()) {
        // if arrow is hidden, show it
        this.arrow.show();
      }
      JSAV.utils._helpers.setRelativePositioning(this, $.extend({}, this.options, options, {relativeTo: newTarget}));
      var that = this;
      this.jsav.container.on("jsav-updaterelative", function() {
        if (!that.isVisible()) { return; }
        that.arrow.movePoints(pointerproto._arrowPoints.call(that, options), options);
      });
      return this;
    }
  };
  pointerproto._orighide = pointerproto.hide;
  pointerproto.hide = function(options) {
    this._orighide(options);
    if (this.arrow) { this.arrow.hide(); }
  };
  pointerproto._origshow = pointerproto.show;
  pointerproto.show = function(options) {
    this._origshow(options);
    if (this.arrow) { this.arrow.show(); }
  };
  // Expose the Pointer as the .pointer(...) function on JSAV instances.
  JSAV.ext.pointer = function(name, target, options) {
    return new Pointer(this, name, $.extend({}, options, {relativeTo: target}));
  };
  // Expose the Pointer type
  JSAV._types.Pointer = Pointer;


  // regexps used for trimming
  var trimRightRegexp = /\s+$/,
      trimLeftRegexp = /^\s*\n/;

  // Pseudocode objects for JSAV
  var Code = function(jsav, codelines, options) {
    this.jsav = jsav;
    if (typeof(codelines) === "string") {
      // strings will be split at newline characters
      codelines = codelines.split("\n");
    } else if (typeof(codelines) === "object" && !$.isArray(codelines)) {
      options = codelines;
      // if no codelines are given, we assume options includes a URL
      $.ajax( {
                url: options.url,
                async: false, // we need it now, so not asynchronous request
                mimeType: "text/plain", // assume it is text
                success: function(data) {
                  var code = data,
                      tmp;
                  if (options.startAfter) {
                    // split on the start tag
                    tmp = code.split(options.startAfter);
                    // if there are multiple instances, we'll use the last one
                    code = tmp[tmp.length - 1];
                  }
                  if (options.endBefore) {
                    // split on the end tag
                    // in case of multiple instances of the marker, use the first part
                    code = code.split(options.endBefore)[0];
                  }

                  // strip extra whitespace from beginning and end; not the whitespace on the
                  // first line of code, though
                  code = code.replace(trimRightRegexp, "").replace(trimLeftRegexp, "");
                  codelines = code.split("\n");
                }
              });
    }
    this.options = $.extend({visible: true, lineNumbers: true, htmlEscape: true,  center: true}, options);
    // select correct HTML element type based on option lineNumbers
    var elem = this.options.lineNumbers?"ol":"ul";
    this.element = this.options.element || $('<' + elem + ' class="jsavcode"></' + elem + '>');
    if (this.options.before) {
      this.element.insertBefore(this.options.before.element);
    } else if (this.options.after) {
      this.element.insertAfter(this.options.before.element);
    } else {
      $(this.jsav.canvas).append(this.element);
    }
    // generate the elements for all lines...
    var clElems = $();
    for (var i = 0, l = codelines.length; i < l; i++) {
      clElems = clElems.add(createCodeLine(codelines[i], this));
    }
    // .. and change the DOM only once
    this.element.append(clElems);
    JSAV.utils._helpers.handlePosition(this);
    JSAV.utils._helpers.handleVisibility(this, this.options);
    if (this.options.center && !this.options.left && !this.options.right && !this.options.top && !this.options.bottom) {
      this.element.css("display", "inline-block");
      this.element.css("width", this.element.outerWidth());
      this.element.css("display", "");
      this.element.addClass("jsavcenter");
    }
  };
  var createCodeLine = function(code, container) {
    var clElem = $('<li class="jsavcodeline">');
    if (container.options.htmlEscape) {
      // let jQuery do the HTML escaping
      clElem.text(code);
    } else {
      clElem.html(code);
    }
    return clElem;
  };
  var codeproto = Code.prototype;
  $.extend(codeproto, JSAV._types.common);
  codeproto._toggleVisible = JSAV.anim(JSAV.ext.effects._toggleVisible);
  codeproto.addCodeLine = JSAV.anim(function(newLine) {
    this.element.append(createCodeLine(newLine, this));
  });
  codeproto.highlight = function(index, options) {
    return this.addClass(index, "jsavhighlight");
  };
  codeproto.unhighlight = function(index, options) {
    return this.removeClass(index, "jsavhighlight");
  };
  codeproto.isHighlight = function(index) {
    return this.hasClass(index, "jsavhighlight");
  };
  codeproto.toggleClass = JSAV.anim(function(index, className, options) {
    var $elems = getIndices($(this.element).find("li.jsavcodeline"), index);
    if (this.jsav._shouldAnimate()) {
      $elems.toggleClass(className, this.jsav.SPEED);
    } else {
      $elems.toggleClass(className);
    }
    return [index, className];
  });
  codeproto.addClass = function(index, className, options) {
    var $elems = getIndices($(this.element).find("li.jsavcodeline"), index);
    if (!$elems.hasClass(className)) {
      return this.toggleClass(index, className, options);
    } else {
      return this;
    }
  };
  codeproto.removeClass = function(index, className, options) {
    var $elems = getIndices($(this.element).find("li.jsavcodeline"), index);
    if ($elems.hasClass(className)) {
      return this.toggleClass(index, className, options);
    } else {
      return this;
    }
  };
  codeproto.hasClass = function(index, className) {
    var $elems = getIndices($(this.element).find("li.jsavcodeline"), index);
    return $elems.hasClass(className);
  };
  codeproto._setcss = JSAV.anim(function(indices, cssprop) {
    var $elems = getIndices($(this.element).find("li.jsavcodeline"), indices);
    if (this.jsav._shouldAnimate()) { // only animate when playing, not when recording
      $elems.animate(cssprop, this.jsav.SPEED);
    } else {
      $elems.css(cssprop);
    }
    return this;
  });
  codeproto.setCurrentLine = function(index, options) {
    var $curr = this.element.find("li.jsavcurrentline"),
        currindex = this.element.find("li.jsavcodeline").index($curr),
        $prev = this.element.find("li.jsavpreviousline"),
        previndex = this.element.find("li.jsavcodeline").index($prev);
    if (index === -1) {
      if (currindex !== -1) { this.toggleClass(currindex, "jsavcurrentline"); }
      if (previndex !== -1) { this.toggleClass(previndex, "jsavpreviousline"); }
    } else if (previndex === -1 && currindex === -1) {
      this.toggleClass(index, "jsavcurrentline");
    } else if (previndex === -1 && currindex !== -1 && index !== currindex) {
      this.toggleClass(currindex, "jsavpreviousline jsavcurrentline", options);
      this.toggleClass(index, "jsavcurrentline");
    } else if (previndex !== -1 && currindex !== -1 && index !== currindex && index !== previndex && previndex !== currindex) {
      this.toggleClass(previndex, "jsavpreviousline", options);
      this.toggleClass(currindex, "jsavpreviousline jsavcurrentline", options);
      this.toggleClass(index, "jsavcurrentline", options);
    } else if (previndex === index && currindex === index) {
      // nothing to be done
    } else if (previndex !== -1 && currindex !== -1 && index === previndex) {
      this.toggleClass(previndex, "jsavpreviousline jsavcurrentline", options);
      this.toggleClass(currindex, "jsavpreviousline jsavcurrentline", options);
    } else if (previndex !== -1 && currindex !== -1 && index === currindex) {
      this.toggleClass(previndex, "jsavpreviousline", options);
      this.toggleClass(currindex, "jsavpreviousline", options);
    } else if (previndex !== -1 && currindex !== -1 && currindex === previndex) {
      this.toggleClass(previndex, "jsavcurrentline", options);
      this.toggleClass(index, "jsavcurrentline", options);
    }
    return this;
  };
  codeproto.css = function(index, cssprop, options) {
    var $elems = getIndices($(this.element).find("li.jsavcodeline"), index);
    if (typeof cssprop === "string") {
      return $elems.css(cssprop);
    } else if (typeof index === "string") {
      return this.element.css(index);
    } else {
      if ($.isFunction(index)) { // if index is a function, evaluate it right away and get a list of indices
        var all_elems = $(this.element).find("li.jsavcodeline"),
          sel_indices = []; // array of selected indices
        for (var i = 0; i < $elems.size(); i++) {
          sel_indices.push(all_elems.index($elems[i]));
        }
        index = sel_indices;
      }
      return this._setcss(index, cssprop, options);
    }
  };
  codeproto.show = function(index, options) {
    if ((typeof(index) === "undefined" || typeof(index) === "object") &&
        !$.isArray(index) && this.element.filter(":visible").size() === 0) {
      return this._toggleVisible(index);
    } else {
      return this.removeClass(index, "jsavhiddencode", options);
    }
  };
  codeproto.hide = function(index, options) {
    if ((typeof(index) === "undefined" || typeof(index) === "object") &&
        !$.isArray(index) && this.element.filter(":visible").size() === 1) {
      return this._toggleVisible(index);
    } else {
      return this.addClass(index, "jsavhiddencode", options);
    }
  };
  codeproto.state = function(newState) {
    if (typeof(newState) === "undefined") {
      return { "html": this.element.html() };
    } else {
      this.element.html(newState.html);
    }
  };
  JSAV.ext.code = function(codelines, options) {
    return new Code(this, codelines, options);
  };
}(jQuery));