---
layout: subpage
title: Rectangle API
---

<h3 class="apimethod">jsav.g.rect(x, y, w, h[, r, properties])</h3>
Initializes a new rectangle with upper left corner at ```x, y``` and given width and height.
Optional parameter ```r``` can be used to specify the roundness of corners.
Optional parameter ```properties```, if given, should be an object with key-value pairs. See
<a href="http://raphaeljs.com/reference.html#Element.attr">raphael.attr</a> for valid keys and values.

<h3 class="apimethod">.width([w])</h3>
Gets or sets the width of the rectangle.

<h3 class="apimethod">.height()</h3>
Gets or sets the height of the rectangle.