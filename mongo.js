var MongoClient = require('mongodb').MongoClient;
var Q = require("q");

function log(text){
  setTimeout(function(){
    try{
      console.log(text);
    }catch(e){
    }
  },5);
}

function mongo(o, cb) {
    // mongo(o,cb) runs a single full mongo query
    // in: o.url
    // in: o.db
    // in: o.collection
    // in: o.mongoquery
    // in: cb
    // out: o.result
    // for example:
    // mongo({operation:"find",data:{id:123}},function(o){
    //   o.db...
    //   o.result...
    // })
    o.domain=o.domain||"localhost";
    o.port=o.port||27017;
    o.db=o.db||"test";
    o.url = o.url || 'mongodb://'+o.domain+':'+o.port+'/'+o.db;
    MongoClient.connect(o.url, function(err, db) {
        //assert.equal(null, err);
        console.log("Connected correctly to server");
        o.db = db;
        o.col = db.collection(o.collection);
        o.mongoquery(o, function(e, r) {
            o = r;
            db.close();
            cb(e, o);
        })
    });
}
exports.mongo = mongo

function doQ(o) {
    // doQ(o)
    // in: o.query
    // out: o.result
    // promise return: doQ({query:query,...other parameter query needs})
    var deferred = Q.defer();
    o.query(o, function(e, o2) {
        tryLog(e);
        deferred.resolve(o2);
    });
    return deferred.promise;
}
exports.doQ = doQ;

function upsert(o,cb) {
    // this operation is create/update/dissable
    // in: o.db
    // in: o.collection
    // in: o.from
    // in: o.to
    // in: o.option
    o.mongoquery= function(o, cb) {
      //console.log(o)
      o.to.updated=new Date();
      o.option=o.option||{upsert:true};
        o.col.update(o.from, {$set:o.to}, o.option, function(e, r) {
            o.result = JSON.stringify(r);
            cb(e, o);
        });
    }

    mongo(o,cb);
}
exports.upsert = upsert;

function q_upsert(o){
  o.query=upsert;
  return doQ(o);
}
exports.q_upsert=q_upsert;

function m_find(o,cb){
  // this operation is create/update/dissable
  // in: o.db
  // in: o.collection
  // in: o.key
  // in: o.option;
  o.key=o.key||{};
  o.limit=o.limit||1;
  o.option=o.option||{};
  o.option.limit=o.option.limit||1;
  o.mongoquery= function(o, cb) {
    //console.log(o)
    o.col.find(o.key,o.option).toArray(function(e, r) {
        o.result=JSON.stringify(r);
        cb(e, o);
    });
  }

  mongo(o,cb);
}
exports.m_find=m_find;

function q_find(o){
  o.query=m_find;
  return doQ(o);
}
exports.q_find=q_find;

function deleteOne(o,cb){
  // this operation is create/update/dissable
  // in: o.db
  // in: o.collection
  // in: o.key
  o.key=o.key||{};
  o.option=o.option||{};
  o.mongoquery= function(o, cb) {
      //console.log(o)
      o.col.deleteOne(o.key, function(e, r) {
        o.result = JSON.stringify(r);
        cb(e, o);
      });
  }

  mongo(o,cb);
}
exports.deleteOne=deleteOne;

function deleteMany(o,cb){
  // this operation is create/update/dissable
  // in: o.db
  // in: o.collection
  // in: o.key
  o.key=o.key||{};
  o.option=o.option||{};
  o.mongoquery= function(o, cb) {
      //console.log(o)
      o.col.deleteMany(o.key, function(e, r) {
        o.result = JSON.stringify(r);
        cb(e, o);
      });
  }

  mongo(o,cb);
}
exports.deleteMany=deleteMany;

function q_delete(o){
  o.query=deleteMany;
  return doQ(o);
}
exports.q_delete=q_delete;

function deleteCollection(o,cb){
  // this operation is create/update/dissable
  // in: o.db
  // in: o.collection
  // in: o.key
  o.key=o.key||{};
  o.option=o.option||{};
  o.mongoquery= function(o, cb) {
      //console.log(o)
      o.col.drop(function(e, r) {
        o.result = JSON.stringify(r);
        cb(e, o);
      });
  }

  mongo(o,cb);
}
exports.deleteCollection=deleteCollection;

function q_deleteCollection(o){
  o.query=deleteCollection;
  return doQ(o);
}
exports.q_deleteCollection=q_deleteCollection;
