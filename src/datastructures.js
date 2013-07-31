/**
* Module that contains the data structure implementations.
* Depends on core.js, anim.js, utils.js, effects.js
*/
(function($) {
  "use strict";
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
      getSvg: function() {
        if (!this.svg) { // lazily create the SVG overlay only when needed
          this.svg = new Raphael(this.element[0]);
          this.svg.renderfix();
          var style = this.svg.canvas.style;
          style.position = "absolute";
        }
        return this.svg;
      },
      _toggleVisible: JSAV.anim(JSAV.ext.effects._toggleVisible),
      show: JSAV.ext.effects.show,
      hide: JSAV.ext.effects.hide,
      addClass: JSAV.utils._helpers.addClass,
      removeClass: JSAV.utils._helpers.removeClass,
      hasClass: JSAV.utils._helpers.hasClass,
      toggleClass: JSAV.anim(JSAV.utils._helpers._toggleClass),
      // dummy methods for initializing a DS, the DS should override these
      initialize: function() { },
      initializeFromElement: function() { },
      clone: function() {}
    };
  $.extend(common, JSAV._types.common);


  // implementation for a tree edge
  var Edge = function(jsav, start, end, options) {
    this.jsav = jsav;
    this.startnode = start;
    this.endnode = end;
    this.options = $.extend(true, {"display": true}, options);
    this.container = start.container;
    var startPos = start?start.element.position():{left:0, top:0},
        endPos = end?end.element.position():{left:0, top:0};
    if (startPos.left === endPos.left && startPos.top === endPos.top) {
      // layout not done yet
      this.g = this.jsav.g.line(-1, -1, -1, -1, $.extend({container: this.container}, this.options));
    } else {
      if (end) {
        endPos.left += end.element.outerWidth() / 2;
        endPos.top += end.element.outerHeight();
      }
      if (!startPos.left && !startPos.top) {
        startPos = endPos;
      }
      this.g = this.jsav.g.line(startPos.left,
                              startPos.top,
                              endPos.left,
                              endPos.top, $.extend({container: this.container}, this.options));
    }

    this.element = $(this.g.rObj.node);

    var visible = (typeof this.options.display === "boolean" && this.options.display === true);
    this.g.rObj.attr({"opacity": 0});
    this.element.addClass("jsavedge");
    if (start) {
      this.element[0].setAttribute("data-startnode", this.startnode.id());
    }
    if (end) {
      this.element[0].setAttribute("data-endnode", this.endnode.id());
    }
    this.element[0].setAttribute("data-container", this.container.id());
    this.element.data("edge", this);

    if (typeof this.options.weight !== "undefined") {
      this._weight = this.options.weight;
      this.label(this._weight);
    }
    if (visible) {
      this.g.show();
    }
  };
  var edgeproto = Edge.prototype;
  $.extend(edgeproto, common);
  edgeproto.layout = function(options) {
    if (this.start().value() === "jsavnull" || this.end().value() === "jsavnull") {
      this.addClass("jsavedge", options).addClass("jsavnulledge", options);
    } else {
      this.addClass("jsavedge", options).removeClass("jsavnulledge");
    }
  };
  edgeproto.start = function(node, options) {
    if (typeof node === "undefined") {
      return this.startnode;
    } else {
      this.startnode = node;
      this.g.rObj.node.setAttribute("data-startnode", this.startnode?this.startnode.id():"");
      return this;
    }
  };
  edgeproto.end = function(node, options) {
    if (typeof node === "undefined") {
      return this.endnode;
    } else {
      this.endnode = node;
      this.g.rObj.node.setAttribute("data-endnode", this.endnode?this.endnode.id():"");
      return this;
    }
  };
  edgeproto._setweight = JSAV.anim(function(newWeight) {
    var oldWeight = this._weight;
    this._weight = newWeight;
    return [oldWeight];
  });
  edgeproto.weight = function(newWeight) {
    if (typeof newWeight === "undefined") {
      return this._weight;
    } else {
      this._setweight(newWeight);
      this.label(newWeight);
    }
  };
  edgeproto.clear = function() {
    this.g.rObj.remove();
  };
  edgeproto.hide = function(options) {
    if (this.g.isVisible()) {
      this.g.hide(options);
      if (this._label) { this._label.hide(options); }
    }
  };
  edgeproto.show = function(options) {
    if (!this.g.isVisible()) {
      this.g.show(options);
      if (this._label) { this._label.show(options); }
    }
  };
  edgeproto.isVisible = function() {
    return this.g.isVisible();
  };
  edgeproto.label = function(newLabel, options) {
    if (typeof newLabel === "undefined") {
      if (this._label && this._label.element.filter(":visible").size() > 0) {
        return this._label.text();
      } else {
        return undefined;
      }
    } else {
      var self = this;
      var positionUpdate = function() {
        var bbox = self.g.bounds(),
            lbbox = self._label.bounds(),
            newTop = bbox.top + (bbox.height - lbbox.height)/2,
            newLeft = bbox.left + (bbox.width - lbbox.width)/2;
        if (newTop !== lbbox.top || newLeft || lbbox.left) {
          self._label.css({top: newTop, left: newLeft}, options);
        }
      };
      if (!this._label) {
        this._label = this.jsav.label(newLabel, {container: this.container.element});
        this._label.element.css({position: "absolute", display: "inline-block"}).addClass("jsavedgelabel");
        this.jsav.container.on("jsav-updaterelative", positionUpdate);
      } else {
        this._label.text(newLabel, options);
      }
    }
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
          equal = this.css(cssprop) === otherEdge.css(cssprop);
          if (!equal) { return false; }
        }
      } else { // if not array, expect it to be a property name string
        cssprop = options.css;
        equal = this.css(cssprop) === otherEdge.css(cssprop);
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
        if (cssprop.hasOwnProperty(i)) {
          oldProps[i] = el.attr(i);
        }
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
  edgeproto.css = function(cssprop, value, options) {
    if (typeof cssprop === "string" && typeof value === "undefined") {
      return this.g.rObj.attr(cssprop);
    } else {
      return this._setcss(cssprop, value, options);
    }
  };
  edgeproto.state = function(newState) {
    // TODO: implement state
  };
  edgeproto.position = function() {
    var bbox = this.g.bounds();
    return {left: bbox.left, top: bbox.top};
  };
  // add class handling functions
  edgeproto.addClass = function(className, options) {
    if (!this.element.hasClass(className)) {
      return this.toggleClass(className, options);
    } else {
      return this;
    }
  };
  edgeproto.removeClass = function(className, options) {
    if (this.element.hasClass(className)) {
      return this.toggleClass(className, options);
    } else {
      return this;
    }
  };
  edgeproto.hasClass = function(className) {
    return this.element.hasClass(className);
  };
  edgeproto.toggleClass = JSAV.anim(function(className, options) {
    this.element.toggleClass(className);
    return [className, options];
  });
  // add highlight/unhighlight functions, essentially only toggle jsavhighlight class
  edgeproto.highlight = function(options) {
    this.addClass("jsavhighlight", options);
  };
  edgeproto.unhighlight = function(options) {
    this.removeClass("jsavhighlight", options);
  };

  var Node = function() {},
  nodeproto = Node.prototype;
  $.extend(nodeproto, common);

  nodeproto.value = function(newVal, options) {
    if (typeof newVal === "undefined") {
      return JSAV.utils.value2type(this.element.attr("data-value"), this.element.attr("data-value-type"));
    } else {
      this._setvalue(newVal, options);
    }
    return this;
  };
  nodeproto._setvalue = JSAV.anim(function(newValue) {
    var oldVal = this.element.attr("data-value") || "",
      valtype = typeof(newValue);
    if (valtype === "object") { valtype = "string"; }
    this.element
      .find(".jsavvalue") // find the .jsavvalue element
      .html(this._valstring(newValue)) // set the HTML to new value
      .end() // go back to this.element
      .attr({"data-value": newValue, "data-value-type": valtype}); // set attributes
    return [oldVal];
  });
  nodeproto._valstring = function(value) {
    return "<span class='jsavvaluelabel'>" + value + "</span>";
  };
  nodeproto.highlight = function(options) {
    this.addClass("jsavhighlight");
  };
  nodeproto.unhighlight = function(options) {
    this.removeClass("jsavhighlight");
  };
  nodeproto.isHighlight = function() {
    return this.hasClass("jsavhighlight");
  };
  nodeproto.css = JSAV.utils._helpers.css;
  nodeproto._setcss = JSAV.anim(JSAV.utils._helpers._setcss);

  JSAV._types.ds = { "common": common, "Edge": Edge, "Node": Node };
  // expose the extend for the JSAV
  JSAV.ext.ds = {
    layout: {}
  };
}(jQuery));
