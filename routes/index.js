var express = require('express');
var router = express.Router();
var InfiniteLoop = require('infinite-loop');
var il = new InfiniteLoop();
/* GET home page. */


router.get('/', function(req, res, next) {
  user = "";
  dbjs.reader.remove({}, function(err,doc){
    console.log(doc);
  });
  res.render('index', {title:'Express'});
});


var collections = ["reader", "efpl", "efpluser"];
var mongojs = require('mongojs');
var dbjs = mongojs('mongodb://admin:admin@ds013619.mlab.com:13619/hogentresto',collections);
var app = express();

var rekeningLijnen = [];
var user = "";
var email = "";
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;

var yyyy = today.getFullYear();
if(dd<10){
    dd='0'+dd
} 
if(mm<10){
    mm='0'+mm
} 
var today = dd+'/'+mm+'/'+yyyy;

router.get('/reader/:id', function(req,res){
  dbjs.reader.insert({'id': req.params.id});
    res.send('Pablo says hello');
});

router.post('/addcart', function(req,res){
    rekeningLijnen.push({
        title: req.body.title, mealname: req.body.mealname, price: req.body.price
    });   
});

router.get('/refresh', function(req,res){
  dbjs.reader.findOne({},function (err, doc) {
    if (!doc) {
        // we visited all docs in the collection
        res.redirect('/');
    } else {
        res.redirect('/kassa/' + doc.id);
    }

});
});

router.post('/efpl', function(req, res){
  //for(i=0; i < cart.length; i++){
    //dbjs.efpl.insert({'id' : user, 'mail':email, 'meal': cart[i].mealname, 'title': cart[i].title, 'price': cart[i].price, 'date': cart[i].date});
  //}
  dbjs.efpl.insert({'rekeningLijnen' : rekeningLijnen, 'id' : user, 'mail':email, 'date':today});
  dbjs.reader.remove({}, function(err,doc){
    console.log(doc);
  });
  res.redirect('/');
});

router.get('/block/:before/:after', function(req,res){
    var m = req.params.before + '@' + req.params.after;
    dbjs.efpluser.findAndModify({
    query: { mail: m },
    update: { $set: { blocked: true } },
    new: false
    }, function (err, doc, lastErrorObject) {
    res.send("pablo says hoho"); 
});
    
});

router.get('/kassa/:id', function(req, res, next){
  cart = [];
  dbjs.efpluser.findOne({'id' : req.params.id},function (err, doc) {
    if (!doc) {
        // we visited all docs in the collection
    } else {
        if(doc.blocked){
            dbjs.reader.remove({}, function(err,doc){
                console.log(doc);
              });
            res.render('index', {message: "Kaart is geblokkerd!"});
        } else {
            user = req.params.id;
            email = doc.mail;
            res.render('kassa', {id: req.params.id, name: doc.name});
        }
    }

  });
});

module.exports = router;
