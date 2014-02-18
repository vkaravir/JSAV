---
layout: subpage
title: Event Logging
---

JSAV supports AVs to log student actions into an event log. It also provides mechanisms for
  sites using the AVs to access a log of those events.

<h3 class="apimethod">Logging events with .logEvent(eventData)</h3>
AVs can log events on student actions using this function. The ```eventData``` can
  be any data describing the event. If it is an object, properties ```tstamp``` and
  ```av``` will be automatically added to it to mark the current time and the ID of
  the AV.

For example:

{% highlight javascript %}
jsav.logEvent({type: "jsav-heap-decrement",
               newSize: bh.heapsize()});
{% endhighlight %}

<h3 class="apimethod">Listening to events</h3>
JSAV will trigger all events logged with the ```.logEvent()``` function as
  ```jsav-log-event``` on the ```body``` element of the current document. To
  attach a listener for those events, one can use the following code.

{% highlight javascript %}
$("body").on("jsav-log-event", function(event, eventData) {
  // here you would do something sensible with the eventData
  console.log(eventData);
});
{% endhighlight %}

JSAV will automatically trigger many events for actions such as student moving forward,
  backward, etc in the animation.

<h3 class="apimethod">Custom event handler</h3>
Sometimes listening to the events on the ```body``` element might not be preferred.
  To customize the way the events are handler, a function to handle all JSAV events can be
  passed as an option to JSAV when initializing it. Name of the option is ```logEvent```.
  The event handler function will be passed the ```eventData``` as the first argument.
  For example:

{% highlight javascript %}
var jsav = new JSAV("avcontainerid", { logEvent: function(eventData) {
  // here you would do something sensible with the eventData
  console.log(eventData);
}});
{% endhighlight %}