var App = (function(){
  var App = function(){
    this.init.apply(this, arguments)
    this.cpuStatus = null
  }

  ;(function(app, proto){
    proto.init = function(host){
      var socket = new WebSocket('ws://'+host)

      socket.addEventListener('open', function(msg){
        this.send(JSON.stringify({ channel: '/cpu' }))
        this.send(JSON.stringify({ channel: '/memory' }))
        this.send(JSON.stringify({ channel: '/avg' }))
      })

      socket.addEventListener('message', function(msg){
        var data = JSON.parse(msg.data)
        switch(data.channel){
          case 'cpu':
            if(!this.cpuStatus){
              this.cpuStatus = new CpuStatus(data.data)
              cpu.appendChild(this.cpuStatus.table)
            } else
              this.cpuStatus.update(data.data)
            break
          case 'memory':
            memory.innerHTML = '<pre>'+JSON.stringify(data.data)+'</pre>'
            break
          case 'avg':
            avg.innerHTML = '<pre>'+data.data+'</pre>'
            break
        }
      })

      socket.addEventListener('close', function(){
        console.log('close')
      })
      this.socket = socket
    }
  })(App, App.prototype)

  return App
})()
