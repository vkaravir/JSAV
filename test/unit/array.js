module("datastructures.array", {  });

test("Initializing from HTML", function() {
  var values = [12, 22, 14, 39, 10]; // array in HTML: 
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
