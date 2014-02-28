/*global ok,test,module,deepEqual,equal,expect,equals,notEqual */
module("core", {  });

test("JSAV", function() {
  expect(4);
  ok( JSAV, "JSAV" );
  ok( JSAV.ext, "JSAV extensions");
  ok( JSAV.init, "JSAV init");
  var av = new JSAV("emptycontainer");
  ok( av, "JSAV initialized" );
});

test("JSAV Options", function() {
  // simple test to see if global JSAV_OPTIONS works
  window.JSAV_OPTIONS = {cat: 0, dog: 1};
  var av = new JSAV("emptycontainer", {cat: 3, turtle: 42});
  equal(av.options.turtle, 42, "Basic option preserved");
  equal(av.options.dog, 1, "Global option");
  equal(av.options.cat, 3, "Global option also specified on initialization");
  // delete the global variable
  delete window.JSAV_OPTIONS;
});
