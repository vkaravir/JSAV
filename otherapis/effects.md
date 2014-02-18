---
layout: subpage
title: Animation Effects 
---

The module ```.effects``` offers some useful animation effects for
  AV developers.

<h3 class="apimethod">.moveValue(...)</h3>
Method ```.moveValue``` animates *moving* of a value from one structure
  to another. Structure can be an array or a tree/list node. The following parameter
  combinations are valid:

 * ```.moveValue(fromArray, fromIndex, toArray, toIndex)``` Moves
    value at ```fromIndex``` in ```fromArray``` to ```toIndex```
    in ```toArray```. The value in ```fromIndex``` will be an empty
    string after this operation.
 * ```.moveValue(fromArray, fromIndex, toNode)``` Moves
    value at ```fromIndex``` in ```fromArray``` to ```toNode```. 
    The value in ```fromIndex``` will be an empty
    string after this operation.
 * ```.moveValue(fromNode, toArray, toIndex)``` Moves
    value in ```fromNode``` to ```toIndex```
    in ```toArray```. The value in ```fromNode``` will be an empty
    string after this operation.
 * ```.moveValue(fromNode, toNode)``` Moves value in ```fromNode```
    to ```toNode```. The value in ```fromNode``` will be an empty
    string after this operation.


In addition, ```fromNode``` and ```toNode``` can be an instance of
  ```jsav.variable```.

<strong>Note:</strong> both from and to structures can be the same structure.

<h3 class="apimethod">.copyValue(...)</h3>
Method that animates *copying* a value from one structure to another. The same
  parameter combinations are valid as for the ```.moveValue``` method. The only
  difference is that the source value is not removed.

<h3 class="apimethod">.swapValues(...)</h3>
Method that animates *swapping* a value from one structure with another. The same
  parameter combinations are valid as for the ```.moveValue``` method.
