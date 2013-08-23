var Core = function(data){
  this.nodes = {}
  this.tr = null
  this.buildNodes(data)
}

Core.prototype.buildNodes = function(data){
  this.tr = document.createElement('tr')
  ;["cpu", "user", "nice", "system", "iowait","idle"].forEach(function(name){
    this[name] = data[name]
    var td = document.createElement('td')
    td.appendChild(document.createTextNode(this[name]))
    this.nodes[name] = td
    this.tr.appendChild(td)
  }, this)
}

Core.prototype.update = function(data){
  ;["user", "nice", "system", "iowait","idle"].forEach(function(name){
    this.nodes[name].firstChild.data = data[name]
  }, this)
}

var CpuStatus = function(data){
  this.table = null
  this.cores = {}
  var i = 0
  this.initDOM()
  for(var k in data){
    this.cores[k] = new Core(data[k])
    this.table.appendChild(this.cores[k].tr)
    i++
  }
  this.count = i
}

CpuStatus.prototype.initDOM = function(data){
  this.table = document.createElement('table')
  this.table.border = 1;
  ;["cpu", "user", "nice", "system", "iowait","idle"].forEach(function(name){
    var th = document.createElement('th')
    th.style.width = "50px"
    th.appendChild(document.createTextNode(name))
    this.table.appendChild(th)
  }, this)
}

CpuStatus.prototype.update = function(data){
  for(var k in data){
    this.cores[k].update(data[k])
  }
}
