/**
* Version support
* Depends on core.js
*/
(function() {
  if (typeof JSAV === "undefined") { return; }
  var theVERSION = "0.1";

  JSAV.version = function() {
    return theVERSION;
  }  
})();
