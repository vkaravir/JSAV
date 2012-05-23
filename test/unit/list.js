(function() {
  module("datastructures.list", {  });

test("Test click event", function() {
  expect(9);
  var handler1 = function(event) {
    ok(event);
    equals(this.value(), 0);
  };
  var handler2 = function(myval, event) {
    equals(myval, "kissa");
    ok(event);
    equals(this.value(), 2);
  }
  var handler3 = function(myval, myval2, event) {
    equals(myval, "kissa");
    equals(myval2, "koira");
    ok(event);
    equals(this.value(), 1);
  }
	var av = new JSAV("arraycontainer"),
	    list1 = av.ds.list(),
	    list2 = av.ds.list(),
	    list3 = av.ds.list();
  var setup = function(list) {
    list.addFirst(0);
    list.addFirst(1);
    list.addFirst(2);
  }
  setup(list1); setup(list2); setup(list3);
  list1.click(handler1);
  list2.click(["kissa"], handler2);
  list3.click(["kissa", "koira"], handler3);
  list1.element.find(".jsavnode:eq(2)").click();
  list2.element.find(".jsavnode:eq(0)").click();
  list3.element.find(".jsavnode:eq(1)").click();
});

test("Test on event binding and custom events", function() {
  expect(9);
  var handler1 = function(event) {
    ok(event);
    equals(this.value(), 0);
  };
  var handler2 = function(myval, event) {
    equals(myval, "kissa");
    ok(event);
    equals(this.value(), 2);
  }
  var handler3 = function(myval, myval2, event) {
    equals(myval, "kissa");
    equals(myval2, "koira");
    ok(event);
    equals(this.value(), 1);
  }
	var av = new JSAV("arraycontainer"),
	    list1 = av.ds.list(),
	    list2 = av.ds.list(),
	    list3 = av.ds.list();
  var setup = function(list) {
    list.addFirst(0);
    list.addFirst(1);
    list.addFirst(2);
  }
  setup(list1); setup(list2); setup(list3);
  list1.on("jsavclick", handler1);
  list2.on("jsavclick", "kissa", handler2);
  list3.on("jsavclick", ["kissa", "koira"], handler3);
  list1.element.find(".jsavnode:eq(2)").trigger("jsavclick");
  list2.element.find(".jsavnode:eq(0)").trigger("jsavclick");
  list3.element.find(".jsavnode:eq(1)").trigger("jsavclick");
});
})();