---
layout: subpage
title: Graph API
---

<h3 class="apimethod">.ds.graph([options])</h3>
This function of a JSAV instance initializes an empty graph. Options that the optional parameter can specify:

 * layout: Defines the layout used, either ```manual```, ```automatic```, or ```layered```. Defaults to manual layout. Note,
    that if you use the ```layered``` layout, you will need to load [Dagre](https://github.com/cpettitt/dagre) (you can also
    find it in ```JSAV/lib/dagre.min.js```).
 * visible: Boolean to determine if initially the graph is shown or not. Default true.
 * center: Boolean to determine if graph should be automatically centered within its container. Defaults to true.
 * left/top/right/bottom: Values to determine the absolute position of the graph relative to its container.
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
 * width: Width of the graph, in pixels. Defaults to 400.
 * height: Height of the graph, in pixels. Defaults to 200.
 * directed: Whether or not this graph is directed.

The returned graph instance is modified through a collection of methods explained next. In addition, the graph has the common 
  functions such as ```.id()```, ```.css(...)```, ```.show()```, and ```.hide()```.

<h3 class="apimethod">.addNode(value, [options])</h3>
Adds a new node with ```value``` to the graph. Returns the new node.

<h3 class="apimethod">.removeNode(node, [options])</h3>
Removes the given ```node```.

<h3 class="apimethod">.addEdge(fromNode, toNode, [options])</h3>
Adds edge from ```fromNode``` to ```toNode```. Returns the new edge.
  Supported options:

 * weight: the weight of the new edge

<h3 class="apimethod">.removeEdge(fromNode, toNode, [options])</h3>
Removes edge from ```fromNode``` to ```toNode```.

<h3 class="apimethod">.removeEdge(edge, [options])</h3>
Removes the given ```edge```.

<h3 class="apimethod">.hasEdge(fromNode, toNode)</h3>
Returns true if the graph has an edge from ```fromNode``` to ```toNode```.

<h3 class="apimethod">.getEdge(fromNode, toNode)</h3>
Returns the Edge object connecting ```fromNode``` and ```toNode```, or ```undefined``` if no such edge exists.

<h3 class="apimethod">.nodes()</h3>
Returns an iterable array of nodes in the graph. The returned structure can be used as a normal JavaScript array. In addition, 
  it has methods ```.next()```, ```.hasNext()```, and ```.reset()``` for iterating over the values.

<h3 class="apimethod">.nodeCount()</h3>
Returns the number of nodes in the graph.

<h3 class="apimethod">.edges()</h3>
Returns an iterable array of edges in the graph. The returned structure is similar to the one returned by ```.nodes()```.

<h3 class="apimethod">.edgeCount()</h3>
Returns the number of edges in the graph.

<h3 class="apimethod">.clear()</h3>
Removes the DOM element of this structure from the document. This is useful, for example, in 
  re-initializing exercises when the existing structure needs to be removed. 

<h3 class="apimethod">.layout()</h3>
This function (re)calculates the layout for the graph. Note, that the library does not do this automatically. That means that after changing the graph, you should call this manually at the end of each animation step.


<h3 class="apitopic">Events</h3>
There are functions to attach event handlers for the nodes and edges in the graph. The events 
  that can be listened for are: click, dblclick, mousedown, mousemove, mouseup, mouseenter, and mouseleave.
  See the tree documentation for details.


<h2>Graph Node API</h2>
A node in a graph has the same functions as a tree node: ```.value([newValue])```, ```.highlight()/unhighlight()```, ```.show()/.hide()```, and ```.css(...)```. In addition, it has the following functions.

<h3 class="apimethod">.neighbors()</h3>
Returns an iterable array of the nodes that this node is connected to.

<h3 class="apimethod">.edgeTo(node)</h3>
Returns the Edge object connecting this node to the given ```node```. Returns ```undefined``` if no such edge exists.

<h3 class="apimethod">.edgeFrom(node)</h3>
Returns the Edge object connecting the given ```node``` to this node. Returns ```undefined``` if no such edge exists.
