/**
* Module that contains the data structure implementations.
* Depends on core.js
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
    },
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
      dstr.options = $.extend({}, options);
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
    this._arr = [];
    initDs(this, element, options);
  };
  var arrproto = AVArray.prototype;
  addCommonProperties(arrproto); // add functionality from common
  function setHighlight(indices, mode) {
    var testDiv = $('<ol class="' + this.element[0].className + 
        '" style="position:absolute;left:-10000px">' + 
        '<li class="node index highlight"></li><li class="node index" ></li></li></ol>'),
  	  styleDiv = (mode && mode === "add" ? testDiv.find(".node").filter(".highlight"):testDiv.find(".node").not(".highlight"));
  	// TODO: general way to get styles for the whole av system
  	$("body").append(testDiv);
    this.css(indices, {color: styleDiv.css("color"), "background-color": styleDiv.css("background-color")});
    testDiv.remove();
  }
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
      $elems.animate(cssprop, this.jsav.SPEED);
    } else {
      $elems.css(cssprop);
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
      $i1 = $pi1.find("span.value"),
      $i2 = $pi2.find("span.value"),
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
    // .. get the value elements again since the content swap lost the nodes ..
    $i1 = $pi1.find("span.value");
    $i2 = $pi2.find("span.value");
    // .. change back the index labels ..
    if (this.options.indexed) {
      $ind1label = $pi1.find("span.indexlabel");
      $ind2label = $pi2.find("span.indexlabel");
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
    // swap the actual values in the array
    tmp = this._arr[index1];
    this._arr[index1] = this._arr[index2];
    this._arr[index2] = tmp;
  }
  arrproto.swap = JSAV.anim(function(index1, index2, options) {
    realSwap.apply(this, arguments);
    return this; 
  }, realSwap
  );
  arrproto.clone = function() { 
    return new AVArray(this.jsav, this._arr.slice(0), $.extend({}, this.options, {display: false})); 
  };
  arrproto.size = function() { return this._arr.length; };
  arrproto.value = function(index, newValue) {
    if (!newValue) {
      return this._arr[index];
    } else {
      return this.setvalue(index, newValue);
    }
  };
  arrproto.setvalue = JSAV.anim(function(index, newValue) {
    var oldVal = this._arr[index] || undefined;
    this._arr[index] = newValue;
    $(this.element).find("li:eq(" + index + ")").html("" + newValue);
    return oldVal;
  });
  arrproto.initialize = function(data) {
    var el = $("<ol class='array' />"),
      liel;
    this.options = jQuery.extend({display: true}, this.options);
    this._arr = data.slice(0); // create a copy
    $.each(data, function(index, item) {
      el.append("<li class='node index'><span class='value'>" + item + "</span></li>");
    });
    $(this.jsav.container).append(el);
    this.element = el;
    this.layout();
    el.css("display", "none");
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
    var that = this,
      $elem = this.element,
      $elems = $elem.find("li");
    $elem.addClass("array");
    this._arr = this._arr || [];
    this._arr.length = $elems.size();
    $elems.each(function(index, item) {
      that._arr[index] = parseInt($(this).html(), 10);
      $(this).addClass("node index").html("<span class='value'>" + $(this).html() + "</span>");     
    });
    this.layout();
  };
  arrproto.layout = function() {
    var layoutAlg = this.options.layout || "_default";
    this.jsav.layout.array[layoutAlg](this);
  };
  arrproto.state = function(newstate) {
    if (newstate) {
      $(this.element).html(newstate.html);
      this._arr = newstate.values;
    } else {
      var sta = {
        html: $(this.element).html(),
        values: [].concat(this._arr)
      };
      return sta;
    }
  };
 
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
