(function($) {
  var compareFunction = function(a, b) {
    return a - b;
  };
  var inittree = function(binheap) {
    var size = binheap.size(),
      bt = binheap._tree,
      nodes = [];
    var donode = function(node, pos) {
      if (pos === 1) {
        node.value(binheap.value(pos - 1));
      }
      node.element.attr("data-jsav-heap-index", pos);
      nodes[pos - 1] = node;
      var lpos = pos * 2,
          rpos = lpos + 1;
      if (lpos <= size) {
        node.left(binheap.value(lpos - 1));
        donode(node.left(), lpos);
      }
      if (rpos <= size) {
        node.right(binheap.value(rpos - 1));
        donode(node.right(), rpos);
      }
    };
    binheap._treenodes = nodes;
    donode(bt.root(), 1);
  };
  
  var BinaryHeap = function(jsav, element, options) {
    this.jsav = jsav;
    this.options = options;
    if ($.isArray(element)) {
      var arrsize = element.length;
      if ('size' in options) {
        element.length = options.size;
      }
      this.initialize(element);
      this.element.attr("data-jsav-heap-size", arrsize);
    } else {
      if (element) { // assume it's a DOM element
        this.element = $(element);
      } else {
        this.element = $("<ol/>");
        $(this.jsav.container).append(this.element).addClass("jsavbinaryheap");
      }
      var size = 0;
      $.each(this.element.find("li"), function(index) {
        if (this.value(index) !== "") {
          size++;
        }
      });
      this.element.attr("data-jsav-heap-size", size.length);
      
      this.initializeFromElement();
    }
    var oldfx = $.fx.off || false;
    $.fx.off = true;
    
    if (options.stats) {
      this.stats = {"swaps": 0, "leftswaps": 0, "rightswaps": 0,
                    "recursiveswaps": 0, "partlyrecursiveswaps": 0};
    }
    if (options.tree) {
      this._tree = jsav.ds.bintree(options);
      inittree(this);
      this._tree.layout();
    }
    if (options.heapify) {
      for (var i = Math.floor(this.heapsize()/2); i > 0; i--) {
        this.heapify(i);
      }
    }
    $.fx.off = oldfx;
  };
  var bhproto = BinaryHeap.prototype;
  JSAV.ext.ds.extend("common", bhproto);
  $.extend(bhproto, JSAV._types.ds.AVArray.prototype);
  bhproto.arrayswap = bhproto.swap;
  bhproto.arraycss = bhproto.css;
  bhproto.arrayclear = bhproto.clear;
  bhproto.arrayvalue = bhproto.value;
  
  bhproto.value = function(index, newValue) {
    if (typeof newValue === "undefined") {
      return this.arrayvalue(index);
    }
    this.arrayvalue(index, newValue);
    if (index >= this.heapsize()) {
      this.element.attr("data-jsav-heap-size", index + 1);
    }
    if (this.options.tree) {
      inittree(this);
      this._treenodes[index].value(newValue);
      this._tree.layout();
    }
  }
  
  bhproto.css = function(index, cssprop) {
    var val = this.arraycss(index, cssprop);
    if (this.options.tree && typeof index === "number") {
      this._treenodes[index].css(cssprop);
    } else if (this.options.tree && $.isArray(index)) {
      for (var i = index.length; i--; ) {
        this._treenodes[index[i]].css(cssprop);
      }
    }
    return val;
  };
  
  bhproto.clear = function() {
    this.arrayclear();
    if (this.options.tree) {
      this._tree.clear();
    }
  };
  bhproto._setsize = JSAV.anim(function(newsize) {
    var oldsize = this.element.attr("data-jsav-heap-size");
    this.element.attr("data-jsav-heap-size", newsize);
    return [oldsize];
  });
  bhproto.heapsize = function(newsize) {
    if (typeof newsize !== "undefined") {
      return this._setsize(newsize);
    } else {
      return parseInt(this.element.attr("data-jsav-heap-size"), 10);
    }
  };

  bhproto.heapify = function(pos) {
    var size = this.heapsize(),
      lpos = pos * 2,
      rpos = pos * 2 + 1,
      smallest = pos,
      comp = this.options.compare;
    if (lpos <= size && comp(this.value(lpos - 1), this.value(pos - 1)) < 0) {
      smallest = lpos;
    }
    if (rpos <= size && comp(this.value(rpos - 1), this.value(smallest - 1)) < 0) {
      smallest = rpos;
    }
    if (smallest !== pos) {
      if (this.options.stats) {
        this.stats.swaps++;
        if (smallest == lpos) { this.stats.leftswaps++; }
        else { this.stats.rightswaps++; }
      }
      this.swap(smallest - 1, pos - 1);
      this.jsav.step();
      if (this.heapify(smallest) && this.options.stats) {
        this.stats.recursiveswaps++;
      } else if (this.options.stats) {
        this.stats.partlyrecursiveswaps++;
      }
      return true;
    } else if (this.options.stats) {
      this.stats.interrupted = true;
    }
    return false;
  };
  bhproto.swap = function(index1, index2, options) {
    this.arrayswap(index1, index2, options);
    if (this.options.tree) {
      // wrap the swap in a function..
      var treeswap = function(index1, index2) {
        this.jsav.effects.swap(this._treenodes[index1].element, this._treenodes[index2].element, true)
      };
      // .. and make it an animatable operation
      // TODO: move this wrapping to interaction.swap as an option
      JSAV.anim(treeswap, treeswap).call(this, index1, index2);
    }
  };
  bhproto.insert = function(val) {
    var i = this.heapsize() + 1,
      parent = Math.floor(i / 2),
      comp = this.options.compare,
      step = this.options.steps ? this.jsav.step : function() {};
    this.value(i - 1, val);
    if (this.options.tree) {
      inittree(this);
      this._tree.layout();
    }
    step.apply(this.jsav);
    while (i > 1 && comp(this.value(parent - 1), val) > 0) {
      if (this.options.stats) {
        this.stats.swaps += 1;
      }
      this.swap(i - 1, parent - 1);
      step.apply(this.jsav);
      i = parent;
      parent = Math.floor(i / 2);
    }
    if (comp(this.value(parent -1), val) === 0 && this.options.stats) {
      this.stats.collision = true;
    }
    return this;
  };
  
  JSAV.ext.ds.binheap = function(element, options) {
    return new BinaryHeap(this, element, $.extend(true, {'compare': compareFunction, "stats": false,
                                                         'steps': true, 'tree': true,
                                                         'heapify': true, 'center': true}, options));
  };
})(jQuery);