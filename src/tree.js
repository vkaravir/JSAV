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
    for (var key in this.options) {
      var val = this.options[key];
      if (this.options.hasOwnProperty(key) && typeof(val) === "string" 
          || typeof(val) === "number" || typeof(val) === "boolean") {
        el.attr("data-" + key, val);
      }
    }
    if (!this.options.element) {
      $(this.jsav.canvas).append(el);
    }
    this.element = el;
    this.rootnode = this.newNode("", null);
    this.element.attr({"data-root": this.rootnode.id(), "id": this.id()});
    this.rootnode.element.attr("data-child-role", "root");
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
    this.element.attr("data-root", node.id());
    node.element.attr("data-child-role", "root");
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
  treeproto.state = function(newState) {
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
    var el = this.options.nodeelement || $("<div>" + valstring(value) + "</div>");
    this.element = el;
    el.addClass("jsavnode jsavtreenode")
        .attr({"data-value": value, "id": this.id() })
        .data("node", this);
    if (parent) {
      el.attr("data-parent", parent.id());
    }
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
      if (!this.edgetoparent) {
        this.edgetoparent = new Edge(this.jsav, this, newParent);
      } else {
        this.edgetoparent.end(newParent);
      }
      this.element.attr("data-parent", newParent?newParent.id():"");
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
    if (typeof node === "string" || typeof node === "number") {
      node = this.container.newNode(node);
    }
    this._setchild(pos, node);
    return this;
  };
  nodeproto._setchild = JSAV.anim(function(pos, node, shift) {
    var oldval = this.childnodes[pos];
    if (oldval && !shift) {
      oldval.parent(null);
    }
    if (node) {
      node.parent(this);
      if (!shift) {
        this.childnodes[pos] = node;
        node.element.attr("data-child-pos", pos);
      } else { // a child was deleted, we want to shift rest of children forward
        var newchildren = [];
        if (pos === 0) { // adding as first child
          this.childnodes.unshift(node);
        } else if (pos === this.childnodes.length) { // adding as last child
          this.childnodes.push(node);
        } else { // adding in the middle
          for (var i = 0, l = this.childnodes.length; i < l; i++) {
            if (i === pos) {
              newchildren.push(node);
            }
            newchildren.push(this.childnodes[i]);
          }
          this.childnodes = newchildren;
        }
      $.each(this.childnodes, function(index, n) {
        n.element.attr("data-child-pos", index);
      });
      }
    } else {
      delete this.childnodes[pos];
      this.childnodes = $.map(this.childnodes, function(item) {return item;});
      $.each(this.childnodes, function(index, n) {
        n.element.attr("data-child-pos", index);
      });
      return [pos, oldval, true];
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
    this.g.rObj.node.setAttribute("data-startnode", this.startnode.id());
    this.g.rObj.node.setAttribute("data-endnode", this.endnode.id());
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
    if (!this.jsav.RECORD || !$.fx.off) { // only animate when playing, not when recording
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

  
  /// Binary Tree implementation
  var BinaryTree = function(jsav, options) {
    this.init(jsav, options);
    this.element.addClass("jsavbinarytree");
  };
  var bintreeproto = BinaryTree.prototype;
  $.extend(bintreeproto, treeproto);
  bintreeproto.newNode = function(value, parent) {
    return new BinaryTreeNode(this, value, parent);
  };
  
  
  /// Binary Tree Node implementation
  var BinaryTreeNode = function(container, value, parent, options) {
    this.init(container, value, parent, options);
    this.element.addClass("jsavbinarynode");
  };
  var binnodeproto = BinaryTreeNode.prototype;
  $.extend(binnodeproto, nodeproto);

  // a general setchild method for bintreenode, pos parameter
  // should be either 0 (left) or 1 (right), node is the new child
  function setchild(self, pos, node) {
    var oPos = pos?0:1;
    if (typeof node === "undefined") {
      if (self.child(pos) && self.child(pos).value() !== "jsavnull") {
        return self.child(pos);
      } else {
        return undefined;
      }
    } else if (node && node.constructor === BinaryTreeNode) {
      self.child(pos, node);
    } else {
      if (node === null) { // node is null, remove child
        if (self.child(pos) && self.child(pos).value() !== "jsavnull") {
          // child exists
          if (!self.child(oPos) || self.child(oPos).value() === "jsavnull") { // ..but no other child
            self.child(pos, null);
            self.child(oPos, null);
          } else { // other child exists
            // create a null node and set it as other child
            var other = self.container.newNode("jsavnull", self);
            other.element.addClass("jsavnullnode").attr("data-binchildrole", pos?"right":"left");
            self.child(pos, other);
          }
        } else { // no such child
          // nothing to be done
        }
      } else if (self.child(pos)) {
        self.child(pos).value(node);
      } else {
        var newNode = self.container.newNode(node, self);
        self.child(pos, newNode);
        newNode.element.attr("data-binchildrole", pos?"right":"left");
        if (!self.child(oPos)) {
          var other = self.container.newNode("jsavnull", self);
          other.element.addClass("jsavnullnode").attr("data-binchildrole", oPos?"right":"left");
          self.child(oPos, other);
        }
        return newNode;
      }
    }
    return self.child(1);
  }
  binnodeproto.left = function(node) {
    return setchild(this, 0, node);
  };
  binnodeproto.right = function(node) {
    return setchild(this, 1, node);
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
    
  // expose the types to JSAV._types.ds
  var dstypes = JSAV._types.ds;
  dstypes.Tree = Tree;
  dstypes.TreeNode = TreeNode;
  dstypes.Edge = Edge;
  dstypes.BinaryTree = BinaryTree;
  dstypes.BinaryTreeNode = BinaryTreeNode;

  // add functions to jsav.ds to create tree, bintree, end edge
  JSAV.ext.ds.tree = function(options) {
    return new Tree(this, $.extend(true, {}, options));
  };
  JSAV.ext.ds.bintree = function(options) {
    return new BinaryTree(this, $.extend(true, {}, options));
  };
  JSAV.ext.ds.edge = function(options) {
    return new Edge(this, $.extend(true, {}, options));
  };
})(jQuery);