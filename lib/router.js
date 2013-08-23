var Router = function(server){
  this.server = server
  this.urls    = {}
  this.gets    = {}
  this.posts   = {}
  this.deletes = {}
  this.updates = {}
}

Router.prototype = new function(){
  this.process = function(request, response){
    var url = request.url.toLowerCase()
    var method = request.method
    if(this.urls[url]){
      switch(method){
        case 'GET':
          this.gets[url].call(null, request, response)
          break
        case 'POST':
          this.posts[url].call(null, request, response)
          break
        case 'DELETE':
          this.deletes[url].call(null, request, response)
          break
        case 'UPDATE':
          this.updates[url].call(null, request, response)
          break
      }
      return true
    }
    return false
  }

  this.get = function(name, callback){
    this.urls[name] = true
    this.gets[name] = callback
  }
  this.post = function(name, callback){
    this.urls[name] = true
    this.posts[name] = callback
  }
  this.delete = function(name, callback){
    this.urls[name] = true
    this.deletes[name] = callback
  }
  this.update = function(name, callback){
    this.urls[name] = true
    this.updates[name] = callback
  }
}

module.exports = Router
