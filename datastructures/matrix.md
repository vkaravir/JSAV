---
layout: subpage
title: Matrix (or, 2D Array) API
---

The Matrix data structure is essentially a 2-dimensional array.

<h3 class="apimethod">.ds.matrix(data[, options]) or .ds.matrix(options)</h3>
A matrix can be initialized with the ```.ds.matrix()``` function of a JSAV instance.
  If the ```data``` argument is provided, it should be an array of arrays, all of the
  same length. If only ```options``` argument is provided, it needs to specify options
```rows``` and ```columns``` specifying the size of the matrix.

Matrix supports the [common options and position options]({{ site.baseurl }}/common/). Additional option that can be specified:

 * style: The style of the array. Valid values are ```plain```, ```matrix```, and
  ```table```. Defaults to ```table```.

<div id="matrixStyles" class="jsavexample"></div>
<script>
(function() {
  var jsav = new JSAV("matrixStyles");
  jsav.label("Table Style", {center: true});
  var tableStyle = jsav.ds.matrix([[0, 1], [2, 3]]);
  jsav.label("Matrix Style", {center: true});
  var matrixStyle = jsav.ds.matrix([[0, 1], [2, 3]], {style: "matrix"});
  jsav.label("Plain Style", {center: true});
  var plainStyle = jsav.ds.matrix([[0, 1], [2, 3]], {style: "plain"});
}());
</script>
<script>
</script>

For example, this would create a 2x2 matrix: ```var m = jsav.ds.matrix([[0, 1], [2, 3]])```.
  An empty 5x8 matrix using the matrix style could be created like this:

{% highlight javascript %}
var m = jsav.ds.matrix({rows: 5, columns: 8, style: "matrix"});
{% endhighlight %}

<h3 class="apimethod">.swap(row1, col1, row2, col2[, options])</h3>
Swaps two values of the matrix, namely (row1, col1) with (ro2, col2).

<h3 class="apimethod">.layout([options])</h3>
Recalculates the layout for the data structure.

<h3 class="apimethod">Array methods</h3>
Like for the array, there are similar functions in the matrix that take the row number as the
first argument and the rest of the arguments similarly than the corresponding array function.
These functions are ```highlight```, ```unhighlight```, ```isHighlight```,
```css```, ```value```, ```addClass```, ```hasClass```,
```removeClass```, and ```toggleClass```. So, for example, whereas the array
has function ```.addClass(col, className)```, the matrix has a function
```.addClass(row, col, className)```.
