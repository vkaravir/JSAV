/*global ok,test,module,deepEqual,equal,expect,equals,notEqual */
module("core", {  });

test("JSAV", function() {
  expect(4);
  ok( JSAV, "JSAV" );
  ok( JSAV.ext, "JSAV extensions");
  ok( JSAV.init, "JSAV init");
  var av = new JSAV("container");
  ok( av, "JSAV initialized" );
});
