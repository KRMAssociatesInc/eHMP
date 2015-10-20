/*
    vxsync-forever-agent.js
    A clone of forever-agent used to maintain persistent connections with subsystems such as JDS.
*/

module.exports = VxSyncForeverAgent
VxSyncForeverAgent.SSL = VxSyncForeverAgentSSL

var util = require('util')
  , Agent = require('http').Agent
  , net = require('net')
  , tls = require('tls')
  , AgentSSL = require('https').Agent

function VxSyncForeverAgent(options) {
  var self = this
  self.options = options || {}
  self.requests = {}
  self.sockets = {}
  self.freeSockets = {}
  self.maxSockets = self.options.maxSockets || Agent.defaultMaxSockets
  self.minSockets = self.options.minSockets || VxSyncForeverAgent.defaultMinSockets
  self.on('free', function(socket, host, port) {
    var name = host + ':' + port

    //The below if statement was modified to ensure that the connection only opens once and then that connection will be reused from the socket pool.
    //This is the only change from the original forever-agent code.
    if (self.requests[name] && self.requests[name].length) {
      self.requests[name].shift().onSocket(socket)
    } else if (self.sockets[name].length < self.minSockets) {
      if (!self.freeSockets[name]) self.freeSockets[name] = []
      self.freeSockets[name].push(socket)
      
      // if an error happens while we don't use the socket anyway, meh, throw the socket away
      var onIdleError = function() {
        socket.destroy()
      }
      socket._onIdleError = onIdleError
      socket.on('error', onIdleError)
    } else {
      // If there are no pending requests just destroy the
      // socket and it will get removed from the pool. This
      // gets us out of timeout issues and allows us to
      // default to Connection:keep-alive.
      socket.destroy()
    }

  })

}
util.inherits(VxSyncForeverAgent, Agent)

VxSyncForeverAgent.defaultMinSockets = 5


VxSyncForeverAgent.prototype.createConnection = net.createConnection
VxSyncForeverAgent.prototype.addRequestNoreuse = Agent.prototype.addRequest
VxSyncForeverAgent.prototype.addRequest = function(req, host, port) {
  var name = host + ':' + port
  if (this.freeSockets[name] && this.freeSockets[name].length > 0) {
    var idleSocket = this.freeSockets[name].pop()
    idleSocket.removeListener('error', idleSocket._onIdleError)
    delete idleSocket._onIdleError
    req._reusedSocket = true
    req.onSocket(idleSocket)
  } else {
    this.addRequestNoreuse(req, host, port)
  }
}

VxSyncForeverAgent.prototype.removeSocket = function(s, name, host, port) {
  if (this.sockets[name]) {
    var index = this.sockets[name].indexOf(s)
    if (index !== -1) {
      this.sockets[name].splice(index, 1)
    }
  } else if (this.sockets[name] && this.sockets[name].length === 0) {
    // don't leak
    delete this.sockets[name]
    delete this.requests[name]
  }
  
  if (this.freeSockets[name]) {
    var index = this.freeSockets[name].indexOf(s)
    if (index !== -1) {
      this.freeSockets[name].splice(index, 1)
      if (this.freeSockets[name].length === 0) {
        delete this.freeSockets[name]
      }
    }
  }

  if (this.requests[name] && this.requests[name].length) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(name, host, port).emit('free')
  }
}

function VxSyncForeverAgentSSL (options) {
  VxSyncForeverAgent.call(this, options)
}
util.inherits(VxSyncForeverAgentSSL, VxSyncForeverAgent)

VxSyncForeverAgentSSL.prototype.createConnection = createConnectionSSL
VxSyncForeverAgentSSL.prototype.addRequestNoreuse = AgentSSL.prototype.addRequest

function createConnectionSSL (port, host, options) {
  if (typeof port === 'object') {
    options = port;
  } else if (typeof host === 'object') {
    options = host;
  } else if (typeof options === 'object') {
    options = options;
  } else {
    options = {};
  }

  if (typeof port === 'number') {
    options.port = port;
  }

  if (typeof host === 'string') {
    options.host = host;
  }

  return tls.connect(options);
}
