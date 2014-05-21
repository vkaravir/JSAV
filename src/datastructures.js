/**
* Module that contains the data structure implementations.
* Depends on core.js, anim.js, utils.js, effects.js
*/
/*global JSAV, jQuery, Raphael */
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
  var JSAVDataStructure = function() {};
  JSAV.utils.extend(JSAVDataStructure, JSAV._types.JSAVObject);
  var dsproto = JSAVDataStructure.prototype;
  dsproto.getSvg = function() {
      if (!this.svg) { // lazily create the SVG overlay only when needed
        this.svg = new Raphael(this.element[0]);
        this.svg.renderfix();
        var style = this.svg.canvas.style;
        style.position = "absolute";
      }
      return this.svg;
    };
  dsproto._toggleVisible = JSAV.anim(JSAV.ext.effects._toggleVisible);
  dsproto.show = JSAV.ext.effects.show;
  dsproto.hide = JSAV.ext.effects.hide;
  dsproto.addClass = JSAV.utils._helpers.addClass;
  dsproto.removeClass = JSAV.utils._helpers.removeClass;
  dsproto.hasClass = JSAV.utils._helpers.hasClass;
  dsproto.toggleClass = JSAV.anim(JSAV.utils._helpers._toggleClass);
  // dummy methods for initializing a DS, the DS should override these
  dsproto.initialize = function() { };
  dsproto.initializeFromElement = function() { };
  dsproto.clone = function() {};



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
  JSAV.utils.extend(Edge, JSAVDataStructure);
  var edgeproto = Edge.prototype;
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
      if (!this._label) {
        var self = this;
        var _labelPositionUpdate = function(options) {
          if (!self._label) { return; } // no label, nothing to do
          var bbox = (options && options.bbox) ? options.bbox: self.g.bounds(),
              lbbox = self._label.bounds(),
              newTop = bbox.top + (bbox.height - lbbox.height)/2,
              newLeft = bbox.left + (bbox.width - lbbox.width)/2;
          if (newTop !== lbbox.top || newLeft || lbbox.left) {
            self._label.css({top: newTop, left: newLeft}, options);
          }
        };
        this._labelPositionUpdate = _labelPositionUpdate;
        this._label = this.jsav.label(newLabel, {container: this.container.element});
        this._label.element.addClass("jsavedgelabel");
      } else {
        this._label.text(newLabel, options);
      }
    }
  };

  edgeproto.equals = function(otherEdge, options) {
    if (!otherEdge || !otherEdge instanceof Edge) {
      return false;
    }
    //if (!options || !(typeof options.checkNodes === "boolean" && !options.checkNodes)) {
    if (options && !options.dontCheckNodes) {
      if (!this.startnode.equals(otherEdge.startnode) ||
                !this.endnode.equals(otherEdge.endnode)) {
        return false;
      }
    }
    // if edge weights are different, the edges are different
    if (this._weight !== otherEdge._weight) { return false; }

    // compare styling of the edges
    if (options && 'css' in options) { // if comparing css properties
      var cssEquals = JSAV.utils._helpers.cssEquals(this, otherEdge, options.css);
      if (!cssEquals) { return false; }
    }

    if (options && 'class' in options) { // if comparing class attributes
      var classEquals = JSAV.utils._helpers.classEquals(this, otherEdge, options["class"]);
      if (!classEquals) { return false; }
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

  edgeproto.layout = function(options) {
    var sElem = this.start().element,
        eElem = this.end().element,
        start = (options && options.start)?options.start:this.start().position(),
        end = (options && options.end)?options.end:this.end().position(),
        sWidth = sElem.outerWidth()/2.0,
        sHeight = sElem.outerHeight()/2.0,
        eWidth = eElem.outerWidth()/2.0,
        eHeight = eElem.outerHeight()/2.0,
        fromX =  Math.round(start.left + sWidth),
        fromY = Math.round(start.top + sHeight),
        toX = Math.round(end.left + eWidth),
        toY = Math.round(end.top + eHeight),
        fromAngle = normalizeAngle(2*Math.PI - Math.atan2(toY - fromY, toX - fromX)),
        toAngle = normalizeAngle(2*Math.PI - Math.atan2(fromY - toY, fromX - toX)),
        fromPoint = getNodeBorderAtAngle(0, this.startnode.element,
            {width: sWidth, height: sHeight, x: fromX, y: fromY}, fromAngle),
        // arbitrarily choose to use bottom-right border radius
        endRadius = parseInt(eElem.css("borderBottomRightRadius"), 10) || 0,
        toPoint = getNodeBorderAtAngle(1, this.endnode.element,
            {width: eWidth, height: eHeight, x: toX, y: toY}, toAngle, endRadius);
    this.g.movePoints([fromPoint, toPoint], options);

    if ($.isFunction(this._labelPositionUpdate)) {
      var bbtop = Math.min(fromPoint[2], toPoint[2]),
          bbleft = Math.min(fromPoint[1], toPoint[1]),
          bbwidth = Math.abs(fromPoint[1] - toPoint[1]),
          bbheight = Math.abs(fromPoint[2] - toPoint[2]),
          bbox = {top: bbtop, left: bbleft, width: bbwidth, height: bbheight};
      this._labelPositionUpdate($.extend({bbox: bbox}, options));
    }

    if (this.start().value() === "jsavnull" || this.end().value() === "jsavnull") {
      this.addClass("jsavedge", options).addClass("jsavnulledge", options);
    } else {
      this.addClass("jsavedge", options).removeClass("jsavnulledge");
    }
  };

  // helper functions for edge position calculation
  function normalizeAngle(angle) {
    var pi = Math.PI;
    while (angle < 0) {
      angle += 2 * pi;
    }
    while (angle >= 2 * pi) {
      angle -= 2 * pi;
    }
    return angle;
  }

  function getNodeBorderAtAngle(pos, node, dim, angle, radius) {
    // dim: x, y coords of center and half of width and height
    var x, y, pi = Math.PI,
        urCornerA = Math.atan2(dim.height*2.0, dim.width*2.0),
        ulCornerA = pi - urCornerA,
        lrCornerA = 2*pi - urCornerA,
        llCornerA = urCornerA + pi;
    if (!radius) { // everything but 0 radius is considered a circle
      radius = dim.width;
    } else {
      radius = Math.min(radius, dim.width);
    }
    if (angle < urCornerA || angle > lrCornerA) { // on right side
      x = dim.x + radius * Math.cos(angle);
      y = dim.y - radius * Math.sin(angle);
    } else if (angle > ulCornerA && angle < llCornerA) { // left
      x = dim.x - radius * Math.cos(angle - pi);
      y = dim.y + radius * Math.sin(angle - pi);
    } else if (angle <= ulCornerA) { // top
      x = dim.x + radius * Math.cos(angle);
      y = dim.y - radius * Math.sin(angle);
    } else { // on bottom side
      x = dim.x - radius * Math.cos(angle - pi);
      y = dim.y + radius * Math.sin(angle - pi);
    }
    return [pos, Math.round(x), Math.round(y)];
  }


  var Node = function() {};
  JSAV.utils.extend(Node, JSAVDataStructure);
  var nodeproto = Node.prototype;

  nodeproto.value = function(newVal, options) {
    if (typeof newVal === "undefined") {
      return JSAV.utils.value2type(this.element.attr("data-value"), this.element.attr("data-value-type"));
    } else {
      this._setvalue(newVal, options);
    }
    return this;
  };
  nodeproto._setvalue = JSAV.anim(function(newValue) {
    var oldVal = this.value(),
      valtype = typeof(newValue);
    if (typeof oldVal === "undefined") {oldVal = ""};
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
    return this.addClass("jsavhighlight");
  };
  nodeproto.unhighlight = function(options) {
    return this.removeClass("jsavhighlight");
  };
  nodeproto.isHighlight = function() {
    return this.hasClass("jsavhighlight");
  };
  // NOTE: the state function only sets state of the node, not
  // things like edges out of the node
  nodeproto.state = function(newState) {
    if (typeof newState !== "undefined") {
      this.value(newState.value, {record: false});
      this.element.attr("class", newState.classes);
      if (newState.style) {
        this.element.attr("style", newState.style);
      }
    } else {
      var state = { value: this.value(),
          classes: this.element.attr("class") },
        style = this.element.attr("style");
      if (style) {
        state.style = style;
      }
      return state;
    }
  };

  nodeproto.css = JSAV.utils._helpers.css;
  nodeproto._setcss = JSAV.anim(JSAV.utils._helpers._setcss);

  JSAV._types.ds = { "JSAVDataStructure": JSAVDataStructure, "Edge": Edge, "Node": Node };
  // expose the extend for the JSAV
  JSAV.ext.ds = {
    layout: { }
  };
}(jQuery));
