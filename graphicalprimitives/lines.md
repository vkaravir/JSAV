---
layout: subpage
title: Line, Polygon, and Polyline API
---

<h3 class="apimethod">jsav.g.line(x1, y1, x2, y2[, properties])</h3>
Initializes a line from point ```x1, y1``` to ```x2, y2```. Optional parameter 
  ```properties```,if given, should be an object with key-value pairs. See 
  <a href="http://raphaeljs.com/reference.html#Element.attr">raphael.attr</a> for valid keys and values.

<h3 class="apimethod">jsav.g.polyline(points[, properties]) and jsav.polygon(points[, properties])</h3>
Initializes a polyline or polygon. Parameter ```points``` should be an array of arrays with
  x and y coordinates. For example:

    var polyline = av.g.polyline([[0, 0], [20, 20], [200, 200]], 
                                  {"stroke-width": 7, "stroke":"#ddd"});
Optional parameter 
  ```properties```,if given, should be an object with key-value pairs. See 
  <a href="http://raphaeljs.com/reference.html#Element.attr">raphael.attr</a> for valid keys and values.

<h3 class="apimethod">.translatePoint(point, dx, dy)</h3>
Translates the given ```point``` in the (poly)line by the given amount of pixels. The point is a zero-indexed list of points used to initialize the polyline. For line, start point is index 0 and endpoint index 1.

<h3 class="apimethod">.movePoints(points)</h3>
Moves the given points to the given pixel positions. Parameter ```points``` should be an array of arrays with each item specifying point, px, and py.
