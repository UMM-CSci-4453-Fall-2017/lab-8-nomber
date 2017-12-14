var express=require('express'),
Promise = require('bluebird'),
mysql=require('mysql'),
dbf = require('./dbf-setup.js'),
credentials=require('./credentials.json'),
app = express(),
port = process.env.PORT || 1337;

credentials.host='ids.morris.umn.edu'; //setup database credentials

var connection = mysql.createConnection(credentials); // setup the connection

connection.connect(function(err){if(err){console.log(error)}});

var queryDatabase = function(dbf, sql){
  queryResults = dbf.query(mysql.format(sql));
  return(queryResults);
}

var fillArray = function(result, arr){
  arr = result;
  return(arr);
}

var sendToDatabase = function(dbf, sql){
  dbf.query(mysql.format(sql));
}

app.use(express.static(__dirname + '/public'));
app.get("/buttons",function(req,res){
  var sql = 'SELECT * FROM Roch.till_buttons';
  connection.query(sql,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an error:");
             console.log(err);}
     res.send(rows);
  }})(res));
});

app.post("/click",function(req,res){
  var id = req.param('id');
  var sql = 'insert into ' + credentials.user + '.transaction values (' + id + ', (select item from ' + credentials.user + '.inventory where id = ' + id + '), 1, (select prices from ' + credentials.user +
  '.prices where id = ' + id + ');'
  console.log("Attempting sql ->"+sql+"<-");

  var query = sendToDatabase(dbf, sql);
  res.send();
});
// Your other API handlers go here!

app.listen(port);
