/*
 * JSAV 0.0.01 - JavaScript Algorithm Visualization Library
 *
 * Copyright (c) 2011 Ville Karavirta (http://)
 * Licensed under the MIT license.
 */

/**
* Module that contains the animator implementations.
* Depends on core.js
*/
(function($) {
  if (typeof JSAV === "undefined") { return; }
  
  function initQueue(jsav) {
    jsav._redo = [];
    jsav._undo = [];
  }
  
  /* Add the function effect to the animation queue */
  function queue(effect) {
    if (!this._redo) { initQueue(this); }
  }
  JSAV.ext.queue = queue;
})(jQuery);