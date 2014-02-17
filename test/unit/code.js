/*global ok,test,module,deepEqual,equal,expect,notEqual,strictEqual */
(function() {
  "use strict";
  module("code.variable", {  });
  test("Variable init and animation", function() {
    var values = [12, 22, 14, 39, 10];
    var av = new JSAV("emptycontainer"),
      variable = av.variable(0);
    ok(!!variable);
    equal(variable.value(), 0, "Testing initial value");
    for (var i = 0; i < values.length; i++) {
      variable.value(values[i]);
      av.step();
    }
    av.recorded(); // rewinds to beginning
    jQuery.fx.off = true;

    equal(variable.value(), 0);
    for (i = 0; i < values.length; i++) {
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
    equal(var1.element.filter(":visible").size(), 0, "Variable initially invisible");
    var1.show();
    av.step();
    equal(var1.element.filter(":visible").size(), 1, "Variable again visible after show");
    var1.show();
    av.step();
    equal(var1.element.filter(":visible").size(), 1, "Variable visible after another show");
    var1.hide();
    av.step();
    equal(var1.element.filter(":visible").size(), 0, "Variable not visible after hide");
    var1.hide();
    av.step(); // need to add another step, since the empty last step is pruned
    equal(var1.element.filter(":visible").size(), 0, "Variable not visible after another hide");
    av.recorded();
    jQuery.fx.off = true;
    av.end();
    equal(var1.element.filter(":visible").size(), 0);
    av.backward();
    equal(var1.element.filter(":visible").size(), 0, "Undoing hiding hidden should keep it hidden");
    av.begin();
    av.forward(); // redo show
    av.forward(); // redo another show
    equal(var1.element.filter(":visible").size(), 1, "Variable visible after another show");
    av.backward(); // undo showing a visible Variable
    equal(var1.element.filter(":visible").size(), 1, "Undoing show of a visible should keep it visible");
  });

  module("code.code");
  test("Pseudocode initialization", function() {
    var av = new JSAV("emptycontainer"),
        lines = ["kissa", "istuu", "katolla"],
        pseudo1 = av.code(lines),
        pseudo2 = av.code("kissa\nistuu\nkatolla");
    var testCodelines = function($elem) {
      var $lines = $elem.find(".jsavcodeline");
      $lines.each(function(index, item) {
        equal($(item).text(), lines[index]);
      });
    };
    testCodelines(pseudo1.element);
    testCodelines(pseudo2.element);
  });
  test("Pseudocode setCurrentLine", function() {
    var av = new JSAV("emptycontainer"),
        lines = ["kissa", "istuu", "katolla", "yksin"],
        pseudo = av.code(lines);
    var testCurrents = function(curr, prev) {
      var $lines = pseudo.element.find(".jsavcodeline"),
          $curr = pseudo.element.find(".jsavcurrentline"),
          $prev = pseudo.element.find(".jsavpreviousline");
      equal($lines.index($curr), curr, "Testing index of current line");
      equal($lines.index($prev), prev, "Testing index of previous line");
      equal($curr.size(), curr === -1?0:1, "Testing number of current lines");
      equal($prev.size(), prev === -1?0:1, "Testing number of previous lines");
    };
    av.displayInit();
    testCurrents(-1, -1);
    pseudo.setCurrentLine(0);
    testCurrents(0, -1);
    av.step();
    pseudo.setCurrentLine(1);
    testCurrents(1, 0);
    av.step();
    pseudo.setCurrentLine(2);
    testCurrents(2, 1);
    av.step();
    pseudo.setCurrentLine(1);
    testCurrents(1, 2);
    av.step();
    pseudo.setCurrentLine(1);
    testCurrents(1, 1);
    av.step();
    pseudo.setCurrentLine(2);
    testCurrents(2, 1);
    av.step();
    pseudo.setCurrentLine(2);
    testCurrents(2, 2);
    av.step();
    pseudo.setCurrentLine(-1);
    testCurrents(-1, -1);
  });

  test("Pseudocode options", function() {
    var av = new JSAV("emptycontainer"),
        lines = ["line1", "  line2", "line3 <br/> line4"],
        pseudo = av.code(lines, {lineNumbers: false}),
        pseudoNoEscape = av.code(lines, {htmlEscape: false});
    // no line numbers -> unordered list
    equal(pseudo.element[0].nodeName.toLowerCase(), "ul");
    // line numbers -> ordered list
    equal(pseudoNoEscape.element[0].nodeName.toLowerCase(), "ol");

    // by default, html is escaped
    equal(pseudo.element.find(".jsavcodeline:eq(2)").html(), "line3 &lt;br/&gt; line4");
    equal(pseudo.element.find(".jsavcodeline:eq(2)").text(), "line3 <br/> line4");
    // html escaping disabled
    equal(pseudoNoEscape.element.find(".jsavcodeline:eq(2)").html(), "line3 <br> line4");
    equal(pseudoNoEscape.element.find(".jsavcodeline:eq(2)").text(), "line3  line4");
  });

  test("Pointers positioning", function(assert) {
    var av = new JSAV("emptycontainer"),
        arr = av.ds.array([1, 2, 3, 4], {left: 500, top: 200}),
        list = av.ds.list(),
        maxDifference = 0.9;

    $.fx.off = true;

    list.addFirst(3);
    list.addFirst(2);
    list.addFirst(1);
    list.layout();

    var target = arr.index(0),
        ptr = av.pointer("p", target, {top: 0, left: 0}),
        ptrOffset = ptr.element.offset(),
        targetOffset = target.element.offset();
    assert.close(ptrOffset.top + ptr.element.outerHeight(), targetOffset.top, maxDifference, "Pointer top position");
    assert.close(ptrOffset.left, targetOffset.left, maxDifference, "Pointer left position");



    av.displayInit();
    target = arr.index(2);
    ptr.target(target);
    av.step();

    // change the target
    ptrOffset = ptr.element.offset();
    targetOffset = target.element.offset();
    assert.close(ptrOffset.top + ptr.element.outerHeight(), targetOffset.top, maxDifference, "Pointer top position after changing target");
    assert.close(ptrOffset.left, targetOffset.left, maxDifference, "Pointer left position after changing target");

    // move the array, pointer should move with it
    arr.translate(20, 20);
    av.step();

    ptrOffset = ptr.element.offset();
    targetOffset = target.element.offset();
    assert.close(ptrOffset.top + ptr.element.outerHeight(), targetOffset.top, maxDifference, "Pointer top position after moving target");
    assert.close(ptrOffset.left, targetOffset.left, maxDifference, "Pointer left position after moving target");

    // change target to another structure
    target = list.get(1);
    ptr.target(target);
    av.step();

    ptrOffset = ptr.element.offset();
    targetOffset = target.element.offset();
    assert.close(ptrOffset.top + ptr.element.outerHeight(), targetOffset.top, maxDifference, "Pointer top position after changing target to another structure");
    assert.close(ptrOffset.left, targetOffset.left, maxDifference, "Pointer left position after changing target to another structure");

    // add node to list, pointers target will move
    list.addFirst("0");
    list.layout();
    av.step();

    ptrOffset = ptr.element.offset();
    targetOffset = target.element.offset();
    assert.close(ptrOffset.top + ptr.element.outerHeight(), targetOffset.top, maxDifference, "Pointer top position after moving target through layout");
    assert.close(ptrOffset.left, targetOffset.left, maxDifference, "Pointer left position after moving target through layout");
  });


  test("Fixed pointer positioning", function(assert) {
    // a fixed pointer should never move even if target moves or changes
    var av = new JSAV("emptycontainer"),
        arr = av.ds.array([1, 2, 3, 4], {left: 500, top: 200}),
        list = av.ds.list({left: 800, top: 400}),
        maxDifference = 0.9;

    $.fx.off = true;

    list.addFirst(3);
    list.addFirst(2);
    list.addFirst(1);
    list.layout();

    var target = arr.index(0),
        ptr = av.pointer("p", target, {top: -300, left: 0, fixed: true}),
        origPointerOffset = ptr.element.offset(),
        origArrowBounds = ptr.arrow.bounds(),
        arrowBounds,
        ptrOffset = ptr.element.offset(),
        targetOffset = target.element.offset();
    av.displayInit();
    assert.close(ptrOffset.top + 300 + ptr.element.outerHeight(), targetOffset.top, maxDifference, "Pointer top position");
    assert.close(ptrOffset.left, targetOffset.left, maxDifference, "Pointer left position");

    // change the target
    target = arr.index(2);
    ptr.target(target);
    av.step();

    ptrOffset = ptr.element.offset();
    equal(ptrOffset.top, origPointerOffset.top, "Pointer top position after changing target");
    equal(ptrOffset.left, origPointerOffset.left, "Pointer left position after changing target");

    arrowBounds = ptr.arrow.bounds();
    equal(origArrowBounds.top, arrowBounds.top, "Arrow still starting from the same top position");
    equal(origArrowBounds.left, arrowBounds.left, "Arrow still starting from the same left position");

    // move the array, pointer should NOT move with it
    arr.css({left: "+=20px", top: "+=20px"});
    av.step();

    ptrOffset = ptr.element.offset();
    equal(ptrOffset.top, origPointerOffset.top, "Pointer top position after moving target");
    equal(ptrOffset.left, origPointerOffset.left, "Pointer left position after moving target");

    arrowBounds = ptr.arrow.bounds();
    equal(origArrowBounds.top, arrowBounds.top, "Arrow still starting from the same top position");
    equal(origArrowBounds.left, arrowBounds.left, "Arrow still starting from the same left position");

    // change target to another structure
    target = list.get(1);
    ptr.target(target);
    av.step();

    ptrOffset = ptr.element.offset();
    equal(ptrOffset.top, origPointerOffset.top, "Pointer top position after changing target to another structure");
    equal(ptrOffset.left, origPointerOffset.left, "Pointer left position after changing target to another structure");

    arrowBounds = ptr.arrow.bounds();
    equal(origArrowBounds.top, arrowBounds.top, "Arrow still starting from the same top position");
    equal(origArrowBounds.left, arrowBounds.left, "Arrow still starting from the same left position");

    // add node to list, pointers target will move
    list.addFirst("0");
    list.layout();
    av.step();

    ptrOffset = ptr.element.offset();
    equal(ptrOffset.top, origPointerOffset.top, "Pointer top position after moving target through layout");
    equal(ptrOffset.left, origPointerOffset.left, "Pointer left position after moving target through layout");

    arrowBounds = ptr.arrow.bounds();
    equal(origArrowBounds.top, arrowBounds.top, "Arrow still starting from the same top position");
    equal(origArrowBounds.left, arrowBounds.left, "Arrow still starting from the same left position");

  });
}());