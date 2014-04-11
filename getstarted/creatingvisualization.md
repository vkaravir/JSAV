---
layout: subpage
title: Creating A Visualization
---

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

