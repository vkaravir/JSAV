/**
* Module that contains layout algorithms for data structures.
* Depends on core.js, datastructures.js
*/
(function() {
  if (typeof JSAV === "undefined") { return; }
  function verticalArray(array) {
    var $arr = $(array.element),
      // rely on browser doing the calculation, float everything to the left..
      $items = $arr.find("li").css({"float": "left", "position":"static"}),
      maxHeight = -1,
      indexed = !!array.options.indexed;
    if (indexed) {
      $arr.addClass("indexed");
    }
    $items.each(function(index, item) {
      var $i = $(this),
        pos = $i.position();
      $i.css({"left": pos.left - index, "top": pos.top});
      maxHeight = Math.max(maxHeight, $i.outerHeight());
      if (indexed) {
        var $indexLabel = $i.find(".indexlabel");
        if ($indexLabel.size() === 0) {
          $i.append('<span class="indexlabel">' + index + '</span>');
          $indexLabel = $i.find(".indexlabel");
        }
      }
    });
    // ..and return float and positioning
    $items.css({"float": "none", "position": "absolute"});
    $arr.height(maxHeight + (indexed?30:0));
  }
  function barArray(array) {
    var $arr = $(array.element).addClass("bararray"),
      $items = $arr.find("li").css({"float": "left", "position":"static"});
    var maxValue = Number.MIN_VALUE;
    for (var i = 0; i < array._arr.length; i++) {
      maxValue = Math.max(maxValue, array._arr[i]);
    }
    $items.each(function(index, item) {
      var $i = $(this),
        pos = $i.position();
      var $valueBar = $i.find(".valuebar");
      if ($valueBar.size() === 0) {
        $i.append('<span class="valuebar" />');
        $valueBar = $i.find(".valuebar");
      }
      $valueBar.css({"height": "100%"});
      $i.find(".value").css("height", (100.0*array.value(index) / maxValue) + "%")
        .html('<span style="position:absolute;width:inherit;display:inline-block;bottom:-20px;">' + $i.text() + '</span>');
      //$i.css({"left": pos.left - index});
    });
  }
  var layouts = {};
  layouts.array = {
    "_default": verticalArray,
    "bar": barArray
  };
  JSAV.ext.layout = layouts;
})();