(function() {
  module("anim", {});
  
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