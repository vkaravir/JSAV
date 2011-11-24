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

	  equal(variable.value(), 0);
	  for (var i = 0; i < values.length; i++) {
  	  av.forward();
  	  equal(variable.value(), values[i], "Testing changing of value");
	  }
  });
  
  test("Variable types", function() {
    var av = new JSAV("emptycontainer"),
        num = av.variable(8),
        str = av.variable("jj"),
        bool = av.variable(true),
        boolFalse = av.variable(false);
    strictEqual(num.value(), 8);
    strictEqual(str.value(), "jj");
    strictEqual(bool.value(), true);
    strictEqual(bool.value(), false);
    
    var strNum = av.variable(8, {"type": "string"});
    strictEqual(strNum.value(), "8");
    
    var strBool = av.variable(false, {"type": "string"});
    strictEqual(strBool.value(), "false");
    
    var numStr = av.variable("42", {"type": "number"});
    strictEqual(numStr.value(), 42);
  });
})();