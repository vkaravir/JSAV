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
	var av = new JSAV("arraycontainer");
	var arr = av.ds.array($("#array"));
	var testDiv = $('<div class="array"><div class="node index" ></div></div>').find(".node");
	var props = ["color", "background-color"];
	for (i=0; i < props.length; i++) {
	  for (var j = 0; j < arr.size(); j++) {
  	  equals(arr.css(j, props[i]), testDiv.css(props[i]), props[i] + " without highlight");
	  }
	}
	arr.highlight(0);
	arr.highlight([1]); // highlight with an array
	arr.highlight(function(index) { return index>3;}); // highlight with function

	av.recorded();
	av.end(); // apply everything by going to the end of vis
	testDiv.addClass("highlight");

	for (var i=0; i < props.length; i++) {
  	equals(arr.css(0, props[i]), testDiv.css(props[i]), props[i] + " with single index highlight");
    equals(arr.css(1, props[i]), testDiv.css(props[i]), props[i] + " with array highlight");
  	equals(arr.css(4, props[i]), testDiv.css(props[i]), props[i] + " with function highlight");
	}
	av.begin(); // going to beginning should remove all highlights
	testDiv.removeClass("highlight");

	for (i=0; i < props.length; i++) {
	  for (var j = 0; j < arr.size(); j++) {
  	  equals(arr.css(j, props[i]), testDiv.css(props[i]), props[i] + " without highlight");
	  }
	}
	av.end(); // going to the end should reapply the highlights
	testDiv.addClass("highlight");
	for (i=0; i < props.length; i++) {
  	equals(arr.css(0, props[i]), testDiv.css(props[i]), props[i] + " with single index highlight");
    equals(arr.css(1, props[i]), testDiv.css(props[i]), props[i] + " with array highlight");
  	equals(arr.css(4, props[i]), testDiv.css(props[i]), props[i] + " with function highlight");
	}
});
