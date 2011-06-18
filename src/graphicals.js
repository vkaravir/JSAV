/*
 * JSAV 0.0.01 - JavaScript Algorithm Visualization Library
 *
 * Copyright (c) 2011 Ville Karavirta (http://)
 * Licensed under the MIT license.
 */

/**
* Module that contains the graphical primitive implementations.
* Depends on core.js, anim.js, jQuery, Raphael
*/
(function($, R) {
 if (typeof JSAV === "undefined") { return; }
 var gp = {};

 gp.circle = function(raphael, x, y, r) {
   if (!raphael) { 
     return this; 
   }
   var c = raphael.circle(x, y, r),
      elem = c.node;
  $(elem).data("svgelem", c);
  console.log("svg circle", $(elem), elem);
  return $(elem);
 };
 
 JSAV.ext.circle = function(x, y, r) {
   console.log(this);
   return gp.circle(this.getSvg(), x, y, r);
 };
 
})(jQuery, Raphael);