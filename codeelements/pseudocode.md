---
layout: subpage
title: Pseudocode API
---

The pseudocode API in JSAV is intended for showing a static set of codelines that can be show/hidden and
  highlighted. There are two ways to initialize a pseudocode object in JSAV:

<h3 class="apimethod">.code(codelines[, options]) or .code([options])</h3>

Both of these are functions of a JSAV object instance. The first version takes either an array or a string 
  to be used as the lines of code. If a string is passed, it will be split on newline characters (```\n```)
  to get the codelines.

The options that can be specified:

 *  ```{url: <string>}``` A URL where the code should be fetched. The fetched text will be split on
    newline characters (```\n```). Note, that if the codelines parameter is given, this option is ignored. Also, same-origin
    policies in browsers might prevent this from working across domains.
 *  ```{tags: <object>}``` Enables referring to lines with strings. The JavaScript object should map strings to either line numbers or arrays of line numbers. For instance if the tags are defined with the object ```{hello: 5}``` it means that ```.highlight("hello")``` will be equivalent to ```.highlight(5)```.
 *  ```{lineNumbers: <boolean>}``` Determine whether linenumbers should be shown. Defaults to true. 
 *  ```{visible: <boolean>}``` Determine whether the pseudocode is visible on creation. Defaults to true.
 *  ```{before: <UI element>}``` Add the pseudocode before element ```UI element```
 *  ```{after: <UI element>}``` Add the pseudocode after element ```UI element```
 *  ```{center: <boolean>}``` Boolean to determine if array should be automatically centered
within its container. Defaults to true.
 *  ```{startAfter: <string>}``` Only the content after the last occurrence of the specified text will be included. Only
    applied if the ```url``` parameter is also provided.
 *  ```{endBefore: <string>}``` Only the content before the first occurrence of the specified text will be included. Only
    applied if the ```url``` parameter is also provided.
 * left/top/right/bottom: Values to determine the absolute position of the codelines relative to its container.
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

Pseudocode objects have the following functions.

<h3 class="apimethod">.highlight(indices) and .unhighlight(indices)</h3>

Highlight and unhighlight the codelines at given indices. Lines are numbered from 0, so first line could be highlighted with:

    pseudo.highlight(0)

Similarly to the array (un)highlight, the ```indices``` parameter can be either a number, an array of numbers, a function or a tag (see tags in options).

<h3 class="apimethod">.show() and .hide()</h3>

Show/hide the pseudocode object.

<h3 class="apimethod">.show(indices) and .hide(indices)</h3>

Show/hide the codelines at given indices. Again, indices can be a number, an array of numbers, a function or a tag.

<h3 class="apimethod">.css(indices, css)</h3>

Apply the given CSS properties to the codelines at specified ```indices```.
  Parameter ```indices``` can be a number, array, function or a tag like for 
  the ```highlight``` method.
  The argument ```css``` should be an object with property name-and-value pairs. For example, to make
  lines 0 and 4 have green color and lightgray background:

    pseudo.css([0, 4], {"color": "green", "background-color": "#eee"});

<h3 class="apimethod">.setCurrentLine(index)</h3>

Sets the line at given ```index``` as the current line. Also, if another line was previously set as current, it will be
  marked as previous. If a line was also earlier marked as previous, that mark will be removed. This will help in creating a 
  visual debugger-like code stepping functionality in visualizations.

<h3 class="apimethod">.clear()</h3>

Removes the DOM element of this object from the document. This is useful, for example, in 
re-initializing exercises when the existing object needs to be removed. 

<h3 class="apimethod">.addClass(indices, className, [options])</h3>

Adds the CSS class ```className``` to lines at given indices and animates the changes. Like for
  the rest of pseudocode methods, ```indices``` can be a number, array of numbers, a function or a tag.

<h3 class="apimethod">.removeClass(indices, className, [options])</h3>

Removes the CSS class ```className``` from lines at given indices and animates the changes. Like for
  the rest of pseudocode methods, ```indices``` can be a number, array of numbers, a function or a tag.

<h3 class="apimethod">.toggleClass(indices, className, [options])</h3>

Toggles the CSS class ```className``` of lines at  given indices and animates the changes. Like for
  the rest of pseudocode methods, ```indices``` can be a number, array of numbers, a function or a tag.

<h3 class="apimethod">.hasClass(index, className, [options])</h3>

Return true/false based on if the line at given index has the CSS class ```className```. Parameter
  ```index``` should be a number or a tag to a number.
