var Client = function(connection){
  this.lastFileName = ''
  this.user = null
  this.connection = connection
  this.oncloseCallbacks = []
  connection.client = this
}

Client.prototype = new function(){
  this.disconnect = function(){
    this.removeFromCurrentPage()
    this.connection.close()
  }

  this.send = function(data){
    this.connection.sendUTF(JSON.stringify(data))
  }

  this.runCloseCallbacks = function(){
    for(var i=0;i<this.oncloseCallbacks.length;i++)
      this.oncloseCallbacks[i].call(this)
  }

  this.onclose = function(callback){
    this.oncloseCallbacks.push(callback)
  }
}

var ClientList = function(){
  this.clients = []
}

ClientList.prototype = new function(){
  this.count = 0

  this.broadcast = function(data){
    for (var i=0; i<this.clients.length; i++){
      this.clients[i].send(data)
    }
  }

  this.addClient = function(connection){
    this.clients.push(new Client(connection))
    this.count++
  }

  this.disconnect = function(connection){
    for (var i=0; i<this.clients.length; i++){
      if(this.clients[i].connection == connection){
        this.clients.splice(i, 1)
        break
      }
    }
    this.count--
    connection.client.runCloseCallbacks()
  }
}

module.exports = new ClientList
