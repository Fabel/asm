# Awesome System Monitor (ASM)

## Getting Started

`git clone https://github.com/Fabel/asm.git`

`sudo apt-get install node sysstat`

`cd asm && npm install`

`node start.js`

## used soft

`node, sar, ps, sysstat`

## install

`sudo apt-get install node sysstat`

## start

`
  node start.js
`


## configuration

```javascript
global.config = {
  port: 8090,
  avgTimeout: 1000,
  cpuTimeout: 1000,
  memTimeout: 1000,
  websocket: {
    port: 8081,
    maxPackageSize: 10*1024*1024
  }
}
```

`port` - web server port
