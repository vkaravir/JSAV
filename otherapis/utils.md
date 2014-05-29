---
layout: subpage
title: Utility Functions
---

The module ```JSAV.utils``` includes some utility functions
for working with HTML pages and visualizations.

<h3 class="apimethod">JSAV.utils.getQueryParameter()</h3>
Returns an object containing all query parameters given for the HTML
page. If no parameters exist, returns an empty object.

<h3 class="apimethod">JSAV.utils.getQueryParameter(name)</h3>
Returns the value of the query parameter ```name```. If no such
parameter exists, return ```undefined```

<h3 class="apimethod">JSAV.utils.rand.numKey(min, max)</h3>
Returns a random integer number between ```min``` (inclusive) and
```max``` (exclusive).

<h3 class="apimethod">JSAV.utils.rand.numKeys(min, max, num[, opts])</h3>
Returns an array of ```num``` random integer numbers between 
```min``` (inclusive) and ```max``` (exclusive). Optional
parameter ```opts``` is an object that can specify options:

 * ```sorted``` If set to true, the array will be sorted.
 * ```sortfunc``` If sorted is set to true, this option can
  be used to specify a function for sorting.
 * ```test``` A function that takes the random array as a
  parameter and returns ```true/false``` indicating whether it
  fullfills some requirements. If it returns false, a new random array is
  generated. This is typically used with exercises to randomize and
  test the initial data.
 * ```tries``` If ```test``` function is provided, this
  option specifies how many data sets are tested. If none of the first
  tries data sets pass the tests, the last one is returned.
  

<h3 class="apimethod">JSAV.utils.rand.sample(arrayCollection, num[, opts])</h3>
Returns an array of ```num``` elements randomly picked from the
given array ```arrayCollection```. The optional parameter
```opts``` can specify options ```test``` and ```tries```
like for the ```numKeys``` function.

<h3 class="apimethod">JSAV.utils.dialog(html, options)</h3>
Shows a pop-up dialog with the given HTML as content. Returns an object
with function ```close()``` that can be used to close the dialog.
Options can include:

 * modal: whether the dialog is modal (default true)
 * width (and min/maxWidth): control the width of the dialog
 * height (and min/maxHeight): control the height of the dialog
 * closeText: if specified, a button with this text to close the dialog
  will be added
 * dialogClass: custom CSS classes to be added to the created component.
  Class ```jsavdialog``` is always added.
 * title: title of the dialog
 * dialogBase: the base element inside which the dialog will be created. Defaults
    to a newly created element ```<div class="jsavdialog"></div>".
 * dialogRootElement: The element into which the dialog element will be appended.
    By default, it will be appended at the end of the ```body``` element.

<h3 class="apimethod">JSAV.utils.getInterpreter(languageJSON[, language])</h3>
Returns an interpreter function which translates tags into strings or other
values specified in the selected language. ```languageJSON``` be either a
JavaScript object or a URL to a JSON file, and can contain one or more
translations. In case there are several translations ```language``` should
specify the selected language. A simple translation JSON with two translations
would look something like:

{% highlight javascript %}
{
  "en": {
    "message": "Hello"
  },
  "fi": {
    "message": "Hei"
  }
}
{% endhighlight %}

The example above contains translations for English and Finnish. To create an
interpreter function for English, ```language``` should be set to ```"en"```.
The returned function will return ```"Hello"``` when called with the argument
```"message"```. Similarly the interpreter function returns ```"Hei"``` if
```language``` is set to ```"fi"```. Alternatively, different langauges can be
placed in different files. In this case ```languageJSON``` could be a URL with
the language tag ```{lang}``` that will be substituted with the value of
```language```. For instance if the URL is ```"path/to/{lang}.json"``` and
```language``` is ```"en"``` the translation will be fetched from
```"path/to/en.json"```.