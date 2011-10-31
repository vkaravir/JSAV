/**
* Module that contains the data structure implementations.
* Depends on core.js, anim.js
*/
(function($) {
  if (typeof JSAV === "undefined") { return; }

  // create a utility function as a jQuery "plugin"
  $.fn.getstyles = function() {
    // Returns the values of CSS properties that are given as 
    // arguments. For example, $elem.getstyles("background-color", "color")
    // could return an object {"background-color" : "rgb(255, 120, 120)",
    //                         "color" : "rgb(0, 0, 0)"}
    var res = {},
      arg;
    for (var i = 0; i < arguments.length; i++) {
      arg = arguments[i];
      if ($.isArray(arg)) {
        for (var j = 0; j < arg.length; j++) {
          res[arg[j]] = this.css(arg[j]);
        }
      } else {
        res[arg] = this.css(arg);
      }
    }
    return res;
  };
  
  // helper functions we want to keep private
  var priv = {
    _hide: function() {
      $(this.element).fadeOut(this.jsav.SPEED);
    },
    // utility function that actually implements show
    _show: function() {
      $(this.element).fadeIn(this.jsav.SPEED);
    }
  };
  
  // common properties/functions for all data structures, these can be copied
  // to the prototype of a new DS using the addCommonProperties(prototype) function
  var common = {
      // gets or sets the id of the DS
      'id': function(newId) { 
        if (newId) { 
          this._id = newId;
          return this;
        } else {
          return this._id; 
        }
      },
      // returns the position of the DS
      'position': function() {
        return JSAV.position(this.element);
      },
      // utility function that actually implements hide
      // animated show function
      show: JSAV.anim(function() { priv._show.apply(this); }, 
        function() { priv._hide.apply(this); }),
      // animated hide function
      hide: JSAV.anim(function() { priv._hide.apply(this); },
        function() { priv._show.apply(this); }),
      // dummy methods for initializing a DS, the DS should override these
      initialize: function() { },
      initializeFromElement: function() { },
      clone: function() {}
    },
    // initializes a data structure
    initDs = function(dstr, element, options) {
      dstr.options = $.extend(true, {}, options);
      if ($.isArray(element)) {
        dstr.initialize(element);
      } else if (element) { // assume it's a DOM element
        dstr.element = element;
        dstr.initializeFromElement();
      } else {
        // TODO: create an element for this data structure
      }
    }; 
 
  // function that selects elements from $elems that match the indices
  // filter (number, array of numbers, or filter function)
  var getIndices = function($elems, indices) {
    if (typeof indices === "undefined") { return $elems; } // use all if no restrictions are given
    if ($.isFunction(indices)) { // use a filter function..
      return $elems.filter(indices); // ..and let jQuery do the work
    } else if ($.isArray(indices)) {
      // return indices that are in the array
      return $elems.filter(function(index, item) {
        for (var i=0; i < indices.length; i++) {
          if (indices[i] == index) { return true; }
        }
        return false;
      });
    } else if (typeof indices === "number"){
      return $elems.eq(indices); // return the specific index
    } else {
      try { // last resort, try if the argument can be parsed into an int..
        return $elems.eq(parseInt(indices, 10));
      } catch (err) {
        return $({}); // ..if not, return an empty set
      }
    }
  };

  /* Array data structure for JSAV library. */
  var AVArray = function(jsav, element, options) {
    this.jsav = jsav;
    initDs(this, element, options);
  };
  var arrproto = AVArray.prototype;
  addCommonProperties(arrproto); // add functionality from common
  function setHighlight(indices, mode) {
    var testDiv = $('<ol class="' + this.element[0].className + 
        '" style="position:absolute;left:-10000px">' + 
        '<li class="jsavnode jsavindex jsavhighlight"></li><li class="jsavnode jsavindex" ></li></li></ol>'),
  	  styleDiv = (mode && mode === "add" ? testDiv.find(".jsavnode").filter(".jsavhighlight"):testDiv.find(".jsavnode").not(".jsavhighlight"));
  	// TODO: general way to get styles for the whole av system
  	$("body").append(testDiv);
    this.css(indices, {color: styleDiv.css("color"), "background-color": styleDiv.css("background-color")});
    testDiv.remove();
  }
  
  arrproto.isHighlight = function(index, options) {
    var testDiv = $('<ol class="' + this.element[0].className + 
        '" style="position:absolute;left:-10000px">' + 
        '<li class="jsavnode jsavindex jsavhighlight"></li><li class="jsavnode jsavindex" ></li></li></ol>'),
  	  styleDiv = testDiv.find(".jsavnode").filter(".jsavhighlight");
  	// TODO: general way to get styles for the whole av system
  	$("body").append(testDiv);
  	var isHl = getIndices($(this.element).find("li"), index).css("background-color") == styleDiv.css("background-color");
  	testDiv.remove();
  	return isHl;
  };
  
  arrproto.highlight = function(indices, options) {
    setHighlight.call(this, indices, "add");
    return this; 
  };

  arrproto.unhighlight = function(indices, options) {
    setHighlight.call(this, indices, "remove");
    return this; 
  };
  arrproto._setcss = JSAV.anim(function(indices, cssprop) {
    var $elems = getIndices($(this.element).find("li"), indices);
    if (!this.jsav.RECORD || !$.fx.off) { // only animate when playing, not when recording
      // also animate the values due to a bug in webkit based browsers with inherited bg color not changing
      $elems.animate(cssprop, this.jsav.SPEED).find("span.jsavvalue").animate(cssprop, this.jsav.SPEED);
    } else {
      $elems.css(cssprop).find("span.jsavvalue").css(cssprop);
    }
    return this;
  });
  arrproto.css = function(indices, cssprop) {
    var $elems = getIndices($(this.element).find("li"), indices);
    if (typeof cssprop === "string") {
      return $elems.css(cssprop);
    } else {
      if ($.isFunction(indices)) { // if indices is a function, evaluate it right away and get a list of indices
        var all_elems = $(this.element).find("li"),
          sel_indices = []; // array of selected indices
        for (var i = 0; i < $elems.size(); i++) {
          sel_indices.push(all_elems.index($elems[i]));
        }
        indices = sel_indices;
      }
      return this._setcss(indices, cssprop);
    }
  };
  function realSwap(index1, index2, options) {
    var $pi1 = $(this.element).find("li:eq(" + index1 + ")"), // index
      $pi2 = $(this.element).find("li:eq(" + index2 + ")"),
      $i1 = $pi1.find("span.jsavvalue"),
      $i2 = $pi2.find("span.jsavvalue"),
      posdiff = JSAV.position($i1).left - JSAV.position($i2).left,
      indices = $($pi1).add($pi2),
      i1prevStyle = $pi1.getstyles("color", "background-color"),
      i2prevStyle = $pi2.getstyles("color", "background-color"),
      speed = this.jsav.SPEED/5,
      tmp = $pi1.html(),
      $ind1label, $ind2label;
    // first swap the contents of the elements..
    $pi1.html($pi2.html());
    $pi2.html(tmp);
    // swap the actual values in the array
    tmp = $pi1.attr("data-value");
    $pi1.attr("data-value", $pi2.attr("data-value"));
    $pi2.attr("data-value", tmp);
    // .. get the value elements again since the content swap lost the nodes ..
    $i1 = $pi1.find("span.jsavvalue");
    $i2 = $pi2.find("span.jsavvalue");
    // .. change back the index labels ..
    if (this.options.indexed) {
      $ind1label = $pi1.find("span.jsavindexlabel");
      $ind2label = $pi2.find("span.jsavindexlabel");
      tmp = $ind1label.html();
      $ind1label.html($ind2label.html());
      $ind2label.html(tmp);
    }
    if (!this.jsav.RECORD || !$.fx.off) {  // only animate when playing, not when recording
      // .. then set the position so that the array appears unchanged..
      $i2.css({"transform": "translateX(" + (posdiff) + "px)"});
      $i1.css({"transform": "translateX(" + (-posdiff) + "px)"});
      // .. animate the color ..
      indices.animate({"color": "red", "background-color": "pink"}, 3*speed, function() {
        // ..animate the translation to 0, so they'll be in their final positions..
        $i2.animate({"transform": "translateX(0px)"}, 7*speed, 'linear');
        $i1.animate({"transform": "translateX(0px)"}, 7*speed, 'linear', 
          function() {
            // ..and finally animate to the original styles.
            $pi1.animate(i1prevStyle, speed);
            $pi2.animate(i2prevStyle, speed);
        });
      });
    }
  }
  arrproto.swap = JSAV.anim(function(index1, index2, options) {
    realSwap.apply(this, arguments);
    return this; 
  }, realSwap
  );
  arrproto.clone = function() { 
    // fetch all values
    var size = this.size(),
      vals = [];
    for (var i=0; i < size; i++) {
      vals[i] = this.value(i);
    }
    return new AVArray(this.jsav, vals, $.extend(true, {}, this.options, {display: false})); 
  };
  arrproto.size = function() { return this.element.find("li").size(); };
  arrproto.value = function(index, newValue) {
    if (!newValue) {
      return parseInt(this.element.find("li:eq(" + index + ")").attr("data-value"), 10);
    } else {
      return this.setvalue(index, newValue);
    }
  };
  arrproto.setvalue = JSAV.anim(function(index, newValue) {
    var $index = this.element.find("li:eq(" + index + ")");
    var oldVal = $index.attr("data-value") || undefined;  
    $index.attr("data-value", newValue);
    $index.find(".jsavvalue").html("" + newValue);
    return oldVal;
  });
  arrproto.initialize = function(data) {
    var el = this.options.element || $("<ol/>"),
      liel, liels = $();
    el.addClass("jsavarray");
    this.options = jQuery.extend({display: true}, this.options);
    $.each(data, function(index, item) {
      liel = $("<li class='jsavnode jsavindex'><span class='jsavvalue'>" + item + "</span></li>");
      // set the data attribute for the index
      liel.attr("data-value", item);
      liels = liels.add(liel);
    });
    el.append(liels);
    if (!this.options.element) {
      $(this.jsav.container).append(el);
    }
    this.element = el;
    this.layout();
    el.css("display", "hidden");
    var visible = (typeof this.options.display === "boolean" && this.options.display === true);
    if (visible) {
      if (this.jsav.currentStep() === 0) { // at beginning, just make it visible
        el.css("display", "block");
      } else { // add effect to show otherwise
        this.show();
      }
    }
  };
  arrproto.initializeFromElement = function() {
    // TODO: handle settings from data-attributes
    if (!this.element) { return; }
    var $elem = this.element,
      $elems = $elem.find("li");
    $elem.addClass("jsavarray");
    $elems.each(function(index, item) {
      var $this = $(this);
      if (!$this.attr("data-value")) {
        $this.attr("data-value", parseInt($this.html(), 10));
      }
      $this.addClass("jsavnode jsavindex").html("<span class='jsavvalue'>" + $this.html() + "</span>");     
    });
    this.layout();
  };
  arrproto.layout = function() {
    var layoutAlg = this.options.layout || "_default";
    this.element.removeClass("jsavbararray");
    this.jsav.layout.array[layoutAlg](this);
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
            equal = this.css(i, cssprop) == otherArray[i];
            if (!equal) { return false; }
          }
          return true; // if tests passed, arrays are equal
        }
      }
    } else if (otherArray instanceof AVArray) { // JSAV array
      len = otherArray.size();
      if (this.size() !== len) { // size check
        return false;
      }
      if (!('value' in opts) || opts['value']) { // if comparing values
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
              equal = this.css(j, cssprop) == otherArray.css(j, cssprop);
              if (!equal) { return false; }
            }
          }
        } else { // if not array, expect it to be a property name string
          cssprop = opts.css;
          for (i = 0; i < len; i++) {
            equal = this.css(i, cssprop) == otherArray.css(i, cssprop);
            if (!equal) { return false; }
          }
        }
      }
      return true; // if tests passed, arrays are equal
    }
    
    // default: return false    
    return false;
  };
 
  arrproto.toggleArrow = JSAV.anim(function(indices) {
    var $elems = getIndices($(this.element).find("li"), indices);
    $elems.toggleClass("jsavarrow");
  });
  
  function addCommonProperties(dsPrototype, commonProps) {
    if (!commonProps) { commonProps = common; }
    for (var prop in commonProps) {
      if (commonProps.hasOwnProperty(prop)) {
        dsPrototype[prop] = commonProps[prop];
      }
    }
  }
 
  // expose the data structures for the JSAV
  JSAV.ext.ds = {
    array: function(element, options) {
      return new AVArray(this, element, options);
    }
  };
})(jQuery);
