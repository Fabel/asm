var http = require("http")
var fs = require('fs')
var path = require('path')
var Router = require('./router')

var APP_PATH = path.join(__dirname, '..')
var PUBLIC_PATH = APP_PATH + '/public'
var ASSETS_PATH = APP_PATH + '/app'

var types = {
  html: "text/html",
  js:   "text/javascript",
  css:  "text/css",
  png:  "image/png",
  jpg:  "image/jpeg",
  jpeg: "image/jpeg",
  gif:  "image/gif"
}

var extention = function(url){
  var res = url.match(/\.(js|css|html|jpg|jpeg|png|gif|ejs)$/)
  if(res)
    return res[1]
}

var contentType = function(ext){
  return types[ext] || "text/plain"
}

var pathForExtention = function(ext){
  switch(ext){
    case 'js':
     return '/assets/javascripts'
    case 'css':
      return '/assets/stylesheets'
    case 'ejs':
      return '/views'
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return '/assets/images'
  }
  return ''
}

var notFound = function(request, response){
  response.writeHead(404, {'Content-Type': 'text/html'})
  response.end(fs.readFileSync(PUBLIC_PATH + '/404.html'))
}

var mainServerCallback = function(request, response) {
  if(this.router.process(request, response)){
    return
  }
  if(request.url == '/'){
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
    response.end(fs.readFileSync(PUBLIC_PATH+'/index.html'))
  }else{
    var ext = extention(request.url)
    if(fs.existsSync(PUBLIC_PATH + request.url)){
      fs.readFile(PUBLIC_PATH + request.url, function(err, file){
        if(err){
          notFound(request, response)
        }else{
          response.writeHead(200, {'Content-Type': contentType(ext)})
          response.end(file)
        }
      })
    }else{
      if(request.url.match(/\/assets\//)){
        var url = request.url.replace('/assets', pathForExtention(ext))
        fs.readFile(ASSETS_PATH + url, function(err, file){
          if(err){
            notFound(request, response)
          }else{
            response.writeHead(200, {'Content-Type': contentType(ext)})
            response.end(file)
          }
        })
      }else{
        notFound(request, response)
      }
    }
  }
}

var server = http.createServer(mainServerCallback);
server.mainServerCallback = mainServerCallback

server.router = new Router(server)

module.exports = server
