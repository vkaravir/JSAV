/**
* Module that contains layout algorithms for data structures.
* Depends on core.js, datastructures.js
*/
(function() {
  if (typeof JSAV === "undefined") { return; }
  
  function centerArray(array, $lastItem) {
    // center the array inside its parent container
    if (array.options.hasOwnProperty("center") && !array.options.center) {
      // if options center is set to falsy value, return
      return;
    }
    // width of array expected to be last items position + its width
    var width = $lastItem.position().left + $lastItem.outerWidth(),
      containerWidth = $(array.jsav.container).width();
    array.element.css("left", (containerWidth - width)/2);
  }
  
  function verticalArray(array) {
    var $arr = $(array.element),
      // rely on browser doing the calculation, float everything to the left..
      $items = $arr.find("li").css({"float": "left", "position":"static"}),
      maxHeight = -1,
      indexed = !!array.options.indexed;
    if (indexed) {
      $arr.addClass("jsavindexed");
    }
    $items.each(function(index, item) {
      var $i = $(this),
        pos = $i.position();
      $i.css({"left": pos.left - index, "top": pos.top});
      maxHeight = Math.max(maxHeight, $i.outerHeight());
      if (indexed) {
        var $indexLabel = $i.find(".jsavindexlabel");
        if ($indexLabel.size() === 0) {
          $i.append('<span class="jsavindexlabel">' + index + '</span>');
          $indexLabel = $i.find(".jsavindexlabel");
        }
      }
    });
    // ..and return float and positioning
    $items.css({"float": "none", "position": "absolute"});
    $arr.height(maxHeight + (indexed?30:0));
    centerArray(array, $items.last());
  }
  function barArray(array) {
    var $arr = $(array.element).addClass("jsavbararray"),
      $items = $arr.find("li").css({"position":"relative", "float": "left"}), 
      maxValue = Number.MIN_VALUE,
      indexed = !!array.options.indexed,
      width = $items.first().outerWidth();
      size = array.size();
    if (indexed) {
      $arr.addClass("jsavindexed");
    }
    for (var i = 0; i < size; i++) {
      maxValue = Math.max(maxValue, array.value(i));
    }
    maxValue *= 1.15;
    $items.each(function(index, item) {
      var $i = $(this);
      var $valueBar = $i.find(".jsavvaluebar");
      if ($valueBar.size() === 0) {
        $i.prepend('<span class="jsavvaluebar" />');
        $valueBar = $i.find(".jsavvaluebar");
      }
      $valueBar.css({"height": "100%"});
      $i.find(".jsavvalue").css("height", (100.0*array.value(index) / maxValue) + 15 + "%")
        .html('<span>' + $i.find(".jsavvalue").text() + '</span>');
      if (indexed) {
        var $indexLabel = $i.find(".jsavindexlabel");
        if ($indexLabel.size() === 0) {
          $i.append('<span class="jsavindexlabel">' + index + '</span>');
          $indexLabel = $i.find(".jsavindexlabel");
        }
      }
    });
    centerArray(array, $items.last());
  }
  var layouts = {};
  layouts.array = {
    "_default": verticalArray,
    "bar": barArray,
    "array": verticalArray
  };
  JSAV.ext.layout = layouts;
})();