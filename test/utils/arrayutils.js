function testArrayHighlights(arr, hlIndices, hlDiv, unhlDiv, props) {
  for (var i= 0; i < arr.size(); i++) {
    var el = hlIndices[i]?hlDiv:unhlDiv,
      hlText = hlIndices[i]?"highlighted":"not highlighted";
    for (var j=0; j < props.length; j++) {
      equals(arr.css(i, props[j]), el.css(props[j]), "index " + i + " " + props[j] + " " + hlText);
    }
  }
}

function testArrayValues(arr, values) {
  equals(arr.size(), values.length, "Equal array sizes");
  for (var i = 0; i < values.length; i++) {
    equals(arr.value(i), values[i], "Values in index " + i);
  }
}
