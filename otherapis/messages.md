---
layout: subpage
title: Messages API
---

The Messages API allows the user to control the contents of the output
message buffer intended for informing the user about the state of the
visualization or for providing directions.


The output buffer will have been specified in the HTML section of the
document. It is defined as an empty paragraph of class
```jsavoutput```, with one of the following class options.


```class="jsavoutput jsavline"``` indicates a small "line-style"
message buffer where typically each line overwrites the previous one.


```class="jsavoutput jsavscroll"``` indicates a visible textbox with a
scrollbar. The textbox is only cleared when explicitly directed by a
```.clearumsg()``` call.
Since this acts as a normal HTML paragraph,
optional standard parameters can be used such as
```readonly="readonly"``` to make 
the textbox unwriteable by the user, or to
override the default height and width.

Alternative way to specify where the output buffer element is to use the
```output``` option when initializing the JSAV instance. The value
of the option should be a DOM element, CSS selector string, or a jQuery object.

<h3 class="apimethod">.umsg(msg[, options])</h3>

Add the given message ```msg``` to the message
output. The optional ```options``` parameter
can be an object whose properties specify the
behavior. The ```color``` property is used (when
present) to change the color of the message.
Use would look something like:

{% highlight javascript %}
av.umsg("My message here", {"color": "blue"});
{% endhighlight %}

When "line-style" message buffer is used, option
```"preserve": true``` can be used to append the new message
after the previous one instead of clearing the buffer.


Since the
```msg``` is output as standard HTML, the style of
the message text can also be controlled by using HTML commands.



**Returns:** A JSAV object. Thus, this method may be chained with,
for example, the ```step``` method.



<h3 class="apimethod">.clearumsg()</h3>
Clear the contents of the output message buffer.

<h3 class="apimethod">Events</h3>
The message API will trigger a ```jsav-message``` event on the JSAV
  ```container``` whenever the output buffer content should change. You
  can listen for this event to integrate more complex output behavior.
