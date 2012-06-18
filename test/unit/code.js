/*global ok,test,module,deepEqual,equal,expect,equals,notEqual,strictEqual */
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
    strictEqual(boolFalse.value(), false);
    
    var strNum = av.variable(8, {"type": "string"});
    strictEqual(strNum.value(), "8");
    
    var strBool = av.variable(false, {"type": "string"});
    strictEqual(strBool.value(), "false");
    
    var numStr = av.variable("42", {"type": "number"});
    strictEqual(numStr.value(), 42);
  });

  test("Test show/hide", function() {
    var av = new JSAV("emptycontainer"),
        var1 = av.variable(7);
    equals(var1.element.filter(":visible").size(), 0, "Variable initially invisible");
    var1.show();
    av.step();
    equals(var1.element.filter(":visible").size(), 1, "Variable again visible after show");
    var1.show();
    av.step();
    equals(var1.element.filter(":visible").size(), 1, "Variable visible after another show");
    var1.hide();
    av.step();
    equals(var1.element.filter(":visible").size(), 0, "Variable not visible after hide");
    var1.hide();
    equals(var1.element.filter(":visible").size(), 0, "Variable not visible after another hide");
    av.recorded();
    jQuery.fx.off = true;
    av.end();
    equals(var1.element.filter(":visible").size(), 0);
    av.backward();
    equals(var1.element.filter(":visible").size(), 0, "Undoing hiding hidden should keep it hidden");
    av.begin();
    av.forward(); // redo show
    av.forward(); // redo another show
    equals(var1.element.filter(":visible").size(), 1, "Variable visible after another show");
    av.backward(); // undo showing a visible Variable
    equals(var1.element.filter(":visible").size(), 1, "Undoing show of a visible should keep it visible");
  });
})();