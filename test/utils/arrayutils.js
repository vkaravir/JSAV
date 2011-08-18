var arrayUtils = {

  testArrayHighlights: function(arr, hlIndices, props) {
    console.log(arr.element[0].className);
    var testDiv= $('<ol class="' + arr.element[0].className + '"><li class="jsavnode jsavindex jsavhighlight"></li><li class="jsavnode jsavindex" ></li></ol>'),
      hlDiv = testDiv.find(".jsavnode").filter(".jsavhighlight"),
      unhlDiv = testDiv.find(".jsavnode").not(".jsavhighlight");
    $("#qunit-fixture").append(testDiv);
    console.log("HL", arr.element[0].className, hlDiv.css("background-color"), hlDiv.size(), hlDiv.css("color"));
    for (var i= 0; i < arr.size(); i++) {
      var el = hlIndices[i]?hlDiv:unhlDiv,
        hlText = hlIndices[i]?"highlighted":"not highlighted";
      for (var j=0; j < props.length; j++) {
        equals(arr.css(i, props[j]), el.css(props[j]), "index " + i + " " + props[j] + " " + hlText);
      }
    }
    testDiv.remove();
  },

  testArrayValues: function(arr, values) {
    equals(arr.size(), values.length, "Equal array sizes");
    for (var i = 0; i < values.length; i++) {
      equals(arr.value(i), values[i], "Values in index " + i);
    }
  }
};
