---
layout: subpage
title: Tree and Binary Tree API
---



Currently, JSAV supports two types of trees: common tree and binary tree. The structures form a "class" hierarchy:
Tree &larr; Binary Tree and TreeNode &larr; BinaryTreeNode.


<h3 class="apimethod">.ds.tree([options]) and .ds.binarytree([options])</h3>
These functions of a JSAV instance initialize a new tree or binary tree. The returned tree instance is controlled through a collection of methods explained next.

Options that the optional parameter can specify:

 * layout: Defines choices of layout (currently only the default layout is supported).
 * visible: Boolean to determine if initially the tree is shown or
      not. Default true.
 * center: Boolean to determine if tree should be automatically centered
  within its container. Defaults to true.
 * left/top/right/bottom: Values to determine the absolute position of the tree relative to its container.
 * nodegap: Number to specify how big the gap between nodes in the tree should be. Defaults to 40.
 * relativeTo: A JSAV data structure object or DOM element that this structure should be positioned relative to.
    If this option is specified, left and top options will change structure's position relative to the relativeTo
    element. Note, that the element pointed by relativeTo needs to be visible.
 * anchor: Defines which position on the element being positioned to align with the target element. Should be in
    format ```horizontal vertical```. Possible horizontal values are "left", "center", "right" and vertical values "top", "center", "bottom". Defaults to ```center center```. Only has an effect if relativeTo is
    specified.
 * myAnchor: Similar to anchor, but the position on this element. Defaults to ```center center```. Only
    has an effect if relativeTo is specified.
 * follow: A boolean indicating whether or not this structure should move when the relative element moves. Only
  has an effect if relativeTo is specified.
 * relativeIndex: If relativeTo points to a JSAV array, this option can be used to position this structure relative
    to an index in that array. Only has an effect if relativeTo is specified.

<h3 class="apimethod">.clear()</h3>
Removes the DOM element of this structure from the document. This is useful, for example, in
  re-initializing exercises when the existing structure needs to be removed.

<h3 class="apimethod">.css(propertyName)</h3>
Returns the value for the given CSS property. This function exists for all trees, nodes, and edges.

<h3 class="apimethod">.css(propertyName, value)</h3>
Animates the value of the given CSS property to value. This function exists for all trees, nodes, and edges.

<h3 class="apimethod">.css({map})</h3>
Animates values of the CSS properties in the map to the given values. This function exists for all trees, nodes, and edges. For example

    tree.css({color: "green", "font-size": "20px"});

would animate the color and font-size properties of the tree.

<h3 class="apimethod">.id([newId])</h3>
Returns the ID of the structure. If optional parameter ```newId``` is given, sets the ID of the structure. The given ID should be unique. This function exists for all trees, nodes, and edges.

<h3 class="apimethod">.root([node [, options]])</h3>
Returns the root of this tree. If the optional ```node``` parameter is given, the root of the tree is set. This function exists for all trees. If ```node``` is a node the old root is replaced. The replaced root will also be hidden, unless option ```hide``` is set to ```false```. If ```node``` is a value the old value will be replaced in the root.

<h3 class="apimethod">.newNode(value)</h3>
Creates a new node that can be added to this tree. "Subclasses" override this to create nodes suited for the tree, so this method should be used when creating new nodes. This function exists for all trees.

<h3 class="apimethod">.height()</h3>
Returns the height of the tree. This function exists for all trees

<h3 class="apimethod">.layout()</h3>
This function (re)calculates the layout for the tree. Note, that the library does not do this automatically. That means that after changing the tree, you should call this manually at the end of each animation step. This function exists for all trees.

<h3 class="apimethod">.hide([options])</h3>
Make the tree invisible. This function exists for all trees. It recursively hides all the nodes and edges in the tree as well unless
option ```recursive``` is set to ```false```.

<h3 class="apimethod">.show([options])</h3>
Make the tree visible.This function exists for all trees. It recursively shows all the nodes and edges in the tree as well unless
option ```recursive``` is set to ```false```.

<h3 class="apimethod">.addClass(className, [options])</h3>
Adds the CSS class ```className``` to the tree and animates the changes.

<h3 class="apimethod">.removeClass(className, [options])</h3>
Removes the CSS class ```className``` from the tree and animates the changes.

<h3 class="apimethod">.toggleClass(className, [options])</h3>
Toggles the CSS class ```className``` to the tree and animates the changes.

<h3 class="apimethod">.hasClass(className, [options])</h3>
Return true/false based on if the tree has the CSS class ```className```.


<h3 class="apitopic">Events</h3>
There are functions to attach event handlers for the nodes and edges in the tree. The events
that can be
listened for are: click, dblclick, mousedown, mousemove, mouseup, mouseenter, and mouseleave.
See <a href="http://api.jquery.com/category/events/">jQuery documentation</a> for details on
the events. Every event handler gets as a parameter the jQuery event object. Inside the event
handler function, ```this``` will refer to the JSAV node or edge object. 

The function takes another, optional, parameter options that should be an object. It can be
used to specify whether the event handler is for nodes or edges. By default, it is attached to only nodes.

<b>Returns:</b> a JSAV tree object. Thus, this method can be chained.

For example, to highlight an node on mouseenter and unhighlight on mouseleave,
you can use:

<pre>tree.mouseenter(function() { this.highlight(); })
  .mouseleave(function() { this.unhighlight(); });</pre>

To attach a handler to edges, you can do:

    tree.mouseenter(yourEventHandler, {edge: true});

Similarly to arrays, you can also pass custom data to the handler. For example,
  ```bt.click({"color": "blue"}, JSAV.utils._helpers.css);``` would call the ```css```
  function with the given parameter. 

<h3 class="apimethod">.on(eventName, [data,], handler, options)</h3>
To bind other events than the ones listed above, you can use the ```on``` function. It takes
  as the first parameter the name of the event. Multiple events can be bound by separating their names with
  spaces. Other parameters are the same as for the shortcuts.


<h2>Tree Node API</h2>
The following functions exist for both tree nodes and binary tree nodes.

<h3 class="apimethod">.value([newValue])</h3>
Returns the value stored in this node. If the optional ```newValue``` parameter is given, the value is set to the given value.

<h3 class="apimethod">.parent([newParent])</h3>
Returns the parent node of this node. If the optional ```newParent``` parameter is given, the parent node is set.

<h3 class="apimethod">.edgeToParent([newEdge])</h3>
Returns the edge that connects this node to its parent. If the optional ```newEdge``` parameter is given, the edge to parent is set.

<h3 class="apimethod">.edgeToChild(pos)</h3>
Returns the edge that connects this node to its child at ```pos```. Returns ```undefined``` is no such child exists.

<h3 class="apimethod">.child(pos)</h3>
Returns the ```pos```:th child of this node.

<h3 class="apimethod">.child(pos, node [,options])</h3>
Sets the ```pos```:th child to the given value. The ```node``` can be a value or a node of correct type to the node. If value ```null``` is given as ```node```, the child at that position is removed. Note, that this also hides the removed node and the edge.

The optional third argument ```options``` should be an object. The following option(s) are supported:

 * ```edgeLabel```: specify a label shown on the edge connecting the new node to its parent.

<h3 class="apimethod">.addChild(node [,options])</h3>
Adds a child node to this node. The ```node``` can be a value or a node of correct type to the node.
  The ```options``` parameter works like above.

<h3 class="apimethod">.remove([options])</h3>
Removes the node from its parent. The node and its child nodes are hidden recursively, unless option ```hide``` is set to ```false```.

<h3 class="apimethod">.hide([options])</h3>
Hides the node and the edge connecting it to the parent node. Also recursively hides all child nodes unless
option ```recursive``` is set to ```false```.

<h3 class="apimethod">.show([options])</h3>
Shows the node and the edge connecting it to the parent node. Also recursively shows all child nodes unless
option ```recursive false``` is set to ```false```. Note, that if the tree is not visible, showing nodes will not have
any effect until the tree is set visible by calling show.


<h2>Binary Tree Node API</h2>
<h3 class="apimethod">.left([node [, options]])</h3>
Returns the left child or undefined if node has no left child. If optional parameter ```node``` is given, sets the left child. The parameter can be a value or a binary tree node. If value ```null``` is given as ```node```, the left child is removed. Note, that this also hides the removed node and the edge.
The additional ```options``` parameter works like for ```.child(...)``` above. 

<h3 class="apimethod">.right([node [,options]])</h3>
Returns the right child or undefined if node has no right child. If optional parameter ```node``` is given, sets the right child. The parameter can be a value or a binary tree node. Passing ```null``` as node works similarly to the left function. The additional ```options``` parameter works like for ```.child(...)``` above.

<h3 class="apimethod">.edgeToLeft()</h3>
Returns the edge that connects this node to its left child. Returns ```undefined``` if node has no left child.

<h3 class="apimethod">.edgeToRight()</h3>
Returns the edge that connects this node to its right child. Returns ```undefined``` if node has no right child.
 