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
    this._alledges = null;
    this.jsav = jsav;
    this.options = $.extend({visible: true, nodegap: 40, autoresize: true, width: 400, height: 200,
                              directed: false, center: true}, options);
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
    el.attr({"id": this.id()}).width(this.options.width).height(this.options.height);
    if (this.options.autoresize) {
      el.addClass("jsavautoresize");
    }
    if (this.options.center) {
      el.addClass("jsavcenter");
    }
    JSAV.utils._helpers.handlePosition(this);
    JSAV.utils._helpers.handleVisibility(this, this.options);
  };
  var graphproto = Graph.prototype;
  $.extend(graphproto, JSAV._types.ds.common);
  graphproto.css = JSAV.utils._helpers.css;
  graphproto._setcss = JSAV.anim(JSAV.utils._helpers._setcss);
  graphproto.clear = function() {};
 
  graphproto._setnodes = JSAV.anim(function(newnodes, options) {
    var oldnodes = this._nodes;
    this._nodes = newnodes;
    return [oldnodes, options];
  });
  graphproto._setadjs = JSAV.anim(function(newadjs, options) {
    var oldadjs = this._edges;
    this._edges = newadjs;
    return [oldadjs, options];
  });
  graphproto._setadjlist = JSAV.anim(function(newadj, index, options) {
    var oldadj = this._edges[index];
    this._edges[index] = newadj;
    this._alledges = null;
    return [oldadj, index, options];
  });

  // returns a new graph node
  graphproto.newNode = function(value, options) {
    var newNode = new GraphNode(this, value, options), // create new node
        newNodes = this._nodes.slice(0);
    newNodes.push(newNode); // add new node to clone of node array
    // set the nodes (makes the operation animatable
    this._setnodes(newNodes, options);

    var newAdjs = this._edges.slice(0);
    newAdjs.push([]);
    this._setadjs(newAdjs, options);

    return newNode;
  };
  graphproto.addNode = function(value, options) {
    return this.newNode(value, options);
  };
   // removes the given node
  graphproto.removeNode = function(node, options) {
    var nodeIndex = this._nodes.indexOf(node);
    if (nodeIndex === -1) { return; } // no such node
    // create a new array of nodes without the removed node
    var firstNodes = this._nodes.slice(0, nodeIndex),
        newNodes = firstNodes.concat(this._nodes.slice(nodeIndex + 1));
    // set the nodes (makes the operation animated)
    this._setnodes(newNodes, options);

    // TODO: remove all edges connected to the removed node ??

    // update the adjacency lists
    var firstAdjs = this._edges.slice(0, nodeIndex),
        newAdjs = firstAdjs.concat(this._edges.slice(nodeIndex + 1));
    this._setadjs(newAdjs, options);

    node.hide();

    // return this for chaining
    return this;
  };

  // adds an edge from fromNode to toNode
  graphproto.addEdge = function(fromNode, toNode, options) {
    var opts = $.extend({}, this.options, options);
    if (opts.directed && !opts["arrow-end"]) {
      opts["arrow-end"] = "classic-wide-long";
    }

    // only allow one edge between two nodes
    if (this.hasEdge(fromNode, toNode)) { return; }
    // get indices of the nodes
    var fromIndex = this._nodes.indexOf(fromNode),
        toIndex = this._nodes.indexOf(toNode);
    if (fromIndex === -1 || toIndex === -1) { return; } // no such nodes

    // create new edge
    var edge = new Edge(this.jsav, fromNode, toNode, opts),
        adjlist = this._edges[fromIndex].slice(0);
    // add new edge to adjlist
    adjlist.push(edge);
    // set the adjlist (makes the operation animated)
    this._setadjlist(adjlist, fromIndex, opts);

    if (!opts.directed) {
      edge = new Edge(this.jsav, toNode, fromNode, opts);
      adjlist = this._edges[toIndex].slice(0);
      adjlist.push(edge);
      this._setadjlist(adjlist, toIndex, opts);
    }
    return edge;
  };

  // removes an edge from fromNode to toNode
  graphproto.removeEdge = function(fromNode, toNode, options) {
    var edge = this.getEdge(fromNode, toNode);
    if (!edge) { return; } // no such edge

    var fromIndex = this._nodes.indexOf(fromNode),
        toIndex = this._nodes.indexOf(toNode),
        adjlist = this._edges[fromIndex],
        edgeIndex = adjlist.indexOf(edge),
        newAdjlist = adjlist.slice(0, edgeIndex).concat(adjlist.slice(edgeIndex + 1));
    this._setadjlist(newAdjlist, fromIndex, options);

    if (!this.options.directed) {
      adjlist = this._edges[toIndex];
      edgeIndex = adjlist.indexOf(edge);
      newAdjlist = adjlist.slice(0, edgeIndex).concat(adjlist.slice(edgeIndex + 1));
      this._setadjlist(newAdjlist, toIndex, options);
    }

    // we "remove" the edge by hiding it
    edge.hide();
  };

  // returns true/false whether an edge from fromNode to toNode exists
  graphproto.hasEdge = function(fromNode, toNode) {
    return !!this.getEdge(fromNode, toNode);
  };

  graphproto.getEdge = function(fromNode, toNode) {
    var fromIndex = this._nodes.indexOf(fromNode),
        adjlist = this._edges[fromIndex];
    for (var i = 0, l = adjlist.length; i < l; i++) {
      var edge = adjlist[i];
      if (edge.end() === toNode) {
        return edge;
      }
    }
    return undefined;
  };

  // returns an iterable array of nodes in the graph
  graphproto.nodes = function() {
    return JSAV.utils.iterable(this._nodes);
  };

  // returns an array of edges in the graph
  graphproto.edges = function() {
    if (!this._alledges) {
      var alledges = [];
      for (var i = 0, l = this._edges.length; i < l; i++) {
        for (var j = 0, ll = this._edges[i].length; j < ll; j++) {
          var edge = this._edges[i][j];
          if (alledges.indexOf(edge) === -1) {
            alledges.push(edge);
          }
        }
      }
      this._alledges = alledges;
    }
    return JSAV.utils.iterable(this._alledges);
  };

  // add the event handler registering functions
  JSAV.utils._events._addEventSupport(graphproto);

  // do the graph layout
  graphproto.layout = function(options) {
    var layoutAlg = this.options.layout || "_default";
    return this.jsav.ds.layout.graph[layoutAlg](this, options);
  };

  var SpringLayout = function(graph, options) {
    this.graph = graph;
    this.iterations = 2000;
    this.maxRepulsiveForceDistance = 6;
    this.k = 2;
    this.c = 0.01;
    this.maxVertexMovement = 0.5;
    this.results = {};
    this.nodes = graph.nodes();
    this.edges = graph.edges();
    this.layout();
    var factorX = (graph.element.width()) / (this.layoutMaxX - this.layoutMinX),
        factorY = (graph.element.height()) / (this.layoutMaxY - this.layoutMinY),
        node, edge, res;
    for (var i = 0, l = this.nodes.length; i < l; i++) {
      node = this.nodes[i];
      res = this.results[node.id()];
      node.css({left: (res.layoutPosX - this.layoutMinX) * factorX + "px",
               top: Math.max(0, (res.layoutPosY - this.layoutMinY) * factorY -
                    node.element.outerHeight())+ "px"});
    }
    for (i = 0, l = this.edges.length; i < l; i++) {
      edge = this.edges[i];
      graph.jsav.ds.layout.edge._default(edge, edge.start().position(), edge.end().position());
    }
  };

  /*!
   * Graph layout algorithm based on Graph Dracula
   * https://github.com/strathausen/dracula
   * Graph Dracula is "released under the MIT license"
   */
  SpringLayout.prototype = {
    layout: function() {
      this.layoutPrepare();
      for (var i = 0; i < this.iterations; i++) {
        this.layoutIteration();
      }
      this.layoutCalcBounds();
    },

    layoutPrepare: function() {
      for (var i = 0, l = this.nodes.length; i < l; i++) {
        var node = {};
        node.layoutPosX = 0;
        node.layoutPosY = 0;
        node.layoutForceX = 0;
        node.layoutForceY = 0;
        this.results[this.nodes[i].id()] = node;
      }
    },

    layoutCalcBounds: function() {
      var minx = Infinity,
          maxx = -Infinity,
          miny = Infinity,
          maxy = -Infinity,
          nodes = this.nodes,
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
      nodes = this.nodes;
      for (i = 0, l = nodes.length; i < l; i++) {
        var node1 = nodes[i];
        for (j = 0, k = prev.length; j < k; j++) {
          var node2 = nodes[prev[j]];
          this.layoutRepulsive(node1, node2);
        }
        prev.push(i);
      }

      // Forces on nodes due to edge attractions
      edges = this.edges;
      for (i = 0, l = edges.length; i < l; i++) {
        var edge = edges[i];
        this.layoutAttractive(edge);
      }

      // Move by the given force
      nodes = this.nodes;
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
  /*! End Graph Dracula -based code
  */

  var springLayout = function springLayout(graph, options) {
    var layout = new SpringLayout(graph);
  };
  var manualLayout = function manualLayout(graph, options) {
    var i, l, edge,
        edges = graph.edges();
    for (i = 0, l = edges.length; i < l; i++) {
      edge = edges[i];
      graph.jsav.ds.layout.edge._default(edge, edge.start().position(), edge.end().position());
    }
  };
  JSAV.ext.ds.layout.graph = {
    "_default": springLayout,
    "automatic": springLayout,
    "manual": manualLayout
  };

  var GraphNode = function(container, value, options) {
    this.jsav = container.jsav;
    this.container = container;
    this.options = $.extend(true, {visible: true, left: 0, top: 0}, options);
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

    JSAV.utils._helpers.handlePosition(this);
    JSAV.utils._helpers.handleVisibility(this, this.options);
  };
  var nodeproto = GraphNode.prototype;
  $.extend(nodeproto, JSAV._types.ds.Node.prototype);
  nodeproto.css = JSAV.utils._helpers.css;
  nodeproto._setcss = JSAV.anim(JSAV.utils._helpers._setcss);

  nodeproto.neighbors = function() {
    var edges = this.container._edges[this.container._nodes.indexOf(this)],
        neighbors = [];
    for (var i = 0, l = edges.length; i < l; i++) {
      neighbors.push(edges[i].end());
    }
    return JSAV.utils.iterable(neighbors);
  };
  nodeproto.edgeTo = function(node) {
    return this.container.getEdge(this, node);
  };
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
