---
layout: subpage
title: Circle API
---

<h3 class="apimethod">jsav.g.circle(cx, cy, r[, properties])</h3>
Initializes a new circle with the given center and radius. Optional parameter ```properties```,if given,
should be an object with key-value pairs. See <a href="http://raphaeljs.com/reference.html#Element.attr">raphael.attr</a>
for valid keys and values.

<h3 class="apimethod">.center([cx, cy])</h3>
Gets or sets the center of the circle. The center is returned as an object with properties ```cx``` and ```cy```.

<h3 class="apimethod">.radius([r])</h3>
Gets or sets the radius of the circle.

<h3>Example</h3>
<div id="circleExample" class="jsavexample"></div>
<script>
(function() {
  var jsav = new JSAV("circleExample");
  jsav.g.circle(100, 55, 50);
  jsav.g.circle(250, 55, 50, {stroke: "red"});
  jsav.g.circle(400, 55, 50, {fill: "orange"});
  jsav.g.circle(550, 55, 50, {stroke: "orange", "stroke-width": 4});
  jsav.displayInit();
}());
</script>