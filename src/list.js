/**
* Module that contains the linked list data structure implementations.
* Depends on core.js, datastructures.js, anim.js, utils.js
*/
/*global JSAV:true */
(function($) {
  if (typeof JSAV === "undefined") { return; }

  var Edge = JSAV._types.ds.Edge;

  var List = function(jsav, options) {
    this.jsav = jsav;
    this.options = $.extend({visible: true, nodegap: 40}, options);
    var el = this.options.element || $("<div/>");
    el.addClass("jsavlist");
    for (var key in this.options) {
      var val = this.options[key];
      if (this.options.hasOwnProperty(key) && typeof(val) === "string" || typeof(val) === "number" || typeof(val) === "boolean") {
        el.attr("data-" + key, val);
      }
    }
    if (!this.options.element) {
      $(jsav.canvas).append(el);
    }
    this.element = el;
    this.element.attr({"id": this.id()});
    JSAV.utils._helpers.handlePosition(this);
    JSAV.utils._helpers.handleVisibility(this, this.options);
  };
  var listproto = List.prototype;
  $.extend(listproto, JSAV._types.ds.common);
  listproto.first = function(newFirst, options) {
    if (typeof newFirst === "undefined") {
      return this._first;
    } else {
      return this.addFirst(newFirst, options);
    }
  };
  listproto._setfirst = JSAV.anim(function(newFirst) {
    var oldFirst = this._first;
    this._first = newFirst;
    return [oldFirst];
  });
  listproto.add = function(index, newValue, options) {
    if (index < 0 || index > this.size()) { return this; }
    if (index === 0) { 
      return this.addFirst(newValue, options);
    }
    var node = this.get(index - 1),
      newNode;
    if (newValue instanceof ListNode) {
      newNode = newValue;
    } else {
      newNode = this.newNode(newValue);
    }
    if (node) { // there is node for the index
      newNode.next(node.next(), options);
      node.next(newNode, options);
    }
    return this;
  };
  listproto.addFirst = function(newValue, options) {
    if (newValue instanceof ListNode) {
      newValue.next(this._first, options);
      this._setfirst(newValue, options);
    } else {
      this._setfirst(this.newNode(newValue, $.extend({}, options, {first: true, next: this._first})), options);
    }
    return this;
  };
  /** returns the last item in the list or if newLast is given, adds it to the end */
  listproto.last = function(newLast, options) {
    if (typeof newLast === "undefined") {
      var curNode = this.first();
      while (curNode.next()) {
        curNode = curNode.next();
      }
      return curNode;
    } else {
      this.addLast(newLast, options);
    }
  };
  /** adds the given value/node as the last item in the list */
  listproto.addLast = function(newValue, options) {
    var last = this.last(),
        newNode;
    if (newValue instanceof ListNode) {
      newNode = newValue;
    } else {
      newNode = this.newNode(newValue);
    }
    last.next(newNode, options);
    return this;
  };
  /** Returns the item at index, first node is at index 0 */
  listproto.get = function(index) {
    if (typeof(index) !== "number" || index < 0) { return; }
    var curNode = this.first(),
        pos = 0;
    while (curNode.next() && pos < index) {
      curNode = curNode.next();
      pos++;
    }
    if (pos === index) {
      return curNode;
    } else {
      return undefined;
    }
  };
  listproto.newNode = function(value, options) {
    return new ListNode(this, value, $.extend({first: false}, this.options, options));
  };
  listproto.remove = function(index, options) {
    // TODO: remove bounds checks -> use removefirst/last
    if (index === 0) {
      return this.removeFirst(options);
    } else if (index === this.size() - 1) {
      return this.removeLast(options);
    }
    var prev = this.get(index - 1),
        next = this.get(index + 1),
        oldNode = prev.next();
    prev.next(next, options);
    return oldNode;
  };
  listproto.removeFirst = function(options) {
    var oldFirst = this.first();
    this._setfirst(oldFirst.next(), options);
    return oldFirst;
  };
  listproto.removeLast = function(options) {
    var newLast = this.get(this.size() - 2),
      oldLast = this.last();
    newLast.next(null, options);
    return oldLast;
  };
  listproto.layout = function(options) {
    var layoutAlg = $.extend({}, this.options, options).layout || "_default";
    this.jsav.ds.layout.list[layoutAlg](this, options);
  };
  listproto.state = function(newState) {
    // TODO: implement list.state
  };
  listproto.size = function() {
    var curNode = this.first(),
      size = 0;
    while (curNode) {
      size++;
      curNode = curNode.next();
    }
    return size;
  };
  listproto.css = JSAV.utils._helpers.css;
  listproto._setcss = JSAV.anim(JSAV.utils._helpers._setcss);

  // add the event handler registration functions to the list prototype
  JSAV.utils._events._addEventSupport(listproto);
  
  var ListNode = function(container, value, options) {
    this.jsav = container.jsav;
    this.container = container;
    this._next = options.next;
    this._value = value;
    this.options = $.extend(true, {visible: true}, options);
    var el = $("<div>" + this._valstring(value) + "<span class='jsavpointerarea'></span></div>"),
      valtype = typeof(value);
    if (valtype === "object") { valtype = "string"; }
    this.element = el;
    el.addClass("jsavnode jsavlistnode")
        .attr({"data-value": value, "id": this.id(), "data-value-type": valtype })
        .data("node", this);
    if ("first" in options && options.first) {
      this.container.element.prepend(el);
    } else {
      this.container.element.append(el);
    }
    if (this._next) {
      this._edgetonext = new Edge(this.jsav, this, this._next, {"arrow-end": "classic-wide-long"});
      if (this.options.edgeLabel) {
        this._edgetonext.label(this.options.edgeLabel);
      }
    }
    JSAV.utils._helpers.handleVisibility(this, this.options);
  };
  
  var listnodeproto = ListNode.prototype;
  $.extend(listnodeproto, JSAV._types.ds.Node.prototype);
  
  listnodeproto.next = function(newNext, options) {
    if (typeof newNext === "undefined") {
      return this._next;
    } else {
      return this._setnext(newNext, options);
    }
  };
  listnodeproto._setnext = JSAV.anim(function(newNext, options) {
    var oldNext = this._next;
    this._next = newNext;
    if (newNext && this._edgetonext) {
      this._edgetonext.end(newNext);
    } else if (newNext){
      this._edgetonext = new Edge(this.jsav, this, this._next, {"arrow-end": "classic-wide-long"});
    }
    if (options && options.edgeLabel) {
      this._edgetonext.label(options.edgeLabel);
    }
    return [oldNext];
  });
  listnodeproto.edgeToNext = function() {
    return this._edgetonext;
  };
  listnodeproto.state = function(newState) {
    // TODO: implement state
  };
  function centerList(list, options) {
    // center the list inside its parent container
    if (list.options.hasOwnProperty("center") && !list.options.center) {
      // if options center is set to falsy value, return
      return;
    }
    // width of list expected to be last items position + its width
    var width = list.element.outerWidth(),
      containerWidth = $(list.jsav.canvas).width();
    list.css("left", (containerWidth - width)/2, options);
  }

  var horizontalList = function(list, options) {
    var curNode = list.first(),
        prevNode,
        prevLeft = 0,
        opts = $.extend({updateLeft: true, updateTop: true, updateEdges: true}, list.options, options);
    while (curNode) {
      var newPos = { };
      if (opts.updateLeft) { newPos.left = prevLeft; }
      if (opts.updateTop) { newPos.top = 0; }
      curNode.css(newPos);
      prevLeft += opts.nodegap + curNode.element.outerWidth();
      var edge = prevNode?prevNode._edgetonext:undefined;
      if (edge && opts.updateEdges) {
        var start = [0, prevNode.element.position().left + prevNode.element.width() - 5,
                    prevNode.element.position().top + Math.round(prevNode.element.height()/2)],
            end = [1, curNode.element.position().left - 3,
                    curNode.element.position().top + Math.round(curNode.element.height()/2)];
        edge.g.movePoints([start, end], options);
      }
      prevNode = curNode;
      curNode = curNode.next();
    }
    list.css("width", prevLeft - opts.nodegap, options);
    list.css("height", "50px", options);
    centerList(list, opts);
  };

  JSAV.ext.ds.layout.list = {
    "_default": horizontalList
  };

  JSAV.ext.ds.list = function() {
    return new List(this);
  };
})(jQuery);