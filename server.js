const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const users = require('./users.json')
const songs = require('./songs.json')

const app = express();

// app.use(function (req, res) {
//   res.send({ msg: "hello" });
// });

 app.get("/", function(req, res) {
    res.sendfile('index.html')
 });

  /* serves all the static files */
 app.get(/^(.+)$/, function(req, res){ 
     console.log('static file request : ' + req.params);
     res.sendfile( __dirname + req.params[0]); 
 });

 app.get("users", function(req, res) {
     res.sendfile("users.json")
 })

//  app.get("songs", function(req, res) {
//      res.sendfile("songs.json")
//  })

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
  const location = url.parse(req.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});

server.listen(8080, function listening() {
  console.log('Listening on %d', server.address().port);
});
