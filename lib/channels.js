var Channel = function(name){
  this.count = 0
  this.name = name
  this.connections = []
}

Channel.prototype = new function(){
  this.subscribe = function(connection){
    this.connections.push(connection)
    connection.channels.push(this)
    this.count++
  }
  this.unsubscribe = function(connection){
    var ind = this.connections.indexOf(connection)
    this.connections.splice(ind, 1)
    this.count--
  }
  this.broadcast = function(data){
    for(var i=0;i<this.count;i++)
      this.connections[i].send(data)
  }
  this.toJSON = function(){
    return this.count
  }
}

var ChannelList = function(){
  this.channels = {}
}

ChannelList.prototype = new function(){
  this.subscribe = function(channel, connection){
    if(!this.channels[channel])
      this.channels[channel] = new Channel(channel)
    this.channels[channel].subscribe(connection)
  }
  this.unsubscribe = function(channel, connection){
    connection.channels.forEach(function(channel){
      channel.unsubscribe(connection)
    })
  }
  this.broadcast = function(channel, data){
    if(this.channels[channel])
      this.channels[channel].broadcast(data)
  }
  this.toJSON = function(){
    return this.channels
  }
}

global.channels = new ChannelList
