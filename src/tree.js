/**
* Module that contains the tree data structure implementations.
* Depends on core.js, datastructures.js, anim.js
*/
(function($) {
  if (typeof JSAV === "undefined") { return; }

  var _setcss = function(cssprop, value) {
    var oldProps = $.extend(true, {}, cssprop),
        el = this.element,
        newprops;
    if (typeof cssprop === "string" && typeof value !== "undefined") {
      oldProps[cssprop] = el.css(cssprop);
      newprops = {};
      newprops[cssprop] = value;
    } else {
      for (var i in cssprop) {
        oldProps[i] = el.css(i);
      }
      newprops = cssprop;
    }
    if (!this.jsav.RECORD || !$.fx.off) { // only animate when playing, not when recording
      this.element.animate(newprops, this.jsav.SPEED);
    } else {
      this.element.css(newprops);
    }
    return [oldProps];
  };
  var valstring = function(value) {
    var valstr = "<span class='jsavvalue'>";
    if (value === "jsavnull") {
      return valstr + "</span>";
    }
    return valstr + value + "</span>";
  };
  
  
  var Tree = function(jsav, options) {
    this.init(jsav, options);
  };
  var treeproto = Tree.prototype;
  JSAV.ext.ds.extend("common", treeproto);
  treeproto.init = function(jsav, options) {
    this.jsav = jsav;
    this.options = options;
    var el = this.options.element || $("<div/>");
    el.addClass("jsavtree jsavcommontree");
    if (!this.options.element) {
      $(this.jsav.container).append(el);
    }
    this.element = el;
    this.rootnode = this.newNode("", null);
    //this.layout();
    el.css("display", "hidden");
    var visible = (typeof this.options.display === "boolean" && this.options.display === true);
    if (visible) {
      if (this.jsav.currentStep() === 0) { // at beginning, just make it visible
        el.css("display", "block");
      } else { // add effect to show otherwise
        this.show();
      }
    }
  };
  treeproto._setrootnode = JSAV.anim(function(node) {
    var oldroot = this.rootnode;
    this.rootnode = node;
    return [oldroot];
  });
  treeproto.root = function(newRoot) {
    if (typeof newRoot === "undefined") {
      return this.rootnode;
    } else if (newRoot.constructor === TreeNode) {
      this._setrootnode(newRoot);
    } else {
      if (this.rootnode) {
        this.rootnode.value(newRoot);
      } else {
        this._setrootnode(this.newNode(newRoot, null));
      }
    }
    return this.rootnode;
  };
  treeproto.clear = function() {
    this.root().clear();
    this.element.remove();
  };
  treeproto.newNode = function(value, parent) {
    return new TreeNode(this, value, parent);
  };
  treeproto.height = function() {
    return this.rootnode.height();
  };
  treeproto.layout = function() {
    var layoutAlg = this.options.layout || "_default";
    this.jsav.layout.tree[layoutAlg](this);
  };
  treeproto.equals = function(otherTree, options) {
    if (!otherTree instanceof Tree) {
      return false;
    }
    return this.root().equals(otherTree.root(), options);
  };
  treeproto._setcss = JSAV.anim(_setcss);
  treeproto.css = function(cssprop) {
    if (typeof cssprop === "string") {
      return this.element.css(cssprop);
    } else {
      return this._setcss(cssprop);
    }
  };
  treeproto.state = function() {
    // TODO: Should tree.state be implemented??? Probably..
  };
  
  var TreeNode = function(container, value, parent, options) {
    this.init(container, value, parent, options);
  };
  var nodeproto = TreeNode.prototype;
  JSAV.ext.ds.extend("common", nodeproto);
  nodeproto.init = function(container, value, parent, options) {
    this.jsav = container.jsav;
    this.container = container;
    this.parentnode = parent;
    this.options = $.extend(true, {display: true}, options);
    var el = $("<div>" + valstring(value) + "</div>").addClass("jsavnode jsavtreenode")
              .attr({"data-value": value, "id": this.id() }).data("node", this);
    this.element = el;
    this.container.element.append(el);
    el.css("display", "hidden");
    var visible = (typeof this.options.display === "boolean" && this.options.display === true);
    if (visible) {
      if (this.jsav.currentStep() === 0) { // at beginning, just make it visible
        el.css("display", "block");
      } else { // add effect to show otherwise
        this.show();
      }
    }
    if (parent) {
      this.edgetoparent = new Edge(this.jsav, this, parent);
    }
    this.childnodes = [];
  };
  nodeproto.value = function(newVal) {
    if (typeof newVal === "undefined") {
      return this.element.attr("data-value");
    } else {
      this._setvalue(newVal);
    }
    return this;
  };
  nodeproto._setvalue = JSAV.anim(function(newValue) {
    var oldVal = this.element.attr("data-value") || "";
    this.element.html(valstring(newValue)).attr("data-value", newValue);
    return [oldVal];
  });
  nodeproto.parent = function(newParent) {
    if (typeof newParent === "undefined") {
      return this.parentnode;
    } else {
      this.parentnode = newParent;
    }
  };
  nodeproto.edgeToParent = function(edge) {
    if (typeof edge === "undefined") {
      return this.edgetoparent;
    } else {
      this.edgetoparent = edge;
      return this;
    }
  };
  nodeproto.clear = function() {
    if (this.edgeToParent()) {
      this.edgeToParent().clear();
    }
    var ch = this.children();
    for (var i = ch.length; i--; ) {
      if (ch[i]) {
        ch[i].clear();
      }
    }
    this.childnodes = [];
    this.element.remove();
  };
  nodeproto.addChild = function(node) {
    var pos = this.childnodes.length;
    this._setchild(pos, node);
    return this;
  };
  nodeproto._setchild = JSAV.anim(function(pos, node) {
    var oldval = this.childnodes[pos];
    if (oldval) {
      oldval.parentnode = undefined;
    }
    if (node) {
      this.childnodes[pos] = node;
      node.parent(this);
    } else {
      delete this.childnodes[pos];
      this.childnodes = $.map(this.childnodes, function(item) {return item;}); 
    }
    return [pos, oldval];
  });
  nodeproto.child = function(pos, node) {
    if (typeof node === "undefined") {
      return this.childnodes[pos];
    } else {
      this._setchild(pos, node);
    }
  };
  nodeproto.height = function() {
    var chs = this.children(),
      maxheight = 0,
      max = Math.max;
    for (var i=0, l=chs.length; i < l; i++) {
      if (chs[i]) {
        maxheight = max(maxheight, chs[i].height());
      }
    }
    return maxheight + 1;
  };
  nodeproto.equals = function(otherNode, options) {
    if (!otherNode || this.value() !== otherNode.value()) {
      return false;
    }
    var cssprop, equal;
    if (options && 'css' in options) { // if comparing css properties
      if ($.isArray(options.css)) { // array of property names
        for (var i = 0; i < options.css.length; i++) {
          cssprop = options.css[i];
          equal = this.css(cssprop) == otherNode.css(cssprop);
          if (!equal) { return false; }
        }
      } else { // if not array, expect it to be a property name string
        cssprop = options.css;
        equal = this.css(cssprop) == otherNode.css(cssprop);
        if (!equal) { return false; }
      }
    }
    // compare edge style
    if (this.edgeToParent()) {
      equal = this.edgeToParent().equals(otherNode.edgeToParent(), options);
    }
    // compare children
    var ch = this.children(),
        och = otherNode.children();
    if (ch.length !== och.length) {
      return false;
    }
    for (var i = 0, l = ch.length; i < l; i++) {
      if (ch[i] && och[i] && !ch[i].equals(och[i], options)) {
        return false;
      }
    }
    return true; // values equal, nothing else to compare
  };
  nodeproto.children = function() {
    return this.childnodes;
  }
  nodeproto.state = function() {
    // TODO: Should this be implemented??? Probably..
  };
  nodeproto.highlight = function() {
    var testDiv = $('<div class="' + this.container.element[0].className + 
        '" style="position:absolute;left:-10000px">' + 
        '<div class="' + this.element[0].className + ' jsavhighlight"></div><div class="' + this.element[0].className + '" ></div></div>'),
  	  styleDiv = testDiv.find(".jsavnode").filter(".jsavhighlight");
  	// TODO: general way to get styles for the whole av system
  	$("body").append(testDiv);
    this._setcss({color: styleDiv.css("color"), "background-color": styleDiv.css("background-color")});
    testDiv.remove();
  };
  
  nodeproto.isHighlight = function() {
    var testDiv = $('<div class="' + this.container.element[0].className + 
        '" style="position:absolute;left:-10000px">' + 
        '<div class="' + this.element[0].className + ' jsavhighlight"></div><div class="' + this.element[0].className + '" ></div></div>'),
  	  styleDiv = testDiv.find(".jsavnode").filter(".jsavhighlight");
  	// TODO: general way to get styles for the whole av system
  	$("body").append(testDiv);
  	var isHl = this.element.css("background-color") == styleDiv.css("background-color");
  	testDiv.remove();
  	return isHl;
  };
  nodeproto._setcss = JSAV.anim(_setcss);
  nodeproto.css = function(cssprop, value) {
    if (typeof cssprop === "string" && typeof value === "undefined") {
      return this.element.css(cssprop);
    } else {
      return this._setcss(cssprop, value);
    }
  };
  
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
      this.g = this.jsav.g.line(-1, -1, -1, -1);
    } else {
      this.g = this.jsav.g.line(start.element.offset().left,
                              start.element.offset().top,
                              end.element.offset().left,
                              end.element.offset().top);
    }

    var visible = (typeof this.options.display === "boolean" && this.options.display === true);
    this.g.rObj.attr({"opacity": 0});
    this.g.rObj.node.setAttribute("class", "jsavedge");
    if (visible) {
      if (this.jsav.currentStep() === 0) { // at beginning, just make it visible
        this.g.rObj.attr({"opacity": 1});
      } else { // add effect to show otherwise
        this.g.show();
      }
    }    
  };
  var edgeproto = Edge.prototype;
  JSAV.ext.ds.extend("common", edgeproto);
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
      return this;
    }
  };
  edgeproto.end = function(node) {
    if (typeof node === "undefined") {
      return this.endnode;
    } else {
      this.endnode = node;
      return this;
    }
  };
  edgeproto.weight = function(node) {
    
  };
  edgeproto.clear = function() {
    this.g.rObj.remove();
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
  edgeproto.css = function(cssprop) {
    // TODO: implement edge css function
    return true;
  };
  edgeproto.state = function(newState) {
    // TODO: implement state
  };
  
  var BinaryTree = function(jsav, options) {
    this.init(jsav, options);
    this.element.addClass("jsavbinarytree");
  };
  var bintreeproto = BinaryTree.prototype;
  $.extend(bintreeproto, treeproto);
  bintreeproto.newNode = function(value, parent) {
    return new BinaryTreeNode(this, value, parent);
  };
  
  var BinaryTreeNode = function(container, value, parent, options) {
    this.init(container, value, parent, options);
    this.element.addClass("jsavbinarynode");
  };
  var binnodeproto = BinaryTreeNode.prototype;
  $.extend(binnodeproto, nodeproto);

  binnodeproto.left = function(node) {
    if (typeof node === "undefined") {
      if (this.child(0) && this.child(0).value() !== "jsavnull") {
        return this.child(0);
      } else {
        return undefined;
      }
    } else if (node.constructor === BinaryTreeNode) {
      this.child(0, node);
    } else {
      if (this.child(0)) {
        this.child(0).value(node);
      } else {
        var newNode = this.container.newNode(node, this);
        this.child(0, newNode);
        if (!this.child(1)) {
          var right = this.container.newNode("jsavnull", this);
          right.element.addClass("jsavnullnode");
          this.child(1, right);
        }
        return newNode;
      }
    }
    return this.child(0);
  };
  binnodeproto.right = function(node) {
    if (typeof node === "undefined") {
      if (this.child(1) && this.child(1).value() !== "jsavnull") {
        return this.child(1);
      } else {
        return undefined;
      }
    } else if (node.constructor === BinaryTreeNode) {
      this.child(1, node);
    } else {
      if (this.child(1)) {
        this.child(1).value(node);
      } else {
        var newNode = this.container.newNode(node, this);
        this.child(1, newNode);
        if (!this.child(0)) {
          var left = this.container.newNode("jsavnull", this);
          left.element.addClass("jsavnullnode");
          this.child(0, left);
        }
        return newNode;
      }
    }
    return this.child(1);
  };
  binnodeproto._setvalue = JSAV.anim(function(newValue) {
    var oldVal = this.element.removeClass("jsavnullnode")
          .attr("data-value");
    this.element.html(valstring(newValue)).attr("data-value", newValue);
    if (newValue === "jsavnull") {
      this.element.addClass("jsavnullnode");
    }
    return [oldVal];
  });
  binnodeproto._setcss = JSAV.anim(_setcss);
  
  var BinarySearchTree = function(jsav, options) {
    this.init(jsav, options);
    this.element.addClass("jsavbinarysearchtree");
  };
  var defaultCompare = function(a, b) {
    return a - b;
  };
  var bstproto = BinarySearchTree.prototype;
  $.extend(bstproto, bintreeproto);
  bstproto.insert = function(value) {
    var comp = this.options.compare;
    // helper function to recursively insert
    var ins = function(node, insval) {
      var val = node.value();
      if (!val || val === "jsavnull") { // no value in node
        node.value(insval);
      } else if (comp(val, insval) > 0) { // go left
        if (node.left()) {
          ins(node.left(), insval);
        } else {
          node.left(insval)
        }
      } else { // go right
        if (node.right()) {
          ins(node.right(), insval);
        } else {
          node.right(insval);
        }
      }
    }
    if ($.isArray(value)) { // array of values
      for (var i=0, l=value.length; i < l; i++) {
        ins(this.root(), value[i]);
      }
    } else {
      ins(this.root(), value);
    }
    return this;
  };
  bstproto.remove = function(value) {
    // TODO: implement BST delete
  };
  bstproto.search = function(value) {
    // TODO: implement BST search
  };
  
  var dstypes = JSAV._types.ds;
  dstypes.Tree = Tree;
  dstypes.TreeNode = TreeNode;
  dstypes.Edge = Edge;
  dstypes.BinaryTree = BinaryTree;
  dstypes.BinarySearchTree = BinarySearchTree;
  dstypes.BinaryTreeNode = BinaryTreeNode;

  JSAV.ext.ds.tree = function(options) {
    return new Tree(this, $.extend(true, {}, options));
  };
  JSAV.ext.ds.bintree = function(options) {
    return new BinaryTree(this, $.extend(true, {}, options));
  };
  JSAV.ext.ds.bst = function(options) {
    return new BinarySearchTree(this, $.extend(true, {'compare': defaultCompare}, options));
  };
  JSAV.ext.ds.edge = function(options) {
    return new Edge(this, $.extend(true, {}, options));
  };
})(jQuery);