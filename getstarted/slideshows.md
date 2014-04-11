---
layout: subpage
title: Creating A Slideshow
---

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
