/**
* Module that contains the data structure implementations.
* Depends on core.js
*/
(function($) {
  if (typeof JSAV === "undefined") { return; }
  $.fn.getstyles = function() {
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
  var common = {
      'id': function(newId) { 
        if (newId) { 
          this._id = newId;
          return this;
        } else {
          return this._id; 
        }
      },
      'position': function() {
        return JSAV.position(this.element);
      },
      _hide: function() {
        $(this.element).fadeOut(this.jsav.SPEED);
      },
      _show: function() {
        $(this.element).fadeIn(this.jsav.SPEED);
      },
      show: JSAV.anim(function() { this._show(); }, 
        function() { this._hide(); }),
      hide: JSAV.anim(function() { this._hide(); },
        function() { this._show(); })
    },
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
    },
    nodecommon = {
      'value': function(newValue) {
         if (newValue) {
           this._val = newValue;
           return this;
         } else {
           return this._val;
         }
       }
    };

 
  var BinTreeNode = function(value, element, options) {
   
  };
  var btnodeproto = BinTreeNode.prototype;
  addCommonProperties(btnodeproto);
  addCommonProperties(btnodeproto, nodecommon);
 
  var BinSearchTree = function(jsav, element, options) {
    this.jsav = jsav;
    initDs(this, element, options);
  };
  var btproto = BinSearchTree.prototype;
  btproto.insert = function(value, callback) { return this; };
  btproto.remove = function(value, callback) { return this; };
  btproto.search = function(value, callback) { return this; };
  btproto.initializeFromElement = function() {
    if (!this.element) { return; }
    // TODO: load from the element given
  };
  addCommonProperties(btproto);
 
 
  var getIndices = function($elems, indices) {
    if (typeof indices === "undefined") { return $elems; } // use all if no restrictions are given
    if ($.isFunction(indices)) {
      return $elems.filter(indices);
    } else if ($.isArray(indices)) {
      // return indices that are in the array
      return $elems.filter(function(index, item) {
        for (var i=0; i < indices.length; i++) {
          if (indices[i] == index) { return true; }
        }
        return false;
      });
    } else if (typeof indices === "number"){
      return $elems.eq(indices);
    } else {
      try {
        return $elems.eq(parseInt(indices, 10));
      } catch (err) {
        return $({});
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
    var testDiv = $('<ol class="array" style="position:absolute;left:-10000px"><li class="node index highlight"></li><li class="node index" ></li></li>'),
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
    $elems.animate(cssprop, this.jsav.SPEED);
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
    var tmp = this._arr[index1],
      that = this,
      args = arguments,
      $pi1 = $(this.element).find("li:eq(" + index1 + ")"), // index
      $pi2 = $(this.element).find("li:eq(" + index2 + ")"),
      $i1 = $pi1.find("span.value"),
      $i2 = $pi2.find("span.value"),
      p1 = JSAV.position($i1),
      p2 = JSAV.position($i2),
      indices = $($pi1).add($pi2),
      i1prevStyle = $pi1.getstyles("color", "background-color"),
      i2prevStyle = $pi2.getstyles("color", "background-color"),
      speed = this.jsav.SPEED/5;
    indices.animate({"color": "red", "background-color": "pink"}, 3*speed, function() {
      $i2.animate({"transform": "translateX(" + (p1.left-p2.left) + "px) translateY(" + (p1.top-p2.top) + "px)"}, 7*speed, 'linear');
      $i1.animate({"transform": "translateX(" + (p2.left-p1.left) + "px) translateY(" + (p2.top-p1.top) + "px)"}, 7*speed, 'linear', 
        function() {
          var htmlTmp = $i1.html();
          $pi1.html("<span class='value'>" + $i2.html() + "</span>");
          $pi2.html("<span class='value'>" + htmlTmp + "</span>");
          $pi1.animate(i1prevStyle, speed);
          $pi2.animate(i2prevStyle, speed);
          that.layout();
        });
    });
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
    this._arr = data;
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
    bst: function(element, options) {
      return new BinSearchTree(this, element, options);
    },
    array: function(element, options) {
      return new AVArray(this, element, options);
    }
  };
})(jQuery);
