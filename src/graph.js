/**
* Module that contains the graph data structure implementations.
* Depends on core.js, datastructures.js, anim.js, utils.js
*/
(function($) {
  "use strict";
  if (typeof JSAV === "undefined") { return; }
  var Edge = JSAV._types.ds.Edge; // shortcut to JSAV Edge

  var Graph = function(jsav, options) {
    this._nodes = [];
    this._edges = [];
    this.jsav = jsav;
    this.options = $.extend({visible: true, nodegap: 40, autoresize: true}, options);
    var el = this.options.element || $("<div/>");
    el.addClass("jsavgraph");
    for (var key in this.options) {
      var val = this.options[key];
      if (this.options.hasOwnProperty(key) && typeof(val) === "string" || typeof(val) === "number" || typeof(val) === "boolean") {
        el.attr("data-" + key, val);
      }
    }
    if (!this.options.element) {
      $(jsav.canvas).append(el);
    }
    this.element = el;
    this.element.attr({"id": this.id()});
    if (this.options.autoresize) {
      el.addClass("jsavautoresize");
    }
    JSAV.utils._helpers.handlePosition(this);
    JSAV.utils._helpers.handleVisibility(this, this.options);
  };
  var graphproto = Graph.prototype;
  $.extend(graphproto, JSAV._types.ds.common);
  graphproto.css = JSAV.utils._helpers.css;
  graphproto._setcss = JSAV.anim(JSAV.utils._helpers._setcss);
  graphproto.clear = function() {};
  
  // returns a new graph node
  graphproto.newNode = function(value, options) {
    var newNode = new GraphNode(this, value, options);
    this._nodes.push(newNode);
    return newNode;
  };
  graphproto.addNode = function(value, options) {
    return this.newNode(value, options);
  };
  
  // adds an edge from fromNode to toNode
  graphproto.addEdge = function(fromNode, toNode) {};
  
  // removes an edge from fromNode to toNode
  graphproto.removeEdge = function(fromNode, toNode) {};

  // returns true/false whether an edge from fromNode to toNode exists
  graphproto.hasEdge = function(fromNode, toNode) {};

  // removes the given node
  graphproto.removeNode = function(node) {};
  
  // returns an array of nodes in the graph
  graphproto.nodes = function() { return this._nodes; };
  
  // returns an array of edges in the graph
  graphproto.edges = function() { return []; };

  // do the graph layout
  graphproto.layout = function() {
    // TODO: check the layout option
    var spring = new SpringLayout(this);
    console.log(spring);
  };

var SpringLayout = function(graph) {
  this.graph = graph;
  this.iterations = 500;
  this.maxRepulsiveForceDistance = 6;
  this.k = 2;
  this.c = 0.01;
  this.maxVertexMovement = 0.5;
  this.results = {};
  this.layout();
};
SpringLayout.prototype = {
  layout: function() {
    this.layoutPrepare();
    for (var i = 0; i < this.iterations; i++) {
      this.layoutIteration();
    }
    this.layoutCalcBounds();
  },

  layoutPrepare: function() {
    var nodes = this.graph.nodes();
    for (var i = 0, l = nodes.length; i < l; i++) {
      var node = {};
      node.layoutPosX = 0;
      node.layoutPosY = 0;
      node.layoutForceX = 0;
      node.layoutForceY = 0;
      this.results[nodes[i].id()] = node;
    }
  },

  layoutCalcBounds: function() {
    var minx = Infinity,
        maxx = -Infinity,
        miny = Infinity,
        maxy = -Infinity,
        nodes = this.graph.nodes(),
        i, x, y, l;

    for (i = 0, l = nodes.length; i < l; i++) {
      x = this.results[nodes[i].id()].layoutPosX;
      y = this.results[nodes[i].id()].layoutPosY;
      if (x > maxx) { maxx = x; }
      if (x < minx) { minx = x; }
      if (y > maxy) { maxy = y; }
      if (y < miny) { miny = y; }
    }

    this.layoutMinX = minx;
    this.layoutMaxX = maxx;
    this.layoutMinY = miny;
    this.layoutMaxY = maxy;
  },

  layoutIteration: function() {
    // Forces on nodes due to node-node repulsions
    var prev = [],
        nodes, edges,
        i, l, j, k;
    nodes = this.graph.nodes();
    for (i = 0, l = nodes.length; i < l; i++) {
      var node1 = nodes[i];
      for (j = 0, k = prev.length; j < k; j++) {
        var node2 = nodes[prev[j]];
        this.layoutRepulsive(node1, node2);
      }
      prev.push(i);
    }

    // Forces on nodes due to edge attractions
    edges = this.graph.edges();
    for (i = 0, l = edges.length; i < l; i++) {
      var edge = edges[i];
      this.layoutAttractive(edge);
    }

    // Move by the given force
    nodes = this.graph.nodes();
    for (i = 0, l = nodes.length; i < l; i++) {
      var node = this.results[nodes[i].id()];
      var xmove = this.c * node.layoutForceX;
      var ymove = this.c * node.layoutForceY;

      var max = this.maxVertexMovement;
      if (xmove > max) { xmove = max; }
      if (xmove < -max) { xmove = -max; }
      if (ymove > max) { ymove = max; }
      if (ymove < -max) { ymove = -max; }

      node.layoutPosX += xmove;
      node.layoutPosY += ymove;
      node.layoutForceX = 0;
      node.layoutForceY = 0;
    }
  },

  layoutRepulsive: function(node1, node2) {
    if (typeof node1 === 'undefined' || typeof node2 === 'undefined') {
      return;
    }
    var lay1 = this.results[node1.id()],
        lay2 = this.results[node2.id()];
    var dx = lay2.layoutPosX - lay1.layoutPosX;
    var dy = lay2.layoutPosY - lay1.layoutPosY;
    var d2 = dx * dx + dy * dy;
    if (d2 < 0.01) {
      dx = 0.1 * Math.random() + 0.1;
      dy = 0.1 * Math.random() + 0.1;
      d2 = dx * dx + dy * dy;
    }
    var d = Math.sqrt(d2);
    if (d < this.maxRepulsiveForceDistance) {
      var repulsiveForce = this.k * this.k / d;
      lay2.layoutForceX += repulsiveForce * dx / d;
      lay2.layoutForceY += repulsiveForce * dy / d;
      lay1.layoutForceX -= repulsiveForce * dx / d;
      lay1.layoutForceY -= repulsiveForce * dy / d;
    }
  },

  layoutAttractive: function(edge) {
    var node1 = edge.start();
    var node2 = edge.end();


    var lay1 = this.results[node1.id()],
        lay2 = this.results[node2.id()];
    var dx = lay2.layoutPosX - lay1.layoutPosX;
    var dy = lay2.layoutPosY - lay1.layoutPosY;
    var d2 = dx * dx + dy * dy;
    if (d2 < 0.01) {
      dx = 0.1 * Math.random() + 0.1;
      dy = 0.1 * Math.random() + 0.1;
      d2 = dx * dx + dy * dy;
    }
    var d = Math.sqrt(d2);
    if (d > this.maxRepulsiveForceDistance) {
      d = this.maxRepulsiveForceDistance;
      d2 = d * d;
    }
    var attractiveForce = (d2 - this.k * this.k) / this.k;
    if (edge.attraction === undefined) {
      edge.attraction = 1;
    }
    attractiveForce *= Math.log(edge.attraction) * 0.5 + 1;

    lay2.layoutForceX -= attractiveForce * dx / d;
    lay2.layoutForceY -= attractiveForce * dy / d;
    lay1.layoutForceX += attractiveForce * dx / d;
    lay1.layoutForceY += attractiveForce * dy / d;
  }
};


  var GraphNode = function(container, value, options) {
    this.jsav = container.jsav;
    this.container = container;
    this.options = $.extend(true, {visible: true}, options);
    var el = this.options.nodeelement || $("<div><span class='jsavvalue'>" + this._valstring(value) + "</span></div>"),
      valtype = typeof(value);
    if (valtype === "object") { valtype = "string"; }
    this.element = el;
    el.addClass("jsavnode jsavgraphnode")
        .attr({"data-value": value, "id": this.id(), "data-value-type": valtype })
        .data("node", this);
    if (this.options.autoResize) {
      el.addClass("jsavautoresize");
    }
    this.container.element.append(el);

    JSAV.utils._helpers.handleVisibility(this, this.options);
    this._successors = [];
  };
  var nodeproto = GraphNode.prototype;
  $.extend(nodeproto, JSAV._types.ds.Node.prototype);
  nodeproto.css = JSAV.utils._helpers.css;
  nodeproto._setcss = JSAV.anim(JSAV.utils._helpers._setcss);

  nodeproto.edgeTo = function(node) {};
  nodeproto.edgeFrom = function(node) {
    return node.edgeTo(this);
  };

  // expose the types
  var dstypes = JSAV._types.ds;
  dstypes.Graph = Graph;
  dstypes.GraphNode = GraphNode;

  // add functions to jsav.ds to create graphs
  JSAV.ext.ds.graph = function(options) {
    return new Graph(this, $.extend(true, {visible: true, autoresize: true}, options));
  };

})(jQuery);
