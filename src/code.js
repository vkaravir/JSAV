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
                      '<span class="jsavvarlabel"></span> <span class="jsavvalue jsavvarvalue">' +
                      value + '</span></div>');
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
  
  JSAV.ext.variable = function(value, options) {
    return new Variable(this, value, options);
  };

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
                  if (options.tag) {
                    options.startAfter = "/* *** ODSATag: " + options.tag + " *** */";
                    options.endBefore = "/* *** ODSAendTag: " + options.tag + " *** */";
                  }
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
    this.options = $.extend({visible: true, lineNumbers: true, htmlEscape: true}, options);
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
    var clElems = $(),
      clElem;
    for (var i = 0, l = codelines.length; i < l; i++) {
      clElem = $('<li class="jsavcodeline">');
      if (this.options.htmlEscape) {
        // let jQuery do the HTML escaping
        clElem.text(codelines[i]);
      } else {
        clElem.html(codelines[i]);
      }
      clElems = clElems.add(clElem);
    }
    // .. and change the DOM only once
    this.element.append(clElems);
    JSAV.utils._helpers.handlePosition(this);
    JSAV.utils._helpers.handleVisibility(this, this.options);
  };
  var codeproto = Code.prototype;
  codeproto._toggleVisible = JSAV.anim(JSAV.ext.effects._toggleVisible);
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
      return $elems.find(".jsavvalue").css(cssprop);
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