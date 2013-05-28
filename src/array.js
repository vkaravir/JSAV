/**
* Module that contains the array data structure implementations.
* Depends on core.js, anim.js, utils.js, effects.js, datastructures.js
*/
(function($) {
  "use strict";
  if (typeof JSAV === "undefined") { return; }

  var getIndices = JSAV.utils._helpers.getIndices;

  /* Array data structure for JSAV library. */
  var AVArray = function(jsav, element, options) {
    this.jsav = jsav;
    this.options = $.extend(true, {autoresize: true}, options);
    if ($.isArray(element)) {
      this.initialize(element);
    } else if (element) { // assume it's a DOM element
      this.element = $(element);
      this.initializeFromElement();
    }
    if (this.options.autoresize) {
      this.element.addClass("jsavautoresize");
    }
  };
  var arrproto = AVArray.prototype;
  $.extend(arrproto, JSAV._types.ds.common);

  arrproto.isHighlight = function(index, options) {
    return this.hasClass(index, "jsavhighlight");
  };

  arrproto.highlight = function(indices, options) {
    this.addClass(indices, "jsavhighlight", options);
    return this;
  };

  arrproto.unhighlight = function(indices, options) {
    this.removeClass(indices, "jsavhighlight", options);
    return this;
  };

  arrproto._setcss = JSAV.anim(function(indices, cssprop) {
    var $elems = getIndices($(this.element).find("li"), indices);
    if (this.jsav._shouldAnimate()) { // only animate when playing, not when recording
      $elems.find("span.jsavvalue").animate(cssprop, this.jsav.SPEED);
    } else {
      $elems.find("span.jsavvalue").css(cssprop);
    }
    return this;
  });
  arrproto._setarraycss = JSAV.anim(function(cssprops) {
    var oldProps = $.extend(true, {}, cssprops),
        el = this.element;
    if (typeof cssprops !== "object") {
      return [cssprops];
    } else {
      for (var i in cssprops) {
        if (cssprops.hasOwnProperty(i)) {
          oldProps[i] = el.css(i);
        }
      }
    }
    if (this.jsav._shouldAnimate()) { // only animate when playing, not when recording
      this.element.animate(cssprops, this.jsav.SPEED);
    } else {
      this.element.css(cssprops);
    }
    return [oldProps];
  });
  arrproto.css = function(indices, cssprop, options) {
    var $elems = getIndices($(this.element).find("li"), indices);
    if (typeof cssprop === "string") {
      return $elems.find(".jsavvalue").css(cssprop);
    } else if (typeof indices === "string") {
      return this.element.css(indices);
    } else if (!$.isArray(indices) && typeof indices === "object") { // object, apply for array
      return this._setarraycss(indices, options);
    } else {
      if ($.isFunction(indices)) { // if indices is a function, evaluate it right away and get a list of indices
        var all_elems = $(this.element).find("li"),
          sel_indices = []; // array of selected indices
        for (var i = 0; i < $elems.size(); i++) {
          sel_indices.push(all_elems.index($elems[i]));
        }
        indices = sel_indices;
      }
      return this._setcss(indices, cssprop, options);
    }
  };
  arrproto.swap = JSAV.anim(function(index1, index2, options) {
    var $pi1 = $(this.element).find("li:eq(" + index1 + ")"),
      $pi2 = $(this.element).find("li:eq(" + index2 + ")");
    this.jsav.effects.swap($pi1, $pi2, options);
    return [index1, index2, options];
  });
  arrproto.clone = function() {
    // fetch all values
    var size = this.size(),
      vals = [];
    for (var i=0; i < size; i++) {
      vals[i] = this.value(i);
    }
    return new AVArray(this.jsav, vals, $.extend(true, {}, this.options, {visible: false}));
  };
  arrproto.size = function() { return this.element.find("li").size(); };
  arrproto.value = function(index, newValue, options) {
    if (typeof newValue === "undefined") {
      var $index = this.element.find("li:eq(" + index + ")"),
          val = $index.attr("data-value"),
          valtype = $index.attr("data-value-type");
      return JSAV.utils.value2type(val, valtype);
    } else {
      return this.setvalue(index, newValue, options);
    }
  };
  arrproto._newindex = function(value) {
    if (typeof value === "undefined") {
      value = "";
    }
    var ind = $("<li class='jsavnode jsavindex'><span class='jsavvalue'><span class='jsavvaluelabel'>" +
          value + "</span></span></li>"), valtype = typeof(value);
    if (valtype === "object") { valtype = "string"; }
    ind.attr("data-value", value).attr("data-value-type", valtype);
    return ind;
  };
  arrproto.setvalue = JSAV.anim(function(index, newValue) {
    var size = this.size(),
      oldval = this.value(index);
    while (index > size - 1) {
      var newli = this._newindex();
      this.element.append(newli);
      size = this.size();
    }
    var $index = this.element.find("li:eq(" + index + ")"),
      valtype = typeof(newValue);
    if (valtype === "object") { valtype = "string"; }
    $index.attr("data-value", "" + newValue).attr("data-value-type", valtype);
    $index.find(".jsavvaluelabel").html("" + newValue);
    if (("" + newValue).length > ("" + oldval).length || newli) {
      // if the new value is longer than old, or new elements were added to array, re-layout
      this.layout();
    }
    return [index, oldval];
  });
  arrproto.initialize = function(data) {
    var el = this.options.element || $("<ol/>"),
      liel, liels = $(),
      key, val;
    el.addClass("jsavarray");
    this.options = jQuery.extend({visible: true}, this.options);
    for (key in this.options) {
      if (this.options.hasOwnProperty(key)) {
        val = this.options[key];
        if (typeof(val) === "string" || typeof(val) === "number" || typeof(val) === "boolean") {
          el.attr("data-" + key, val);
        }
      }
    }
    for (var i=0; i < data.length; i++) {
      liel = this._newindex(data[i]);
      liels = liels.add(liel);
    }
    el.append(liels);
    if (!this.options.element) {
      $(this.jsav.canvas).append(el);
    }
    this.element = el;
    JSAV.utils._helpers.handlePosition(this);
    this.layout();
    el.css("display", "none");
    JSAV.utils._helpers.handleVisibility(this, this.options);
  };
  arrproto.initializeFromElement = function() {
    if (!this.element) { return; }
    var $elem = this.element,
      $elems = $elem.find("li"),
      data = $elem.data();
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        this.options[key] = data[key];
      }
    }
    $elem.addClass("jsavarray");
    $elems.each(function(index, item) {
      var $this = $(this);
      if (typeof $this.attr("data-value") === "undefined") {
        $this.attr("data-value", $this.html());
      }
      if (!$this.attr("data-value-type")) {
        $this.attr("data-value-type", "string");
      }
      $this.addClass("jsavnode jsavindex").html("<span class='jsavvalue'><span class='jsavvaluelabel'>" + 
          $this.html() + "</span></span>");
    });
    this.layout();
  };
  arrproto.layout = function(options) {
    var layoutAlg = this.options.layout || "_default";
    this.element.removeClass("jsavbararray");
    return this.jsav.ds.layout.array[layoutAlg](this, options);
  };
  arrproto.state = function(newstate) {
    if (newstate) {
      $(this.element).html(newstate.html);
    } else {
      var sta = {
        html: $(this.element).html()
      };
      return sta;
    }
  };
  arrproto.equals = function(otherArray, options) {
    var opts = options || {},
      i, j,
      equal,
      cssprop,
      len;
    if ($.isArray(otherArray)) { // simple case of array values
      if (!options) { // if nothing in options is specified
        len = otherArray.length;
        if (this.size() !== len) { // don't compare arrays of different size
          return false;
        }
        for (i = 0; i < len; i++) { // are the values equal
          equal = this.value(i) == otherArray[i];
          if (!equal) { return false; }
        }
        return true; // if tests passed, arrays are equal
      } else { // if options
        if ('css' in opts) { // if css property given, compare given array to property
          cssprop = opts.css;
          for (i = 0; i < len; i++) {
            equal = this.css(i, cssprop) === otherArray[i];
            if (!equal) { return false; }
          }
          return true; // if tests passed, arrays are equal
        }
      }
    } else { // JSAV array
      len = otherArray.size();
      if (this.size() !== len) { // size check
        return false;
      }
      if (!('value' in opts) || opts.value) { // if comparing values
        for (i = 0; i < len; i++) {
          equal = this.value(i) == otherArray.value(i);
          if (!equal) { return false; }
        }
      }
      if ('css' in opts) { // if comparing css properties
        if ($.isArray(opts.css)) { // array of property names
          for (i = 0; i < opts.css.length; i++) {
            cssprop = opts.css[i];
            for (j = 0; j < len; j++) {
              equal = this.css(j, cssprop) === otherArray.css(j, cssprop);
              if (!equal) { return false; }
            }
          }
        } else { // if not array, expect it to be a property name string
          cssprop = opts.css;
          for (i = 0; i < len; i++) {
            equal = this.css(i, cssprop) === otherArray.css(i, cssprop);
            if (!equal) { return false; }
          }
        }
      }
      return true; // if tests passed, arrays are equal
    }

    // default: return false
    return false;
  };
  arrproto.toggleClass = JSAV.anim(function(index, className, options) {
    var $elems = getIndices($(this.element).find("li.jsavindex").find("span.jsavvalue"), index);
    if (this.jsav._shouldAnimate()) {
      $elems.toggleClass(className, this.jsav.SPEED);
    } else {
      $elems.toggleClass(className);
    }
    return [index, className];
  });
  arrproto.addClass = function(index, className, options) {
    var indices = JSAV.utils._helpers.normalizeIndices($(this.element).find("li.jsavindex").find("span.jsavvalue"), index, ":not(." + className + ")");
    if (indices.length > 0) {
      return this.toggleClass(indices, className, options);
    } else {
      return this;
    }
  };
  arrproto.removeClass = function(index, className, options) {
    var indices = JSAV.utils._helpers.normalizeIndices($(this.element).find("li.jsavindex").find("span.jsavvalue"), index, "." + className);
    if (indices.length > 0) {
      return this.toggleClass(indices, className, options);
    } else {
      return this;
    }
  };
  arrproto.hasClass = function(index, className) {
    var $elems = getIndices($(this.element).find("li.jsavindex").find("span.jsavvalue"), index);
    return $elems.hasClass(className);
  };

  // Returns true if the array contains no values
  arrproto.isEmpty = function () {
    for (var i = 0; i < this.size(); i++) {
      if (this.value(i) !== "") { return false; }
    }
    return true;
  };

  // events to register as functions on array
  var events = ["click", "dblclick", "mousedown", "mousemove", "mouseup",
                "mouseenter", "mouseleave"];
  // returns a function for the passed eventType that binds a passed
  // function to that eventType for indices in the array
  var eventhandler = function(eventType) {
    return function(data, handler) {
      // store reference to this, needed when executing the handler
      var self = this;
      // bind a jQuery event handler, limit to .jsavindex
      this.element.on(eventType, ".jsavindex", function(e) {
        // get the index of the clicked element
        var index = self.element.find(".jsavindex").index(this);
        // log the event
        self.jsav.logEvent({type: "jsav-array-" + eventType, arrayid: self.id(), index: index});
        if ($.isFunction(data)) { // if no custom data..
          // ..bind this to the array and call handler
          // with params array index and the event
          data.call(self, index, e);
        } else if ($.isFunction(handler)) { // if custom data is passed
          // ..bind this to the array and call handler
          var params = $.isArray(data)?data.slice(0):[data]; // get a cloned array or data as array
          params.unshift(index); // add index to first parameter
          params.push(e); // jQuery event as the last
          handler.apply(self, params); // apply the function
        }
      });
      return this;
    };
  };
  // create the event binding functions and add to array prototype
  for (var i = events.length; i--; ) {
    arrproto[events[i]] = eventhandler(events[i]);
  }
  arrproto.on = function(eventName, data, handler) {
    eventhandler(eventName).call(this, data, handler);
    return this;
  };
 
  arrproto.toggleArrow = JSAV.anim(function(indices) {
    var $elems = getIndices($(this.element).find("li"), indices);
    $elems.toggleClass("jsavarrow");
  });
  arrproto.toggleLine = JSAV.anim(function(index, options) {
      // Toggles a marker line above a given array index for bar layout
      // Options that can be passed:
      //  - markStyle: style of the "ball" as an object of CSS property/value pairs.
      //               Default style is first applied, then the given style. Passing
      //               null will disable the ball alltogether
      //  - lineStyle: style of the line, similarly to markStyle
      //  - startIndex: index in the array where the line will start. default 0
      //  - endIndex: index in the array where the line will end, inclusive. default
      //              last index of the array
      if (this.options.layout !== "bar") { return; } // not bar layout
      var valelem = this.element.find("li .jsavvalue").eq(index),
          lielem = valelem.parent();
      if (valelem.size() === 0 ) { return; } // no such index
      var opts = $.extend({startIndex: 0, endIndex: this.size() - 1}, options);
      
      var $mark = lielem.find(".jsavmark"),
          $markline = lielem.find(".jsavmarkline");
      if ($markline.size() === 0 && $mark.size() === 0) { // no mark exists yet
        if (opts.markStyle !== null) { // mark is not disabled
          $mark = $("<div class='jsavmark' />");
          lielem.prepend($mark);
          if (opts.markStyle) { $mark.css(opts.markStyle); }
          $mark.css({ bottom: valelem.height() - $mark.outerHeight()/2,
                      left: valelem.position().left + valelem.width() / 2 - $mark.outerWidth()/2,
                      display: "block"});
        }
        if (opts.lineStyle !== null) { // mark line not disabled
          $markline = $("<div class='jsavmarkline' />");
          lielem.prepend($markline);
          if (opts.lineStyle) { $markline.css(opts.lineStyle); }
          var startelem = this.element.find("li:eq(" + opts.startIndex + ")"),
              endelem = this.element.find("li:eq(" + opts.endIndex + ")");
          $markline.css({ width: endelem.position().left - startelem.position().left +
                                  endelem.width(),
                          left:startelem.position().left - lielem.position().left,
                          bottom: valelem.height() - $markline.outerHeight()/2,
                          display: "block"});
        }
      } else { // mark exists already, remove them
        $mark.remove();
        $markline.remove();
      }
      return [index, opts];
    });


  JSAV._types.ds.AVArray = AVArray;
  // expose the data structures for the JSAV
  JSAV.ext.ds.array = function(element, options) {
      return new AVArray(this, element, options);
  };

}(jQuery));




/// array layout
(function($) {
  "use strict";
  function centerArray(array, $lastItem, options) {
    var opts = $.extend({}, array.options, options);
    // center the array inside its parent container
    if (opts.hasOwnProperty("center") && !opts.center) {
      // if options center is set to falsy value, return
      return;
    }
    // width of array expected to be last items position + its width
    var width = $lastItem.position().left + $lastItem.outerWidth(),
      containerWidth = $(array.jsav.canvas).width();
    array.element.css("left", (containerWidth - width)/2);
  }
  
  function horizontalArray(array, options) {
    var $arr = $(array.element).addClass("jsavhorizontalarray"),
      // rely on browser doing the calculation, float everything to the left..
      $items = $arr.find("li"),//.css({"float": "left", "position":"static"}),
      maxHeight = -1,
      indexed = !!array.options.indexed;
    if (indexed) {
      $arr.addClass("jsavindexed");
    }
    $items.each(function(index, item) {
      var $i = $(this);
      maxHeight = Math.max(maxHeight, $i.outerHeight());
      if (indexed) {
        var $indexLabel = $i.find(".jsavindexlabel");
        if ($indexLabel.size() === 0) {
          $i.append('<span class="jsavindexlabel">' + index + '</span>');
          $indexLabel = $i.find(".jsavindexlabel");
        }
      }
    });
    $arr.height(maxHeight + (indexed?30:0));
    centerArray(array, $items.last(), options);
    var arrPos = $arr.position();
    return { width: $arr.outerWidth(), height: $arr.outerHeight(),
              left: arrPos.left, top: arrPos.top };
  }
  
  function verticalArray(array, options) {
    var $arr = $(array.element).addClass("jsavverticalarray"),
      $items = $arr.find("li"),
      maxWidth = -1,
      indexed = !!array.options.indexed;
    if (indexed) {
      $arr.addClass("jsavindexed");
      $items.each(function(index, item) {
        var $i = $(this);
        var $indexLabel = $i.find(".jsavindexlabel");
        if ($indexLabel.size() === 0) {
          $i.append('<span class="jsavindexlabel">' + index + '</span>');
          $indexLabel = $i.find(".jsavindexlabel");
        }
        maxWidth = Math.max(maxWidth, $indexLabel.innerWidth());
        $indexLabel.css({
          top: $i.innerHeight() / 2 - $indexLabel.outerHeight() / 2
        });
      });
      $items.css("margin-left", maxWidth);
    }
    centerArray(array, $items.last(), options);
    var arrPos = $arr.position();
    return { width: $arr.outerWidth(), height: $arr.outerHeight(),
              left: arrPos.left, top: arrPos.top };
  }

  function barArray(array, options) {
    var $arr = $(array.element).addClass("jsavbararray"),
      $items = $arr.find("li").css({"position":"relative", "float": "left"}),
      maxValue = Number.MIN_VALUE,
      indexed = !!array.options.indexed,
      width = $items.first().outerWidth(),
      size = array.size();
    if (indexed) {
      $arr.addClass("jsavindexed");
    }
    for (var i = 0; i < size; i++) {
      maxValue = Math.max(maxValue, array.value(i));
    }
    maxValue *= 1.15;
    $items.each(function(index, item) {
      var $i = $(this);
      var $valueBar = $i.find(".jsavvaluebar");
      if ($valueBar.size() === 0) {
        $i.prepend('<span class="jsavvaluebar" />');
        $valueBar = $i.find(".jsavvaluebar");
      }
      $valueBar.css({"height": "100%"});
      $i.find(".jsavvalue").css("height", (100.0*array.value(index) / maxValue) + "%");
      if (indexed) {
        var $indexLabel = $i.find(".jsavindexlabel");
        if ($indexLabel.size() === 0) {
          $i.append('<span class="jsavindexlabel">' + index + '</span>');
          $indexLabel = $i.find(".jsavindexlabel");
        }
      }
    });
    centerArray(array, $items.last(), options);
    return { width: array.element.outerWidth(), height: array.element.outerHeight(),
              left: array.position().left, top: array.position().top };
  }
  
  JSAV.ext.ds.layout.array = {
    "_default": horizontalArray,
    "bar": barArray,
    "array": horizontalArray,
    "vertical": verticalArray
  };
}(jQuery));