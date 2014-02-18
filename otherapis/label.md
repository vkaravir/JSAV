---
layout: subpage
title: Label API
---

The label API can be used to add text elements into the visualization.

<h3 class="apimethod">.label(msg, options)</h3>

This is a method of the JSAV object.
It creates a label that is associated with some UI element of the AV
specified by the options.
Parameter ```msg``` is the
(initial) value for the label.
Parameter ```options``` include the following:

 *  ```{before: <UI element>}``` Set the label before element
```UI element```
 *  ```{after: <UI element>}``` Set the label after element
```UI element```
 *  ```{visible: <boolean>}``` Determine whether the label
is visible on creation. Defaults to true.
 * ```{left/top/right/bottom: <lengthUnit>}``` Values to determine the absolute position of the label relative to its container.

<h3 class="apimethod">.hide()</h3>
Make the label invisible.


<h3 class="apimethod">.show()</h3>
Make the label visible.

<h3 class="apimethod">.text(msg)</h3>

Set the text for the label. If the ```msg``` parameter is left
out, this method will return the current text of the label.


<h3 class="apimethod">.clear()</h3>
Removes the DOM element of this label from the document. This is useful, for example, in 
  re-initializing exercises when the existing label needs to be removed. 

<h3 class="apimethod">.addClass(className, [options])</h3>
Adds the CSS class ```className``` to the label and animates the changes.

<h3 class="apimethod">.removeClass(className, [options])</h3>
Removes the CSS class ```className``` from the label and animates the changes.

<h3 class="apimethod">.toggleClass(className, [options])</h3>
Toggles the CSS class ```className``` of the label and animates the changes.

<h3 class="apimethod">.hasClass(className, [options])</h3>
Return true/false based on if the label has the CSS class ```className```.
