/**
* Module that contains layout algorithms for data structures.
* Depends on core.js, datastructures.js
*/
(function() {
  if (typeof JSAV === "undefined") { return; }
  function getNodeSize(clazz) {
   
  }
  function verticalArray(array) {
    var $arr = $(array.element),
    // rely on browser doing the calculation, float everything to the left
    $items = $arr.find("li").css({"float": "left", "position":"static"});
    $items.each(function(index, item) {
      var $i = $(this),
        pos = $i.position();
      $i.css({"left": pos.left - index, "top": pos.top});
    });
    // and return float and positioning
    $items.css({"float": "none", "position": "absolute"});
    $arr.height(60);
  }
  var layouts = {};
  layouts.array = {
    "_default": verticalArray
  };
  JSAV.ext.layout = layouts;
})();