//express 
const express = require('express');
const app = express();
const bodyParser = require('body-parser'); // body text
const cors = require('cors')

app.use(bodyParser.json()); // accept JSON data
app.use(bodyParser.urlencoded({ extended: true })); // accept form data
app.use(cors())

//mongpdb
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const registeredUsersDB = 'registeredUsers';
// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  const db = client.db(registeredUsersDB);
  client.close();
});

//socket.io
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

//user registration

app.post('/register', (req, res) =>{
	var username = req.body.username;
	var password = req.body.password;

	var users;

	const insertDocuments = function(db, callback) {
    const collection = db.collection('documents');
    collection.find({username : username}).toArray(function(err, docs) {
    	assert.equal(err, null);
    	console.log("Found the following records: " + docs.length);
    	users = docs;
    	callback(docs);
  	});
}
    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
      const db = client.db(registeredUsersDB);
      const insertDocuments = function(db, callback) {
        const collection = db.collection('documents');
        collection.insertMany([
          { username: username, password: password }], 
            function(err, result) {
              assert.equal(err, null);
              assert.equal(1, result.ops.length);
              console.log("Inserted username and password to the collection");
              callback(result);
            }
        );
      }
      insertDocuments(db, function() {
        res.status(200).send( username );
        client.close();
      });
    });
  });

  //user login
  app.post('/login', (req, res) =>{
    var username = req.body.username;
    var password = req.body.password;

    var users;
    const findDocuments = function(db, callback) {
      const collection = db.collection('documents');
      collection.find({username : username}).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("Found the following records: " + docs.length);
        users = docs;
        callback(docs);
      });
    };
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(registeredUsersDB);

    findDocuments(db, function() {
      var i = users.length;
      while(i--){
        if(username == users[0].username){
          res.status(200).send(username);
          client.close();
        }
        else{
          res.status(200).send("Username is not registered")
          client.close();
        }
      }
    });
  });
});


server.listen(3000, () => console.log('App listening on port 3000!'));



