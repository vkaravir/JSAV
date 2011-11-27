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
    if (!this.jsav.RECORD && !$.fx.off) { // only animate when playing, not when recording
      this.element.animate(newprops, this.jsav.SPEED);
    } else {
      this.element.css(newprops);
    }
    return [oldProps];
  };
  
  var Tree = function(jsav, options) {
    this.jsav = jsav;
    this.options = options;
    this.root = null;
  };
  var treeproto = Tree.prototype;
  JSAV.ext.ds.extend("common", treeproto);
  treeproto.root = function(newRoot) {
    if (typeof newRoot === "undefined") {
      return this.rootnode;
    }
    this.rootnode.value(newRoot);
  };
  treeproto.newNode = function(value) {
    return new TreeNode(this.jsav, value);
  };
  treeproto.height = function() {
    return this.root.height();
  };
  treeproto.layout = function() {
    var layoutAlg = this.options.layout || "_default";
    this.jsav.layout.tree[layoutAlg](this);
  };
  treeproto.equals = function(otherTree, options) {
    if (!otherTree instanceof Tree) {
      return false;
    }
    return this.rootnode.equals(otherTree.rootnode, options);
  };
  treeproto._setcss = JSAV.anim(_setcss);
  treeproto.css = function(cssprop) {
    if (typeof cssprop === "string") {
      return $elems.css(cssprop);
    } else {
      return this._setcss(cssprop);
    }
  };
  treeproto.state = function() {
    // TODO: Should tree.state be implemented??? Probably..
  };
  
  var TreeNode = function(container, value, parent, options) {
    this.jsav = container.jsav;
    this.container = container;
    this.parentnode = parent;
    this.options = $.extend(true, {display: true}, options);
    var el = $("<div>" + value + "</div>").addClass("jsavnode jsavtreenode jsavbinarynode")
              .attr("data-value", value);
    this.element = el;
    this.container.element.append(el);
    el.css("display", "hidden");
    var visible = (typeof this.options.display === "boolean" && this.options.display === true);
    if (visible) {
      if (jsav.currentStep() === 0) { // at beginning, just make it visible
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
  var nodeproto = TreeNode.prototype;
  JSAV.ext.ds.extend("common", nodeproto);
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
    this.element.text(newValue).attr("data-value", newValue);
    return [oldVal];
  });
  nodeproto.parent = function() {
    return this.parentnode;
  };
  nodeproto.edgeToParent = function(edge) {
    if (typeof edge === "undefined") {
      return this.edgetoparent;
    } else {
      this.edgetoparent = edge;
      return this;
    }
  };
  nodeproto.addChild = function(node) {
    this.childnodes.push(node);
    return this;
  }
  nodeproto.child = function(pos, node) {
    if (typeof node === "undefined") {
      return this.childnodes[pos];
    } else {
      this.childnodes[pos] = node;
    }
  };
  nodeproto.equals = function(otherNode, options) {
    if (!otherNode || this.value() !== otherNode.value()) {
      return false;
    }
    var cssprop, equal;
    if (options && 'css' in options) { // if comparing css properties
      if ($.isArray(options.css)) { // array of property names
        for (var i = 0; i < options.css.length; i++) {
          cssprop = opts.css[i];
          equal = this.css(cssprop) == otherNode.css(cssprop);
          if (!equal) { return false; }
        }
      } else { // if not array, expect it to be a property name string
        cssprop = opts.css;
        equal = this.css(cssprop) == otherNode.css(cssprop);
        if (!equal) { return false; }
      }
    }
    // compare edge style
    if (this.edgeToParent()) {
      equal = this.edgeToParent().equals(otherNode.edgeToParent(), options);
    }
    // compare children
    var ch = this.children();
    for (i = 0, l = ch.length; i < l; i++) {
      if (!ch[i].equals(otherNode.child(i), options)) {
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
    this.g = this.jsav.g.line(start.element.offset().left,
                              start.element.offset().top,
                              end.element.offset().left,
                              end.element.offset().top);

    var visible = (typeof this.options.display === "boolean" && this.options.display === true);
    this.g.rObj.attr({"opacity": 0});
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
          cssprop = opts.css[i];
          equal = this.css(cssprop) == otherEdge.css(cssprop);
          if (!equal) { return false; }
        }
      } else { // if not array, expect it to be a property name string
        cssprop = opts.css;
        equal = this.css(cssprop) == otherEdge.css(cssprop);
        if (!equal) { return false; }
      }
    }
    return true;
  };
  
  var BinaryTree = function(jsav, options) {
    this.jsav = jsav;
    this.options = options;
    var el = this.options.element || $("<div/>");
    el.addClass("jsavtree jsavbinarytree");
    if (!this.options.element) {
      $(this.jsav.container).append(el);
    }
    this.element = el;
    this.rootnode = this.newNode("");
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
  var bintreeproto = BinaryTree.prototype;
  $.extend(bintreeproto, treeproto);
  bintreeproto.newNode = function(value, parent) {
    return new BinaryTreeNode(this, value, parent || this.rootnode);
  };
  
  var BinaryTreeNode = function(container, value, parent, options) {
    this.jsav = container.jsav;
    this.container = container;
    this.parentnode = parent;
    this.options = $.extend(true, {display: true}, options);
    var el = $("<div>" + value + "</div>").addClass("jsavnode jsavtreenode jsavbinarynode")
              .attr("data-value", value);
    this.element = el;
    this.container.element.append(el);
    el.css("display", "hidden");
    var visible = (typeof this.options.display === "boolean" && this.options.display === true);
    if (visible) {
      if (jsav.currentStep() === 0) { // at beginning, just make it visible
        el.css("display", "block");
      } else { // add effect to show otherwise
        this.show();
      }
    }
    if (parent) {
      this.edgetoparent = new Edge(this.jsav, this, parent);
    }
  };
  var binnodeproto = BinaryTreeNode.prototype;
  $.extend(binnodeproto, nodeproto);

  binnodeproto.children = function() {
    if (this.leftnode && this.rightnode) {
      return [this.leftnode, this.rightnode];
    } else if (this.leftnode) {
      return [this.leftnode];
    } else if (this.rightnode) {
      return [this.rightnode];
    } else {
      return [];
    }
  };
  binnodeproto.child = function(pos, node) {
    if (typeof node === "undefined") {
      if (pos === 0) {
        return this.leftnode;
      } else if (pos === 1) {
        return this.rightnode;
      }
    } else {
      if (pos === 0) {
        this.leftnode = node;
      } else if (pos === 1) {
        this.rightnode = node;
      }
    }
  };
  binnodeproto.left = function(node) {
    if (typeof node === "undefined") {
      return this.leftnode;
    } else if (node.constructor === BinaryTreeNode) {
      this.leftnode = node;
    } else {
      if (this.leftnode) {
        this.leftnode.value(node);
      } else {
        this.leftnode = new BinaryTreeNode(this.container, node, this);
        //this.container.layout();
      }
    }
    return this.leftnode;
  };
  binnodeproto.right = function(node) {
    if (typeof node === "undefined") {
      return this.rightnode;
    } else if (node.constructor === BinaryTreeNode) {
      this.rightnode = node;
    } else {
      this.rightnode = new BinaryTreeNode(this.container, node, this);
      //this.container.layout();
    }
    return this.rightnode;
  };
  
  var BinarySearchTree = function(jsav, options) {
    this.jsav = jsav;
  };
  var bstproto = BinarySearchTree.prototype;
  $.extend(bstproto, bintreeproto);
  bstproto.insert = function(value) {
    // TODO: implement BST insert
  };
  bstproto.remove = function(value) {
    // TODO: implement BST delete
  };
  bstproto.search = function(value) {
    // TODO: implement BST search
  };
  
  var dstypes = JSAV._types.ds;
  dstypes.Tree = Tree.prototype;
  dstypes.TreeNode = TreeNode.prototype;
  dstypes.Edge = Edge.prototype;
  dstypes.BinaryTree = BinaryTree.prototype;
  dstypes.BinarySearchTree = BinarySearchTree.prototype;
  dstypes.BinaryTreeNode = BinaryTreeNode.prototype;

  JSAV.ext.ds.tree = function(options) {
    return new Tree(this, $.extend(true, {}, options));
  };
  JSAV.ext.ds.bintree = function(options) {
    return new BinaryTree(this, $.extend(true, {}, options));
  };
  JSAV.ext.ds.bst = function(options) {
    return new BinarySearchTree(this, $.extend(true, {}, options));
  };
  JSAV.ext.ds.edge = function(options) {
    return new Edge(this, $.extend(true, {}, options));
  };
})(jQuery);