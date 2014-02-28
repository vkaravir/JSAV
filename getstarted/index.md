---
layout: page
title: Getting Started
---


## Loading the Required Files


The easiest way to check the required files is to look at
the examples directory and copy one of those files as a template for
your new AV.



If done manually, the files required (in this order) are as follows.
Note that <code>[JSAV]</code> refers to the relative position of the
JSAV library directory, which depends on where you are developing from.


 * jquery.transit: <code>[JSAV]/lib/jquery.transit.js</code>
 * Rapha&euml;l: <code>[JSAV]/lib/raphael.js</code>
 * The library: Either <code>[JSAV]/build/jsav.js</code> or
      <code>[JSAV]/build/jsav-min.js</code>.
      This must always be included.


The main jQuery library must always be loaded.
jQuery UI and jquery.transit are only needed when you use the
library to show animations, such as using the data structures or
graphical primitives and modifying them. In other words, using
any other part of the library than the messaging API. Rapha&euml;l is
only needed when using graphical primitives like circles and
rectangles or when using data structures with edges.


In addition, developers must include the supporting .css file:
<code>[JSAV]/css/JSAV.css</code>


## HTML Template for the Visualization


Visualizations generally include two parts:
HTML DOM elements, and JavaScript elements.
The HTML section typical includes something like this:

    <div id="container">
      <div class="jsavcontrols"></div>
      <p class="jsavoutput jsavline"></p>
    </div>

 * <code>container</code> This is the container element for the visualization
 * <code>jsavcontrols</code> The library will generate slideshow controls inside this
  element if your visualization uses the slideshow API
 * <code>jsavoutput</code> The area where the messages from the
      visualization will be displayed to the user.
      Type can further be specified using either
      class <code>jsavline</code> or <code>jsavscroll</code>.
      See the Messages API for more details.

If you want a finer control on where inside the JSAV container the
data structures are added, you can also add
<code>&lt;div class="jsavcanvas">&lt;/div></code>. Then, all DOM
elements created by JSAV will be added inside this element.

## Creating A Visualization
Initializing the visualization container is simple:
<pre>var av = new JSAV("container");</pre>
The <code>container</code> here refers to the id attribute of the
  container element (see the HTML template above).
  Alternatively, a DOM or jQuery element can be
  used as well. So, the following are alternative ways to achieve
  the same result:

    var av = new JSAV(document.getElementById("container"));
    var av = new JSAV(jQuery("#container"));

Both alternatives accept an optional second parameter <code>options</code>
  which should be a JavaScript object. The options that are currently
  supported:

 * <code>title</code> Title of the AV. This will be shown as the first slide of the
    slideshow.
 * <code>animationMode</code> Use "none" to turn off animation (slideshow) mode.
 * <code>output</code> The output buffer element to use with the Messaging API. The value
    of the option should be a DOM element, CSS selector string, or a jQuery object.
 * <code>autoresize</code> Control whether the JSAV canvas element automatically adjusts
    its size based on the content. Defaults to <code>true</code>.

In addition to the options passed to the function, any options specified
  in a global variable <code>JSAV_OPTIONS</code> will be used. Those passed on
  initialization always override the global options.

## Slideshow Support

A slideshow is created by using a series of calls to the
  <code>.step()</code> method.
  Associated with each step, you use method calls to define or show
  the appropriate data structures and UI elements along with any
  actions to take place (such as swapping elements in an array or
  highlighting an element).

<h3 class="apimethod">.step()</h3>
Marks that a new step in the animation will start. Basically,
   everything within one step will be animated simultaneously when
   moving backward and forward.


<b>Returns:</b> A JSAV object. Thus, this method may be chained with,
for example, the <code>umsg</code> method.


<h3 class="apimethod">.recorded()</h3>

A call to this method is placed at the end of the series of
<code>.step()</code> method calls to start the slideshow.


<h3 class="apimethod">.displayInit()</h3>
Marks the current state of the visualization as the state where the
  animation will start. That is, what will be displayed initially.

<b>Returns:</b> A JSAV object. Thus, this method may be chained.


<h3 class="apimethod">.animInfo()</h3>

This will return an object that has two properties: number of slides
and and number of effects.
It might be better used when called from somewhere like the FireBug
command line than in an actual AV implementation.
It can help a developer to optimize the complexity of the slideshow.

<h3>The <code>counter</code> element</h3>

A slideshow counter showing the position in slideshow (e.g. 2/120) can
be added by including a DOM element with class <code>jsavcounter</code>
inside the <code>container</code>.
For example, you can add
<code>&lt;span class="jsavcounter">&lt;/span></code> to some DOM element
to attach the counter.
