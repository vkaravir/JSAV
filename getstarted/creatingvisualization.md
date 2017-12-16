---
layout: subpage
title: Creating A Visualization
---

Initializing the visualization container is simple:

{% highlight javascript %}
var av = new JSAV("container");
{% endhighlight %}

The <code>container</code> here refers to the id attribute of the
  container element (see the HTML template above).
  Alternatively, a DOM or jQuery element can be
  used as well. So, the following are alternative ways to achieve
  the same result:

{% highlight javascript %}
var av = new JSAV(document.getElementById("container"));
var av = new JSAV(jQuery("#container"));
{% endhighlight %}

Both alternatives accept an optional second parameter <code>options</code>
  which should be a JavaScript object. The options that are currently
  supported:

 * <code>title</code> Title of the AV. This will be shown as the first slide of the
    slideshow.
 * <code>animationMode</code> Use "none" to turn off animation (slideshow) mode.
 * <code>output</code> The output buffer element to use with the Messaging API. The value
    of the option should be a DOM element, CSS selector string, or a jQuery object.
 * <code>narration</code> For slideshows, an object that configures text-to-speech narration, which uses the 
    <code>[SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)</code>
    functionality of the user's browser. If enabled, every call to <code>umsg()</code> will be narrated.
    The narration object has the following properties, all of which are optional:
      - enabled: A boolean specifying whether a button should be displayed that will allow the user to 
      turn on/off narration for the slideshow. Defaults to <code>false</code>.
      - appendReplacements: An array of objects that specify certain patterns that should be replaced in 
      the text before it is given to the SpeechSynthesis API. Each object should have the format
        ```
          {
            searchValue: <regexp or substring>,
            replaceValue: <replacement substring, or function>
          }
        ```
        The values specified by searchValue and replaceValue will be passed as arguments to 
        <code>[String.replace()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)</code>.
      These replacements will be appended to the global list of replacements defined by
      <code>JSAV_OPTIONS.narration.replacements</code>.
      - overrideReplacements: Same as appendReplacements, except these replacements will override the
      global list of replacements defined by <code>JSAV_OPTIONS.narration.replacements</code>.
 * <code>autoresize</code> Control whether the JSAV canvas element automatically adjusts
    its size based on the content. Defaults to <code>true</code>.

In addition to the options passed to the function, any options specified
  in a global variable <code>JSAV_OPTIONS</code> will be used. Those passed on
  initialization always override the global options.
