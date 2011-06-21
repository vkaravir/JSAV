var arrayUtils = {
  testDiv: $('<div class="array"><div class="node index highlight"></div><div class="node index" ></div></div>').find(".node"),

  testArrayHighlights: function(arr, hlIndices, props) {
    if (!this.hlDiv) {
      this.hlDiv = this.testDiv.filter(".highlight");
      this.unhlDiv = this.testDiv.not(".highlight");
    }
    
    for (var i= 0; i < arr.size(); i++) {
      var el = hlIndices[i]?this.hlDiv:this.unhlDiv,
        hlText = hlIndices[i]?"highlighted":"not highlighted";
      for (var j=0; j < props.length; j++) {
        equals(arr.css(i, props[j]), el.css(props[j]), "index " + i + " " + props[j] + " " + hlText);
      }
    }
  },

  testArrayValues: function(arr, values) {
    equals(arr.size(), values.length, "Equal array sizes");
    for (var i = 0; i < values.length; i++) {
      equals(arr.value(i), values[i], "Values in index " + i);
    }
  }
};
console.log(arrayUtils);
