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

test("Test isHighlight", function() {
	var av = new JSAV("arraycontainer"),
	  arr = av.ds.array($("#array")),
	  props = ["color", "background-color"];
	arr.highlight([0, 3]);
	av.recorded();
	av.end();
	ok(arr.isHighlight(0));
	ok(!arr.isHighlight(1));
	ok(!arr.isHighlight(2));
	ok(arr.isHighlight(3));
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
test("Swaps with indices", function() {
  var av = new JSAV("emptycontainer"),
    arr = av.ds.array([10, 20, 30, 40], {indexed: true}),
    ind0,
    ind2;
  arr.swap(0, 2);
  av.recorded();
  $.fx.off = true;
  ind0 = $($(".jsavindexed li")[0]);
  ind2 = $($(".jsavindexed li")[2]);
  // indices in the beginning should be 0 and 2
  equals(ind0.find(".jsavindexlabel").text(), "0");
  equals(ind2.find(".jsavindexlabel").text(), "2");
  av.forward();
  // .. as they should after the swap
  equals(ind0.find(".jsavindexlabel").text(), "0");
  equals(ind2.find(".jsavindexlabel").text(), "2");
});

test("Comparing arrays", function() {
  var av = new JSAV("emptycontainer"),
    arr1 = av.ds.array([10, 20, 30, 40], {indexed: true}),
    arr2 = av.ds.array([10, 30, 20, 40]),
    arr3 = av.ds.array([10, 30, 20, 40]),
    arr4 = av.ds.array([10, 30, 20, 40, 50]);
  equals(arr1.equals([10, 20, 30, 40, 50]), false, "Different lengths should not match");
  equals(arr1.equals([10, 20, 30, 40]), true, "Equal arrays");
  equals(arr1.equals(arr2), false, "Arrays with different values");
  equals(arr2.equals(arr3), true, "Equal JSAV arrays");
  equals(arr3.equals(arr4), false, "Different lengths should not match"); 
  equals(arr2.equals(arr3, {'css': 'background-color'}), true, "Equals values and background-colors");
  equals(arr2.equals(arr3, {'css': ['color', 'background-color']}), true, "Equal values, background-colors and colors");
  equals(arr1.equals(arr2, {'css': 'background-color', 'value': false}), true, "Ignoring values, equal background-colors");
  arr2.highlight(2);
  av.step();
  equals(arr2.equals(arr3, {'css': 'background-color'}), false, "Unequal background-colors");

  equals(arr2.equals(arr3, {'css': ['color', 'background-color']}), false, "Unequal background-colors and colors");
  
  var testDiv= $('<ol class="' + arr1.element[0].className + '"><li class="jsavnode jsavindex jsavhighlight"></li><li class="jsavnode jsavindex" ></li></ol>'),
    hlDiv = testDiv.find(".jsavnode").filter(".jsavhighlight"),
    unhlDiv = testDiv.find(".jsavnode").not(".jsavhighlight"),
    hlBg = hlDiv.css("background-color"),
    unhlBg = unhlDiv.css("background-color");
  equals(arr2.equals([unhlBg, unhlBg, hlBg, unhlBg], {'css': 'background-color'}), true, "Equal background-colors as array.");
});
})();