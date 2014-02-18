---
layout: subpage
title: Settings for AVs
---

There is a configurable settings dialog class in JSAV.utils.Settings.
The settings objects can be instantiated with ```new JSAV.utils.Settings(elem)```
where the optional ```elem``` parameter specifies an element on which a
click will open the dialog. 

The settings used by an instance of JSAV can be specified with the ```settings```
option for the constructor. For example

{% highlight javascript %}
var av = new JSAV(jQuery("#container"), {"settings": settings});
{% endhighlight %}

If no custom settings
are given, JSAV will automatically create a default settings panel and attach it to
any element with class ```jsavsettings``` inside the container.
No matter how the settings object is initialized,
it can be accessed through the ```av.settings```
field.

A settings instance has the following functions.

<h3 class="apimethod">settings.show()</h3>
Shows the settings dialog.

<h3 class="apimethod">settings.close()</h3>
Closes the settings dialog.

<h3 class="apimethod">settings.add(varname, options)</h3>
Adds a component to the settings dialog. Parameter ```varname``` is the unique
name of the variable for this setting which can be used later to get the value of the setting.
Parameter ```options``` is an object used to specify the properties of the settings
variable. The following options can be set:

 * type: Type of the HTML element used for this setting. Choices are ```select``` and
    valid values for the text attribute of an HTML input element (such as text, email, range).
 * label: The label displayed next to the form element of this setting.
 * value: The initial value of the setting.
 * options: Select options for the type select. This should be an object representing key-value pairs.
    For example, ```"options": {"bar": "Bar layout", "array", "Array layout"}``` would add
    two choices: Bar layout and Array layout.

In addition to these options, when using an HTML input element (text, email) to represent the setting,
  any additional options will be set as attributes of the ```input``` element. For example:

{% highlight javascript %}
settings.add("speed", {"type": "range",
                       "value": "7",
                       "min": 1,
                       "max": 10,
                       "step": 1});
{% endhighlight %}

Would create ```<input type="range" value="7" min="1" max="10" step="1" />```.
  
The ```add``` function returns a reference to the setting. The function ```val()``` 
  returns the value of the setting.
  

<h3 class="apimethod">settings.add(function)</h3>
Adds a more customizable component to the settings dialog. The parameter should be a function
that returns a DOM element or a jQuery object.
