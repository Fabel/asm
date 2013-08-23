var fs = require('fs')
var clientList = require('./client_list')

var wsconfig = config.websocket

var webSocketServer = require('websocket').server

var server = require('./http_server')

server.on('error', function(e) {
    console.log(e)
})

var wsServer = new webSocketServer({
  httpServer: server,
  maxReceivedFrameSize: wsconfig.maxPackageSize,
  maxReceivedMessageSize: wsconfig.maxPackageSize
})

wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin)
  console.log((new Date()) + ' Connection accepted.')

  clientList.addClient(connection)
  connection.channels = []

  connection.on('message', function(message) {
    var data
    try{
      data = JSON.parse(message.utf8Data)
      if(data.channel){
        channels.subscribe(data.channel, connection)
      }
    }catch(e){
      console.log(e)
    }
  });

  connection.on('close', function(reasonCode, description) {
    clientList.disconnect(this)
    channels.unsubscribe(this.channel, this)
    console.log((new Date()) + ' Peer ' + this.remoteAddress + ' disconnected.');
  })
})

module.exports.clientList = clientList
