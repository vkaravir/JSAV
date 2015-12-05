---
layout: subpage
title: Set API
---

<h3 class="apimethod">jsav.g.set()</h3>
Creates a new set, which can be used to combine and then manipulate multiple graphical primitives
at the same time.

Note, that many things like changing the style for the group won’t work. Instead, they just silently fail.

<h3 class="apimethod">jsav.g.push(obj)</h3>
Adds the given ```obj``` graphical primitive to the set.

<h3>Example</h3>
<div id="setExample" class="jsavexample">
  <div class="jsavcounter"></div>
  <div class="jsavcontrols"></div>
</div>
<script>
(function() {
  var jsav = new JSAV("setExample");
  var c1 = jsav.g.circle(30, 30, 20);
  var c2 = jsav.g.circle(50, 50, 20);
  var c3 = jsav.g.circle(70, 70, 20);
  var g = jsav.g.set();
  g.push(c1);
  g.push(c2);
  g.push(c3);
  jsav.step();
  g.translateX(50);
  jsav.step();
  g.translateY(50);
  jsav.step();
  g.scale(1.5);
  jsav.recorded();
}());
</script>
