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


  module("graphicals.rect", {  });

  test("Testing Rectangle", function() {
	  var av = new JSAV("emptycontainer");
	  
    var r = av.g.rect(70, 60, 50, 40);
    ok(r, "rect created");
    equals(r.width(), 50, "rectangle width");
    equals(r.height(), 40, "rectangle height");
    equals(r.css("stroke"), "#000", "rectangle stroke color");
    equals(r.css("stroke-width"), 1, "rectangle stroke width");
    equals(r.css("fill"), "none", "rectangle fill");
    equals(r.css("opacity"), 1, "rectangle opacity");
    var origBB = $.extend(true, {}, r.rObj.getBBox());
    av.step();
    r.width(80);
    av.step();
    r.height(30);
    av.step();
    r.translate(30, 40);
    av.step();
    r.scale(2);
    av.step();
    r.css({"stroke-width": 4, "stroke": "red", "fill": "rgb(120,120,120)"});
    av.step();
    r.hide();
    av.step();
    r.show();
    av.recorded();

    equals(r.width(), 50, "rectangle width");
    equals(r.height(), 40, "rectangle height");
    equals(r.css("stroke"), "#000", "rectangle stroke color");
    equals(r.css("stroke-width"), 1, "rectangle stroke width");
    equals(r.css("fill"), "none", "rectangle fill");
    equals(r.css("opacity"), 1, "rectangle opacity");

    av.end();
    av.begin();

    var currBB = r.rObj.getBBox();
    equals(Math.round(currBB.x), Math.round(origBB.x));
    equals(Math.round(currBB.y), Math.round(origBB.y));
    equals(Math.round(currBB.width), Math.round(origBB.width), "horizontal scale undone correctly");
    equals(Math.round(currBB.height), Math.round(origBB.height), "vertical scale undone correctly");

    $.fx.off = true;
    
    av.forward(); // apply width
    equals(r.width(), 80, "rectangle width");
    equals(r.height(), 40, "rectangle height");
    currBB = r.rObj.getBBox();
    equals(Math.round(currBB.x), Math.round(origBB.x));
    equals(Math.round(currBB.y), Math.round(origBB.y));
    equals(Math.round(currBB.width), Math.round(origBB.width) + 30);
    equals(Math.round(currBB.height), Math.round(origBB.height));
    
    av.forward(); // apply height
    equals(r.width(), 80, "rectangle width");
    equals(r.height(), 30, "rectangle height");
    currBB = r.rObj.getBBox();
    equals(Math.round(currBB.x), Math.round(origBB.x));
    equals(Math.round(currBB.y), Math.round(origBB.y));
    equals(Math.round(currBB.width), Math.round(origBB.width) + 30);
    equals(Math.round(currBB.height), Math.round(origBB.height) - 10);
    
    av.forward(); // apply translate
    currBB = r.rObj.getBBox();
    equals(Math.round(currBB.x - origBB.x), 30);
    equals(Math.round(currBB.y - origBB.y), 40);
    
    av.forward(); // apply scale
    currBB = r.rObj.getBBox();
    equals(Math.floor(currBB.width), Math.round((origBB.width+30)*2), "hor scale redone correctly");
    equals(Math.floor(currBB.height), Math.round((origBB.height-10)*2), "vert scale redone correctly");
    
    av.forward(); // apply css
    equals(r.width(), 80, "rectangle width");
    equals(r.height(), 30, "rectangle height");
    equals(r.css("stroke"), "red", "rectangle stroke color");
    equals(r.css("stroke-width"), 4, "rectangle stroke width");
    equals(r.css("fill"), "rgb(120,120,120)", "rectangle fill");
    equals(r.css("opacity"), 1, "rectangle opacity");
    
    av.forward(); // apply hide
    equals(r.css("opacity"), 0, "rectangle opacity");
    
    av.forward(); // apply show
    equals(r.css("opacity"), 1, "rectangle opacity");
    
    ok(!av.forward()); // no more steps
  });


  module("graphicals.line", {  });

  test("Testing Line", function() {
	  var av = new JSAV("emptycontainer");
	  
    var l = av.g.line(10, 20, 150, 140);
    ok(l, "line created");
    var origBB = $.extend(true, {}, l.rObj.getBBox());
    equals(origBB.width, 140, "line BB width");
    equals(origBB.height, 120, "line BB height");
    equals(l.css("stroke"), "#000", "line stroke color");
    equals(l.css("stroke-width"), 1, "line stroke width");
    equals(l.css("fill"), "none", "line fill");
    equals(l.css("opacity"), 1, "line opacity");
    av.step();
    l.translatePoint(0, 20, 10);
    av.step();
    l.translatePoint(1, 10, 20);
    av.step();
    l.translate(30, 40);
    av.step();
    l.scale(2);
    av.step();
    l.scale(0.5);
    av.step();
    l.movePoints([[0, 10, 20], [1, 150, 140]]);
    av.step();
    l.css({"stroke-width": 4, "stroke": "red", "fill": "rgb(120,120,120)"});
    av.step();
    l.hide();
    av.step();
    l.show();
    av.recorded();

    $.fx.off = true;

    var currBB = l.rObj.getBBox();
    equals(Math.round(currBB.x), Math.round(origBB.x));
    equals(Math.round(currBB.y), Math.round(origBB.y));
    equals(Math.round(currBB.width), Math.round(origBB.width), "horizontal scale undone correctly");
    equals(Math.round(currBB.height), Math.round(origBB.height), "vertical scale undone correctly");
    equals(l.css("stroke"), "#000", "rectangle stroke color");
    equals(l.css("stroke-width"), 1, "rectangle stroke width");
    equals(l.css("fill"), "none", "rectangle fill");
    equals(l.css("opacity"), 1, "rectangle opacity");

    av.end();
    av.begin();

    currBB = l.rObj.getBBox();
    equals(Math.round(currBB.x), Math.round(origBB.x));
    equals(Math.round(currBB.y), Math.round(origBB.y));
    equals(Math.round(currBB.width), Math.round(origBB.width), "horizontal scale undone correctly");
    equals(Math.round(currBB.height), Math.round(origBB.height), "vertical scale undone correctly");

    $.fx.off = true;
    
    av.forward(); // apply translate point 0
    currBB = l.rObj.getBBox();
    equals(Math.round(currBB.x), Math.round(origBB.x) + 20);
    equals(Math.round(currBB.y), Math.round(origBB.y) + 10);
    equals(Math.round(currBB.width), Math.round(origBB.width) - 20);
    equals(Math.round(currBB.height), Math.round(origBB.height) - 10);
        
    av.forward(); // apply translate point 1
    currBB = l.rObj.getBBox();
    equals(Math.round(currBB.x), Math.round(origBB.x) + 20);
    equals(Math.round(currBB.y), Math.round(origBB.y) + 10);
    equals(Math.round(currBB.width), Math.round(origBB.width) - 10);
    equals(Math.round(currBB.height), Math.round(origBB.height) + 10);

    av.forward(); // apply translate
    currBB = l.rObj.getBBox();
    equals(Math.round(currBB.x - origBB.x), 50);
    equals(Math.round(currBB.y - origBB.y), 50);
    
    av.forward(); // apply scale
    currBB = l.rObj.getBBox();
    equals(Math.floor(currBB.width), Math.round((origBB.width-10)*2), "hor scale redone correctly");
    equals(Math.floor(currBB.height), Math.round((origBB.height+10)*2), "vert scale redone correctly");

    av.forward(); // apply scale 0.5
    currBB = l.rObj.getBBox();
    equals(Math.round(currBB.x - origBB.x), 50);
    equals(Math.round(currBB.y - origBB.y), 50);    

    av.forward(); // apply move points
    currBB = l.rObj.getBBox();
    equals(Math.round(currBB.x), Math.round(origBB.x) + 30);
    equals(Math.round(currBB.y), Math.round(origBB.y) + 40);
    equals(Math.round(currBB.width), Math.round(origBB.width));
    equals(Math.round(currBB.height), Math.round(origBB.height));
    
    av.forward(); // apply css
    equals(l.css("stroke"), "red", "line stroke color");
    equals(l.css("stroke-width"), 4, "line stroke width");
    equals(l.css("fill"), "rgb(120,120,120)", "line fill");
    equals(l.css("opacity"), 1, "line opacity");
    
    av.forward(); // apply hide
    equals(l.css("opacity"), 0, "line opacity");
    
    av.forward(); // apply show
    equals(l.css("opacity"), 1, "line opacity");
    
    ok(!av.forward()); // no more steps
  });
  test("Test line movePoints", function() {
	  var av = new JSAV("emptycontainer");
	  
    var l = av.g.line(10, 20, 150, 140);
    ok(l, "line created");
    var origBB = $.extend(true, {}, l.rObj.getBBox());
    av.step();
    l.movePoints([[0, 10, 20], [1, 150, 140]]);
    av.step();
    l.movePoints([[0, 30, 40], [1, 170, 160]]);
    av.recorded();
    
    $.fx.off = true;
    
    ok(av.forward());
    var currBB = $.extend(true, {}, l.rObj.getBBox());
    equals(Math.round(currBB.x), Math.round(origBB.x));
    equals(Math.round(currBB.y), Math.round(origBB.y));
    equals(Math.round(currBB.width), Math.round(origBB.width));
    equals(Math.round(currBB.height), Math.round(origBB.height));
    
    ok(av.forward());
    var currBB = $.extend(true, {}, l.rObj.getBBox());
    equals(Math.round(currBB.x), Math.round(origBB.x) + 20);
    equals(Math.round(currBB.y), Math.round(origBB.y) + 20);
    equals(Math.round(currBB.width), Math.round(origBB.width));
    equals(Math.round(currBB.height), Math.round(origBB.height));
  });
})();