/**
* Module that contains utility functions.
* Depends on core.js
*/
(function($) {
  "use strict";
  if (typeof JSAV === "undefined") { return; }

  // Test if range type is supported and add to jQuery.support
  var inp = $("<input type='range' />");
  $.support.inputTypeRange = (inp.prop("type") === "range");

  var objcommons = {};
  // gets or sets the id of the object
  objcommons.id = function(newId) {
    if (newId) {
      this.element[0].id = newId;
      return this;
    } else {
      var id = this.element[0].id;
      if (!id) {
        id = JSAV.utils.createUUID();
        this.element[0].id = id;
      }
      return id;
    }
  };
  objcommons.bounds = function(recalculate, options) {
    if (recalculate && $.isFunction(this.layout)) {
      return this.layout($.extend({boundsOnly: true}, options));
    } else {
      var pos = this.position();
      return $.extend({width: this.element.width(), height: this.element.height()}, pos);
    }
  };
  objcommons.position = function() {
    return JSAV.position(this.element);
  };
  objcommons.isVisible = function() {
    // use the jquery :visible pseudo filter for checking for visibility
    return this.element.filter(":visible").size() > 0;
  };
  objcommons.clear = function() {
    if (this.element) {
      this.element.remove();
    }
  };

  JSAV._types.common = objcommons;

  JSAV.utils = {};
  var u = JSAV.utils; // shortcut for easier and faster access

  u.getQueryParameter = function(name) {
    var params = window.location.search,
      vars = {},
      i,
      pair;
    if (params) {
      params = params.slice(1).split('&'); // get rid of ?
      for (i=params.length; i--; ) {
        pair = params[i].split('='); // split to name and value
        vars[pair[0]] = decodeURIComponent(pair[1]); // decode URI
        if (name && pair[0] === name) {
          return pair[1]; // if name requested, return the matching value
        }
      }
    }
    if (name) { return; } // name was passed but param was not found, return undefined
    return vars;
  };
  /* from raphaeljs */
  u.createUUID = function() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [],
        i = 0;
    for (; i < 32; i++) {
      s[i] = (~~(Math.random() * 16)).toString(16);
    }
    s[12] = 4;  // bits 12-15 of the time_hi_and_version field to 0010
    s[16] = ((s[16] & 3) | 8).toString(16);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    return "jsav-" + s.join("");
  };

  /** Returns an iterable version of the passed array that has functions .next() and
    * .hasNext(). Note, that the array is a clone of the original array! */
  u.iterable = function(array) {
    var i = 0,
      array_clone = array.slice(0);
    array_clone.next = function() {
      return this[i++];
    };
    array_clone.hasNext = function() {
      return i < this.length;
    };
    array_clone.reset = function() {
      i = 0;
    };
    return array_clone;
  };

  /** Returns true if the passed object is a graphical primitive, false otherwise. */
  u.isGraphicalPrimitive = function(jsavobj) {
    if (!jsavobj) { return false; }
    return !!jsavobj.rObj;
  };


  JSAV.ext.logEvent = function(eventData) {
    // if object, add default fields if they don't exist
    if (typeof eventData === "object") {
      if (!eventData.hasOwnProperty('tstamp')) {
        eventData.tstamp = new Date().toISOString();
      }
      if (!eventData.hasOwnProperty('av')) {
        eventData.av = this.id();
      }
    }
    if ($.isFunction(this.options.logEvent)) {
      this.options.logEvent(eventData);
    } else {
      $("body").trigger("jsav-log-event", [eventData]);
    }
  };
  
  var dialogBase = '<div class="jsavdialog"></div>',
    $modalElem = null;
  
  u.dialog = function(html, options) {
    // options supported :
    //  - modal (default true)
    //  - width (and min/maxWidth)
    //  - height (and min/maxHeight)
    //  - closeText
    //  - dialogClass
    //  - title
    //  - closeCallback
    options = $.extend({}, {modal: true, closeOnClick: true}, options);
    var d = {
      },
      modal = options.modal,
      $dialog = $(dialogBase),
      i, l, attr,
      attrOptions = ["width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight"];
    if (typeof html === "string") {
      $dialog.html(html);
    } else if ($.isFunction(html)) {
      $dialog.html(html());
    } else {
      $dialog.append(html); // jquery or dom element
    }
    if ("title" in options) {
      $dialog.prepend("<h2>" + options.title + "<a href='#' class='jsavdialogclose'>X</a></h2>");
    }
    if ("dialogClass" in options) {
      $dialog.addClass(options.dialogClass);
    }
    for (i = 0, l = attrOptions.length; i < l; i++ ) {
      attr = attrOptions[i];
      if (options[attr] !== undefined) {
        $dialog.css(attr, options[attr]);
      }
    }
    var $doc = $(document),
      $win = $(window),
      docHeight = $doc.height(),
      docWidth = $doc.width(),
      winHeight = $win.height(),
      winWidth = $win.width(),
      scrollLeft = $doc.scrollLeft(),
      scrollTop = $doc.scrollTop();
    if (!("width" in options)) {
      $dialog.css("width", Math.max(500, winWidth*0.7)); // min width 500px, default 70% of window
    }
    var close = function(e) {
      if (e) { // if used as an event handler, prevent default behavior
        e.preventDefault();
      }
      if ($modalElem) {
        $modalElem.detach();
      }
      $dialog.remove();
      if ($.isFunction(options.closeCallback)) {
        options.closeCallback();
      }
    };
    if (modal) {
      $modalElem = $modalElem || $('<div class="jsavmodal" />');
      $modalElem.css({width: docWidth, height: docHeight});
      $modalElem.appendTo($("body"));
      if (options.closeOnClick) {
        $modalElem.click(close);
      }
    }
    $dialog.find(".jsavdialogclose").click(close);
    if ("closeText" in options) {
      var closeButton = $('<button type="button" class="jsavrow">' + options.closeText + '</button>')
        .click(close);
      $dialog.append(closeButton);
    }
    var $dial = $dialog.appendTo($("body")).add($modalElem);
    $dial.draggable();
    var center = function() {
      $dialog.css({
        top: Math.max(scrollTop + (winHeight - $dialog.outerHeight())/2, 0),
        left: scrollLeft + (winWidth - $dialog.outerWidth())/2
      });
    };
    center();
    $dial.show = function() {
      center();
      $dial.fadeIn();
    };
    $dial.close = close;
    return $dial;
  };
  
  u.value2type = function(val, valtype) {
    if (valtype === "number") {
      return Number(val);
    } else if (valtype === "boolean") {
      if (typeof(val) === "boolean") {
        return val;
      } else if (typeof(val) === "string") {
        return val === "true";
      }
      return !!val;
    } else {
      return val;
    }
  };
  
  var dummyTestFunction = function(dataArr) { return true; };
  u.rand = {
    random: Math.random,
    numKey: function(min, max) {
      return Math.floor(this.random()*(max-min) + min);
    },
    numKeys: function(min, max, num, options) {
      var opts = $.extend(true, {sorted: false, test: dummyTestFunction,
                                tries: 10}, options);
      var keys, tries = opts.tries, size = num;
      do {
        keys = [];
        for (size = num; size--; ) {
          keys.push(this.numKey(min, max));
        }
      } while (tries-- && !opts.test(keys));
      if (opts.sorted) { keys.sort(opts.sortfunc || function(a, b) {return a - b;}); }
      return keys;
    },
    /** returns an array of num random items from given array collection */
    sample: function(collection, num, options) {
      var opts = $.extend(true, {test: dummyTestFunction,
                                 tries: 10}, options);
      var min = 0,
        max = collection.length,
        result = [],
        dupl,
        tmp, rnd,
        tries = opts.tries;
      if (max < num || num < 0) { return undefined; }
      do {
        dupl = collection.slice(0);

        // do num random swaps, always swap with an item later in the array
        for (var i = 0; i < num; i++) {
          tmp = dupl[i];
          rnd = this.numKey(i, max);
          dupl[i] = dupl[rnd];
          dupl[rnd] = tmp;
        }
      } while (tries-- && !opts.test(dupl));
      return dupl.slice(0, num);
    }
  };

/*!
// based on seedrandom.js version 2.0.
// Author: David Bau 4/2/2011
// http://davidbau.com/encode/seedrandom.js
//
// 12/12/2011: Original code modified to add the methods to JSAV.utils.rand
// instead of overwriting the Math.random().
//
// LICENSE (BSD):
//
// Copyright 2010 David Bau, all rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   1. Redistributions of source code must retain the above copyright
//      notice, this list of conditions and the following disclaimer.
//
//   2. Redistributions in binary form must reproduce the above copyright
//      notice, this list of conditions and the following disclaimer in the
//      documentation and/or other materials provided with the distribution.
//
//   3. Neither the name of this module nor the names of its contributors may
//      be used to endorse or promote products derived from this software
//      without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
/**
 * All code is in an anonymous closure to keep the global namespace clean.
 *
 * @param {number=} overflow
 * @param {number=} startdenom
 */
(function (pool, math, width, chunks, significance, overflow, startdenom) {


//
// seedrandom()
// This is the seedrandom function described above.
//
math.seedrandom = function seedrandom(seed, use_entropy) {
  var key = [];
  var arc4;

  // Flatten the seed string or build one from local entropy if needed.
  seed = mixkey(flatten(
    use_entropy ? [seed, pool] :
    arguments.length ? seed :
    [new Date().getTime(), pool, window], 3), key);

  // Use the seed to initialize an ARC4 generator.
  arc4 = new ARC4(key);

  // Mix the randomness into accumulated entropy.
  mixkey(arc4.S, pool);

  // Override Math.random

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.

  math.random = function random() {  // Closure to return a random double:
    var n = arc4.g(chunks);             // Start with a numerator n < 2 ^ 48
    var d = startdenom;                 //   and denominator d = 2 ^ 48.
    var x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };

  // Return the seed that was used
  return seed;
};

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
/** @constructor */
function ARC4(key) {
  var t, u, me = this, keylen = key.length;
  var i = 0, j = me.i = me.j = me.m = 0;
  me.S = [];
  me.c = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) { me.S[i] = i++; }
  for (i = 0; i < width; i++) {
    t = me.S[i];
    j = lowbits(j + t + key[i % keylen]);
    u = me.S[j];
    me.S[i] = u;
    me.S[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  me.g = function getnext(count) {
    var s = me.S;
    var i = lowbits(me.i + 1); var t = s[i];
    var j = lowbits(me.j + t); var u = s[j];
    s[i] = u;
    s[j] = t;
    var r = s[lowbits(t + u)];
    while (--count) {
      i = lowbits(i + 1); t = s[i];
      j = lowbits(j + t); u = s[j];
      s[i] = u;
      s[j] = t;
      r = r * width + s[lowbits(t + u)];
    }
    me.i = i;
    me.j = j;
    return r;
  };
  // For robust unpredictability discard an initial batch of values.
  // See http://www.rsa.com/rsalabs/node.asp?id=2009
  me.g(width);
}

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
/** @param {Object=} result
  * @param {string=} prop
  * @param {string=} typ */
function flatten(obj, depth, result, prop, typ) {
  result = [];
  typ = typeof(obj);
  if (depth && typ == 'object') {
    for (prop in obj) {
      if (prop.indexOf('S') < 5) {    // Avoid FF3 bug (local/sessionStorage)
        try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
      }
    }
  }
  return (result.length ? result : obj + (typ != 'string' ? '\0' : ''));
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
/** @param {number=} smear
  * @param {number=} j */
function mixkey(seed, key, smear, j) {
  seed += '';                         // Ensure the seed is a string
  smear = 0;
  for (j = 0; j < seed.length; j++) {
    key[lowbits(j)] =
      lowbits((smear ^= key[lowbits(j)] * 19) + seed.charCodeAt(j));
  }
  seed = '';
  for (j in key) { seed += String.fromCharCode(key[j]); }
  return seed;
}

//
// lowbits()
// A quick "n mod width" for width a power of 2.
//
function lowbits(n) { return n & (width - 1); }

//
// The following constants are related to IEEE 754 limits.
//
startdenom = Math.pow(width, chunks);
significance = Math.pow(2, significance);
overflow = significance * 2;

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to intefere with determinstic PRNG state later,
// seedrandom will not call math.random on its own again after
// initialization.
//
mixkey(math.random(), pool);

// End anonymous scope, and pass initial values.
}(
  [],   // pool: entropy pool starts empty
  u.rand, // math: package containing random, pow, and seedrandom
  256,  // width: each RC4 output is 0 <= x < 256
  6,    // chunks: at least six RC4 outputs for each double
  52    // significance: there are 52 significant digits in a double
));
/*!
 End seedrandom.js
 */
 
  var _helpers = {};
  u._helpers = _helpers;
  _helpers.css = function(cssprop, value, options) {
    if (typeof cssprop === "string" && typeof value === "undefined") {
      return this.element.css(cssprop);
    } else {
      return this._setcss(cssprop, value, options);
    }
  };
  _helpers._setcss = function(cssprop, value) {
    var oldProps = $.extend(true, {}, cssprop),
        el = this.element,
        newprops;
    if (typeof cssprop === "string" && typeof value !== "undefined") {
      oldProps[cssprop] = el.css(cssprop);
      newprops = {};
      newprops[cssprop] = value;
    } else {
      for (var i in cssprop) {
        if (cssprop.hasOwnProperty(i)) {
          oldProps[i] = el.css(i);
        }
      }
      newprops = cssprop;
    }
    if (this.jsav._shouldAnimate()) { // only animate when playing, not when recording
      this.element.animate(newprops, this.jsav.SPEED);
    } else {
      this.element.css(newprops);
    }
    return [oldProps];
  };
  // function that selects elements from $elems that match the indices
  // filter (number, array of numbers, or filter function)
  _helpers.getIndices = function($elems, indices) {
    if (typeof indices === "undefined") { return $elems; } // use all if no restrictions are given
    if ($.isFunction(indices)) { // use a filter function..
      return $elems.filter(indices); // ..and let jQuery do the work
    } else if ($.isArray(indices)) {
      // return indices that are in the array
      return $elems.filter(function(index, item) {
        for (var i=0; i < indices.length; i++) {
          if (indices[i] === index) { return true; }
        }
        return false;
      });
    } else if (typeof indices === "number") {
      return $elems.eq(indices); // return the specific index
    } else if (typeof indices === "boolean") {
      // return all elems if indices is true, empty set otherwise
      return indices?$elems:$({});
    } else {
      try { // last resort, try if the argument can be parsed into an int..
        return $elems.eq(parseInt(indices, 10));
      } catch (err) {
        return $({}); // ..if not, return an empty set
      }
    }
  };
  _helpers.normalizeIndices = function($elems, indices, test) {
    var normIndices = [],
        $normElems = this.getIndices($elems, indices),
        i, l;
    if (typeof test !== "undefined") {
      $normElems = $normElems.filter(test);
    }
    for (i = 0, l = $normElems.size(); i < l; i++) {
      normIndices.push($elems.index($normElems.get(i)));
    }
    return normIndices;
  };

  // Returns an handler for the jsav-update-relative event
  // to maintain scope.
  var relativeUpdateHandlerFunction = function(jsavobj, relElem, offsetLeft, offsetTop, 
                  elemPos, elemTop, elemLeft, anchor, myAnchor) {
    return function() {
      // on update:
      //  - check relElems position
      //  - check elems position
      //  - update elems position using jqUI
      //  - store new pos and revert elems position change
      //  - calculate new pos and animate
      var el = jsavobj.element,
          elemCurPos = el.position(),
          elemCurLeft = elemCurPos.left,
          elemCurTop = elemCurPos.top,
          offsetChangeLeft = elemCurLeft - elemLeft, // element position has been changed
          offsetChangeTop = elemCurTop - elemTop; // element position has been changed

      // if the element is not visible, setting position won't work so simply return
      if (el.filter(":visible").size() === 0) {
        return;
      }
      
      offsetLeft = offsetLeft + offsetChangeLeft;
      offsetTop = offsetTop + offsetChangeTop;
      // use jqueryui to position the el relative to the relElem
      el.position({my: myAnchor,
                   at: anchor,
                   of: relElem,
                   offset: offsetLeft + " " + offsetTop,
                   collision: "none"});
      elemPos = el.position();
      elemLeft = elemPos.left;
      elemTop = elemPos.top;
      if (elemLeft === elemCurLeft && elemTop === elemCurTop && // relativeTo element has not changed pos
                offsetChangeLeft === 0 && offsetChangeTop === 0) { // this element has not changed pos
        return; // no change to animate, just return
      }
      el.css({left: elemCurLeft, top: elemCurTop}); // restore the element position
      jsavobj.css({left: elemLeft, top: elemTop}); // .. and animate the change
    };
  };

  // Sets the given jsavobj to be positioned relative to the options.relativeTo object
  _helpers.setRelativePositioning = function(jsavobj, options) {
    var el = jsavobj.element,
        relElem = options.relativeTo,
        anchor = options.anchor || "center",
        myAnchor = options.myAnchor || "center";
    if (!(relElem instanceof jQuery)) {
      if (relElem.nodeType === Node.ELEMENT_NODE) { // check if it's DOM element
        relElem = $(relElem);
      } else if (relElem.constructor === JSAV._types.ds.AVArray && "relativeIndex" in options)  {
        // position relative to the given array index, so set relElem to that index element
        relElem = relElem.element.find(".jsavindex:eq(" + options.relativeIndex + ")");
      } else if (JSAV.utils.isGraphicalPrimitive(relElem)) { // JSAV graphical primitive
        relElem = $(relElem.rObj.node);
      } else {
        // if not jQuery object nor DOM element, assume JSAV object
        relElem = relElem.element || relElem;
      }
    }
    el.css({ position: "absolute" });
    var offsetLeft = parseInt(options.left || 0, 10),
        offsetTop = parseInt(options.top || 0, 10);
    // store relElems position
    var relPos = relElem.position(),
        relLeft = relPos.left,
        relTop = relPos.top;
    // unbind previous event handler
    if (jsavobj._relativehandle) {
      jsavobj.jsav.container.off("jsav-updaterelative", jsavobj._relativehandle);
    } else { // set the initial position to the current position (to prevent unnecessary animations)
      el.position({my: myAnchor,
                   at: anchor,
                   of: relElem,
                   offset: offsetLeft + " " + offsetTop,
                   collision: "none"});
    }
    var elemPos = el.position(),
        elemLeft = elemPos.left,
        elemTop = elemPos.top;
    var hdanle = relativeUpdateHandlerFunction(jsavobj, relElem, offsetLeft, offsetTop, elemPos, elemTop, elemLeft, anchor, myAnchor) // end relative positioning
    jsavobj.jsav.container.on("jsav-updaterelative", hdanle);
    jsavobj._relativehandle = hdanle;
  };
  /* Handles top, left, right, bottom options and positions the given element accordingly */
  _helpers.handlePosition = function(jsavobj) {
    var el = jsavobj.element,
        options = jsavobj.options;
    if ("relativeTo" in options || "left" in options || "top" in options || "bottom" in options || "right" in options) {
      var positions = ["right", "bottom", "top", "left"],
          posProps = {"position": "absolute"},
          pos;
      options.center = false;
      // if positioning relative to some other object
      if ("relativeTo" in options && options.relativeTo) {
        this.setRelativePositioning(jsavobj, options);
      } else { // positioning absolutely
        for (var i = positions.length; i--; ) {
          pos = positions[i];
          if (options.hasOwnProperty(pos)) {
            posProps[positions[i]] = options[pos];
          }
          el.css(posProps);
        }
      }
    }
  };
  _helpers.handleVisibility = function(jsavobj, options) {
    jsavobj.element.css("display", "none");
    var visible = (typeof options.visible === "boolean" && options.visible === true);
    if (visible) {
      jsavobj.show(options);
    }
  };
  // A helper function to attach to JSAV objects to animate and record
  // toggling of a CSS class. Note, that when adding this to a JSAV
  // object prototype, it should be wrapper with the JSAV.anim(..).
  // For example:
  // treenode.toggleClass = JSAV.anim(JSAV.utils._helpers._toggleClass);
  _helpers._toggleClass = function(className) {
    if (this.jsav._shouldAnimate()) {
      this.element.toggleClass(className, this.jsav.SPEED);
    } else {
      this.element.toggleClass(className);
    }
    return [className];
  };
  // A helper function to attach to JSAV objects to animate and record
  // addition of a CSS class. This should not be wrapped with JSAV.anim(..).
  // Note, that this function assumes there is a .toggleClass(..) function
  // on the JSAV object.
  _helpers.addClass = function(className, options) {
    if (!this.element.hasClass(className)) {
      return this.toggleClass(className, options);
    } else {
      return this;
    }
  };
  // A helper function to attach to JSAV objects to animate and record
  // removal of a CSS class. This should not be wrapped with JSAV.anim(..).
  // Note, that this function assumes there is a .toggleClass(..) function
  // on the JSAV object.
  _helpers.removeClass = function(className, options) {
    if (this.element.hasClass(className)) {
      return this.toggleClass(className, options);
    } else {
      return this;
    }
  };
  // A helper function to attach to JSAV objects to tell whether or not the
  // object has a CSS class applied.
  _helpers.hasClass = function(className) {
    return this.element.hasClass(className);
  };

}(jQuery));