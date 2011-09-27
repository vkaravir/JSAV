(function() {
  module("code.variable", {  });
  test("Variable init and animation", function() {
    var values = [12, 22, 14, 39, 10];
	  var av = new JSAV("emptycontainer"),
	    variable = av.variable(0);
	  ok(!!variable);
	  equals(variable.value(), 0, "Testing initial value");
	  for (var i = 0; i < values.length; i++) {
  	  variable.value(values[i]);
  	  av.step();
	  }
	  av.recorded(); // rewinds to beginning
	  jQuery.fx.off = true;

	  equals(variable.value(), 0);
	  for (var i = 0; i < values.length; i++) {
  	  av.forward();
  	  equals(variable.value(), values[i], "Testing changing of value");
	  }
  });
})();