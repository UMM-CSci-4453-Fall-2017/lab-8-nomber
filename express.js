Promise=require('bluebird')
mysql=require('mysql');
dbf=require('./dbf-setup.js');
var credentials = require('./credentials.json');

var express=require('express'),
app = express(),
port = process.env.PORT || 1337;

var buttons = [];
var transaction = [];
var totalAmt = [];

var queryDatabase = function(dbf, sql){
  queryResults = dbf.query(mysql.format(sql));
  return(queryResults);
}


var fillInArray = function(result, array){
  array = result;
  return(array);
}

var sendToDatabase = function(dbf, sql){
  dbf.query(mysql.format(sql));
}

app.use(express.static(__dirname + '/public'));
app.get("/buttons",function(req,res){
  var sql = "SELECT * FROM " + credentials.user + ".till_buttons";
  var query = queryDatabase(dbf, sql)
  .then(fillInArray(buttons))
  .then(function (buttons) {
    res.send(buttons);})
  .catch(function(err){console.log("DANGER:",err)});
});

app.get("/transaction",function(req,res){
  var sql = "SELECT * FROM " + credentials.user + ".transaction";
  var query = queryDatabase(dbf, sql)
  .then(fillInArray(transaction))
  .then(function (transaction) {
    res.send(transaction);})
  .catch(function(err){console.log("DANGER:",err)});
});


app.post("/click",function(req,res){
  var id = req.param('id');
  var sql = 'insert into ' + credentials.user + '.transaction values (' + id + ', (select item from ' + credentials.user + '.inventory where id = ' + id + '), 1, (select prices from ' + credentials.user + '.prices where id = ' + id + ')) ON DUPLICATE KEY UPDATE cost=cost+(select prices from ' + credentials.user + '.prices where id = ' + id + '), amount=amount+1;'
  console.log("Attempting sql ->"+sql+"<-");
  var query = sendToDatabase(dbf, sql);
  res.send();
});


app.post("/delete", function(req,res){
  var id = req.param('id');
  var sql = 'DELETE FROM ' + credentials.user + '.transaction where id = ' + id;
  var query = sendToDatabase(dbf, sql);
  res.send();
});


app.get("/total", function(req, res){
  var sql = 'SELECT SUM(cost) AS TOTAL FROM ' + credentials.user + '.transaction';
  var query = queryDatabase(dbf, sql)
  .then(fillInArray(totalAmt))
  .then(function (totalAmt) {
    res.send(totalAmt);})
  .catch(function(err){console.log("DANGER:",err)});
});

app.listen(port);
