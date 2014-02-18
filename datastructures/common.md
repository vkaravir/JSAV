---
layout: subpage
title: Data Structures, Nodes, and Edges
---

## Data Structure API



## Node API

<h3 class="apimethod">.value([newValue])</h3>
Returns the value stored in this node. If the optional ```newValue``` parameter is given, the value is set to the given value.

<h3 class="apimethod">.addClass(className, [options])</h3>
Adds the CSS class ```className``` to the node and animates the changes.

<h3 class="apimethod">.removeClass(className, [options])</h3>
Removes the CSS class ```className``` from the node and animates the changes.

<h3 class="apimethod">.toggleClass(className, [options])</h3>
Toggles the CSS class ```className``` of the node and animates the changes.

<h3 class="apimethod">.hasClass(className, [options])</h3>
Return true/false based on if the node has the CSS class ```className```.


## Edge API
All edges in the structures are based on a common Edge type. They all have the functions below. Note, that you do not
 create edges in your code, they are created by the structures they are used in.

<h3 class="apimethod">.start([node])</h3>
Returns the start node of this edge. If the optional ```node``` parameter is given, sets the start node of this edge.

<h3 class="apimethod">.end([node])</h3>
Returns the end node of this edge. If the optional ```node``` parameter is given, sets the end node of this edge.

<h3 class="apimethod">.label()</h3>
Returns the label attached to this edge.

<h3 class="apimethod">.label(newLabel)</h3>
Sets the value of the label attached to this edge.

<h3 class="apimethod">.weight()</h3>
Returns the weight of this edge.

<h3 class="apimethod">.weight(newWeight)</h3>
Sets the weight of this edge.

<h3 class="apimethod">.show()</h3>
Shows this edge if it isn't visible already.

<h3 class="apimethod">.hide()</h3>
Hides this edge if it isn't hidden already.

<h3 class="apimethod">.isVisible()</h3>
Returns true if this edge is visible, false if hidden.
