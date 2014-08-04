---
layout: subpage
title: Array API
---


<h3 class="apimethod">.ds.array(element[, options]) and
.ds.array(Array[, options])</h3>

An array can be created using the .ds.array method on a JSAV instance.
It takes one parameter indicating either a DOM/jQuery Element
(ul or ol) or a JavaScript Array.
For example, to initialize and add to the visualization an array with
four elements, the following code creates an array like the one below.

{% highlight javascript %}var arr = av.ds.array([10, 13, 99, 25]);{% endhighlight %}

<div id="arrayCreation" class="jsavexample"></div>
<script>
(function() {
  var jsav = new JSAV("arrayCreation");
  jsav.ds.array([10, 13, 99, 25]);
}());
</script>

Array indexing begins at zero.


The returned array instance is controlled through a collection of
methods explained next. Note that changes to the array contents must
go through this API (using the ```.value``` method),
since the array contents must be managed by
JSAV rather than by the developer.


Options that the second, optional, parameter can specify:


 * layout: Defines choices of layout (```bar``` for bars, ```vertical``` to show the array vertically, the
      default is to show a horizontal array).
 * indexed: Boolean to determine if array indices are shown or not. Defaults to false.
 * visible: Boolean to determine if initially the array is shown or
        not. Default true.
 * center: Boolean to determine if array should be automatically centered
    within its container. Defaults to true.
 * left/top/right/bottom: Values to determine the absolute position of the array relative to its container.
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

<h3 class="apimethod">.clone()</h3>

Create and return a clone of an array.
The clone will remain invisible until the ```show```
method is called on it.


<h3 class="apimethod">.css(indices, cssPropertyName)</h3>
Returns the value of CSS property ```cssPropertyName``` for the first
  index matching the ```indices``` parameter. Parameter ```indices```
  can be a number, array, ```true```, or function like for
  the ```highlight``` method.


<h3 class="apimethod">.css(indices, css)</h3>

Apply the given CSS properties to the specified ```indices```.
Parameter ```indices``` can be a number, array,
```true```, or function like for the ```highlight```
method.
When ```indices``` is ```true```, then ```css```
is applied to all elements of the array.
The argument ```css``` should be an object with property
name-and-value pairs.
For example, to make positions 0 and 4 have green color and lightgray
background:


{% highlight javascript %}
arr.css([0, 4], {"color": "green", "background-color": "#eee"});
{% endhighlight %}


**Returns:** a JSAV array object. Thus, this method can be chained.


<h3 class="apimethod">.css(cssPropertyName)</h3>
Returns the value of CSS property ```cssPropertyName``` for the array.

<h3 class="apimethod">.css(css)</h3>

Apply the given CSS properties to the array element.
The argument ```css``` should be an object with property
name-and-value pairs. For example, to move the array 20 pixels to the right:


{% highlight javascript %}
arr.css({"left": "+=20px"});
{% endhighlight %}

<h3 class="apimethod">.hide()</h3>

Make the array invisible.


<h3 class="apimethod">.highlight()</h3>

Call to ```highlight``` without any parameters will highlight
all elements in the array.
Note that this will only apply the color and background-color of CSS class
```jsavhighlight``` to the array elements.
It is up to the author to make sure the loaded CSS files include such
styling.



**Returns:** a JSAV array object. Thus, this method can be chained.


<h3 class="apimethod">.highlight(number)</h3>
Highlight the given index number.

<h3 class="apimethod">.highlight(indexlist)</h3>
Highlight the indices in the given ```indexlist```.
For example, the following would highlight array positions 1, 2, and 5.

{% highlight javascript %}arr.highlight([1, 2, 5]);{% endhighlight %}

<h3 class="apimethod">.highlight(function)</h3>
Highlights all the indices that the passed function returns true.
For example, to highlight all even indices:

{% highlight javascript %}arr.highlight(function(index) { return index%2==0; });{% endhighlight %}

<h3 class="apimethod">.highlight(boolean)</h3>

If the given boolean value is ```true```, all the indices are highlighted.
If ```false```, none are.
For example, to highlight all indices:

{% highlight javascript %}arr.highlight(true);{% endhighlight %}


<h3 class="apimethod">.unhighlight(indices)</h3>
Removes the highlight from the given ```indices```.
There are corresponding versions of this function with parameters like
for highlight.

**Returns:** a JSAV array object. Thus, this method can be chained.

<h3 class="apimethod">.ishighlight(number)</h3>
Returns true or false depending on whether the element at index ```number``` is highlighted or not.

<h3 class="apimethod">.show()</h3>
Make the array visible.

<h3 class="apimethod">.size()</h3>
Returns the size of the array.
For the array defined in the array creation example above,
the following would return 4:

{% highlight javascript %}arr.size();{% endhighlight %}

<h3 class="apimethod">.swap(index1, index2, [options])</h3>
Swaps the values of the two array positions. Options supported:

 * ```arrow```: A boolean specifying whether to show an arrow below the array to indicate the swapped indices.
   Defaults to true. If Rapha&euml;l.js is not loaded, no arrow will be shown.
 * ```swapClasses```: A boolean specifying whether to swap the classes of the array indices as well. Defaults to false.
 * ```highlight```: A boolean indicating whether the swapped elements should be highlighted. The highlight is
   adding the class ```jsavswap``` which, by default, sets the background color to red. Defaults to true.

<h3 class="apimethod">.value(index)</h3>
Returns the value of the element at the given index.

<h3 class="apimethod">.value(index, newValue)</h3>
Sets the value of the element at the given index to the given value.

<h3 class="apimethod">.toggleLine(index, [options])</h3>
Toggles a marker line above a given array index for bar layout. For other layouts, does nothing. Options that can be passed:


 * ```markStyle```: Style of the "ball" as an object of CSS property/value pairs. Default style is first applied, then the given style. Passing ```null``` will disable the ball altogether.
 * ```lineStyle```: Style of the line. Works similarly to ```markStyle```.
 * ```startIndex```: Index in the array where the line will start. Default 0.
 * ```endIndex```: Index in the array where the line will end, inclusive. Defaults to last index of the array.


<h3 class="apimethod">.isEmpty()</h3>
Returns true if the array is empty.

<h3 class="apimethod">.addClass(index, className, [options])</h3>
Adds the CSS class ```className``` to given indices and animates the changes. Like for
  the rest of array methods, ```index``` can be a number, array of numbers, or a function.

<h3 class="apimethod">.removeClass(index, className, [options])</h3>
Removes the CSS class ```className``` to given indices and animates the changes. Like for
  the rest of array methods, ```index``` can be a number, array of numbers, or a function.

<h3 class="apimethod">.toggleClass(index, className, [options])</h3>
Toggles the CSS class ```className``` to given indices and animates the changes. Like for
  the rest of array methods, ```index``` can be a number, array of numbers, or a function.

<h3 class="apimethod">.hasClass(index, className, [options])</h3>
Return true/false based on if the given index has the CSS class ```className```. Parameter
  ```index``` should be a number.

<h3 class="apimethod">.index(index)</h3>
Returns an ArrayIndex object correcponding to the array index at the given position. The ArrayIndex object
has all the functions JSAV node objects have, like ```.css```, ```.toggle/add/remove/hasClass```,
and ```.highlight```.

## Events
The array has functions to attach event handlers for the array elements. The events that can be
  listened for are: click, dblclick, mousedown, mousemove, mouseup, mouseenter, and mouseleave.
  See <a href="http://api.jquery.com/category/events/">jQuery documentation</a> for details on
  the events. Every event handler gets as a first parameter the index of the array element that
  the event was triggered for. The last parameter is the jQuery event object. Inside the event
  handler function, ```this``` will refer to the JSAV array object. 

**Returns:** a JSAV array object. Thus, this method can be chained.

Example to toggle arrow on click of an element:

{% highlight javascript %}
arr.click(function(index) {
  this.toggleArrow(index);
});
{% endhighlight %}

Since many of the JSAV array functions take the index as the first parameter, they can be used
as event handlers. For example, to highlight an index on mouseenter and unhighlight on mouseleave,
you can use:

{% highlight javascript %}
arr.mouseenter(arr.highlight)
   .mouseleave(arr.unhighlight);
{% endhighlight %}

You can also pass custom arguments to the event handler function. To do this, the first argument
to the event binding function should be an array of parameters that will be passed as parameters to
the event handler function. This is best explained with an example:

{% highlight javascript %}
arr.mouseenter([{"color": "red"}], arr.css)
   .mouseleave([{"color": "black"}], arr.css);
{% endhighlight %}

This will use array's ```css``` function as the event handler and pass it another parameter
when the event is triggered. On mouse enter, the function call will essentially be:
```arr(index, {"color": "red"}, e)```. Here, ```e``` is again the jQuery event object.

You can try the result by moving your cursor in to and out of the indices in the interactive example below.

<div id="jsavMouseEvents" class="jsavexample"></div>
<script>
(function() {
  var jsav = new JSAV("jsavMouseEvents", {animationMode: "none"}),
      arr = jsav.ds.array([6, 5, 4, 3, 2, 1]);
  arr.mouseenter([{"color": "red"}], arr.css)
     .mouseleave([{"color": "black"}], arr.css);
}());
</script>


<h3 class="apimethod">.on(eventName, [data,], handler)</h3>
To bind other events than the ones listed above, you can use the ```on``` function. It takes
  as the first parameter the name of the event. Multiple events can be bound by separating their names with
  spaces. Other parameters are the same as for the shortcuts.

## CSS control
There are various options and style effects that can be controlled via
CSS.

<h3 class="apimethod">width and height</h3>
By default, array elements are at minimum 45 pixels wide and will automatically expand if the content
  is wider than that. Width and height can be controlled with
  the ```width```/```height``` CSS properties. Example:

{% highlight css %}
.jsavarray .jsavindex {
  width: 60px;
}
{% endhighlight %}

Width and height will only produce a change if they fall within the
range defined by ```min-width``` to ```max-width```
and ```min-height``` to ```max-height```, respectively.
Note, that JSAV has specified ```min-width``` for array indices to be 45 pixels. If you want to
  make the indices smaller than that, you will also need to specify the ```min-width``` property. For
  example, to make indices 20px wide:

{% highlight css %}
.jsavarray .jsavindex {
  width: 20px;
  min-width: 20px;
}
{% endhighlight %}

If you change the height of array elements, you should probably also change the line-height of the text inside. Example:

{% highlight css %}
.jsavarray .jsavindex {
  height: 20px;
  min-height: 20px;
  line-height: 20px
}
{% endhighlight %}

