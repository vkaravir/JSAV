/*global ok,test,module,deepEqual,equal,expect,equals,notEqual,arrayUtils */
(function() {
  "use strict";
  module("datastructures.graph", {  });
  test("Simple undirected graph test", function() {
    var av = new JSAV("emptycontainer");
    ok( av, "JSAV initialized" );
    ok( av.ds.graph, "Graph exists" );
    var graph = av.ds.graph();
    ok( graph, "Graph initialized" );
    var a = graph.addNode("A"),
        b = graph.addNode("B"),
        c = graph.addNode("C"),
        d = graph.addNode("D"),
        e = graph.addNode("E"),
        f = graph.addNode("F");
    equal(graph.nodeCount(), 6);
    var e1 = graph.addEdge(a, b);
    graph.addEdge(b, a);
    graph.addEdge(a, c);
    graph.addEdge(b, d);
    graph.addEdge(e, a);
    graph.addEdge(d, e);
    graph.addEdge(d, f);
    equal(graph.edgeCount(), 6);
    ok(graph.hasEdge(a, b));
    ok(graph.hasEdge(b, a));
    ok(graph.hasEdge(a, c));
    ok(graph.hasEdge(c, a));
    ok(graph.hasEdge(b, d));
    ok(graph.hasEdge(d, b));
    ok(graph.hasEdge(e, a));
    ok(graph.hasEdge(a, e));
    ok(graph.hasEdge(d, e));
    ok(graph.hasEdge(e, d));
    ok(graph.hasEdge(d, f));
    ok(graph.hasEdge(f, d));
    equal(a.neighbors().length, 3);
    equal(b.neighbors().length, 2);
    equal(c.neighbors().length, 1);
    equal(d.neighbors().length, 3);
    equal(e.neighbors().length, 2);
    equal(f.neighbors().length, 1);
    equal(graph.getEdge(a, b), e1);
    equal(graph.getEdge(b, a).id(), e1.id());
  });

  test("Graph edge removal", function() {
    var av = new JSAV("emptycontainer");
    var graph = av.ds.graph();
    var a = graph.addNode("A"),
        b = graph.addNode("B"),
        c = graph.addNode("C"),
        d = graph.addNode("D");
    var e1 = graph.addEdge(a, b),
        e2 = graph.addEdge(b, c),
        e3 = graph.addEdge(c, d),
        e4 = graph.addEdge(d, a);
    equal(graph.edges().length, 4);
    equal(graph.edgeCount(), 4);
    av.displayInit();
    graph.removeEdge(e1);
    graph.layout();
    equal(graph.edges().length, 3);
    equal(graph.edgeCount(), 3);
    ok(!e1.isVisible());
    av.step();
    graph.removeEdge(graph.getEdge(c, b));
    graph.layout();
    equal(graph.edges().length, 2);
    equal(graph.edgeCount(), 2);
    ok(!e2.isVisible());
    av.step();
    graph.removeEdge(e4);
    graph.layout();
    equal(graph.edges().length, 1);
    equal(graph.edgeCount(), 1);
    ok(!e4.isVisible());
    av.recorded();
    $.fx.off = true;

    equal(graph.edges().length, 4);
    equal(graph.edgeCount(), 4);
    ok(e1.isVisible() && e2.isVisible() && e4.isVisible());
    av.forward();
    equal(graph.edges().length, 3);
    equal(graph.edgeCount(), 3);
    ok(!e1.isVisible() && e2.isVisible() && e4.isVisible());
    av.forward();
    equal(graph.edges().length, 2);
    equal(graph.edgeCount(), 2);
    ok(!e1.isVisible() && !e2.isVisible() && e4.isVisible());
    av.forward();
    equal(graph.edges().length, 1);
    equal(graph.edgeCount(), 1);
    ok(!e1.isVisible() && !e2.isVisible() && !e4.isVisible());
  });

  test("Graph equals() test", function() {
    var av = new JSAV("emptycontainer");
    var graph1 = av.ds.graph(),
        graph2 = av.ds.graph();
    var a = graph1.addNode("A"),
        b = graph1.addNode("B"),
        a2 = graph2.addNode("A"),
        b2 = graph2.addNode("B");
    ok(graph1.equals(graph2), "Equal graphs");
    var c = graph1.addNode("C");
    ok(!graph1.equals(graph2), "Graphs with different nodes");
    var c2 = graph2.addNode("C");

    c.highlight();
    ok(graph1.equals(graph2), "Different background colors, not compared");
    ok(!graph1.equals(graph2, {'css': 'background-color'}), "Different background colors");
    c.unhighlight();

    ok(graph1.equals(graph2), "Same background colors, not compared");
    ok(graph1.equals(graph2, {'css': 'background-color'}), "Same background colors");

    c.highlight();
    c2.highlight();
    ok(graph1.equals(graph2), "Same background colors, not compared");
    ok(graph1.equals(graph2, {'css': 'background-color'}), "Same background colors");

    var e = graph1.addEdge(a, b);
    ok(!graph1.equals(graph2), "Different set of edges");

    var e2 = graph2.addEdge(a2, b2);
    ok(graph1.equals(graph2), "Same set of edges");

    e.css({stroke: "red"});
    ok(graph1.equals(graph2), "Different edge colors, not compared");
    ok(!graph1.equals(graph2, {'css': 'stroke'}), "Different edge colors");

    e2.css({stroke: "red"});
    ok(graph1.equals(graph2), "Same edge colors, not compared");
    ok(graph1.equals(graph2, {'css': ['stroke', 'background-color']}), "Same edge colors");

  });
})();