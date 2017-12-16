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

The  option ```fill: <object>``` can be used to easily insert variable values
to the message. This feature is especially useful when the AV is being
translated to different languages. The message should contain a tag surrounded
by curly brackets where the value should be inserted. The object handed to the
fill option should map the different tags used in the message to their values.
The tags are replaced with regular expression, which means that the tags should
not contain characters such as ```$ ^ . + -```, or consist only of digits.
Fill option example:

{% highlight javascript %}
// This will output "Value of variable x: 5"
av.umsg("Value of variable x: {x}", {fill: {x: 5}});
{% endhighlight %}

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

<h2>Narration</h2>

JSAV can narrate calls to <code>umsg</code> using the browser's [SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) functionality. Narration is disabled by default. To configure global narration options, you can modify the properties of the <code>window.JSAV_OPTIONS.narration</code> object. The properties of this object include:
- enabled: A boolean indicating whether a button that users can click to turn on/off narration will be added to slideshows. Defaults to <code>false</code>.
- replacements: An array of objects that specify certain patterns that should be replaced
before the text is given to the SpeechSynthesis API. These objects have the format:
  ```
    {
      searchValue: <regexp or substring>,
      replaceValue: <replacement substring, or function>
    }
  ```
  The values specified by searchValue and replaceValue will be passed as arguments to 
  <code>[String.replace()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)</code>.
- langMap: The speechSynthesis API uses IETF lanaguage tags to label, which can include region subtags for languages that have regional variations (e.g. en-US and en-UK). This object specifies how the language of the visualization should be mapped to IETF language tags, which can affect the accent of the voice used by the SpeechSynthesis API. If no mapping exists, then the language of the visualization will be used directly. Below is an example of a langMap object:
  ```
    {
      "en": "en-US",
      "fr": "fr-FR"
    }
  ```
  
So in order to enable narration, you can do <code>window.JSAV_OPTIONS.narration.enabled = true</code>

For information on how to override the global narration settings for an individual slideshow, see [Creating A Visualization](../getstarted/creatingvisualization.md).
