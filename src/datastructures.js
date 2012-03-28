/**
* Module that contains the data structure implementations.
* Depends on core.js, anim.js, utils.js, effects.js
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
          this.element[0].id = newId;
          return this;
        } else {
          var id = this.element[0].id
          if (!id) {
            id = JSAV.utils.createUUID();
            this.element[0].id = id;
          }
          return id;
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
    };
 
  
  function addCommonProperties(dsPrototype, commonProps) {
    if (!commonProps) { commonProps = common; }
    for (var prop in commonProps) {
      if (commonProps.hasOwnProperty(prop)) {
        dsPrototype[prop] = commonProps[prop];
      }
    }
  }
 
  JSAV._types.ds = { };
  // expose the extend for the JSAV
  JSAV.ext.ds = {
    extend: function(strName, strPrototype) {
      // copies properties for strName into strPrototype
      if (strName === "common") {
        addCommonProperties(strPrototype);
      }
    }
  };
  
  JSAV.ext.ds.layout = {};

})(jQuery);
