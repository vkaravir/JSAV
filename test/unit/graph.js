/*global ok,test,module,deepEqual,equal,expect,equals,notEqual,arrayUtils */
(function() {
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
    graph.addEdge(a, b);
    graph.addEdge(b, a);
    graph.addEdge(a, c);
    graph.addEdge(b, d);
    graph.addEdge(e, a);
    graph.addEdge(d, e);
    graph.addEdge(d, f);
    ok( graph.hasEdge(a, b));
    ok( graph.hasEdge(b, a));
    ok( graph.hasEdge(a, c));
    ok( graph.hasEdge(c, a));
    ok( graph.hasEdge(b, d));
    ok( graph.hasEdge(d, b));
    ok( graph.hasEdge(e, a));
    ok( graph.hasEdge(a, e));
    ok( graph.hasEdge(d, e));
    ok( graph.hasEdge(e, d));
    ok( graph.hasEdge(d, f));
    ok( graph.hasEdge(f, d));
    equal( a.neighbors().length, 3);
    equal( b.neighbors().length, 2);
    equal( c.neighbors().length, 1);
    equal( d.neighbors().length, 3);
    equal( e.neighbors().length, 2);
    equal( f.neighbors().length, 1);
  });
})();