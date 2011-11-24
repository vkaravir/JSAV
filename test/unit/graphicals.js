(function() {
  module("graphicals.circle", {  });
  test("Testing Circle", function() {
	  var av = new JSAV("emptycontainer");
	  
    var c = av.g.circle(50, 60, 70);
    ok(c, "circle created");
    equals(c.center().cx, 50, "circle center x");
    equals(c.center().cy, 60, "circle center y");
    equals(c.radius(), 70, "circle radius");
    equals(c.css("stroke"), "#000", "circle stroke color");
    equals(c.css("stroke-width"), 1, "circle stroke width");
    equals(c.css("fill"), "none", "circle fill");
    equals(c.css("opacity"), 1, "circle opacity");
    var origBB = $.extend(true, {}, c.rObj.getBBox());
    av.step();
    c.center({cx: 80, cy: 90});
    av.step();
    c.radius(90);
    av.step();
    c.translate(30, 40);
    av.step();
    c.scale(2);
    av.step();
    c.css({"stroke-width": 4, "stroke": "red", "fill": "rgb(120,120,120)"});
    av.step();
    c.hide();
    av.step();
    c.show();
    av.recorded();

    equals(c.center().cx, 50, "circle center x");
    equals(c.center().cy, 60, "circle center y");
    equals(c.radius(), 70, "circle radius");
    equals(c.css("stroke"), "#000", "circle stroke color");
    equals(c.css("stroke-width"), 1, "circle stroke width");
    equals(c.css("fill"), "none", "circle fill");
    equals(c.css("opacity"), 1, "circle opacity");

    av.end();
    av.begin();

    var currBB = c.rObj.getBBox();
    equals(Math.round(currBB.x), Math.round(origBB.x));
    equals(Math.round(currBB.y), Math.round(origBB.y));
    equals(Math.round(currBB.width), Math.round(origBB.width), "scale undone correctly");

    $.fx.off = true;
    
    av.forward(); // apply center
    equals(c.center().cx, 80, "circle center x");
    equals(c.center().cy, 90, "circle center y");
    currBB = c.rObj.getBBox();
    equals(Math.round(currBB.x - origBB.x), 30);
    equals(Math.round(currBB.y - origBB.y), 30);
    
    av.forward(); // apply radius
    equals(c.radius(), 90, "circle radius");
    currBB = c.rObj.getBBox();
    equals(Math.round(currBB.x - origBB.x), 10);
    equals(Math.round(currBB.y - origBB.y), 10);
    
    av.forward(); // apply translate
    currBB = c.rObj.getBBox();
    equals(Math.round(currBB.x - origBB.x), 40);
    equals(Math.round(currBB.y - origBB.y), 50);
    
    av.forward(); // apply scale
    currBB = c.rObj.getBBox();
    equals(Math.floor(currBB.width), Math.round((origBB.width+40)*2), "scale redone correctly");
    
    av.forward(); // apply css
    equals(c.center().cx, 80, "circle center x");
    equals(c.center().cy, 90, "circle center y");
    equals(c.radius(), 90, "circle radius");
    equals(c.css("stroke"), "red", "circle stroke color");
    equals(c.css("stroke-width"), 4, "circle stroke width");
    equals(c.css("fill"), "rgb(120,120,120)", "circle fill");
    equals(c.css("opacity"), 1, "circle opacity");
    
    av.forward(); // apply hide
    equals(c.css("opacity"), 0, "circle opacity");
    
    av.forward(); // apply show
    equals(c.css("opacity"), 1, "circle opacity");
    
    ok(!av.forward()); // no more steps
  });


  module("graphicals.ellipse", {  });

  test("Testing Ellipse", function() {
	  var av = new JSAV("emptycontainer");
	  
    var e = av.g.ellipse(70, 60, 50, 40);
    ok(e, "ellipse created");
    equals(e.center().cx, 70, "ellipse center x");
    equals(e.center().cy, 60, "ellipse center y");
    equals(e.radius().rx, 50, "ellipse radius x");
    equals(e.radius().ry, 40, "ellipse radius y");
    equals(e.css("stroke"), "#000", "ellipse stroke color");
    equals(e.css("stroke-width"), 1, "ellipse stroke width");
    equals(e.css("fill"), "none", "ellipse fill");
    equals(e.css("opacity"), 1, "ellipse opacity");
    var origBB = $.extend(true, {}, e.rObj.getBBox());
    av.step();
    e.center({cx: 80, cy: 90});
    av.step();
    e.radius([30, 20]);
    av.step();
    e.translate(30, 40);
    av.step();
    e.scale(2);
    av.step();
    e.css({"stroke-width": 4, "stroke": "red", "fill": "rgb(120,120,120)"});
    av.step();
    e.hide();
    av.step();
    e.show();
    av.recorded();

    equals(e.center().cx, 70, "ellipse center x");
    equals(e.center().cy, 60, "ellipse center y");
    equals(e.radius().rx, 50, "ellipse radius x");
    equals(e.radius().ry, 40, "ellipse radius y");
    equals(e.css("stroke"), "#000", "ellipse stroke color");
    equals(e.css("stroke-width"), 1, "ellipse stroke width");
    equals(e.css("fill"), "none", "ellipse fill");
    equals(e.css("opacity"), 1, "ellipse opacity");

    av.end();
    av.begin();

    var currBB = e.rObj.getBBox();
    equals(Math.round(currBB.x), Math.round(origBB.x));
    equals(Math.round(currBB.y), Math.round(origBB.y));
    equals(Math.round(currBB.width), Math.round(origBB.width), "horizontal scale undone correctly");
    equals(Math.round(currBB.height), Math.round(origBB.height), "vertical scale undone correctly");

    $.fx.off = true;
    
    av.forward(); // apply center
    equals(e.center().cx, 80, "ellipse center x");
    equals(e.center().cy, 90, "ellipse center y");
    currBB = e.rObj.getBBox();
    equals(Math.round(currBB.x - origBB.x), 10);
    equals(Math.round(currBB.y - origBB.y), 30);
    
    av.forward(); // apply radius
    equals(e.radius().rx, 30, "ellipse radius x");
    equals(e.radius().ry, 20, "ellipse radius y");
    currBB = e.rObj.getBBox();
    equals(Math.round(currBB.x - origBB.x), 30);
    equals(Math.round(currBB.y - origBB.y), 50);
    
    av.forward(); // apply translate
    currBB = e.rObj.getBBox();
    equals(Math.round(currBB.x - origBB.x), 60);
    equals(Math.round(currBB.y - origBB.y), 90);
    
    av.forward(); // apply scale
    currBB = e.rObj.getBBox();
    equals(Math.floor(currBB.width), Math.round((origBB.width-40)*2), "hor scale redone correctly");
    equals(Math.floor(currBB.height), Math.round((origBB.height-40)*2), "vert scale redone correctly");
    
    av.forward(); // apply css
    equals(e.center().cx, 80, "ellipse center x");
    equals(e.center().cy, 90, "ellipse center y");
    equals(e.radius().rx, 30, "ellipse radius x");
    equals(e.radius().ry, 20, "ellipse radius y");
    equals(e.css("stroke"), "red", "ellipse stroke color");
    equals(e.css("stroke-width"), 4, "ellipse stroke width");
    equals(e.css("fill"), "rgb(120,120,120)", "ellipse fill");
    equals(e.css("opacity"), 1, "ellipse opacity");
    
    av.forward(); // apply hide
    equals(e.css("opacity"), 0, "ellipse opacity");
    
    av.forward(); // apply show
    equals(e.css("opacity"), 1, "ellipse opacity");
    
    ok(!av.forward()); // no more steps
  });
})();