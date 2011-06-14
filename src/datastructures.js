/*
 * JSAV 0.0.01 - JavaScript Algorithm Visualization Library
 *
 * Copyright (c) 2011 Ville Karavirta (http://)
 * Licensed under the MIT license.
 */

/**
* Module that contains the data structure implementations.
* Depends on core.js
*/
(function($) {
  if (typeof JSAV === "undefined") { return; }
  var ds = {},
    common = {
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
      }
    },
    initDs = function(dstr, options, element) {
      dstr.options = options;
      console.log("dstr", dstr, this, this.prototype, options, element);
      if (element) {
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

 
  ds.BinTreeNode = function(value, options, element) {
   
  };
  var btnodeproto = ds.BinTreeNode.prototype;
  addCommonProperties(btnodeproto);
  addCommonProperties(btnodeproto, nodecommon);
 
  var BinSearchTree = function(jsav, options, element) {
    this.jsav = jsav;
    initDs(this, options, element);
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
  ds.bst = function(options, element) {
    return new BinSearchTree(this, options, element);
  };
 
 
  var getIndices = function($elems, indices) {
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
  }

  var AVArray = function(jsav, options, element) {
    this.jsav = jsav;
    this._arr = [];
    initDs(this, options, element);
  };
  var arrproto = AVArray.prototype;
  arrproto.highlight = function(indices, options, callback) {
    var $elems = getIndices($(this.element).find("li"), indices);
    if (!options) {
      $elems.addClass("highlight", 2500);
    } else {
      $elems.animate(options, 2500);
    }
    if (callback) {}
    return this; 
  };
  arrproto.unhighlight = function(indices, options, callback) { return this; };
  arrproto.css = function(indices, css, callback) { return this; };
  arrproto.swap = function(index1, index2, options, callback) {
    var tmp = this._arr[index1],
      $i1 = $(this.element).find("li:eq(" + index1 + ")").find("span"),
      $i2 = $(this.element).find("li:eq(" + index2 + ")").find("span"),
      p1 = JSAV.position($i1),
      p2 = JSAV.position($i2),
      that = this,
      args = arguments;
    $i2.animate({"transform": "translateX(" + (p1.left-p2.left) + "px) translateY(" + (p1.top-p2.top) + "px)"}, 2500, 'linear');
    $i1.animate({"transform": "translateX(" + (p2.left-p1.left) + "px) translateY(" + (p2.top-p1.top) + "px)"}, 2500, 'linear', 
        function() {
          var htmlTmp = $i1.html();
          $i1.parent().html("<span>" + $i2.html() + "</span>");
          $i2.parent().html("<span>" + htmlTmp + "</span>");
          if (callback) {
            callback.apply(that, args); 
          }});
    this._arr[index1] = this._arr[index2];
    this._arr[index2] = tmp;
   
    return this; 
  };
  arrproto.clone = function(callback) { };
  arrproto.size = function() { return this._arr.length; };
  arrproto.value = function(index, newValue, callback) {
    if (!newValue) {
      return this._arr[index];
    } else {
      var oldVal = this._arr[index] || undefined;
      this._arr[index] = newValue;
      $(this.element).find("li:eq(" + index + ")").html("" + newValue);
      if (callback && oldVal && jQuery.isFunction(callback)) { callback(oldVal); }
    }
  };
  arrproto.initializeFromElement = function() {
    if (!this.element) { return; }
    var that = this,
      $elem = $(this.element);
      $elems = $elem.find("li");
    $elem.addClass("array");
    this._arr = this._arr || [];
    this._arr.length = $elems.size();
    $elems.each(function(index, item) {
      that._arr[index] = $(this).html();
      $(this).addClass("node index").html("<span>" + $(this).html() + "</span>");     
    });
    this.layout();
  };
  arrproto.layout = function() {
    this.jsav.layout.array._default(this);
  };
  addCommonProperties(arrproto);
  ds.array = function(options, element) {
    return new AVArray(this, options, element);
  };
 
  function addCommonProperties(dsPrototype, commonProps) {
    if (!commonProps) { commonProps = common; }
    for (var prop in commonProps) {
      if (commonProps.hasOwnProperty(prop)) {
        dsPrototype[prop] = commonProps[prop];
      }
    }
  }
 
  JSAV.ext.ds = ds;
})(jQuery);