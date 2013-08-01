#Documentation for the JavaScript Algorithm Visualization API (JSAV) Version 0.7dev

<p class="note">
This documentation reflects the current status of the library.
It is a work-in-progress and subject to change!
</p>
#Contents
<ol id="toc"></ol>
##Loading the Required Files

The easiest way to check the required files is to look at
the examples directory and copy one of those files as a template for
your new AV.
 


If done manually, the files required (in this order) are as follows.
Note that `[JSAV]` refers to the relative position of the
JSAV library directory, which depends on where you are developing from.
 


* jquery.transform: `[JSAV]/lib/jquery.transform.light.js`
* Raphael: `[JSAV]/lib/raphael.js`
* The library: Either `[JSAV]/build/jsav.js` or
      `[JSAV]/build/jsav-min.js`.
      This must always be included.




The main jQuery library must always be loaded.
jQuery UI and jquery.transform are only needed when you use the
library to show animations, such as using the data structures or
graphical primitives and modifying them. In other words, using
any other part of the library than the messaging API. Raphael is
only needed when using graphical primitives like circles and
rectangles or when using data structures with edges.



In addition, developers must include the supporting .css file:
`[JSAV]/css/JSAV.css`


##HTML Template for the Visualization


Visualizations generally include two parts:
HTML DOM elements, and JavaScript elements. 
The HTML section typical includes something like this:


    <div id="container">
      <div class="jsavcontrols"></div>
      <p class="jsavoutput jsavline"></p>
    </div>


`container`  
This is the container element for the visualization  
`jsavcontrols`  
The library will generate slideshow controls inside this
element if your visualization uses the slideshow API  
`jsavoutput`  
The area where the messages from the
visualization will be displayed to the user.
Type can further be specified using either
class `jsavline` or `jsavscroll`.
See the Messages API for more details.


If you want a finer control on where inside the JSAV container the
data structures are added, you can also add
`<div class="jsavcanvas"></div>`. Then, all DOM
elements created by JSAV will be added inside this element.

##Creating A Visualization
Initializing the visualization container is simple:  

    var av = new JSAV("container");

The `container` here refers to the id attribute of the
container element (see the HTML template above).
Alternatively, a DOM or jQuery element can be
used as well. So, the following are alternative ways to achieve
the same result:

    var av = new JSAV(document.getElementById("container"));
    var av = new JSAV(jQuery("#container"));

Both alternatives accept an optional second parameter `options` 
which should be a JavaScript object. The options that are currently 
supported:

`title`  
Title of the AV. This will be shown as the first slide of the
slideshow.

`animationMode`  
Use "none" to turn off animation (slideshow) mode.

In addition to the options passed to the function, any options specified
in a global variable `JSAV_OPTIONS` will be used. Those passed on
initialization always override the global options.
    
##Slideshow Support

A slideshow is created by using a series of calls to the
`.step()` method.
Associated with each step, you use method calls to define or show
the appropriate data structures and UI elements along with any
actions to take place (such as swapping elements in an array or
highlighting an element).

<h3 class="apimethod">.step()</h3>
Marks that a new step in the animation will start. Basically,
everything within one step will be animated simultaneously when
moving backward and forward.


**Returns:** A JSAV object. Thus, this method may be chained with,
for example, the `umsg` method.


<h3 class="apimethod">.recorded()</h3>

A call to this method is placed at the end of the series of
`.step()` method calls to start the slideshow.


<h3 class="apimethod">.displayInit()</h3>
Marks the current state of the visualization as the state where the 
animation will start. That is, what will be displayed initially.

**Returns:** A JSAV object. Thus, this method may be chained.
  

<h3 class="apimethod">.animInfo()</h3>

This will return an object that has two properties: number of slides
and and number of effects.
It might be better used when called from somewhere like the FireBug
command line than in an actual AV implementation.
It can help a developer to optimize the complexity of the slideshow.

###The `counter` element

A slideshow counter showing the position in slideshow (e.g. 2/120) can
be added by including a DOM element with class `jsavcounter`
inside the `container`.
For example, you can add
`<span class="jsavcounter"></span>` to some DOM element
to attach the counter.


###Controlling Animation Outside of JSAV
Sometimes you might want to control a JSAV animation from JavaScript 
 and not through the JSAV generated UI. There are two ways to do this:

1. A JSAV instance has functions `.begin()`, `.backward()`,
    `.forward()` and `.end()` that can be called to move in
    the animation.
2. You can trigger events on the `container` element to have
    JSAV move in the animation. The events are: `jsav-begin`,
    `jsav-backward`, `jsav-forward`, and
    `jsav-end`. For example, to move a step forward in the animation, 
    one could write `$(".jsavcontainer").trigger("jsav-forward")`.
    Note, that this example moves _all_ JSAV animations on the page one
    step forward.

##Messages API


The Messages API allows the user to control the contents of the output
message buffer intended for informing the user about the state of the
visualization or for providing directions.


The output buffer will have been specified in the HTML section of the
document. It is defined as an empty paragraph of class
`jsavoutput`, with one of the following class options.


`class="jsavoutput jsavline"` indicates a small "line-style"
message buffer where typically each line overwrites the previous one.


`class="jsavoutput jsavscroll"` indicates a visible textbox with a
scrollbar. The textbox is only cleared when explicitly directed by a
`.clearumsg()` call.
Since this acts as a normal HTML paragraph,
optional standard parameters can be used such as
`readonly="readonly"` to make 
the textbox unwriteable by the user, or to
override the default height and width.


<h3 class="apimethod">.umsg(msg[, options])</h3>

Add the given message `msg` to the message
output. The optional `options` parameter
can be an object whose properties specify the
behavior. The `color` property is used (when
present) to change the color of the message.
Use would look something like:


    av.umsg("My message here", {"color": "blue"});


When "line-style" message buffer is used, option
`"preserve": true` can be used to append the new message
after the previous one instead of clearing the buffer.


Since the
`msg` is output as standard HTML, the style of
the message text can also be controlled by using HTML commands.


**Returns:** A JSAV object. Thus, this method may be chained with,
for example, the `step` method.

<h3 class="apimethod">.clearumsg()</h3>
Clear the contents of the output message buffer.

##Array Data Structure API


JSAV will ultimately provide layout support for a number of standard
data structures. Presently, arrays, trees, lists, and graphs are supported.


<h3 class="apimethod">.ds.array(element[, options]) and
.ds.array(Array[, options])</h3>

An array can be created using the .ds.array method on a JSAV instance.
It takes one parameter indicating either a DOM/jQuery Element
(ul or ol) or a JavaScript Array.
For example, to initialize and add to the visualization an array with
four elements:

    var arr = av.ds.array([10, 13, 99, 25]);

Array indexing begins at zero.


The returned array instance is controlled through a collection of
methods explained next. Note that changes to the array contents must
go through this API (using the `.value` method),
since the array contents must be managed by
JSAV rather than by the developer.


Options that the second, optional, parameter can specify:

* layout: Defines choices of layout (`bar` for bars, `vertical` to show the array vertically, the
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
      format `horizontal vertical`. Possible horizontal values are "left", "center", "right" and vertical values "top", "center", "bottom". Defaults to `center center`. Only has an effect if relativeTo is
      specified.
* myAnchor: Similar to anchor, but the position on this element. Defaults to `center center`. Only 
      has an effect if relativeTo is specified.
* relativeIndex: If relativeTo points to a JSAV array, this option can be used to position this structure relative
  to an index in that array. Only has an effect if relativeTo is specified.


<h3 class="apimethod">.clear()</h3>
Removes the DOM element of this structure from the document. This is useful, for example, in 
re-initializing exercises when the existing structure needs to be removed. 

<h3 class="apimethod">.clone()</h3>

Create and return a clone of an array.
The clone will remain invisible until the `show`
method is called on it.


<h3 class="apimethod">.css(indices, cssPropertyName)</h3>
Returns the value of CSS property `cssPropertyName` for the first 
index matching the `indices` parameter. Parameter `indices` 
can be a number, array, `true`, or function like for
the `highlight` method.


<h3 class="apimethod">.css(indices, css)</h3>

Apply the given CSS properties to the specified `indices`.
Parameter `indices` can be a number, array,
`true`, or function like for the `highlight`
method.
When `indices` is `true`, then `css`
is applied to all elements of the array.
The argument `css` should be an object with property
name-and-value pairs.
For example, to make positions 0 and 4 have green color and lightgray
background:


    arr.css([0, 4], {"color": "green", "background-color": "#eee"});



**Returns:** a JSAV array object. Thus, this method can be chained.


<h3 class="apimethod">.css(cssPropertyName)</h3>
Returns the value of CSS property `cssPropertyName` for the array.

<h3 class="apimethod">.css(css)</h3>

Apply the given CSS properties to the array element.
The argument `css` should be an object with property
name-and-value pairs. For example, to move the array 20 pixels to the right:


    arr.css({"left": "+=20px"});


<h3 class="apimethod">.hide()</h3>

Make the array invisible.


<h3 class="apimethod">.highlight()</h3>

Call to `highlight` without any parameters will highlight
all elements in the array.
Note that this will only apply the color and background-color of CSS class 
`jsavhighlight` to the array elements.
It is up to the author to make sure the loaded CSS files include such
styling.



**Returns:** a JSAV array object. Thus, this method can be chained.


<h3 class="apimethod">.highlight(number)</h3>

Highlight the given index number.


<h3 class="apimethod">.highlight(indexlist)</h3>

Highlight the indices in the given `indexlist`.
For example, the following would highlight array positions 1, 2, and 5.

    arr.highlight([1, 2, 5]);

<h3 class="apimethod">.highlight(function)</h3>

Highlights all the indices that the passed function returns true.
For example, to highlight all even indices: 

    arr.highlight(function(index) { return index%2==0; });

<h3 class="apimethod">.highlight(boolean)</h3>

If the given boolean value is `true`, all the indices are highlighted. 
If `false`, none are.
For example, to highlight all indices: 

    arr.highlight(true);

<h3 class="apimethod">.show()</h3>

Make the array visible.


<h3 class="apimethod">.size()</h3>

Returns the size of the array.
For the array defined in the array creation example above,
the following would return 4:

    arr.size();
    
<h3 class="apimethod">.swap(index1, index2)</h3>
Swaps the contents (and graphics state) of the two array positions.
    
<h3 class="apimethod">.unhighlight(indices)</h3>

Removes the highlight from the given `indices`.
There are corresponding versions of this function with parameters like
for highlight.


**Returns:** a JSAV array object. Thus, this method can be chained.


<h3 class="apimethod">.value(index)</h3>
Returns the value of the element at the given index.
    
<h3 class="apimethod">.value(index, newValue)</h3>

Sets the value of the element at the given index to the given value.


<h3 class="apimethod">.toggleLine(index, [options])</h3>
Toggles a marker line above a given array index for bar layout. For other layouts, does nothing. Options that can be passed:

* `markStyle`: Style of the "ball" as an object of CSS property/value pairs. Default style is first applied, then the given style. Passing `null` will disable the ball altogether.
* `lineStyle`: Style of the line. Works similarly to `markStyle`.
* `startIndex`: Index in the array where the line will start. Default 0.
* `endIndex`: Index in the array where the line will end, inclusive. Defaults to last index of the array.

<h3 class="apimethod">.isEmpty()</h3>
Returns true if the array is empty.
<h3 class="apimethod">.addClass(index, className, [options])</h3>
Adds the CSS class `className` to given indices and animates the changes. Like for
the rest of array methods, `index` can be a number, array of numbers, or a function.
<h3 class="apimethod">.removeClass(index, className, [options])</h3>
Removes the CSS class `className` to given indices and animates the changes. Like for
the rest of array methods, `index` can be a number, array of numbers, or a function.
<h3 class="apimethod">.toggleClass(index, className, [options])</h3>
Toggles the CSS class `className` to given indices and animates the changes. Like for
the rest of array methods, `index` can be a number, array of numbers, or a function.
<h3 class="apimethod">.hasClass(index, className, [options])</h3>
Return true/false based on if the given index has the CSS class `className`. Parameter
`index` should be a number.

<h3 class="apitopic">Events</h3>
There are functions to attach event handlers for the array elements. The events that can be
listened for are: click, dblclick, mousedown, mousemove, mouseup, mouseenter, and mouseleave. 
See [jQuery documentation](http://api.jquery.com/category/events/) for details on 
the events. Every event handler gets as a first parameter the index of the array element that
the event was triggered for. The last parameter is the jQuery event object. Inside the event
handler function, `this` will refer to the JSAV array object. 

**Returns:** a JSAV array object. Thus, this method can be chained.

Example to toggle arrow on click of an element:

    arr.click(function(index) {
      this.toggleArrow(index);
    });

Since many of the JSAV array functions take the index as the first parameter, they can be used
as event handlers. For example, to highlight an index on mouseenter and unhighlight on mouseleave,
you can use:

    arr.mouseenter(arr.highlight).mouseleave(arr.unhighlight);

You can also pass custom arguments to the event handler function. To do this, the first argument
to the event binding function should be an array of parameters that will be passed as parameters to
the event handler function. This is best explained with an example:
  
    arr.mouseenter([{"color": "red"}], arr.css).mouseleave([{"color": "black"}], arr.css);

This will use array's `css` function as the event handler and pass it another parameter
when the event is triggered. On mouse enter, the function call will essentially be: 
`arr(index, {"color": "red"}, e)`. Here, `e` is again the jQuery event object.
<h3 class="apimethod">.on(eventName, [data,], handler)</h3>
To bind other events than the ones listed above, you can use the `on` function. It takes
  as the first parameter the name of the event. Multiple events can be bound by separating their names with
  spaces. Other parameters are the same as for the shortcuts.

<h3 class="apitopic">CSS control</h3>

There are various options and style effects that can be controlled via
CSS.

<h3 class="apimethod">width and height</h3>

By default, array elements are at minimum 45 pixels wide and will automatically expand if the content
is wider than that. Width and height can be controlled with
the `width`/`height` CSS properties. Example:


    .jsavarray .jsavindex {
      width: 60px;
    }

Width and height will only produce a change if they fall within the
range defined by `min-width` to `max-width`
and `min-height` to `max-height`, respectively.
Note, that JSAV has specified `min-width` for array indices to be 45 pixels. If you want to
make the indices smaller than that, you will also need to specify the `min-width` property. For 
example, to make indices 20px wide:

    .jsavarray .jsavindex {
      width: 20px;
      min-width: 20px;
    }

If you change the height of array elements, you should probably also change the line-height of the text inside. Example:

    .jsavarray .jsavindex {
      height: 20px;
      min-height: 20px;
      line-height: 20px
    }


<h3 class="apitopic">Extending the Array</h3>
<p class="todo">
Example of extending to provide .opacity(indices, value) function as a
shortcut to set the opacity of indices.
</p> 



##Tree Data Structure API


Currently, JSAV supports two types of trees: common tree and binary tree. The structures form a "class" hierarchy: Tree &larr; Binary Tree and TreeNode &larr; BinaryTreeNode.


<h3 class="apimethod">.ds.tree([options]) and .ds.bintree([options])</h3>
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
  format `horizontal vertical`. Possible horizontal values are "left", "center", "right" and vertical values "top", "center", "bottom". Defaults to `center center`. Only has an effect if relativeTo is
  specified.
* myAnchor: Similar to anchor, but the position on this element. Defaults to `center center`. Only 
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
Returns the ID of the structure. If optional parameter `newId` is given, sets the ID of the structure. The given ID should be unique. This function exists for all trees, nodes, and edges.

<h3 class="apimethod">.root([node])</h3>
Returns the root of this tree. If the optional `node` parameter is given, the root of the tree is set. This function exists for all trees.

<h3 class="apimethod">.newNode(value)</h3>
Creates a new node that can be added to this tree. "Subclasses" override this to create nodes suited for the tree, so this method should be used when creating new nodes. This function exists for all trees.

<h3 class="apimethod">.height()</h3>
Returns the height of the tree. This function exists for all trees

<h3 class="apimethod">.layout()</h3>
This function (re)calculates the layout for the tree. Note, that the library does not do this automatically. That means that after changing the tree, you should call this manually at the end of each animation step. This function exists for all trees.

<h3 class="apimethod">.hide([options])</h3>
Make the tree invisible. This function exists for all trees. It recursively hides all the nodes and edges in the tree as well unless
option `recursive` is set to `false`.
<h3 class="apimethod">.show([options])</h3>
Make the tree visible.This function exists for all trees. It recursively shows all the nodes and edges in the tree as well unless
option `recursive` is set to `false`.

<h3 class="apimethod">.addClass(className, [options])</h3>
Adds the CSS class `className` to the tree and animates the changes.

<h3 class="apimethod">.removeClass(className, [options])</h3>
Removes the CSS class `className` from the tree and animates the changes.

<h3 class="apimethod">.toggleClass(className, [options])</h3>
Toggles the CSS class `className` to the tree and animates the changes.

<h3 class="apimethod">.hasClass(className, [options])</h3>
Return true/false based on if the tree has the CSS class `className`.


<h3 class="apitopic">Events</h3>
There are functions to attach event handlers for the nodes and edges in the tree. The events 
that can be
listened for are: click, dblclick, mousedown, mousemove, mouseup, mouseenter, and mouseleave. 
See [jQuery documentation](http://api.jquery.com/category/events/) for details on 
the events. Every event handler gets as a parameter the jQuery event object. Inside the event
handler function, `this` will refer to the JSAV node or edge object.

The function takes another, optional, parameter options that should be an object. It can be 
used to specify whether
the event handler is for nodes or edges. By default, it is attached to only nodes.

**Returns:** a JSAV tree object. Thus, this method can be chained.
For example, to highlight an node on mouseenter and unhighlight on mouseleave,
you can use:

    tree.mouseenter(function() { this.highlight(); })
      .mouseleave(function() { this.unhighlight(); });

To attach a handler to edges, you can do:

    tree.mouseenter(yourEventHandler, {edge: true});

Similarly to arrays, you can also pass custom data to the handler. For example, 
`bt.click({"color": "blue"}, JSAV.utils._helpers.css);` would call the `css`
function with the given parameter. 
<h3 class="apimethod">.on(eventName, [data,], handler, options)</h3>
To bind other events than the ones listed above, you can use the `on` function. It takes
as the first parameter the name of the event. Multiple events can be bound by separating their names with
spaces. Other parameters are the same as for the shortcuts.
  

##Tree Node API
The following functions exist for both tree nodes and binary tree nodes.
<h3 class="apimethod">.value([newValue])</h3>
Returns the value stored in this node. If the optional `newValue` parameter is given, the value is set to the given value.
<h3 class="apimethod">.parent([newParent])</h3>
Returns the parent node of this node. If the optional `newParent` parameter is given, the parent node is set.
<h3 class="apimethod">.edgeToParent([newEdge])</h3>
Returns the edge that connects this node to its parent. If the optional `newEdge` parameter is given, the edge to parent is set.
<h3 class="apimethod">.edgeToChild(pos)</h3>
Returns the edge that connects this node to its child at `pos`. Returns `undefined` is no such child exists.
<h3 class="apimethod">.child(pos)</h3>
Returns the `pos`:th child of this node.
<h3 class="apimethod">.child(pos, node [,options])</h3>
Sets the `pos`:th child to the given value. The `node` can be a value or a node of correct type to the node. If value `null` is given as `node`, the child at that position is removed. Note, that this also hides the removed node and the edge.

The optional third argument `options` should be an object. The following option(s) are supported:

* `edgeLabel`: specify a label shown on the edge connecting the new node to its parent.

<h3 class="apimethod">.addChild(node [,options])</h3>
Adds a child node to this node. The `node` can be a value or a node of correct type to the node.
The `options` parameter works like above.
<h3 class="apimethod">.remove([options])</h3>
Removes the node from its parent.
<h3 class="apimethod">.hide([options])</h3>
Hides the node and the edge connecting it to the parent node. Also recursively hides all child nodes unless 
option `recursive` is set to `false`.
<h3 class="apimethod">.show([options])</h3>
Shows the node and the edge connecting it to the parent node. Also recursively shows all child nodes unless 
option `recursive false` is set to `false`. Note, that if the tree is not visible, showing nodes will not have
any effect until the tree is set visible by calling show.

<h3 class="apimethod">.addClass(className, [options])</h3>
Adds the CSS class `className` to the node and animates the changes.

<h3 class="apimethod">.removeClass(className, [options])</h3>
Removes the CSS class `className` from the node and animates the changes.

<h3 class="apimethod">.toggleClass(className, [options])</h3>
Toggles the CSS class `className` of the node and animates the changes.

<h3 class="apimethod">.hasClass(className, [options])</h3>
Return true/false based on if the node has the CSS class `className`.

##Binary Tree Node API
<h3 class="apimethod">.left([node [, options]])</h3>
Returns the left child or undefined if node has no left child. If optional parameter `node` is given, sets the left child. The parameter can be a value or a binary tree node. If value `null` is given as `node`, the left child is removed. Note, that this also hides the removed node and the edge.
The additional `options` parameter works like for `.child(...)` above. 
<h3 class="apimethod">.right([node [,options]])</h3>
Returns the right child or undefined if node has no right child. If optional parameter `node` is given, sets the right child. The parameter can be a value or a binary tree node. Passing `null` as node works similarly to the left function. The additional `options` parameter works like for `.child(...)` above.
<h3 class="apimethod">.edgeToLeft()</h3>
Returns the edge that connects this node to its left child. Returns `undefined` if node has no left child.
<h3 class="apimethod">.edgeToRight()</h3>
Returns the edge that connects this node to its right child. Returns `undefined` if node has no right child.
  
##Edge structure API
<h3 class="apimethod">.start([node])</h3>
Returns the start node of this edge. If the optional `node` parameter is given, sets the start node of this edge.
<h3 class="apimethod">.end([node])</h3>
Returns the end node of this edge. If the optional `node` parameter is given, sets the end node of this edge.
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


##Linked List API
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
  format `horizontal vertical`. Possible horizontal values are "left", "center", "right" and vertical values "top", "center", "bottom". Defaults to `center center`. Only has an effect if relativeTo is
  specified.
* myAnchor: Similar to anchor, but the position on this element. Defaults to `center center`. Only 
  has an effect if relativeTo is specified.
* relativeIndex: If relativeTo points to a JSAV array, this option can be used to position this structure relative
  to an index in that array. Only has an effect if relativeTo is specified.

The returned list instance is controlled through a collection of methods explained next. In addition, the list has the common functions such as `.id()`, `.css(...)`, `.show()`, and `.hide()`.

<h3 class="apimethod">.first() and last()</h3>
Returns the first or last node in the list. If there are no nodes in the list, returns undefined.
<h3 class="apimethod">.addFirst([value]) and .addFirst([node])</h3>
Adds the given `value` or `node` as the first item in the list. Returns the list, so calls can be chained.
<h3 class="apimethod">.addLast([value]) and .addLast([node])</h3>
Adds the given `value` or `node` as the last item in the list. Returns the list, so calls can be chained.
<h3 class="apimethod">.add(index, [value or node])</h3>
Adds the given `value` or `node` to be the `index`th item in the list. The first item in the list has index 0. Returns the list, so calls can be chained.
<h3 class="apimethod">.get(index)</h3>
Returns the node at `index`. First item has index 0. If no such index exists, returns `undefined`.
<h3 class="apimethod">.removeFirst() and .removeLast()</h3>
Removes the first or last node in the list. Returns the removed node.
<h3 class="apimethod">.remove(index)</h3>
Removes the node at `index` in the list. First item has index 0. Returns the removed node.
<h3 class="apimethod">.size()</h3>
Returns the size of the list.
<h3 class="apimethod">.layout([options])</h3>
This function (re)calculates the layout for the list. Note, that the library does not do this automatically. That means that after changing the list, you should call this manually at the end of each animation step.
Options supported by the layout function:

* `updateLeft` If true, the horizontal position (that is, left) of the nodes are calculated.
Defaults to true.
* `updateTop` If true, the vertical position (that is, top) of the nodes are calculated.
Defaults to true.

If the call to layout is, for example, `list.layout({updateLeft: false, updateTop: false}), only the edges
in the list are redrawn.`

<h3 class="apimethod">.newNode(value [, options])</h3>
Returns a new node that can be added to the list.

<h3 class="apimethod">.clear()</h3>
Removes the DOM element of this structure from the document. This is useful, for example, in 
re-initializing exercises when the existing structure needs to be removed. 

<h3 class="apimethod">.addClass(className, [options])</h3>
Adds the CSS class `className` to the list and animates the changes.

<h3 class="apimethod">.removeClass(className, [options])</h3>
Removes the CSS class `className` from the list and animates the changes.

<h3 class="apimethod">.toggleClass(className, [options])</h3>
Toggles the CSS class `className` of the list and animates the changes.

<h3 class="apimethod">.hasClass(className, [options])</h3>
Return true/false based on if the list has the CSS class `className`.

<h3 class="apitopic">Events</h3>
There are functions to attach event handlers for the nodes and edges in the list. The events 
that can be listened for are: click, dblclick, mousedown, mousemove, mouseup, mouseenter, and mouseleave.
See the tree documentation for details.

##Linked List Node API
A node in a list has the same functions as a tree node: `.value([newValue])`, `.highlight()/unhighlight()`, `.show()/.hide()`, and `.css(...)`. In addition, it has the following functions.
<h3 class="apimethod">.next()</h3>
Returns the next node in the linked list. If no next, returns null.
<h3 class="apimethod">.next([node [, options]])</h3>
Sets the next node to be the passed `node`. The optional second argument `options` should be an object. The following option(s) are supported:

* `edgeLabel`: specify a label shown on the edge connecting the node to the next.


<h3 class="apimethod">.edgeToNext()</h3>
Returns the JSAV Edge object that points to the next item in the list.

<h3 class="apimethod">.addClass(className, [options])</h3>
Adds the CSS class `className` to the node and animates the changes.

<h3 class="apimethod">.removeClass(className, [options])</h3>
Removes the CSS class `className` from the node and animates the changes.

<h3 class="apimethod">.toggleClass(className, [options])</h3>
Toggles the CSS class `className` of the node and animates the changes.

<h3 class="apimethod">.hasClass(className, [options])</h3>
Return true/false based on if the node has the CSS class `className`.


##Graph API
<h3 class="apimethod">.ds.graph([options])</h3>
This function of a JSAV instance initializes an empty graph. Options that the optional parameter can specify:

* layout: Defines the layout used, either `manual` or `automatic`. Defaults to manual layout.
* visible: Boolean to determine if initially the graph is shown or not. Default true.
* center: Boolean to determine if graph should be automatically centered within its container. Defaults to true.
* left/top/right/bottom: Values to determine the absolute position of the graph relative to its container.
* relativeTo: A JSAV data structure object or DOM element that this structure should be positioned relative to.
  If this option is specified, left and top options will change structure's position relative to the relativeTo
  element. Note, that the element pointed by relativeTo needs to be visible.
* anchor: Defines which position on the element being positioned to align with the target element. Should be in 
  format `horizontal vertical`. Possible horizontal values are "left", "center", "right" and vertical values "top", "center", "bottom". Defaults to `center center`. Only has an effect if relativeTo is
  specified.
* myAnchor: Similar to anchor, but the position on this element. Defaults to `center center`. Only 
  has an effect if relativeTo is specified.
* relativeIndex: If relativeTo points to a JSAV array, this option can be used to position this structure relative
  to an index in that array. Only has an effect if relativeTo is specified.
* width: Width of the graph, in pixels. Defaults to 400.
* height: Height of the graph, in pixels. Defaults to 200.
* directed: Wether or not this graph is directed.

The returned graph instance is modified through a collection of methods explained next. In addition, the graph has the common 
functions such as `.id()`, `.css(...)`, `.show()`, and `.hide()`.

<h3 class="apimethod">.addNode(value, [options])</h3>
Adds a new node with `value` to the graph. Returns the new node.
<h3 class="apimethod">.removeNode(node, [options])</h3>
Removes the given `node`.
<h3 class="apimethod">.addEdge(fromNode, toNode, [options])</h3>
Adds edge from `fromNode` to `toNode`. Returns the new edge.
Supported options:

  * weight: the weight of the new edge

<h3 class="apimethod">.removeEdge(fromNode, toNode, [options])</h3>
Removes edge from `fromNode` to `toNode`.
<h3 class="apimethod">.removeEdge(edge, [options])</h3>
Removes the given `edge`.
<h3 class="apimethod">.hasEdge(fromNode, toNode)</h3>
Returns true if the graph has an edge from `fromNode` to `toNode`.
<h3 class="apimethod">.getEdge(fromNode, toNode)</h3>
Returns the Edge object connecting `fromNode` and `toNode`, or `undefined` if no such edge exists.
<h3 class="apimethod">.nodes()</h3>
Returns an iterable array of nodes in the graph. The returned structure can be used as a normal JavaScript array. In addition, 
it has methods `.next()`, `.hasNext()`, and `.reset()` for iterating over the values.
<h3 class="apimethod">.nodeCount()</h3>
Returns the number of nodes in the graph.
<h3 class="apimethod">.edges()</h3>
Returns an iterable array of edges in the graph. The returned structure is similar to the one returned by `.nodes()`.
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


##Graph Node API
A node in a graph has the same functions as a tree node: `.value([newValue])`, `.highlight()/unhighlight()`, `.show()/.hide()`, and `.css(...)`. In addition, it has the following functions.
<h3 class="apimethod">.neighbors()</h3>
Returns an iterable array of the nodes that this node is connected to.
<h3 class="apimethod">.edgeTo(node)</h3>
Returns the Edge object connecting this node to the given `node`. Returns `undefined` if no such edge exists.
<h3 class="apimethod">.edgeFrom(node)</h3>
Returns the Edge object connecting the given `node` to this node. Returns `undefined` if no such edge exists.

##Label API

UI elements such as arrays can take a label.

<h3 class="apimethod">.label(msg, options)</h3>

This is a method of the AV object.
It creates a label that is associated with some UI element of the AV
specified by the options.
Parameter `msg` is the
(initial) value for the label.
Paramter `options` include the following:


*  `{before: <UI element>}` Set the label before element
`UI element`
*  `{after: <UI element>}` Set the label after element
`UI element`
*  `{visible: <boolean>}` Determine whether the label
is visible on creation. Defaults to true.
  * `{left/top/right/bottom: <lengthUnit>}` Values to determine the absolute position of the label relative to its container.


<h3 class="apimethod">.hide()</h3>

Make the label invisible.


<h3 class="apimethod">.show()</h3>

Make the label visible.


<h3 class="apimethod">.text(msg)</h3>

Set the text for the label. If the `msg` parameter is left
out, this method will return the current text of the label.


<h3 class="apimethod">.clear()</h3>
Removes the DOM element of this label from the document. This is useful, for example, in 
  re-initializing exercises when the existing label needs to be removed. 

<h3 class="apimethod">.addClass(className, [options])</h3>
Adds the CSS class `className` to the label and animates the changes.

<h3 class="apimethod">.removeClass(className, [options])</h3>
Removes the CSS class `className` from the label and animates the changes.

<h3 class="apimethod">.toggleClass(className, [options])</h3>
Toggles the CSS class `className` of the label and animates the changes.

<h3 class="apimethod">.hasClass(className, [options])</h3>
Return true/false based on if the label has the CSS class `className`.

##Variable API

Variables can be used to present undo/redo capable variables.

<h3 class="apimethod">.variable(value, [options])</h3>

This is a method of the AV object.
It creates a variable that can be associated with some UI element.
Parameter `value` is the
(initial) value for the variable.
Parameter `options` include the following:


*  `{before: <UI element>}` Add the variable before element
`UI element`
*  `{after: <UI element>}` Add the variable after element
`UI element`
*  `{visible: <boolean>}` Determine whether the variable
is visible on creation. Defaults to false.
*  `{name: <string>}` Name of the variable. Can be used to 
  fetch the variable value later. 
*  `{label: <string>}` Label for the variable. Will be shown 
  before the variable value. For example, label "Count =" would end up the
  variable looking like "Count = 3" in the HTML.
*  `{type: <string>}` Type of the variable. Can be boolean,
  number, or string. By default, the type is decided based on the type of the
  initial value.
* `{left/top/right/bottom: <lengthUnit>}` Values to determine the absolute position of the label relative to its container.
* relativeTo: A JSAV data structure object or DOM element that this structure should be positioned relative to.
  If this option is specified, left and top options will change structure's position relative to the relativeTo
  element. Note, that the element pointed by relativeTo needs to be visible.
* anchor: Defines which position on the element being positioned to align with the target element. Should be in 
  format `horizontal vertical`. Possible horizontal values are "left", "center", "right" and vertical values "top", "center", "bottom". Defaults to `center center`. Only has an effect if relativeTo is
  specified.
* myAnchor: Similar to anchor, but the position on this element. Defaults to `center center`. Only 
  has an effect if relativeTo is specified.
* relativeIndex: If relativeTo points to a JSAV array, this option can be used to position this structure relative
  to an index in that array. Only has an effect if relativeTo is specified.
    

<h3 class="apimethod">.hide()</h3>

Make the variable invisible.


<h3 class="apimethod">.show()</h3>

Make the variable visible.


<h3 class="apimethod">.value([val])</h3>

Set the value of the variable. If the `val` parameter is left
out, this method will return the current value of the variable. The value is
converted to the type specified when initializing the variable.
    

<h3 class="apimethod">.clear()</h3>
Removes the DOM element of this variable from the document. This is useful, for example, in 
re-initializing exercises when the existing variable needs to be removed. 

<h3 class="apimethod">.addClass(className, [options])</h3>
Adds the CSS class `className` to the variable and animates the changes.

<h3 class="apimethod">.removeClass(className, [options])</h3>
Removes the CSS class `className` from the variable and animates the changes.

<h3 class="apimethod">.toggleClass(className, [options])</h3>
Toggles the CSS class `className` of the variable and animates the changes.

<h3 class="apimethod">.hasClass(className, [options])</h3>
Return true/false based on if the variable has the CSS class `className`.


##Pointer API

Pointers can be used to represent pointers of a programming language. The pointer is
visualized as a label with an arrow to the target of the pointer.

<h3 class="apimethod">.pointer(name, target, [options])</h3>

This is a method of the AV object.
It creates a pointer that points to some JSAV element element.
Parameter `name` is the
(initial) name for the variable.
Parameter `options` include the following:


*  `{visible: <boolean>}` Determine whether the pointer
is visible on creation. Defaults to true.
* `{left/top/right/bottom: <lengthUnit>}` Values to determine the absolute position of the label relative to the pointer's target.
* anchor: Defines which position on the element being positioned to align with the target element. Should be in 
  format `horizontal vertical`. Possible horizontal values are "left", "center", "right" and vertical values "top", "center", "bottom". Defaults to `center center`.
* myAnchor: Similar to anchor, but the position on this element. Defaults to `center center`.
* targetIndex: If target is a JSAV array, this option can be used to target
  an index in that array.

A pointer instance has the functions of the Label object as well as the following functions.
<h3 class="apimethod">.target([newTarget], [options])</h3>
If `newTarget` is not specified, returns the JSAV object this pointer points to. If
`newTarget` is a JSAV object, the pointer will be updated to point to that structure.
Valid `options` are the same as for the pointer constructor. If setting a new target,
the change is recorded in the animationo and the function returns the pointer object.

**Note:** the position of the pointer is only updated once the `jsav.step()`
`jsav.displayInit()`, or `jsav.recorded()` function is called.

##Pseudocode API
The pseudocode API in JSAV is intended for showing a static set of codelines that can be show/hidden and
highlighted. There are two ways to initialize a pseudocode object in JSAV:
<h3 class="apimethod">.code(codelines[, options]) or .code([options])</h3>
Both of these are functions of a JSAV object instance. The first version takes either an array or a string 
to be used as the lines of code. If a string is passed, it will be split on newline characters (`\n`)
to get the codelines.

The options that can be specified:
    
*  `{url: <string>}` A URL where the code should be fetched. The fetched text will be split on
newline characters (`\n`). Note, that if the codelines parameter is given, this option is ignored. Also, same-origin
policies in browsers might prevent this from working across domains.
*  `{lineNumbers: <boolean>}` Determine whether linenumbers should be shown. Defaults to true. 
*  `{visible: <boolean>}` Determine whether the pseudocode is visible on creation. Defaults to true.
*  `{before: <UI element>}` Add the pseudocode before element `UI element`
*  `{after: <UI element>}` Add the pseudocode after element `UI element`
*  `{center: <boolean>}` Boolean to determine if array should be automatically centered
within its container. Defaults to true.
*  `{startAfter: <string>}` Only the content after the last occurrence of the specified text will be included. Only
  applied if the `url` parameter is also provided.
*  `{endBefore: <string>}` Only the content before the first occurrence of the specified text will be included. Only
  applied if the `url` parameter is also provided.
* relativeTo: A JSAV data structure object or DOM element that this structure should be positioned relative to.
If this option is specified, left and top options will change structure's position relative to the relativeTo
element. Note, that the element pointed by relativeTo needs to be visible.
* anchor: Defines which position on the element being positioned to align with the target element. Should be in 
format `horizontal vertical`. Possible horizontal values are "left", "center", "right" and vertical values "top", "center", "bottom". Defaults to `center center`. Only has an effect if relativeTo is
specified.
* myAnchor: Similar to anchor, but the position on this element. Defaults to `center center`. Only 
has an effect if relativeTo is specified.
* relativeIndex: If relativeTo points to a JSAV array, this option can be used to position this structure relative
to an index in that array. Only has an effect if relativeTo is specified.
    
Pseudocode objects have the following functions.
<h3 class="apimethod">.highlight(indices) and .unhighlight(indices)</h3>
Highlight and unhighlight the codelines at given indices. Lines are numbered from 0, so first line could be highlighted with:

    pseudo.highlight(0)
Similarly to the array (un)highlight, the `indices` parameter can be either a number, an array of numbers, or a function.
<h3 class="apimethod">.show() and .hide()</h3>
Show/hide the pseudocode object.
<h3 class="apimethod">.show(indices) and .hide(indices)</h3>
Show/hide the codelines at given indices. Again, indices can be a number, an array of numbers, or a function.
<h3 class="apimethod">.css(indices, css)</h3>
Apply the given CSS properties to the codelines at specified `indices`.
Parameter `indices` can be a number, array, or function like for 
the `highlight` method.
The argument `css` should be an object with property name-and-value pairs. For example, to make
lines 0 and 4 have green color and lightgray background:

    pseudo.css([0, 4], {"color": "green", "background-color": "#eee"});
<h3 class="apimethod">.setCurrentLine(index)</h3>
Sets the line at given `index` as the current line. Also, if another line was previously set as current, it will be
marked as previous. If a line was also earlier marked as previous, that mark will be removed. This will help in creating a 
visual debugger-like code stepping functionality in visualizations.
<h3 class="apimethod">.clear()</h3>
Removes the DOM element of this object from the document. This is useful, for example, in 
re-initializing exercises when the existing object needs to be removed. 
<h3 class="apimethod">.addClass(indices, className, [options])</h3>
Adds the CSS class `className` to lines at given indices and animates the changes. Like for
the rest of pseudocode methods, `indices` can be a number, array of numbers, or a function.
<h3 class="apimethod">.removeClass(indices, className, [options])</h3>
Removes the CSS class `className` from lines at given indices and animates the changes. Like for
the rest of pseudocode methods, `indices` can be a number, array of numbers, or a function.
<h3 class="apimethod">.toggleClass(indices, className, [options])</h3>
Toggles the CSS class `className` of lines at  given indices and animates the changes. Like for
the rest of pseudocode methods, `indices` can be a number, array of numbers, or a function.
<h3 class="apimethod">.hasClass(index, className, [options])</h3>
Return true/false based on if the line at given index has the CSS class `className`. Parameter
`index` should be a number.

##Matrix (or 2D-Array) Data Structure API
The Matrix data structures is essentially a 2-dimensional array.
<h3 class="apimethod">.ds.matrix(data[, options]) or .ds.matrix(options)</h3>
A matrix can be initialized with the `.ds.matrix()` function of a JSAV instance.
If the `data` argument is provided, it should be an array of arrays, all of the
same length. If only `options` argument is provided, it needs to specify options
`rows` and `columns` specifying the size of the matrix.

Options that can be specified:
    
* visible: Boolean to determine if initially the matrix is shown or not. Default true.
* center: Boolean to determine if matrix should be automatically centered within its container. Defaults to true.
* left/top/right/bottom: Values to determine the absolute position of the matrix relative to its container.
* relativeTo: A JSAV data structure object or DOM element that this structure should be positioned relative to. If this option is specified, left and top options will change structure's position relative to the relativeTo element. Note, that the element pointed by relativeTo needs to be visible.
* anchor: Defines which position on the element being positioned to align with the target element. Should be in format horizontal vertical. Possible horizontal values are "left", "center", "right" and vertical values "top", "center", "bottom". Defaults to center center. Only has an effect if relativeTo is specified.
* myAnchor: Similar to anchor, but the position on this element. Defaults to center center. Only has an effect if relativeTo is specified.
* relativeIndex: If relativeTo points to a JSAV array, this option can be used to position this structure relative to an index in that array. Only has an effect if relativeTo is specified.
* style: The style of the array. Valid values are `plain`, `matrix`, and
  `table`. Defaults to table.
* element: The DOM element inside which the matrix should be added.

For example, this would create a 2x2 matrix: `var m = jsav.ds.matrix([[0, 1], [2, 3]])`.
An empty 5x8 matrix using the matrix style could be created like this:

    var m = jsav.ds.matrix({rows: 5, columns: 8, style: "matrix"});

<h3 class="apimethod">.swap(row1, col1, row2, col2[, options])</h3>
Swaps two values of the matrix, namely (row1, col1) with (ro2, col2).

<h3 class="apimethod">.layout([options])</h3>
Recalculates the layout for the data structure.

<h3 class="apimethod">arrays methods</h3>
Like for the array, there are similar functions in the matrix that take the row number as the
first argument and the rest of the arguments similarly than the corresponding array function.
These functions are `highlight`, `unhighlight`, `isHighlight`,
`css`, `value`, `addClass`, `hasClass`,
`removeClass`, and `toggleClass`. So, for example, whereas the array
has function `.addClass(col, className)`, the matrix has a function
`.addClass(row, col, className)`.

##Graphical Primitives API
JSAV supports the following graphical primitives: circle, rectangle, line,
ellipse, polygon, polyline, and path. All these are in the JSAV.g namespace. A 
rectangle, for example, can be initialized like follows.

    var rect = av.g.rect(70, 60, 50, 40);
This would initialize a rectangle with upper-left corner at point (70, 60) that
is 50 pixels wide and 40 pixels tall.
All the graphical primitives have the following functions.
<h3 class="apimethod">.show()</h3>
Make the shape visible. Essentially the same as calling `.css({opacity: 1})`.
<h3 class="apimethod">.hide()</h3>
Make the shape invisible. Essentially the same as calling `.css({opacity: 0})`.
<h3 class="apimethod">.isVisible()</h3>
Return true if the shape is visible, false if hidden.
<h3 class="apimethod">.rotate(deg)</h3>
Rotates the object by the given amount of degrees around the center of the shape.
<h3 class="apimethod">.scale(sx, sy), .scaleX(sx), .scaleY(sy)</h3>
Scales the object by given amount. The shortcuts for X/Y scaling only
are the same as calling `.scale(sx, 0)` and `.scale(0, sy)`. For example

    rect.scale(2, 1.5)
would make the rectangle from the previous example to have width of 100 pixels and height of 60px. Note, that the position of the rectangle would also change, since the scaling is done relative to the center of the shape.
<h3 class="apimethod">.translate(dx, dy), .translateX(dx), .translateY(dy)</h3>
Translates the shape by the given amount. Again, X/Y versions are shortcuts to
the main translation function.
<h3 class="apimethod">.css(propname)</h3>
Returns the value of the attribute with the name `propname`.
<h3 class="apimethod">.css(propname, propvalue), .css(propsObj)</h3>
Like the .css functions of the other JSAV objects, these can be used to animate
attributes of the shape. Technically, what is changed is not CSS properties but
attributes of the SVG element visualizing the shape. For a list of valid values,
see [Rapha&euml;l JS documentation](http://raphaeljs.com/reference.html#Element.attr).
  
##Circle API
<h3 class="apimethod">jsav.g.circle(cx, cy, r[, properties])</h3>
Initializes a new circle with the given center and radius. Optional parameter `properties`,if given,  
should be an object with key-value pairs. See [raphael.attr](http://raphaeljs.com/reference.html#Element.attr) for valid keys and values.
<h3 class="apimethod">.center([cx, cy])</h3>
Gets or sets the center of the circle. The center is returned as an object with
properties `cx` and `cy`.
<h3 class="apimethod">.radius([r])</h3>
Gets or sets the radius of the circle.
  
##Ellipse API
<h3 class="apimethod">jsav.g.ellipse(cx, cy, rx, ry[, properties])</h3>
Initializes a new ellipse with the given center and x and y radius. Optional parameter 
`properties`,if given, should be an object with key-value pairs. See 
[raphael.attr](http://raphaeljs.com/reference.html#Element.attr) for valid keys and values.
<h3 class="apimethod">.center([cx, cy])</h3>
Same as center function of the circle.
<h3 class="apimethod">.radius([rx, ry])</h3>
Gets or sets the radius of the ellipse. The radius is returned as an object with
properties `rx` and `ry`.

##Rectangle API
<h3 class="apimethod">jsav.g.rect(x, y, w, h[, r, properties])</h3>
Initializes a new rectangle with upper left corner at `x, y` and given width and height.
Optional parameter `r` can be used to specify the roundness of corners.
Optional parameter `properties`,if given, should be an object with key-value pairs. See 
[raphael.attr](http://raphaeljs.com/reference.html#Element.attr) for valid keys and values.
<h3 class="apimethod">.width([w])</h3>
Gets or sets the width of the rectangle.
<h3 class="apimethod">.height()</h3>
Gets or sets the height of the rectangle.

##Line, Polygon, and Polyline API
<h3 class="apimethod">jsav.g.line(x1, y1, x2, y2[, properties])</h3>
Initializes a line from point `x1, y1` to `x2, y2`. Optional parameter 
`properties`,if given, should be an object with key-value pairs. See 
[raphael.attr](http://raphaeljs.com/reference.html#Element.attr) for valid keys and values.

<h3 class="apimethod">jsav.g.polyline(points[, properties]) and jsav.polygon(points[, properties])</h3>
Initializes a polyline or polygon. Parameter `points` should be an array of arrays with
x and y coordinates. For example:

    var polyline = av.g.polyline([[0, 0], [20, 20], [200, 200]], 
                                  {"stroke-width": 7, "stroke":"#ddd"});
Optional parameter 
`properties`,if given, should be an object with key-value pairs. See 
[raphael.attr](http://raphaeljs.com/reference.html#Element.attr) for valid keys and values.

<h3 class="apimethod">.translatePoint(point, dx, dy)</h3>
Translates the given `point` in the (poly)line by the given amount of pixels. The point is a zero-indexed list of points used to initialize the polyline. For line, start point is index 0 and endpoint index 1.

<h3 class="apimethod">.movePoints(points)</h3>
Moves the given points to the given pixel positions. Parameter `points` should be an array of arrays with each item specifying point, px, and py.

##Path API
<h3 class="apimethod">jsav.g.path(path[, properties])</h3>
Initializes a new path element with the given `path`. The path should be defined according
  to the [SVG path string format](http://www.w3.org/TR/SVG/paths.html#PathData).
<h3 class="apimethod">.path()</h3>
Returns the current `path` of the object.
<h3 class="apimethod">.path(newPath)</h3>
Animates the objects path to the `newPath`.

##Graphical Primitive Set
Sometimes there is a need to combine multiple graphical primitives to make up more complex shapes that can be changed simultaneously. Function `av.g.set()` can be used to create a set of graphical primitives. It has all the functions common to all graphical primitive listed above. In addition, it has one function:
<h3 class="apimethod">.push(gp)</h3>
Adds the graphical primitive gp to the set.

##Questions API
Interactive questions can be initialized with the `question`
function of a JSAV instance.
<h3 class="apimethod">.question(qtype, questionText, [options])</h3>
This is a method of the AV object. It initializes an interactive question
of the given type (`qtype`). The type can be:

* `TF` for a true-false type question
* `MC` for a multiple-choice question where only one answer can be selected
* `MS` for a multiple-select question where multiple answers can be selected and be correct

The `questionText` parameter is the actual question shown to a student. For the question type TF, `options` parameter can contain following options.

* `{trueLabel: <string>}` The label shown for true option. Only for type TF. Default value True.
* `{falseLabel: <string>}` The label shown for false option. Only for type TF. Default value False.
* `{correct: <boolean>}` The correct answer, true or false.

An example of initializing a true-false question is below.

    var q = av.question("TF", "JSAV supports questions now?", {correct: true, falseLabel: "No", trueLabel: "Yes"});

The function returns an instance of a question. Answer choices can be added
to this instance using the following methods.

<h3 class="apimethod">q.addChoice(label, [options])</h3>
This adds an answer choice to question `q`. Parameter `label` is the label shown for this answer choice. The only option at the moment is `correct` which indicates the correctness of this choice. Default value for it is false. Note, that this method does nothing for the true-false type question.

<h3 class="apimethod">q.show()</h3>
This function will show the question in the current step in the algorithm. This way, the initialization, addition of answers, and displaying the question can happen in different steps in the animation. It helps when the goal is to show students questions that require prediction of the algorithm's behavior.
A complete example of a multiple-select question:

    var q = av.question("MS", "Life is good?");
    q.addChoice("Of course", {correct: true});
    q.addChoice("Certainly", {correct: true});
    q.addChoice("No way!");
    q.show();
    

##Settings Dialog for AV
There is a configurable settings dialog class in JSAV.utils.Settings.
The settings objects can be instantiated with `new JSAV.utils.Settings(elem)`
where the optional `elem` parameter specifies an element on which a
click will open the dialog. 

The settings used by an instance of JSAV can be specified with the `settings`
option for the constructor. For example, `var av = 
new JSAV(jQuery("#container"), {"settings": settings});`. If no custom settings
are given, JSAV will automatically create a default settings panel and attach it to
any element with class `jsavsettings` inside the container.
No matter how the settings object is initialized,
it can be accessed through the `av.settings`
field.

A settings instance has the following functions.

<h3 class="apimethod">settings.show()</h3>
Shows the settings dialog.

<h3 class="apimethod">settings.close()</h3>
Closes the settings dialog.

<h3 class="apimethod">settings.add(varname, options)</h3>
Adds a component to the settings dialog. Parameter `varname` is the unique
name of the variable for this setting which can be used later to get the value of the setting.
Parameter `options` is an object used to specify the properties of the settings
variable. The following options can be set:
  
  
* type: Type of the HTML element used for this setting. Choices are `select` and
  valid values for the text attribute of an HTML input element (such as text, email, range).
* label: The label displayed next to the form element of this setting.
* value: The initial value of the setting.
* options: Select options for the type select. This should be an object representing key-value pairs.
  For example, `"options": {"bar": "Bar layout", "array", "Array layout"}` would add
  two choices: Bar layout and Array layout.
  
In addition to these options, when using an HTML input element (text, email) to represent the setting,
any additional options will be set as attributes of the `input` element. For example:

    settings.add("speed", {"type": "range", "value": "7", "min": 1, "max": 10, "step": 1});
Would create `<input type="range" value="7" min="1" max="10" step="1" />`.
  
The `add` function returns a reference to the setting. The function `val()` 
returns the value of the setting.
    

<h3 class="apimethod">settings.add(function)</h3>
Adds a more customizable component to the settings dialog. The parameter should be a function
that returns a DOM element or a jQuery object.

##Exercise API
<h3 class="apimethod">.exercise(modelSolution, reset, options)</h3>

The exercise API is used to create interactive, automatically assessed exercises. An exercise is 
initialized with a call to `av.exercise(..)`. The parameters for the function are:
  
* `{modelSolution: <function>}` The function to generate the model solution. The function has to return the data structures and/or variables used in grading of the exercise. The return value can be a single data structure or an array of structures.
* `{reset: <function>}` The initialization function that resets the exercise. The function has to return the data structures and/or variables used in grading of the exercise. The return value can be a single data structure or an array of structures.
    
  
The function can also take several options, some of which are required. The full set of options are: 
  
* `{compare: <Object or Array>}` Specifies which properties to compare for the structures. In the example below, we set the comparison to be CSS property background-color so grading would check if the structures have same background color (that is, if they are highlighted). **Required.**
* `{feedback: <string>}` Will change the feedback mode, possible values continuous and atend (default). See Continuous feedback below.
* `{fixmode: <string>}` Change the behavior in continuous mode, possible values are undo and fix. The default is undo.
* `{feedbackSelectable: <>boolean}` The settings dialog will not, by default, allow student to change the feedback mode. Setting this option to true enables this choice.
* `{fixmodeSelectable: <>boolean}` The settings dialog will not, by default, allow student to change the behavior in continuous feedback mode. Setting this option to true enables this choice.
* `{fix: <function}` A function that will fix the student's solution to match the current step in model solution. Before this function is called, the previous incorrect step in student's solution is undone. The function gets the model structures as a parameter. For an example, see the examples/ShellsortProficiency.html.
* `{showGrade}: <function>}` A function that can be used to customize the way the grade is shown. The function will be added to the exercise and can be called with `exercise.showGrade`. The function can access the grade information from attribute `this.score`. Example content of that attribute: `{total: 15, correct: 3, undo: 0, fix: 0, student: 5}`. Total is the total number of steps in the model solution, student the number of steps in student solution, and correct the number of correct steps. Values undo and fix show how many steps were undone/fixed in the continuous feedback mode. Note, that to make sure the grading is up to date, this function should call the `grade` function of the exercise before showing the grade.
* `{modelDialog}: <object>}` An object that can specify options for the model answer dialog. For
  the possible options, see the documentation for the JSAV.utils.dialog.
  
For example, assuming `modelSolution` and `reset` are functions, the following would initialize an exercise:

    var exercise = av.exercise(modelSolution, reset, { compare: {css: "background-color"}});
    exercise.reset();

See also the [tutorial on creating an exercise](exercise.html).
<h3 class="apimethod">exercise.showGrade()</h3>
Shows the grade of the student's current solution. The behaviour can be customized using the `showGrade` option when initializing the exercise.

<h3 class="apimethod">exercise.reset()</h3>
Resets the exercise.
<h3 class="apimethod">exercise.showModelAnswer()</h3>
Shows the model answer of the exercise.
<h3 class="apimethod">exercise.gradeableStep()</h3>
Marks the current step in the student's solution as a step used in grading.

###Showing the Current Score and Maximum Score in Continuous Feedback Mode
If the exercise is in the continuous feedback mode, it is possible to have JSAV show
the current score, current maximum score, and the total maximum score to student.
This can be done by adding HTML elements _inside_ the JSAV container elements.
JSAV will search for elements with the following class attributes:

* `jsavcurrentscore`: Inside this element, JSAv will update the current 
  score achieved by the student.
* `jsavcurrentmaxscore`: The contents of this element will be updated to
  contain the maximum score thus far in the exercise.
* `jsavmaxscore`: The maximum score available in this exercise.
  
So you could use the following HTML:

    <p>
      Your current score is <span class="jsavcurrentscore"></span> of 
      <span class="jsavcurrentmaxscore"></span>. Maximum score in this exercise is
      <span class="jsavmaxscore"></span>.
    </p>
As a shorter convenience notation, you can use `<p class="jsavscore"><p/>`
that will be replaced automatically by JSAV with the HTML above if the exercise is
in continuous feedback mode. Note, that in both cases, the elements can be anything, the
important thing is that they have the `class` attributes.

##Utility Functions
The module `JSAV.utils` includes some utility functions
for working with HTML pages and visualizations.
<h3 class="apimethod">JSAV.utils.getQueryParameter()</h3>
Returns an object containing all query parameters given for the HTML
page. If no parameters exist, returns an empty object.
  
<h3 class="apimethod">JSAV.utils.getQueryParameter(name)</h3>
Returns the value of the query parameter `name`. If no such
parameter exists, return `undefined`

<h3 class="apimethod">JSAV.utils.rand.numKey(min, max)</h3>
Returns a random integer number between `min` (inclusive) and
`max` (exclusive).

<h3 class="apimethod">JSAV.utils.rand.numKeys(min, max, num, opts)</h3>
Returns an array of `num` random integer numbers between 
`min` (inclusive) and `max` (exclusive). Optional
parameter `opts` is an object that can specify options:
  
* `sorted` If set to true, the array will be sorted.
* `sortfunc` If sorted is set to true, this option can
   be used to specify a function for sorting.
    

<h3 class="apimethod">JSAV.utils.rand.sample(arrayCollection, num)</h3>
Returns an array of `num` elements randomly picked from the
given array `arrayCollection`.

<h3 class="apimethod">JSAV.utils.dialog(html, options)</h3>
Shows a pop-up dialog with the given HTML as content. Returns an object
with function `close()` that can be used to close the dialog.
Options can include:

* modal: whether the dialog is modal (default true)
* width (and min/maxWidth): control the width of the dialog
* height (and min/maxHeight): control the height of the dialog
* closeText: if specified, a button with this text to close the dialog
  will be added
* dialogClass: custom CSS classes to be added to the created component.
  Class `jsavdialog` is always added.
* title: title of the dialog


##Animation Effects
The module `.effects` offers some useful animation effects for
  AV developers.
<h3 class="apimethod">.moveValue(...)</h3>
Method `.moveValue` animates _moving_ of a value from one structure
to another. Structure can be an array or a tree/list node. The following parameter
combinations are valid:

* `.moveValue(fromArray, fromIndex, toArray, toIndex)` Moves
  value at `fromIndex` in `fromArray` to `toIndex`
  in `toArray`. The value in `fromIndex` will be an empty
  string after this operation.
* `.moveValue(fromArray, fromIndex, toNode)` Moves
  value at `fromIndex` in `fromArray` to `toNode`. 
  The value in `fromIndex` will be an empty
  string after this operation.
* `.moveValue(fromNode, toArray, toIndex)` Moves
  value in `fromNode` to `toIndex`
  in `toArray`. The value in `fromNode` will be an empty
  string after this operation.
* `.moveValue(fromNode, toNode)` Moves value in `fromNode`
  to `toNode`. The value in `fromNode` will be an empty
  string after this operation.

In addition, `fromNode` and `toNode` can be an instance of
  `jsav.variable`.

**Note:** both from and to structures can be the same structure.

<h3 class="apimethod">.copyValue(...)</h3>
Method that animates _copying_ a value from one structure to another. The same
parameter combinations are valid as for the `.moveValue` method. The only
difference is that the source value is not removed.

<h3 class="apimethod">.swapValues(...)</h3>
Method that animates _swapping_ a value from one structure with another. The same
parameter combinations are valid as for the `.moveValue` method.

##Event Logging API
JSAV supports AVs to log student actions into an event log. It also provides mechanisms for
sites using the AVs to access a log of those events.
<h3 class="apimethod">Logging events with .logEvent(eventData)</h3>
AVs can log events on student actions using this function. The `eventData` can
be any data describing the event. If it is an object, properties `tstamp` and
`av` will be automatically added to it to mark the current time and the ID of
the AV.

For example:

    jsav.logEvent({type: "jsav-heap-decrement", newSize: bh.heapsize()});
<h3 class="apimethod">Listening to events</h3>
JSAV will trigger all events logged with the `.logEvent()` function as
`jsav-log-event` on the `body` element of the current document. To
attach a listener for those events, one can use the following code.
  
    $("body").on("jsav-log-event", function(event, eventData) {
      console.log(eventData); // here you would do something sensible with the eventData
    });

JSAV will automatically trigger many events for actions such as student moving forward,
backward, etc in the animation.
<h3 class="apimethod">Custom event handler</h3>
Sometimes listening to the events on the `body` element might not be preferred.
To customize the way the events are handler, a function to handle all JSAV events can be
passed as an option to JSAv when initializing it. Name of the option is `logEvent`.
The event handler function will be passed the `eventData` as the first argument.
For example:

    var jsav = new JSAV("avcontainerid", { logEvent: function(eventData) {
      console.log(eventData); // here you would do something sensible with the eventData
    }});

##Best Practice for Modularity


When you create a visualization, you might want to make it easy for
other people to reuse via embedding within their own pages.
Some simple steps will make this easier for them
when using a simple `iframe` tag.
The library is set up to make it natural for your visualization to
reside within the `container` element.
There is no margin or padding around the `container`, and
it has a one-pixel-wide black border.
So long as you stay within this, an `iframe` can include
your whole visualization without any disruption to the user's page.
If you would like to support mobiles, you will probably want to restrict
the full size of your `container` to at most 800 by 435 pixels.
A visualization can then be embedded with a call such as:

    <iframe src="http://algoviz.org/OpenDSA/trunk/AV/shellsort.html"
       width="824" height="459" frameborder="0" marginwidth="0"
       marginheight="0" scrolling="no">
    </iframe>


<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js">
</script>
<script>
  $(function() {
    /*dynamically create a table of contents*/
    var toc = $('#toc');
    $('h2').each(function(index, item) {
      $(item).html('<a name=\'sect' + index + '\'>' + $(item).text() + '</a>');
      toc.append($('<li> <a href=\'#sect' + index + '\'>' + $(item).text() + '</a></li>'));
    });
  });
</script>
