---
layout: subpage
title: Utility Functions
---

The module ```JSAV.utils``` includes some utility functions
for working with HTML pages and visualizations.

<h3 class="apimethod">JSAV.utils.getQueryParameter()</h3>
Returns an object containing all query parameters given for the HTML
page. If no parameters exist, returns an empty object.

<h3 class="apimethod">JSAV.utils.getQueryParameter(name)</h3>
Returns the value of the query parameter ```name```. If no such
parameter exists, return ```undefined```

<h3 class="apimethod">JSAV.utils.rand.numKey(min, max)</h3>
Returns a random integer number between ```min``` (inclusive) and
```max``` (exclusive).

<h3 class="apimethod">JSAV.utils.rand.numKeys(min, max, num[, opts])</h3>
Returns an array of ```num``` random integer numbers between 
```min``` (inclusive) and ```max``` (exclusive). Optional
parameter ```opts``` is an object that can specify options:

 * ```sorted``` If set to true, the array will be sorted.
 * ```sortfunc``` If sorted is set to true, this option can
  be used to specify a function for sorting.
 * ```test``` A function that takes the random array as a
  parameter and returns ```true/false``` indicating whether it
  fullfills some requirements. If it returns false, a new random array is
  generated. This is typically used with exercises to randomize and
  test the initial data.
 * ```tries``` If ```test``` function is provided, this
  option specifies how many data sets are tested. If none of the first
  tries data sets pass the tests, the last one is returned.
  

<h3 class="apimethod">JSAV.utils.rand.sample(arrayCollection, num[, opts])</h3>
Returns an array of ```num``` elements randomly picked from the
given array ```arrayCollection```. The optional parameter
```opts``` can specify options ```test``` and ```tries```
like for the ```numKeys``` function.

<h3 class="apimethod">JSAV.utils.dialog(html, options)</h3>
Shows a pop-up dialog with the given HTML as content. Returns an object
with function ```close()``` that can be used to close the dialog.
Options can include:

 * modal: whether the dialog is modal (default true)
 * width (and min/maxWidth): control the width of the dialog
 * height (and min/maxHeight): control the height of the dialog
 * closeText: if specified, a button with this text to close the dialog
  will be added
 * dialogClass: custom CSS classes to be added to the created component.
  Class ```jsavdialog``` is always added.
 * title: title of the dialog

