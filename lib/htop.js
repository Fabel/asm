var os = require('os')
var child_process = require('child_process')

var Htop = function(){
  this.cpuCount = os.cpus().length
  this.state = false
  this.clients = []
  this.avgInterval = null
  this.cpuInterval = null
  this.memInterval = null
}

;(function(htop, proto){
  proto.on = function(){
    this.state = true
    this.avgInterval = this.runAvg()
    this.cpuInterval = this.runCPU()
    this.memInterval = this.runMemory()
  }

  proto.off = function(){
    this.state = false
    if(this.avgInterval){
      clearInterval(this.avgInterval)
      this.avgInterval = null
    }
  }

  proto.avg = function(){
    return os.loadavg()
  }

  proto.readProcesses = function(callback){
    exec("ps axfo pid,user,start,status,%mem,%cpu,rss,command", callback)
  }

  proto.getCPUStats = function(callback){
    exec("sar -P ALL 1 1", callback)
  }

  proto.getMemory = function(callback){
    exec("free -m", callback)
  }

  proto.runAvg = function(){
    var self = this
    return setInterval(function(){
      var data = {
        channel: 'avg',
        data: self.avg()
      }
      channels.broadcast('/avg', JSON.stringify(data))
    }, config.avgTimeout)
  }

  proto.runCPU = function(){
    var self = this
    return setInterval(function(){
      self.getCPUStats(function(out){
        var data = {
          channel: 'cpu',
          data: self.parseCPUInfo(out)
        }
        channels.broadcast('/cpu', JSON.stringify(data))
      })
    }, config.cpuTimeout)
  }

  proto.runMemory = function(){
    var self = this
    return setInterval(function(){
      self.getMemory(function(out){
        var data = {
          channel: 'memory',
          data: self.parseMemoryInfo(out)
        }
        channels.broadcast('/memory', JSON.stringify(data))
      })
    }, config.memTimeout)
  }

  proto.parseCPUInfo = function(data){
    var obj = {}
    var rows = data.split('\n')
    for(var i=0;i<this.cpuCount+1;i++){
      var cols = rows[i+3].split(/\s+/)
      obj[i] = {
        cpu: cols[1],
        user: cols[2],
        nice: cols[3],
        system: cols[4],
        iowait: cols[5],
        steal: cols[6],
        idle: cols[7],
      }
    }
    return obj
  }

  proto.parseMemoryInfo = function(data){
    var obj = {}
    var rows = data.split('\n')
    var memory = rows[1].split(/\s+/)
    var swap = rows[3].split(/\s+/)
    obj['memory'] = {
      total: memory[1],
      used: memory[2],
      free: memory[3],
      shared: memory[4],
      buffered: memory[5],
      cached: memory[6]
    }
    obj['swap'] = {
      total: swap[1],
      used: swap[2],
      free: swap[3],
    }
    return obj
  }

  var exec = function(command, callback){
    var outBuf = ""
    child_process.exec(command, function(err, stdout, stderr){
      if(err)
        console.log(err, stderr)
      else
        callback(stdout)
    })
  }

})(Htop, Htop.prototype)

module.exports = Htop
