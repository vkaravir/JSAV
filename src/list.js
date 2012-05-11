/**
* Module that contains the linked list data structure implementations.
* Depends on core.js, datastructures.js, anim.js, utils.js
*/
(function($) {
  if (typeof JSAV === "undefined") { return; }

  var Edge = JSAV._types.ds.Edge;

  var List = function(jsav, options) {
    this.jsav = jsav;
    this.options = $.extend({visible: true}, options);
    var el = this.options.element || $("<div/>");
    el.addClass("jsavlist");
    for (var key in this.options) {
      var val = this.options[key];
      if (this.options.hasOwnProperty(key) && typeof(val) === "string" 
          || typeof(val) === "number" || typeof(val) === "boolean") {
        el.attr("data-" + key, val);
      }
    }
    if (!this.options.element) {
      $(jsav.canvas).append(el);
    }
    this.element = el;
    this._first = this.newNode("key");
    this.element.attr({"id": this.id()});
    JSAV.utils._helpers.handlePosition(this);
    JSAV.utils._helpers.handleVisibility(this, this.options);
  };
  var listproto = List.prototype;
  $.extend(listproto, JSAV._types.ds.common);
  listproto.first = function(newFirst) {
    if (typeof newFirst === "undefined") {
      return this._first;
    } else {
      return this.addFirst(newFirst);
    }
  };
  listproto._setfirst = JSAV.anim(function(newFirst) {
    var oldFirst = this._first;
    this._first = newFirst;
    return [oldFirst];
  });
  listproto.add = function(index, newValue) {
    if (index === 0) { 
      return this.addFirst(newValue);
    }
    var node = this.get(index - 1),
      newNode;
    if (newValue instanceof ListNode) {
      newNode = newValue;
    } else {
      newNode = this.newNode(newValue);
    }
    if (node) { // there is node for the index
      newNode.next(node.next());
      node.next(newNode);
    }
    return this;
  };
  listproto.addFirst = function(newValue) {
    if (newValue instanceof ListNode) {
      newValue.next(this._first);
      this._setfirst(newValue);
    } else {
      this._setfirst(this.newNode(newValue, {first: true, next: this._first}));
    }
    return this;
  };
  /** returns the last item in the list or if newLast is given, adds it to the end */
  listproto.last = function(newLast) {
    if (typeof newLast === "undefined") {
      var curNode = this.first();
      while (curNode.next()) {
        curNode = curNode.next();
      }
      return curNode;
    } else {
      this.addLast(newLast);
    }
  };
  /** adds the given value/node as the last item in the list */
  listproto.addLast = function(newValue) {
    var last = this.last(),
        newNode;
    if (newValue instanceof ListNode) {
      newNode = newValue;
    } else {
      newNode = this.newNode(newValue);
    }
    last.next(newNode);
    return this;
  };
  /** Returns the item at index, first node is at index 0 */
  listproto.get = function(index) {
    var curNode = this.first(),
        pos = 0;
    while (curNode.next() && pos < index) {
      curNode = curNode.next();
      pos++;
    }
    if (pos === index) {
      return curNode;
    } else {
      return null;
    }
  };
  listproto.newNode = function(value, options) {
    return new ListNode(this, value, $.extend({first: false}, this.options, options));
  };
  listproto.remove = function(index) {
    // TODO: remove bounds checks -> use removefirst/last
    if (index === 0) {
      return this.removeFirst();
    } else if (index === this.size() - 1) {
      return this.removeLast();
    }
    var prev = this.get(index - 1),
        next = this.get(index + 1);
    prev.next(next);
    return this;
  };
  listproto.removeFirst = function() {
    this.first(this.first().next());
    return this;
  };
  listproto.removeLast = function() {
    var newLast = this.get(this.size() - 1);
    newLast.next(null);
    return this;
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
    }
    JSAV.utils._helpers.handleVisibility(this, this.options)
  };
  
  var listnodeproto = ListNode.prototype;
  $.extend(listnodeproto, JSAV._types.ds.common);
  $.extend(listnodeproto, JSAV._types.ds.Node.prototype);
  
  listnodeproto.next = function(newNext) {
    if (typeof newNext === "undefined") {
      return this._next;
    } else {
      return this._setnext(newNext);
    }
  };
  listnodeproto._setnext = JSAV.anim(function(newNext) {
    var oldNext = this._next;
    this._next = newNext;
    if (newNext && this._edgetonext) {
      this._edgetonext.end(newNext);
    } else if (newNext){
      this._edgetonext = new Edge(this.jsav, this, this._next, {"arrow-end": "classic-wide-long"});
    }
    return [oldNext];
  });
  listnodeproto.state = function(newState) {
    // TODO: implement state
  };
  function centerList(list) {
    // center the list inside its parent container
    if (list.options.hasOwnProperty("center") && !list.options.center) {
      // if options center is set to falsy value, return
      return;
    }
    // width of list expected to be last items position + its width
    var width = list.element.outerWidth(),
      containerWidth = $(list.jsav.canvas).width();
    list.css("left", (containerWidth - width)/2);
  }

  var horizontalList = function(list, options) {
    var curNode = list.first(),
        prevNode,
        prevLeft = 0,
        opts = $.extend({updateLeft: true, updateTop: true, updateEdges: true}, options);
  	while (curNode) {
  	  var newPos = { };
  	  if (opts.updateLeft) { newPos.left = prevLeft; }
  	  if (opts.updateTop) { newPos.top = 0; }
  	  curNode.css(newPos);
  	  prevLeft += 50 + curNode.element.outerWidth();
	    var edge = prevNode?prevNode._edgetonext:undefined;
  	  if (edge && opts.updateEdges) {
  	    var start = [0, prevNode.element.position().left + prevNode.element.width() - 5,
  	                 prevNode.element.position().top + Math.round(prevNode.element.height()/2)],
  	        end = [1, curNode.element.position().left - 3,
  	                 curNode.element.position().top + Math.round(curNode.element.height()/2)];
        edge.g.movePoints([start, end]);
  	  }
  	  prevNode = curNode;
      curNode = curNode.next();
  	}
  	list.css("width", prevLeft - 50);
  	list.css("height", "50px");
    centerList(list);
  };

  JSAV.ext.ds.layout.list = {
    "_default": horizontalList
  };

  JSAV.ext.ds.list = function() {
    return new List(this);
  };
})(jQuery);