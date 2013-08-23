require('./config')
require('./lib/db_connection')
var Server = require('./lib/http_server')
var clients = require('./lib/ws_server').CLients
require('./lib/channels')
var Router = Server.router

var htop = new(require('./lib/htop'))
htop.on()

Router.get('/channels', function(req, resp){
  htop.getCPUStats(function(data){
    resp.end(JSON.stringify(channels))
  })
})

Server.listen(config.port)
