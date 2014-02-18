---
layout: subpage
title: Variable API
---

Variables can be used to present undo/redo capable variables.

<h3 class="apimethod">.variable(value, [options])</h3>

This is a method of the AV object.
It creates a variable that can be associated with some UI element.
Parameter ```value``` is the
(initial) value for the variable.
Parameter ```options``` include the following:

 *  ```{before: <UI element>}``` Add the variable before element
```UI element```
 *  ```{after: <UI element>}``` Add the variable after element
```UI element```
 *  ```{visible: <boolean>}``` Determine whether the variable
is visible on creation. Defaults to false.
 *  ```{name: <string>}``` Name of the variable. Can be used to
  fetch the variable value later. 
 *  ```{label: <string>}``` Label for the variable. Will be shown
  before the variable value. For example, label "Count =" would end up the
  variable looking like "Count = 3" in the HTML.
 *  ```{type: <string>}``` Type of the variable. Can be boolean,
  number, or string. By default, the type is decided based on the type of the
  initial value.
 * ```{left/top/right/bottom: <lengthUnit>}``` Values to determine the absolute position of the label relative to its container.
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


<h3 class="apimethod">.hide()</h3>

Make the variable invisible.

<h3 class="apimethod">.show()</h3>

Make the variable visible.


<h3 class="apimethod">.value([val])</h3>

Set the value of the variable. If the ```val``` parameter is left
out, this method will return the current value of the variable. The value is
converted to the type specified when initializing the variable.


<h3 class="apimethod">.clear()</h3>
Removes the DOM element of this variable from the document. This is useful, for example, in
re-initializing exercises when the existing variable needs to be removed.

<h3 class="apimethod">.addClass(className, [options])</h3>
Adds the CSS class ```className``` to the variable and animates the changes.

<h3 class="apimethod">.removeClass(className, [options])</h3>
Removes the CSS class ```className``` from the variable and animates the changes.

<h3 class="apimethod">.toggleClass(className, [options])</h3>
Toggles the CSS class ```className``` of the variable and animates the changes.

<h3 class="apimethod">.hasClass(className, [options])</h3>
Return true/false based on if the variable has the CSS class ```className```.

