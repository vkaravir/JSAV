/*global ok,test,module,deepEqual,equal,expect,notEqual */
(function() {
  "use strict";
  module("extras.binaryheap", {  });
  test("Binheap Basics", function() {
    // this is a pretty lame test, but main point is to make sure nothing major is broken
    // due to changes in JSAV. that is, the file should still load without errors
    var ordered_values = [1, 2, 3, 4, 5, 6, 7, 8, 9],
        reversed_values = [9, 8, 7, 6, 5, 4, 3, 2, 1],
        av = new JSAV("emptycontainer"),
        bh1 = av.ds.binheap(ordered_values),
        bh2 = av.ds.binheap(reversed_values),
        bh3 = av.ds.binheap([,,,,,,,,,]);
    equal(9, bh1.heapsize());
    equal(9, bh2.heapsize());
    equal(9, bh3.heapsize());
    equal(1, bh1.value(0));
    equal(1, bh2.value(0));
    equal(bh3.value(0), "");
  });
})();