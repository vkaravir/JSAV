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

function testHighlights(arr, hlIndices, hlDiv, unhlDiv, props) {
  for (var i= 0; i < arr.size(); i++) {
    var el = hlIndices[j]?hlDiv:unhlDiv,
      hlText = hlIndices[j]?"highlighted":"not highlighted";
    for (var j=0; j < props.length; j++) {
      equals(arr.css(i, props[j]), el.css(props[j]), "index " + i + " " + props[j] + " " + hlText);
    }
  }
}

test("Highlighting indices in Array", function() {
  // [12, 22, 14, 39, 10] array in HTML
	var av = new JSAV("arraycontainer"),
	  arr = av.ds.array($("#array")),
	  testDiv = $('<div class="array"><div class="node index highlight"></div><div class="node index" ></div></div>').find(".node"),
	  hlDiv = testDiv.filter(".highlight");
	  unhlDiv = testDiv.not(".highlight");
	  props = ["color", "background-color"];

	arr.highlight(0);
	av.step();
	arr.highlight([1]); // highlight with an array
	av.step();
	arr.highlight(function(index) { return index>3;}); // highlight with function
	//av.step();
  //arr.highlight(); // highlight all
	av.recorded(); // will do rewind, nothing should be highlighted

  testHighlights(arr, [0, 0, 0, 0, 0], hlDiv, unhlDiv, props);
  
  av.forward(); // apply first highlight

  testHighlights(arr, [1, 0, 0, 0, 0], hlDiv, unhlDiv, props);

  av.forward(); // apply 2nd (array version) highlight
  testHighlights(arr, [1, 1, 0, 0, 0], hlDiv, unhlDiv, props);

  av.forward(); // apply 3rd (function version) highlight
  testHighlights(arr, [1, 1, 0, 0, 1], hlDiv, unhlDiv, props);

  //av.forward(); // apply last highlight (all should now be highlighted)
  //testHighlights(arr, [1, 1, 1, 1, 1], hlDiv, unhlDiv, props);

	av.begin(); // going to beginning should remove all highlights
  testHighlights(arr, [0, 0, 0, 0, 0], hlDiv, unhlDiv, props);
	av.end(); // going to the end should reapply the highlights
  //testHighlights(arr, [1, 1, 1, 1, 1], hlDiv, unhlDiv, props);
	testDiv = null;
});
