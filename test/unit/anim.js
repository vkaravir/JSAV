(function() {
  module("anim", {});
  
  test("slideshow counter", function() {
    var av = new JSAV("arraycontainer"),
      arr = av.ds.array($("#array")),
      i = 0,
      counter = $("#arraycontainer .counter");
    arr.highlight(0);
    av.step();
    arr.highlight(1);
    av.recorded(); // will rewind it
    // bind listener to test event firing as well
    av.container.bind("updatecounter", function(e) { i++; });
    equals("1 / 3", counter.text(), "Testing counter text");
    av.forward();
    equals("2 / 3", counter.text(), "Testing counter text");
    av.forward();
    equals("3 / 3", counter.text(), "Testing counter text");
    av.forward(); // does nothing, updatecounter does not fire
    equals("3 / 3", counter.text(), "Testing counter text");
    av.begin(); // fires two events, one for each step forward
    equals("1 / 3", counter.text(), "Testing counter text");
    av.end(); // fires two events, one for each step backward
    equals("3 / 3", counter.text(), "Testing counter text");
    av.backward();
    equals("2 / 3", counter.text(), "Testing counter text");
    av.forward();
    equals("3 / 3", counter.text(), "Testing counter text");    
    av.backward();
    av.backward();
    equals("1 / 3", counter.text(), "Testing counter text");
    av.backward(); // does nothing, updatecounter does not fire
    equals("1 / 3", counter.text(), "Testing counter text");
    equals(i, 10, "Number of updatecounter events fired");
  });
  
  test("animator control events", function() {
    var av = new JSAV("emptycontainer"),
      arr = av.ds.array([10, 20, 30, 40]),
  	  props = ["color", "background-color"];
    arr.highlight(0);
    av.step();
    arr.highlight(1);
    av.step();
    arr.highlight(2);
    av.recorded(); // will rewind it
    jQuery.fx.off = true; // turn off smooth animation
    arrayUtils.testArrayHighlights(arr, [0, 0, 0, 0], props);
    av.container.trigger("end"); // apply all highlights
    arrayUtils.testArrayHighlights(arr, [1, 1, 1, 0], props);
    av.container.trigger("begin"); // undo everything
    arrayUtils.testArrayHighlights(arr, [0, 0, 0, 0], props);
    av.container.trigger("forward");
    arrayUtils.testArrayHighlights(arr, [1, 0, 0, 0], props);
    av.container.trigger("forward"); // second highlight
    arrayUtils.testArrayHighlights(arr, [1, 1, 0, 0], props);
    av.container.trigger("backward"); // undo second highlight
    arrayUtils.testArrayHighlights(arr, [1, 0, 0, 0], props);
  });
})();