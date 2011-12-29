/**
* Module that contains layout algorithms for data structures.
* Depends on core.js, datastructures.js
*/
(function() {
  if (typeof JSAV === "undefined") { return; }
  
  function centerArray(array, $lastItem) {
    // center the array inside its parent container
    if (array.options.hasOwnProperty("center") && !array.options.center) {
      // if options center is set to falsy value, return
      return;
    }
    // width of array expected to be last items position + its width
    var width = $lastItem.position().left + $lastItem.outerWidth(),
      containerWidth = $(array.jsav.container).width();
    array.element.css("left", (containerWidth - width)/2);
  }
  
  function verticalArray(array) {
    var $arr = $(array.element),
      // rely on browser doing the calculation, float everything to the left..
      $items = $arr.find("li").css({"float": "left", "position":"static"}),
      maxHeight = -1,
      indexed = !!array.options.indexed;
    if (indexed) {
      $arr.addClass("jsavindexed");
    }
    $items.each(function(index, item) {
      var $i = $(this),
        pos = $i.position();
      $i.css({"left": pos.left - index, "top": pos.top});
      maxHeight = Math.max(maxHeight, $i.outerHeight());
      if (indexed) {
        var $indexLabel = $i.find(".jsavindexlabel");
        if ($indexLabel.size() === 0) {
          $i.append('<span class="jsavindexlabel">' + index + '</span>');
          $indexLabel = $i.find(".jsavindexlabel");
        }
      }
    });
    // ..and return float and positioning
    $items.css({"float": "none", "position": "absolute"});
    $arr.height(maxHeight + (indexed?30:0));
    centerArray(array, $items.last());
  }
  function barArray(array) {
    var $arr = $(array.element).addClass("jsavbararray"),
      $items = $arr.find("li").css({"position":"relative", "float": "left"}), 
      maxValue = Number.MIN_VALUE,
      indexed = !!array.options.indexed,
      width = $items.first().outerWidth();
      size = array.size();
    if (indexed) {
      $arr.addClass("jsavindexed");
    }
    for (var i = 0; i < size; i++) {
      maxValue = Math.max(maxValue, array.value(i));
    }
    maxValue *= 1.15;
    $items.each(function(index, item) {
      var $i = $(this);
      var $valueBar = $i.find(".jsavvaluebar");
      if ($valueBar.size() === 0) {
        $i.prepend('<span class="jsavvaluebar" />');
        $valueBar = $i.find(".jsavvaluebar");
      }
      $valueBar.css({"height": "100%"});
      $i.find(".jsavvalue").css("height", (100.0*array.value(index) / maxValue) + 15 + "%")
        .html('<span>' + $i.find(".jsavvalue").text() + '</span>');
      if (indexed) {
        var $indexLabel = $i.find(".jsavindexlabel");
        if ($indexLabel.size() === 0) {
          $i.append('<span class="jsavindexlabel">' + index + '</span>');
          $indexLabel = $i.find(".jsavindexlabel");
        }
      }
    });
    centerArray(array, $items.last());
  }
  
  function treeLayout(tree) {
	  var NODEGAP = 40,
        results = {};
    var compactArray = function(arr) {
          return $.map(arr, function(item) { return item || null; });
        };
    var calculateLayout = function(node) {
  		var ch = compactArray(node.children());
  		for (var i = 0, l=ch.length; i < l; i++) {
  			if (ch[i]) {
  				calculateLayout(ch[i]);
  			}
  		}
  		results[node.id()] = {
  		  cachedTranslation: {width: 0, height: 0},
  		  translation: {width: 0, height: 0},
  		  node: node
  		};
      calculateContours(node);
  	},
  	calculateContours = function(node) {
  		var children = compactArray(node.children()),
  		  resnode = results[node.id()];
			var nodeWidth = node.element.outerWidth()/2.0,
			    nodeHeight = node.element.outerHeight();
  		if (children.length === 0) {
  			resnode.contours = new TreeContours(-nodeWidth, nodeWidth + (nodeWidth % 2 === 0 ? 0 : 1), 
  			                  nodeHeight, node.value());
  			translateThisNode(node, -nodeWidth, 0);
  		} else {
  			var transSum = 0;
  			var firstChild = children[0];
  			resnode.contours = results[firstChild.id()].contours;
  			results[firstChild.id()].contours = null;
  			translateNodes(firstChild, 0, NODEGAP + nodeHeight);

  			for (var i = 1, l = children.length; i < l; i++) {
  				var child = children[i];
  				if (!child) { continue; }
  				var childC = results[child.id()].contours;
  				var trans = resnode.contours.calcTranslation(childC, NODEGAP);
  				transSum += trans;

  				results[child.id()].contours = null;
  				resnode.contours.joinWith(childC, trans);

  				translateNodes(child, getXTranslation(firstChild) + trans - getXTranslation(child),
                                  	NODEGAP + nodeHeight);
  			}

  			var rootTrans = transSum / children.length;
  			resnode.contours.addOnTop(-nodeWidth, nodeWidth + (nodeWidth % 2 === 0 ? 0 : 1), 
  			          nodeHeight, NODEGAP, rootTrans);
  			translateThisNode(node, getXTranslation(firstChild) + rootTrans, 0);
  		}
  	},
  	translateThisNode = function(node, x, y) {
  	  var restrans = results[node.id()].translation;
  		restrans.width += x;
  		restrans.height += y;
  	},
  	translateNodes = function(node, x, y) {
  	  if (!node) { return; }
  	  var restrans = results[node.id()].cachedTranslation;
  		if (!restrans) {
  			restrans = {width: 0, height: 0};
  			results[node.id()].cachedTranslation = restrans;
  		}
  		restrans.width += x;
  		restrans.height += y;
  	},
  	getXTranslation = function(node) {
  	  var restrans = results[node.id()].cachedTranslation;
  		return results[node.id()].translation.width +
  			((!restrans) ? 0 : restrans.width);
  	},
  	propagateTranslations = function(node) {
  	  if (!node) { return; }
  	  var noderes = results[node.id()];
  		if (noderes.cachedTranslation) {
  			var ch = compactArray(node.children());
  			for (var i = 0, l = ch.length; i < l; i++) {
  				var child = ch[i];
  				translateNodes(child, noderes.cachedTranslation.width, noderes.cachedTranslation.height);
  				propagateTranslations(child);
  			}
  			noderes.translation.width += noderes.cachedTranslation.width;
  			noderes.translation.height += noderes.cachedTranslation.height;
  			noderes.cachedTranslation = null;
  		}
  	},
  	calculateFinalLayout = function(node, dx, dy) {
  	  var cLeftExtent = results[node.id()].contours.cLeftExtent;
  	  if (-cLeftExtent - getXTranslation(node) > 0) {
  			translateThisNode(node, -cLeftExtent - getXTranslation(node), 0);
  		}
  		translateNodes(node, dx, dy);
  		propagateTranslations(node);
  	};
  	
  	calculateLayout(tree.root());
  	calculateFinalLayout(tree.root(), 20, 10+NODEGAP);
  	var maxX = -1, maxY = -1, max = Math.max;
  	$.each(results, function(key, value) {
  	  var oldPos = value.node.element.position();
  	  if (oldPos.left == 0 && oldPos.top == 0) {
    	  value.node.element.css({left: value.translation.width + "px", top: value.translation.height + "px"});
  	  } else {
    	  value.node.css({left: value.translation.width + "px", top: value.translation.height + "px"});
  	  }
  	  maxX = max(maxX, value.translation.width + value.node.element.outerWidth());
  	  maxY = max(maxY, value.translation.height + value.node.element.outerHeight());
  	});
  	tree.element.width(maxX);
  	tree.element.height(maxY);

    // center the tree inside its parent container
    if (tree.options.hasOwnProperty("center") && tree.options.center) {
      // if options center is set to truthy value, center it
      containerWidth = $(tree.jsav.container).width();
      tree.element.css("left", (containerWidth - maxX)/2);
    }

  	var offset = tree.element.position();
  	$.each(results, function(key, value) {
  	  var node = value.node;
  	  if (node['edgetoparent']) {
  	    var start = {left: value.translation.width + offset.left,
  	                 top: value.translation.height + offset.top},
  	        endnode = results[node.parent().id()].translation,
  	        end = {left: endnode.width + offset.left,
  	               top: endnode.height + offset.top};
  	        
  	    edgeLayout(node.edgetoparent, start, end);
  	  }
  	});
  }
  
  var edgeLayout = function(edge, start, end) {
    var sElem = edge.startnode.element,
        eElem = edge.endnode.element,
        sWidth = sElem.outerWidth()/2.0,
        eWidth = eElem.outerWidth()/2.0,
        sHeight = sElem.outerHeight()/2.0,
        eHeight = eElem.outerHeight()/2.0,
        svgstyle = edge.jsav.getSvg().canvas.style,
        svgleft = svgstyle.left,
        svgtop = svgstyle.top,
        pi = Math.PI,
        startpos = sElem.offset(),
        endpos = eElem.offset(),
        fromX =  Math.round(start.left + sWidth - parseInt(svgleft, 10)),
  	    fromY = Math.round(start.top + sHeight - parseInt(svgtop, 10)),
  	    toX = Math.round(end.left + eWidth - parseInt(svgleft, 10)),
  	    toY = Math.round(end.top + eHeight - parseInt(svgtop, 10)),
  	    fromAngle = normalizeAngle(2*pi - Math.atan2(toY - fromY, toX - fromX)),
        toAngle = normalizeAngle(2*pi - Math.atan2(fromY - toY, fromX - toX)),
        fromPoint = getNodeBorderAtAngle(0, edge.startnode.element, 
                  {width: sWidth, height: sHeight, x: fromX, y: fromY}, fromAngle),
        toPoint = getNodeBorderAtAngle(1, edge.endnode.element, 
                  {width: eWidth, height: eHeight, x: toX, y: toY}, toAngle)
    edge.g.movePoints([fromPoint, toPoint]);
    edge.layout();
    
    function normalizeAngle(angle) {
      var pi = Math.PI;
    	while (angle < 0)
        angle += 2 * pi;
      while (angle >= 2 * pi) 
        angle -= 2 * pi;
      return angle;
    };
    function getNodeBorderAtAngle(pos, node, dim, angle) {
      // dim: x, y coords of center and half of width and height
    	var x, y, pi = Math.PI,
          urCornerA = Math.atan2(dim.height*2.0, dim.width*2.0),
          ulCornerA = pi - urCornerA,
          lrCornerA = 2*pi - urCornerA,
          llCornerA = urCornerA + pi;

      if (angle < urCornerA || angle > lrCornerA) { // on right side
        x = dim.x + dim.width;
        y = dim.y - (dim.width) * Math.tan(angle);
      } else if (angle > ulCornerA && angle < llCornerA) { // left
        x = dim.x - dim.width;
        y = dim.y + (dim.width) * Math.tan(angle - pi);
      } else if (angle <= ulCornerA) { // top
        x = dim.x + (dim.height) / Math.tan(angle);
        y = dim.y- dim.height;
      } else { // on bottom side
        x = dim.x - (dim.height) / Math.tan(angle - pi);
        y = dim.y + dim.height;
      }
    	return [pos, Math.round(x), Math.round(y)];
    }
  }
  
  var layouts = {};
  layouts.array = {
    "_default": verticalArray,
    "bar": barArray,
    "array": verticalArray
  };
  layouts.tree = {
    "_default": treeLayout
  };
  layouts.edge = {
    "_default": edgeLayout
  };
  JSAV.ext.layout = layouts;

TreeContours = function(left, right, height, data) {
		this.cHeight = height;
		this.leftCDims = [];
		this.leftCDims[this.leftCDims.length] = {width: -left, height: height};
		this.cLeftExtent = left;
		this.rightCDims = [];
		this.rightCDims[this.rightCDims.length] = {width: -right, height: height};
		this.cRightExtent = right;
	};
TreeContours.prototype = {
	addOnTop: function(left, right, height, addHeight, originTrans) {
	  var lCD = this.leftCDims,
	      rCD = this.rightCDims;
		lCD[lCD.length-1].height += addHeight;
		lCD[lCD.length-1].width += originTrans + left;
		rCD[rCD.length-1].height += addHeight;
		rCD[rCD.length-1].width += originTrans + right;

		lCD.push({width: -left, height: height});
		rCD.push({width: -right, height: height});
		this.cHeight += height + addHeight;
		this.cLeftExtent -= originTrans;
		this.cRightExtent -= originTrans;
		if (left < this.cLeftExtent) {
			this.cLeftExtent = left;
		}
		if (right > this.cRightExtent) {
			this.cRightExtent = right;
		}
	},
	joinWith: function(other, hDist) {
		if (other.cHeight > this.cHeight) {
			var newLeftC = new Array();
			var otherLeft = other.cHeight - this.cHeight;
			var thisCDisp = 0;
			var otherCDisp = 0;
			$.each(other.leftCDims, function (index, item) {
				if (otherLeft > 0 ) {
					var dim = {width: item.width, height: item.height};
					otherLeft -= item.height;
					if (otherLeft < 0) {
						dim.height += otherLeft;					
					}
					newLeftC[newLeftC.length] = dim;
				} else {
					otherCDisp += item.width;
				}
			});
			var middle = newLeftC[newLeftC.length - 1];

			$.each(this.leftCDims, function(index, item) {
				thisCDisp += item.width;
				newLeftC[newLeftC.length] = {width: item.width, height: item.height};
			});
               
			middle.width -= thisCDisp - otherCDisp;
			middle.width -= hDist;
			this.leftCDims = newLeftC;
		}
		if (other.cHeight >= this.cHeight) {
			this.rightCDims = other.rightCDims.slice();
		} else {
			var thisLeft = this.cHeight - other.cHeight;
			var nextIndex = 0;

			var thisCDisp = 0;
			var otherCDisp = 0;
			$.each(this.rightCDims, function (index, item) {
				if (thisLeft > 0 ) {
					nextIndex++;
					thisLeft -= item.height;
					if (thisLeft < 0) {
						item.height += thisLeft;
					}
				} else {
					thisCDisp += item.width;
				}
			});
			for (var i = nextIndex + 1, l=this.rightCDims.length; i < l; i++) {
				this.rightCDims[i] = null;
			}
			this.rightCDims = $.map(this.rightCDims, function(item) {return item;});
			var middle = this.rightCDims[nextIndex];

			for (i = 0, l=other.rightCDims.length; i < l; i++) {
				var item = other.rightCDims[i];
				otherCDisp += item.width;
				this.rightCDims[this.rightCDims.length] = {width: item.width, height: item.height};
			}
			middle.width += thisCDisp - otherCDisp;
			middle.width += hDist;
		}
		this.rightCDims[this.rightCDims.length-1].width -= hDist;

		if (other.cHeight > this.cHeight) {
			this.cHeight = other.cHeight;
		}
		if (other.cLeftExtent + hDist < this.cLeftExtent) {
			this.cLeftExtent = other.cLeftExtent + hDist;
		}
		if (other.cRightExtent + hDist > this.cRightExtent) {
			this.cRightExtent = other.cRightExtent + hDist;
		}
	},
	calcTranslation: function(other, wantedDist) {
		var lc = this.rightCDims,
		    rc = other.leftCDims,
		    li = lc.length - 1,
		    ri = rc.length - 1,
        lCumD = {width: 0, height: 0},
		    rCumD = {width: 0, height: 0},
		    displacement = wantedDist;

		while (true) {
			if (li < 0) {
				if (ri < 0 || rCumD.height >= lCumD.height) {
					break;
				}
				var rd = rc[ri];
				rCumD.height += rd.height;
				rCumD.width += rd.width;
				ri--;
			} else if (ri < 0) {
				if (lCumD.height >= rCumD.height) {
					break;
				}
				var ld = lc[li];
				lCumD.height += ld.height;
				lCumD.width += ld.width;
				li--;
			} else {
				var ld = lc[li],
				    rd = rc[ri],
				    leftNewHeight = lCumD.height,
				    rightNewHeight = rCumD.height;
				if (leftNewHeight <= rightNewHeight) {
					lCumD.height += ld.height;
					lCumD.width += ld.width;
					li--;
				}
				if (rightNewHeight <= leftNewHeight) {
					rCumD.height += rd.height;
					rCumD.width += rd.width;
					ri--;
				}
			}
			if (displacement < rCumD.width - lCumD.width + wantedDist) {
				displacement = rCumD.width - lCumD.width + wantedDist;
			}
		}
		return displacement;
	}
};
})();