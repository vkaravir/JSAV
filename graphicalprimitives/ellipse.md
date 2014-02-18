---
layout: subpage
title: Ellipse API
---

<h3 class="apimethod">jsav.g.ellipse(cx, cy, rx, ry[, properties])</h3>
Initializes a new ellipse with the given center and x and y radius. Optional parameter 
```properties```,if given, should be an object with key-value pairs. See 
<a href="http://raphaeljs.com/reference.html#Element.attr">raphael.attr</a> for valid keys and values.

<h3 class="apimethod">.center([cx, cy])</h3>
Same as center function of the circle.

<h3 class="apimethod">.radius([rx, ry])</h3>
Gets or sets the radius of the ellipse. The radius is returned as an object with
properties ```rx``` and ```ry```.
