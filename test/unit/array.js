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
	  testDiv = $('<div class="array" style="position:absolute;left:-10000px;"><div class="node index highlight"></div><div class="node index" ></div></div>').find(".node"),
	  hlDiv = testDiv.filter(".highlight");
	  unhlDiv = testDiv.not(".highlight");
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

  testArrayHighlights(arr, [0, 0, 0, 0, 0], hlDiv, unhlDiv, props);
  
  av.forward(); // apply first highlight

  testArrayHighlights(arr, [1, 0, 0, 0, 0], hlDiv, unhlDiv, props);

  av.forward(); // apply 2nd (array version) highlight
  testArrayHighlights(arr, [1, 1, 0, 0, 0], hlDiv, unhlDiv, props);

  av.forward(); // apply 3rd (function version) highlight
  testArrayHighlights(arr, [1, 1, 0, 0, 1], hlDiv, unhlDiv, props);

  av.forward(); // apply last highlight (all should now be highlighted)
  testArrayHighlights(arr, [1, 1, 1, 1, 1], hlDiv, unhlDiv, props);

	av.begin(); // going to beginning should remove all highlights
  testArrayHighlights(arr, [0, 0, 0, 0, 0], hlDiv, unhlDiv, props);
	av.end(); // going to the end should reapply the highlights
  testArrayHighlights(arr, [1, 1, 1, 1, 1], hlDiv, unhlDiv, props);
	testDiv = null;
});

test("Unhighlighting indices in Array", function() {
  // [12, 22, 14, 39, 10] array in HTML
	var av = new JSAV("arraycontainer"),
	  arr = av.ds.array($("#array")),
	  testDiv = $('<div class="array"><div class="node index highlight"></div><div class="node index" ></div></div>').find(".node"),
	  hlDiv = testDiv.filter(".highlight");
	  unhlDiv = testDiv.not(".highlight");
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

  testArrayHighlights(arr, [0, 0, 0, 0, 0], hlDiv, unhlDiv, props);
  
  av.forward(); // apply first highlight
  testArrayHighlights(arr, [1, 1, 1, 1, 1], hlDiv, unhlDiv, props);

  av.forward(); // apply first unhighlight
  testArrayHighlights(arr, [0, 1, 1, 1, 1], hlDiv, unhlDiv, props);

  av.forward(); // apply 2nd (array version) unhighlight
  testArrayHighlights(arr, [0, 0, 1, 1, 1], hlDiv, unhlDiv, props);

  av.forward(); // apply 3rd (function version) unhighlight
  testArrayHighlights(arr, [0, 0, 1, 1, 0], hlDiv, unhlDiv, props);

  av.forward(); // apply last unhighlight (all should now be unhighlighted)
  testArrayHighlights(arr, [0, 0, 0, 0, 0], hlDiv, unhlDiv, props);

	av.begin(); // going to beginning should remove all highlights
  testArrayHighlights(arr, [0, 0, 0, 0, 0], hlDiv, unhlDiv, props);
	av.end(); // going to the end should reapply the unhighlights
  testArrayHighlights(arr, [0, 0, 0, 0, 0], hlDiv, unhlDiv, props);
	testDiv = null;
});

test("Highlight without parameters", function() {
	var av = new JSAV("arraycontainer"),
	  arr = av.ds.array($("#array")),
	  testDiv = $('<div class="array"><div class="node index highlight"></div><div class="node index" ></div></div>').find(".node"),
	  hlDiv = testDiv.filter(".highlight");
	  unhlDiv = testDiv.not(".highlight");
	  props = ["color", "background-color"];
	arr.highlight();
	av.recorded();
	testArrayHighlights(arr, [0, 0, 0, 0, 0], hlDiv, unhlDiv, props);
	$.fx.off = true;
	av.forward();
	testArrayHighlights(arr, [1, 1, 1, 1, 1], hlDiv, unhlDiv, props);
});

test("Simple swaps", function() {
  var av = new JSAV("emptycontainer"),
    arr = av.ds.array([10, 20, 30, 40]);
  arr.swap(0, 2);
  av.step();
  arr.swap(0, 3);
  av.recorded();
  $.fx.off = true;
  testArrayValues(arr, [10, 20, 30, 40]);
  av.forward();
  testArrayValues(arr, [30, 20, 10, 40]);
  av.forward();
  testArrayValues(arr, [40, 20, 10, 30]);
  av.backward();
  testArrayValues(arr, [30, 20, 10, 40]);
  av.backward();
  testArrayValues(arr, [10, 20, 30, 40]);
});

test("Swaps with highlights", function() {
  var av = new JSAV("emptycontainer"),
    arr = av.ds.array([10, 20, 30, 40]),
	  testDiv = $('<div class="array"><div class="node index highlight"></div><div class="node index" ></div></div>').find(".node"),
	  hlDiv = testDiv.filter(".highlight");
	  unhlDiv = testDiv.not(".highlight");
	  props = ["color", "background-color"];
  arr.highlight(function(index) { return index%2 == 0;});
  av.step();
  arr.swap(0, 2);
  av.step();
  arr.unhighlight(function(index) { return index%2 == 0;});
  av.recorded();
  $.fx.off = true;
  testArrayHighlights(arr, [0, 0, 0, 0, 0], hlDiv, unhlDiv, props);
  testArrayValues(arr, [10, 20, 30, 40]);
	av.forward(); // apply highlight
	testArrayHighlights(arr, [1, 0, 1, 0, 0], hlDiv, unhlDiv, props);
  testArrayValues(arr, [10, 20, 30, 40]);
  av.forward(); // apply swap
	testArrayHighlights(arr, [1, 0, 1, 0, 0], hlDiv, unhlDiv, props);
  testArrayValues(arr, [30, 20, 10, 40]);
	av.forward(); // apply unhighlight
  testArrayHighlights(arr, [0, 0, 0, 0, 0], hlDiv, unhlDiv, props);
  testArrayValues(arr, [30, 20, 10, 40]);
});
})();