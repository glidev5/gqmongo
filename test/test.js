// upsert
// read
// delete
//

//
var Q=require('q');
var mongo=require(__dirname+"/../mongo.js");
var assert=require("assert");
var lib={mongo:mongo};
function log(text){
  console.log(text);
}

it("should be able to run lib.js",function(done){
  done();
});

it("should be able to upsert", function(done){
  return Q({db:"test",collection:"test1",from:{id:123},to:{id:123,value:"1234"}}).then(lib.mongo.q_upsert).then(function(o){
    log(o.result)
    assert.equal(JSON.parse(o.result)["ok"],1);
  }).done(done);
});

it("should be able to find", function(done){
  return Q({db:"test",collection:"test1",key:{id:123}}).then(lib.mongo.q_find).then(function(o){
    log(o.result)
    assert.equal(JSON.parse(o.result)["length"],1)
  }).done(done);
});

it("should be able to delete", function(done){
    return Q({db:"test",collection:"test1",key:{id:123}}).then(lib.mongo.q_delete).then(function(o){
    log(o.result);
  }).done(done);
});
