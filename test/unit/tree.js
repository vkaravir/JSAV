/*global ok,test,module,deepEqual,equal,expect,equals,notEqual,strictEqual */
(function() {
  module("datastructures.tree", {  });
  test("Tree Root", function() {
    var av = new JSAV("emptycontainer");
    ok( av, "JSAV initialized" );
    ok( JSAV._types.ds.Tree, "Tree exists" );
    ok( JSAV._types.ds.TreeNode, "TreeNode exists" );
    var tree = av.ds.tree();
    ok(!tree.root().value());
    ok(!tree.root().parent());
    tree.root("R"); // set the value of root
    equal(tree.root().value(), "R");
    ok(av.backward()); // test undo
    ok(!tree.root().value());
    ok(av.forward());
    
    var newRoot = tree.newNode("NR"); // create a new nodee
    equal(tree.root().value(), "R");
    equal(newRoot.value(), "NR");
    av.step();
    tree.root(newRoot); // set the new node as root

    equal(tree.root().id(), newRoot.id());
    equal(tree.root().value(), newRoot.value());
    
    ok(av.backward()); // test undo of change of root
    equal(tree.root().value(), "R");
    
    ok(av.forward());
    av.step();
    tree.root("R3"); // set new root value
    equal(tree.root().id(), newRoot.id());
    equal(tree.root().value(), "R3");
    equal(newRoot.value(), "R3");

    ok(av.backward()); // test undo of change of root value
    equal(tree.root().id(), newRoot.id());
    equal(tree.root().value(), "NR");
    equal(newRoot.value(), "NR");
    
  });
  
  test("Tree Children", function() {
    var av = new JSAV("emptycontainer");
    ok( JSAV._types.ds.Tree, "Tree exists" );
    ok( JSAV._types.ds.TreeNode, "TreeNode exists" );
    var tree = av.ds.tree(),
        root = tree.root();
    tree.root("R"); // set the value of root
    
    equal(tree.root().children().length, 0);
    equal(tree.height(), 1);
    var n1 = tree.newNode("1");
    av.step();
    root.addChild(n1); // add child
    equal(root.children().length, 1);
    equal(root.child(0).id(), n1.id());
    equal(tree.height(), 2);
    
    ok(av.backward()); // test undo of add child
    equal(root.children().length, 0, "Number of children after undo adding of a child");
    ok(!root.child(0));
    equal(tree.height(), 1, "Tree height");
    
    ok(av.forward()); // test that redo works
    equal(root.children().length, 1);
    equal(root.child(0).id(), n1.id());
    equal(tree.height(), 2);
    
    var n2 = tree.newNode("2"),
        n3 = tree.newNode("3");
    av.step();
    root.addChild(n2).addChild(n3); // add children, test chaining as well
    equal(root.children().length, 3);
    equal(root.child(0).id(), n1.id());
    equal(root.child(1).id(), n2.id());
    equal(root.child(2).id(), n3.id());
    equal(tree.height(), 2);
    
    var n4 = tree.newNode("4");
    av.step();
    root.child(1, n4); // test replacing a child
    equal(root.children().length, 3);
    ok(!n2.parent());
    equal(root.child(0).id(), n1.id());
    equal(root.child(1).id(), n4.id());
    equal(root.child(2).id(), n3.id());
    equal(tree.height(), 2);
    ok(!n2.child(4));
    
    ok(av.backward(), "backward"); // test undo of replacing a child
    equal(root.children().length, 3);
    equal(root.child(0).id(), n1.id());
    equal(root.child(1).id(), n2.id());
    equal(root.child(2).id(), n3.id());
    equal(tree.height(), 2);
    
    ok(av.forward()); // redo last step
    var n21 = tree.newNode("n21"),
        n22 = tree.newNode("n22");
    av.step();
    n1.addChild(n21).addChild(n22); // add children to n2
    equal(n1.children().length, 2);
    equal(n21.parent().id(), n1.id());
    equal(n22.parent().id(), n1.id());
    equal(n1.child(0).id(), n21.id());
    equal(n1.child(1).id(), n22.id());
    equal(tree.height(), 3);
    
    ok(av.backward()); // test undo of adding children
    equal(n2.children().length, 0);
    ok(av.forward());
    
    av.step();
    n1.child(0, null);
    equal(n1.children().length, 1);
    equal(n1.child(0).id(), n22.id());
    equal(n21.parent(), undefined);
    equal(n22.parent().id(), n1.id());

    ok(av.backward());
    equal(n1.children().length, 2);
    equal(n21.parent().id(), n1.id());
    equal(n22.parent().id(), n1.id());
    equal(n1.child(0).id(), n21.id());
    equal(n1.child(1).id(), n22.id());
    ok(av.forward());

    equal(n1.children().length, 1);
    equal(n1.child(0).id(), n22.id());
    equal(n21.parent(), undefined);
    equal(n22.parent().id(), n1.id());
  });
  
  
  test("Tree Node Value", function() {
    var av = new JSAV("emptycontainer");
    ok( JSAV._types.ds.Tree, "Tree exists" );
    ok( JSAV._types.ds.TreeNode, "TreeNode exists" );
    var tree = av.ds.tree(),
        root = tree.root();
    tree.root("R"); // set the value of root
    deepEqual(root.value(), "R");

    av.step();
    root.value(4);
    deepEqual(root.value(), 4);

    ok(av.backward());
    deepEqual(root.value(), "R");

    ok(av.forward());
    deepEqual(root.value(), 4);
  });
  
  test("Tree Node Highlight", function() {
    var av = new JSAV("emptycontainer");
    var tree = av.ds.bintree(),
        root = tree.root();
    tree.root("Ro").left("L").parent().right("R");
    var left = root.left(),
        right = root.right();
    av.step();
    ok(!left.isHighlight());
    ok(!right.isHighlight());
    ok(!root.isHighlight());
    
    left.highlight();
    av.step();
    right.highlight();
    av.step();
    root.highlight();

    ok(left.isHighlight());
    ok(right.isHighlight());
    ok(root.isHighlight());
    
    $.fx.off = true;
    av.recorded();
    ok(!left.isHighlight());
    ok(!right.isHighlight());
    ok(!root.isHighlight());

    av.end();
    $.fx.off = true;
    ok(left.isHighlight());
    ok(right.isHighlight());
    ok(root.isHighlight());

    ok(av.backward());
    ok(left.isHighlight());
    ok(right.isHighlight());
    ok(!root.isHighlight());

    ok(av.backward());
    ok(left.isHighlight());
    ok(!right.isHighlight());
    ok(!root.isHighlight());

    ok(av.backward());
    ok(!left.isHighlight());
    ok(!right.isHighlight());
    ok(!root.isHighlight());

    ok(av.backward());
    ok(!av.backward());
  });

  test("Tree Compare", function() {
    var av = new JSAV("emptycontainer"),
      t1 = av.ds.bintree(),
      t2 = av.ds.bintree();
    t1.root("Ro").left("L").left("LL").parent().parent().right("R");
    t2.root("Ro").left("L").left("LL").parent().parent().right("R");
    ok(t1.equals(t2));
    ok(t1.equals(t2, {"css": "background-color"}));
    t1.root().highlight();
    ok(t1.equals(t2));
    ok(!t1.equals(t2, {"css": "background-color"}));
    
    t2.root().highlight();
    ok(t1.equals(t2));
    ok(t1.equals(t2, {"css": "background-color"}));
    
    t1.root().left().highlight();
    ok(t1.equals(t2));
    ok(!t1.equals(t2, {"css": "background-color"}));
    
    t2.root().right().highlight();
    ok(t1.equals(t2));
    ok(!t1.equals(t2, {"css": "background-color"}));

    t2.root().left().highlight();
    ok(t1.equals(t2));
    ok(!t1.equals(t2, {"css": "background-color"}));

    t1.root().right().highlight();
    ok(t1.equals(t2));
    ok(t1.equals(t2, {"css": "background-color"}));

  });

  module("datastructures.binarytree", {  });
  test("Binary Tree Children", function() {
    var av = new JSAV("emptycontainer");
    ok (JSAV._types.ds.BinaryTree, "BinaryTree exists" );
    ok( JSAV._types.ds.BinaryTreeNode, "BinaryTreeNode exists" );
    var tree = av.ds.bintree(),
        root = tree.root();
    equal(tree.root().children().length, 0);
    equal(tree.height(), 1);
    ok(!root.value());

    tree.root("R"); // set the value of root
    
    equal(tree.root().children().length, 0);
    equal(tree.height(), 1);
    var n1 = tree.newNode("1");
    av.step();
    root.left(n1); // add child
    equal(root.children().length, 1);
    equal(root.left().id(), n1.id());
    equal(tree.height(), 2);
    
    ok(av.backward()); // test undo of add child
    equal(root.children().length, 0, "Number of children after undo adding of a child");
    ok(!root.left());
    equal(tree.height(), 1, "Tree height");
    
    ok(av.forward()); // test that redo works
    equal(root.children().length, 1);
    equal(root.left().id(), n1.id());
    equal(tree.height(), 2);

    ok(!root.right());
    av.step();
    root.right("Right");
    equal(root.children().length, 2);
    equal(root.left().id(), n1.id());
    equal(root.right().value(), "Right");
    equal(tree.height(), 2);
    
    ok(av.backward());
    equal(root.children().length, 1);
    equal(root.left().id(), n1.id());
    equal(tree.height(), 2);

    ok(av.forward()); // test that redo works
    equal(root.children().length, 2);
    equal(root.left().id(), n1.id());
    equal(root.right().value(), "Right");
    equal(tree.height(), 2);
    

  });
  
  test("Binary Tree Remove Child", function() {
    var av = new JSAV("emptycontainer");
    var tree = av.ds.bintree(),
        root = tree.root();
    tree.root("Ro");
    var left = root.left("L");
    var right = root.right("R");

    av.step();
    root.left(null); // test removing left
    equal(root.children().length, 2);
    ok(!root.left());
    ok(!left.parent());
    equal(root.right().value(), "R");
    equal(tree.height(), 2);

    ok(av.backward()); //
    equal(root.children().length, 2);
    equal(left.parent().id(), root.id());
    equal(root.left().id(), left.id());
    equal(root.right().value(), "R");
    equal(tree.height(), 2);
    ok(av.forward());
    
    av.step();
    root.right(null); // test removing right
    equal(root.children().length, 0);
    ok(!root.left());
    ok(!left.parent());
    ok(!root.right());
    ok(!right.parent());
    equal(tree.height(), 1);

    ok(av.backward()); //
    equal(root.children().length, 2);
    ok(!root.left());
    ok(!left.parent());
    equal(root.right().value(), "R");
    equal(tree.height(), 2);
  });
  
  test("Binary Tree Edges", function() {
    var av = new JSAV("emptycontainer");
    ok (JSAV._types.ds.Edge, "Edge exists" );
    var tree = av.ds.bintree(),
        root = tree.root();
    tree.root("Ro");
    var left = root.left("L");
    var right = root.right("R");
    equal(root.value(), "Ro");
    equal(root.left().value(), "L");
    equal(root.right().value(), "R");
    equal(left.value(), "L");
    equal(right.value(), "R");
    equal(left.parent().id(), root.id());
    equal(right.parent().id(), root.id());
    equal(left.edgeToParent().start().id(), left.id());
    equal(right.edgeToParent().start().id(), right.id());
    equal(left.edgeToParent().end().id(), root.id());
    equal(right.edgeToParent().end().id(), root.id());
    av.backward();
    av.forward();
    equal(left.edgeToParent().start().id(), left.id());
    equal(right.edgeToParent().start().id(), right.id());
    equal(left.edgeToParent().end().id(), root.id());
    equal(right.edgeToParent().end().id(), root.id());
    
    av.step();
    left.right("LR").left("LRL");
    var lr = left.right(),
        lrl = lr.left();
    equal(lr.value(), "LR");
    equal(lrl.value(), "LRL");
    equal(lrl.edgeToParent().end().id(), lr.id());
    equal(lr.edgeToParent().end().id(), left.id());
  });

  test("Test edge labels", function() {
    var av = new JSAV("emptycontainer"),
        tree = av.ds.bintree(),
        root = tree.root();
    root.value("R");
    av.step();
    root.left("L", {edgeLabel: "R-L"});
    av.step();
    root.right("R");
    av.step();
    root.edgeToRight().label("R-R");
    av.recorded();

    av.forward();
    av.forward();
    equal(root.edgeToLeft().label(), "R-L");
    av.forward();
    strictEqual(root.edgeToRight().label(), undefined);
    av.forward();
    equal(root.edgeToRight().label(), "R-R");
    
  });


test("Test show/hide", function() {
  var av = new JSAV("emptycontainer"),
      tree = av.ds.bintree();

  equals(tree.element.filter(":visible").size(), 1, "Tree initially visible");
  tree.hide();
  av.step();
  equals(tree.element.filter(":visible").size(), 0, "Tree not visible after hide");
  tree.show();
  av.step();
  equals(tree.element.filter(":visible").size(), 1, "Tree again visible after show");
  tree.show();
  av.step();
  equals(tree.element.filter(":visible").size(), 1, "Tree visible after another show");
  tree.hide();
  av.step();
  equals(tree.element.filter(":visible").size(), 0, "Tree not visible after hide");
  tree.hide();
  equals(tree.element.filter(":visible").size(), 0, "Tree not visible after another hide");
  av.recorded();
  jQuery.fx.off = true;
  av.end();
  equals(tree.element.filter(":visible").size(), 0);
  av.backward();
  equals(tree.element.filter(":visible").size(), 0, "Undoing hiding hidden should keep it hidden");
  av.begin();
  av.forward(); // redo hide
  av.forward(); // redo show
  av.forward(); // redo another show
  equals(tree.element.filter(":visible").size(), 1, "Tree visible after another show");
  av.backward(); // undo showing a visible Tree
  equals(tree.element.filter(":visible").size(), 1, "Undoing show of a visible should keep it visible");
});



test("Test click event", function() {
  expect(6);
  var handler1 = function(event) {
    ok(event);
  };
  var handler2 = function(myval, event) {
    equals(myval, "kissa");
    ok(event);
  };
  var handler3 = function(myval, myval2, event) {
    equals(myval, "kissa");
    equals(myval2, "koira");
    ok(event);
  };
  var av = new JSAV("arraycontainer"),
      tree1 = av.ds.tree(),
      tree2 = av.ds.bintree(),
      tree3 = av.ds.bintree();
  var setup = function(tree) {
    tree.root("r");
    var r = tree.root();
    r.addChild(0);
    r.addChild(2);
  };
  setup(tree1); setup(tree2); setup(tree3);
  tree1.click(handler1);
  tree2.click(["kissa"], handler2);
  tree3.click(["kissa", "koira"], handler3);
  tree1.element.find(".jsavnode:eq(2)").click();
  tree2.element.find(".jsavnode:eq(0)").click();
  tree3.element.find(".jsavnode:eq(1)").click();
});

test("Test on event binding and custom events", function() {
  expect(6);
  var handler1 = function(event) {
    ok(event);
  };
  var handler2 = function(myval, event) {
    equals(myval, "kissa");
    ok(event);
  };
  var handler3 = function(myval, myval2, event) {
    equals(myval, "kissa");
    equals(myval2, "koira");
    ok(event);
  };
  var av = new JSAV("arraycontainer"),
      tree1 = av.ds.tree(),
      tree2 = av.ds.bintree(),
      tree3 = av.ds.bintree();
  var setup = function(tree) {
    tree.root("r");
    var r = tree.root();
    r.addChild(0);
    r.addChild(2);
  };
  setup(tree1); setup(tree2); setup(tree3);
  tree1.on("jsavclick", handler1);
  tree2.on("jsavclick", "kissa", handler2);
  tree3.on("jsavclick", ["kissa", "koira"], handler3);
  tree1.element.find(".jsavnode:eq(2)").trigger("jsavclick");
  tree2.element.find(".jsavnode:eq(0)").trigger("jsavclick");
  tree3.element.find(".jsavnode:eq(1)").trigger("jsavclick");
});
}());
