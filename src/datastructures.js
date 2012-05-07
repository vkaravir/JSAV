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
      getSvg: function() {
        if (!this.svg) { // lazily create the SVG overlay only when needed
          this.svg = Raphael(this.element[0]);
          this.svg.renderfix();
          var style = this.svg.canvas.style;
          style.position = "absolute";
        }
        return this.svg;
      },
      // returns the position of the DS
      'position': function() {
        return JSAV.position(this.element);
      },
      _toggleVisible: JSAV.anim(JSAV.ext.effects._toggleVisible),
      show: JSAV.ext.effects.show,
      hide: JSAV.ext.effects.hide,
      // dummy methods for initializing a DS, the DS should override these
      initialize: function() { },
      initializeFromElement: function() { },
      clone: function() {}
    };


  // implementation for a tree edge
  var Edge = function(jsav, start, end, options) {
    this.jsav = jsav;
    this.startnode = start;
    this.endnode = end;
    this.options = $.extend(true, {"display": true}, options);
    this.container = start.container;
    var startOffset = start.element.offset(),
        endOffset = end.element.offset();
    if (startOffset.left === endOffset.left && startOffset.top === endOffset.top) {
      // layout not done yet
      this.g = this.jsav.g.line(-1, -1, -1, -1, {container: this.container});
    } else {
      this.g = this.jsav.g.line(start.element.offset().left,
                              start.element.offset().top,
                              end.element.offset().left,
                              end.element.offset().top, {container: this.container});
    }

    var visible = (typeof this.options.display === "boolean" && this.options.display === true);
    this.g.rObj.attr({"opacity": 0});
    this.g.rObj.node.setAttribute("class", "jsavedge");
    this.g.rObj.node.setAttribute("data-startnode", this.startnode.id());
    this.g.rObj.node.setAttribute("data-endnode", this.endnode.id());
    this.g.rObj.node.setAttribute("data-container", this.container.id());
    $(this.g.rObj.node).data("edge", this);
    if (visible) {
      this.g.show();
    }    
  };
  var edgeproto = Edge.prototype;
  $.extend(edgeproto, common);
  edgeproto._setclass = JSAV.anim(function(clazz) {
    var line = this.g.rObj.node,
      oldclass = line.getAttribute("class");
    line.setAttribute("class", clazz);
    return [oldclass];
  });
  edgeproto.layout = function() {
    if (this.start().value() === "jsavnull" || this.end().value() === "jsavnull") {
      this._setclass("jsavedge jsavnulledge");
    } else {
      this._setclass("jsavedge");
    }
  };
  edgeproto.start = function(node) {
    if (typeof node === "undefined") {
      return this.startnode;
    } else {
      this.startnode = node;
      this.g.rObj.node.setAttribute("data-startnode", this.startnode?this.startnode.id():"");
      return this;
    }
  };
  edgeproto.end = function(node) {
    if (typeof node === "undefined") {
      return this.endnode;
    } else {
      this.endnode = node;
      this.g.rObj.node.setAttribute("data-endnode", this.endnode?this.endnode.id():"");
      return this;
    }
  };
  edgeproto.weight = function(node) {
    
  };
  edgeproto.clear = function() {
    this.g.rObj.remove();
  };
  edgeproto.hide = function() {
    this.g.hide();
  };
  edgeproto.show = function() {
    this.g.show();
  };
  edgeproto.equals = function(otherEdge, options) {
    if (!otherEdge || !otherEdge instanceof Edge) {
      return false;
    }
    if (options && !options.checkNodes) {
      if (!this.startnode.equals(otherEdge.startnode) || 
        !this.endnode.equals(otherEdge.endnode)) {
          return false;
      }
    }
    var cssprop, equal;
    if (options && 'css' in options) { // if comparing css properties
      if ($.isArray(options.css)) { // array of property names
        for (var i = 0; i < options.css.length; i++) {
          cssprop = options.css[i];
          equal = this.css(cssprop) == otherEdge.css(cssprop);
          if (!equal) { return false; }
        }
      } else { // if not array, expect it to be a property name string
        cssprop = options.css;
        equal = this.css(cssprop) == otherEdge.css(cssprop);
        if (!equal) { return false; }
      }
    }
    return true;
  };

  edgeproto._setcss = JSAV.anim(function(cssprop, value) {
    var oldProps = $.extend(true, {}, cssprop),
        el = this.g.rObj,
        newprops;
    if (typeof cssprop === "string" && typeof value !== "undefined") {
      oldProps[cssprop] = el.attr(cssprop);
      newprops = {};
      newprops[cssprop] = value;
    } else {
      for (var i in cssprop) {
        oldProps[i] = el.attr(i);
      }
      newprops = cssprop;
    }
    if (this.jsav._shouldAnimate()) { // only animate when playing, not when recording
      el.animate(newprops, this.jsav.SPEED);
    } else {
      el.attr(newprops);
    }
    return [oldProps];
  });
  edgeproto.css = function(cssprop, value) {
    if (typeof cssprop === "string" && typeof value === "undefined") {
      return this.g.rObj.attr(cssprop);
    } else {
      return this._setcss(cssprop, value);
    }
  };
  edgeproto.state = function(newState) {
    // TODO: implement state
  };
  edgeproto.position = function() {
    var bbox = this.g.rObj.getBBox();
    return {left: bbox.x, top: bbox.y};
  };
 
  
  function addCommonProperties(dsPrototype, commonProps) {
    if (!commonProps) { commonProps = common; }
    for (var prop in commonProps) {
      if (commonProps.hasOwnProperty(prop)) {
        dsPrototype[prop] = commonProps[prop];
      }
    }
  }
 
  JSAV._types.ds = { "common": common, "Edge": Edge };
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
