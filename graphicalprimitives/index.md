---
layout: page
title: Graphical Primitives
---

JSAV supports the following graphical primitives: [circle](circle/), [rectangle](rectangle/), [line](lines/),
  [ellipse](ellipse/), [polygon](lines/), [polyline](lines/), and [path](path/). All these are in the JSAV.g namespace. A
  rectangle, for example, can be initialized like follows.

    var rect = av.g.rect(70, 60, 50, 40);

This would initialize a rectangle with upper-left corner at point (70, 60) that
  is 50 pixels wide and 40 pixels tall.

**Note:** Make sure you [load Rapha&euml;l.js](../getstarted/) when using the graphical primitives.

All the graphical primitives have the following functions.

<h3 class="apimethod">.show()</h3>
Make the shape visible. Essentially the same as calling ```.css({opacity: 1})```.

<h3 class="apimethod">.hide()</h3>
Make the shape invisible. Essentially the same as calling ```.css({opacity: 0})```.

<h3 class="apimethod">.isVisible()</h3>
Return true if the shape is visible, false if hidden.

<h3 class="apimethod">.rotate(deg)</h3>
Rotates the object by the given amount of degrees around the center of the shape.

<h3 class="apimethod">.scale(sx, sy), .scaleX(sx), .scaleY(sy)</h3>
Scales the object by given amount. The shortcuts for X/Y scaling only
  are the same as calling ```.scale(sx, 0)``` and ```.scale(0, sy)```. For example

    rect.scale(2, 1.5)

would make the rectangle from the previous example to have width of 100 pixels and height of 60px. Note, that the position of the rectangle would also change, since the scaling is done relative to the center of the shape.

<h3 class="apimethod">.translate(dx, dy), .translateX(dx), .translateY(dy)</h3>
Translates the shape by the given amount. Again, X/Y versions are shortcuts to
  the main translation function.

<h3 class="apimethod">.css(propname)</h3>
Returns the value of the attribute with the name ```propname```.

<h3 class="apimethod">.css(propname, propvalue), .css(propsObj)</h3>
Like the .css functions of the other JSAV objects, these can be used to animate
  attributes of the shape. Technically, what is changed is not CSS properties but
  attributes of the SVG element visualizing the shape. For a list of valid values,
  see <a href="http://raphaeljs.com/reference.html#Element.attr">Rapha&euml;l JS documentation</a>.


The primitive-specific pages give more details on what functions are available for each type.
  {% include subpages.html %}
