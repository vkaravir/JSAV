---
layout: subpage
title: Linked List API
---

<h3 class="apimethod">.ds.list([options])</h3>
This function of a JSAV instance initializes an empty linked list. Options that the optional parameter can specify:

 * layout: Defines choices of layout (currently only the default layout is supported).
 * visible: Boolean to determine if initially the list is shown or not. Default true.
 * center: Boolean to determine if list should be automatically centered within its container. Defaults to true.
 * left/top/right/bottom: Values to determine the absolute position of the list relative to its container.
 * nodegap: Number to specify how big the gap between nodes in the list should be. Defaults to 40.
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


The returned list instance is controlled through a collection of methods explained next. In addition, the list has the common functions such as ```.id()```, ```.css(...)```, ```.show()```, and ```.hide()```.

<h3 class="apimethod">.first() and last()</h3>
Returns the first or last node in the list. If there are no nodes in the list, returns undefined.

<h3 class="apimethod">.addFirst([value]) and .addFirst([node])</h3>
Adds the given ```value``` or ```node``` as the first item in the list. Returns the list, so calls can be chained.

<h3 class="apimethod">.addLast([value]) and .addLast([node])</h3>
Adds the given ```value``` or ```node``` as the last item in the list. Returns the list, so calls can be chained.

<h3 class="apimethod">.add(index, [value or node])</h3>
Adds the given ```value``` or ```node``` to be the ```index```th item in the list. The first item in the list has index 0. Returns the list, so calls can be chained.

<h3 class="apimethod">.get(index)</h3>
Returns the node at ```index```. First item has index 0. If no such index exists, returns ```undefined```.

<h3 class="apimethod">.removeFirst() and .removeLast()</h3>
Removes the first or last node in the list. Returns the removed node.

<h3 class="apimethod">.remove(index)</h3>
Removes the node at ```index``` in the list. First item has index 0. Returns the removed node.

<h3 class="apimethod">.size()</h3>
Returns the size of the list.

<h3 class="apimethod">.layout([options])</h3>
This function (re)calculates the layout for the list. Note, that the library does not do this automatically. That means that after changing the list, you should call this manually at the end of each animation step.

Options supported by the layout function:


 * ```updateLeft``` If true, the horizontal position (that is, left) of the nodes are calculated.
    Defaults to true.
 * ```updateTop``` If true, the vertical position (that is, top) of the nodes are calculated.
    Defaults to true.

If the call to layout is, for example, ```list.layout({updateLeft: false, updateTop: false}), only the edges
  in the list are redrawn.```

<h3 class="apimethod">.newNode(value [, options])</h3>
Returns a new node that can be added to the list.

<h3 class="apimethod">.clear()</h3>
Removes the DOM element of this structure from the document. This is useful, for example, in
  re-initializing exercises when the existing structure needs to be removed.

<h3 class="apimethod">.addClass(className, [options])</h3>
Adds the CSS class ```className``` to the list and animates the changes.

<h3 class="apimethod">.removeClass(className, [options])</h3>
Removes the CSS class ```className``` from the list and animates the changes.

<h3 class="apimethod">.toggleClass(className, [options])</h3>
Toggles the CSS class ```className``` of the list and animates the changes.

<h3 class="apimethod">.hasClass(className, [options])</h3>
Return true/false based on if the list has the CSS class ```className```.

<h3 class="apitopic">Events</h3>
There are functions to attach event handlers for the nodes and edges in the list. The events
  that can be listened for are: click, dblclick, mousedown, mousemove, mouseup, mouseenter, and mouseleave.
  See the tree documentation for details.

## Linked List Node API
A node in a list has the same functions as a tree node: ```.value([newValue])```, ```.highlight()/unhighlight()```, ```.show()/.hide()```, and ```.css(...)```. In addition, it has the following functions.

<h3 class="apimethod">.next()</h3>
Returns the next node in the linked list. If no next, returns null.

<h3 class="apimethod">.next([node [, options]])</h3>
Sets the next node to be the passed ```node```. The optional second argument ```options``` should be an object. The following option(s) are supported:

 * ```edgeLabel```: specify a label shown on the edge connecting the node to the next.


<h3 class="apimethod">.edgeToNext()</h3>
Returns the JSAV Edge object that points to the next item in the list.

<h3 class="apimethod">.addClass(className, [options])</h3>
Adds the CSS class ```className``` to the node and animates the changes.

<h3 class="apimethod">.removeClass(className, [options])</h3>
Removes the CSS class ```className``` from the node and animates the changes.

<h3 class="apimethod">.toggleClass(className, [options])</h3>
Toggles the CSS class ```className``` of the node and animates the changes.

<h3 class="apimethod">.hasClass(className, [options])</h3>
Return true/false based on if the node has the CSS class ```className```.
