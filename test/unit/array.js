(function() {
  module("datastructures.array", {  });
test("Initializing from HTML", function() {
  var values = [12, 22, 14, 39, 10]; // array in HTML
  expect(8);
	var av = new JSAV("arraycontainer");
	ok( av, "JSAV initialized" );
	ok( av.ds.array, "Array exists" );
	var arr = av.ds.array($("#array"));
	ok( arr, "Array initialized" );
	for (var i = 0; i < values.length; i++) {
	  equals( arr.value(i), values[i], "Getting value of index " + i );
	}
});


test("Initializing from Array", function() {
  var values = [15, 26, 13, 139, 10];
  expect(8);
	var av = new JSAV("emptycontainer");
	ok( av, "JSAV initialized" );
	ok( av.ds.array, "Array exists" );
	var arr = av.ds.array(values);
	ok( arr, "Array initialized" );
	for (var i = 0; i < values.length; i++) {
	  equals( arr.value(i), values[i], "Getting value of index " + i );
	}
});

test("Highlighting indices in Array", function() {
  // [12, 22, 14, 39, 10] array in HTML
	var av = new JSAV("arraycontainer"),
	  arr = av.ds.array($("#array")),
	  props = ["color", "background-color"];
	arr.highlight(0);
	av.step();
	arr.highlight([1]); // highlight with an array
	av.step();
	arr.highlight(function(index) { return index>3;}); // highlight with function
	av.step();
  arr.highlight(); // highlight all
	av.recorded(); // will do rewind, nothing should be highlighted
	$.fx.off = true;

  arrayUtils.testArrayHighlights(arr, [0, 0, 0, 0, 0], props);
  
  av.forward(); // apply first highlight

  arrayUtils.testArrayHighlights(arr, [1, 0, 0, 0, 0], props);

  av.forward(); // apply 2nd (array version) highlight
  arrayUtils.testArrayHighlights(arr, [1, 1, 0, 0, 0], props);

  av.forward(); // apply 3rd (function version) highlight
  arrayUtils.testArrayHighlights(arr, [1, 1, 0, 0, 1], props);

  av.forward(); // apply last highlight (all should now be highlighted)
  arrayUtils.testArrayHighlights(arr, [1, 1, 1, 1, 1], props);

	av.begin(); // going to beginning should remove all highlights
  arrayUtils.testArrayHighlights(arr, [0, 0, 0, 0, 0], props);
	av.end(); // going to the end should reapply the highlights
  arrayUtils.testArrayHighlights(arr, [1, 1, 1, 1, 1], props);
	testDiv = null;
});

test("Unhighlighting indices in Array", function() {
  // [12, 22, 14, 39, 10] array in HTML
	var av = new JSAV("arraycontainer"),
	  arr = av.ds.array($("#array")),
	  props = ["color", "background-color"];

	arr.highlight();
	av.step();
	arr.unhighlight(0);
	av.step();
	arr.unhighlight([1]); // highlight with an array
	av.step();
	arr.unhighlight(function(index) { return index>3;}); // highlight with function
	av.step();
  arr.unhighlight(); // highlight all
	av.recorded(); // will do rewind, nothing should be highlighted
	$.fx.off = true;

  arrayUtils.testArrayHighlights(arr, [0, 0, 0, 0, 0], props);
  
  av.forward(); // apply first highlight
  arrayUtils.testArrayHighlights(arr, [1, 1, 1, 1, 1], props);

  av.forward(); // apply first unhighlight
  arrayUtils.testArrayHighlights(arr, [0, 1, 1, 1, 1], props);

  av.forward(); // apply 2nd (array version) unhighlight
  arrayUtils.testArrayHighlights(arr, [0, 0, 1, 1, 1], props);

  av.forward(); // apply 3rd (function version) unhighlight
  arrayUtils.testArrayHighlights(arr, [0, 0, 1, 1, 0], props);

  av.forward(); // apply last unhighlight (all should now be unhighlighted)
  arrayUtils.testArrayHighlights(arr, [0, 0, 0, 0, 0], props);

	av.begin(); // going to beginning should remove all highlights
  arrayUtils.testArrayHighlights(arr, [0, 0, 0, 0, 0], props);
	av.end(); // going to the end should reapply the unhighlights
  arrayUtils.testArrayHighlights(arr, [0, 0, 0, 0, 0], props);
	testDiv = null;
});

test("Highlight without parameters", function() {
	var av = new JSAV("arraycontainer"),
	  arr = av.ds.array($("#array")),
	  props = ["color", "background-color"];
	arr.highlight();
	av.recorded();
	arrayUtils.testArrayHighlights(arr, [0, 0, 0, 0, 0], props);
	$.fx.off = true;
	av.forward();
	arrayUtils.testArrayHighlights(arr, [1, 1, 1, 1, 1], props);
});

test("Simple swaps", function() {
  var av = new JSAV("emptycontainer"),
    arr = av.ds.array([10, 20, 30, 40]);
  arr.swap(0, 2);
  av.step();
  arr.swap(0, 3);
  av.recorded();
  $.fx.off = true;
  arrayUtils.testArrayValues(arr, [10, 20, 30, 40]);
  av.forward();
  arrayUtils.testArrayValues(arr, [30, 20, 10, 40]);
  av.forward();
  arrayUtils.testArrayValues(arr, [40, 20, 10, 30]);
  av.backward();
  arrayUtils.testArrayValues(arr, [30, 20, 10, 40]);
  av.backward();
  arrayUtils.testArrayValues(arr, [10, 20, 30, 40]);
});

test("Swaps with highlights", function() {
  var av = new JSAV("emptycontainer"),
    arr = av.ds.array([10, 20, 30, 40]),
	  props = ["color", "background-color"];
  arr.highlight(function(index) { return index%2 == 0;});
  av.step();
  arr.swap(0, 2);
  av.step();
  arr.unhighlight(function(index) { return index%2 == 0;});
  av.recorded();
  $.fx.off = true;
  arrayUtils.testArrayHighlights(arr, [0, 0, 0, 0, 0], props);
  arrayUtils.testArrayValues(arr, [10, 20, 30, 40]);
	av.forward(); // apply highlight
	arrayUtils.testArrayHighlights(arr, [1, 0, 1, 0, 0], props);
  arrayUtils.testArrayValues(arr, [10, 20, 30, 40]);
  av.forward(); // apply swap
	arrayUtils.testArrayHighlights(arr, [1, 0, 1, 0, 0], props);
  arrayUtils.testArrayValues(arr, [30, 20, 10, 40]);
	av.forward(); // apply unhighlight
  arrayUtils.testArrayHighlights(arr, [0, 0, 0, 0, 0], props);
  arrayUtils.testArrayValues(arr, [30, 20, 10, 40]);
});
})();