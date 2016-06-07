---
layout: subpage
title: Required Files and HTML
---

### Loading the Required Files


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


### HTML Template for the Visualization


Visualizations generally include two parts:
HTML DOM elements, and JavaScript elements.
The HTML section typical includes something like this:

{% highlight html %}
<div id="container">
  <div class="jsavcontrols"></div>
  <p class="jsavoutput jsavline"></p>
</div>
{% endhighlight %}

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
