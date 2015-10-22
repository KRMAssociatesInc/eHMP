'use strict';

var events = require('events');
var net = require('net');
var util = require('util');
var _ = require('underscore');

var ResponseHandler = require('./ResponseHandler.js');

var DEFAULT_HOST = '127.0.0.1';
var DEFAULT_PORT = 5000;
var LOWEST_PRIORITY = 1000;

var CRLF = new Buffer([0x0d, 0x0a]);

/*
This class emits:
    connect
    error
    close
*/
function BeanstalkClient(logger, host, port, maxListeners) {
    if (!(this instanceof BeanstalkClient)) {
        return new BeanstalkClient(logger, host, port);
    }

    this.logger = logger;
    this.logger.debug('beanstalk-client.BeanstalkClient() : host port %s:%s', host, port);
    events.EventEmitter.call(this);

    this.stream = null;
    this.handlers = [];
    this.buffer = undefined;
    this.host = host ? host : DEFAULT_HOST;
    this.port = port ? port : DEFAULT_PORT;

    this.setMaxListeners(maxListeners || 500);
}
util.inherits(BeanstalkClient, events.EventEmitter);

BeanstalkClient.prototype.connect = function(callback) {
    this.logger.debug('beanstalk-client.connect');
    var self = this;
    var tmp;

    this.logger.trace('beanstalk-client.connect() : connecting host port %s:%s', self.host, self.port);

    self.stream = net.createConnection(self.port, self.host);

    self.stream.on('data', function(data) {
        if (!self.buffer) {
            self.buffer = data;
        } else {
            tmp = new Buffer(self.buffer.length + data.length);
            self.buffer.copy(tmp, 0);
            data.copy(tmp, self.buffer.length);
            self.buffer = tmp;
        }

        self._tryHandlingResponse();
    });

    //handle callback
    self.stream.on('connect', onSuccessfulConnection);
    self.stream.on('error', onFailedConnection);

    function onSuccessfulConnection() {
        self.logger.trace('beanstalk-client.onSuccessfulConnection() : successfully connected');

        self.stream.removeListener('connect', onSuccessfulConnection);
        self.stream.removeListener('error', onFailedConnection);

        self.emit('connect');

        self.stream.on('connect', function() {
            self.logger.debug('beanstalk-client.onSuccessfulConnection() : BeanstalkClient emit connect');
            self.emit('connect');
        });

        self.stream.on('error', function(err) {
            self.logger.debug('BeanstalkClient emit error');
            self.emit('error', err);
        });

        self.stream.on('close', function(err) {
            self.logger.debug('BeanstalkClient emit close');
            self.emit('close', err);
        });

        if (callback) {
            self.logger.debug('letting consumer know of connection');
            callback();
        }
    }

    function onFailedConnection(err) {
        self.logger.debug('beanstalk-client.onFailedConnection() connection failure %s:%s -> %j', self.host, self.port, err);
        self.logger.warn('%j', err);
        self.stream.removeListener('connect', onSuccessfulConnection);
        self.stream.removeListener('error', onFailedConnection);

        if (callback) {
            callback(err);
        }
    }
};

BeanstalkClient.prototype.end = function(callback) {
    this.logger.debug('beanstalk-client.end()');
    if (this.stream) {
        this.stream.end();
        this.stream = null;
    }

    if (callback) {
        callback();
    }
};

BeanstalkClient.prototype._tryHandlingResponse = function() {
    this.logger.trace('beanstalk-client.tryHandlingResponse()');

    while (true) {
        // Peek at the oldest handler in our list and see if if thinks it's done.
        var latest = _.first(this.handlers);
        if (!latest) {
            break;
        }

        var handler = latest.handler;
        var callback = latest.callback;

        if ((handler !== undefined) && (handler !== null)) {
            this.buffer = handler.process(this.buffer);
            if (handler.complete) {
                // shift it off & reset
                this.handlers.shift();
                if (handler.success) {
                    callback.call.apply(callback, [null, null].concat(handler.args));
                } else {
                    callback.call(null, _.first(handler.args));
                }
            } else {
                handler.reset();
                break;
            }
        } else {
            break;
        }
    }
};


// Implementing the beanstalkd interface.
function makeBeanstalkCommand(command, expectedResponse, sendsData) {

    // Commands are called as client.COMMAND(arg1, arg2, ... data, callback);
    // They're sent to beanstalkd as: COMMAND arg1 arg2 ...
    // followed by data.
    // So we slice the callback & data from the passed-in arguments, prepend
    // the command, then send the arglist otherwise intact.
    // We then push a handler for the expected response onto our handler stack.
    // Some commands have no args, just a callback (stats, stats-tube, etc);
    // That's the case handled when args < 2.
    return function(args, data, callback) {
        this.logger.trace('beanstalk-client.%s(%j)', command, args || '');
        var buffer;
        var params = _.toArray(arguments);

        callback = params.pop();
        data = undefined;

        params.unshift(command);
        if (sendsData) {
            data = params.pop();
            if (!Buffer.isBuffer(data)) {
                data = new Buffer(data);
            }
            params.push(data.length);
        }

        this.handlers.push({
            handler: new ResponseHandler(this.logger, expectedResponse),
            callback: callback
        });

        if (data) {
            buffer = Buffer.concat([new Buffer(params.join(' ')), CRLF, data, CRLF]);
        } else {
            buffer = Buffer.concat([new Buffer(params.join(' ')), CRLF]);
        }

        this.stream.write(buffer);
    };
}


// beanstalkd commands

// use(tubename, callback)
BeanstalkClient.prototype.use = makeBeanstalkCommand('use', 'USING');

// put(priority, delaySecs, ttrSecs, job, callback)
BeanstalkClient.prototype.put = makeBeanstalkCommand('put', 'INSERTED', true);

// watch(priority, delaySecs, ttrSecs, job, callback)
BeanstalkClient.prototype.watch = makeBeanstalkCommand('watch', 'WATCHING');

// ignore(priority, delaySecs, ttrSecs, job, callback)
BeanstalkClient.prototype.ignore = makeBeanstalkCommand('ignore', 'WATCHING');

// reserve(callback)
BeanstalkClient.prototype.reserve = makeBeanstalkCommand('reserve', 'RESERVED');

// reserve_with_timeout(timeoutSecs, callback)
BeanstalkClient.prototype.reserve_with_timeout = makeBeanstalkCommand('reserve-with-timeout', 'RESERVED');

// destroy(beanstalkJobId, callback)
BeanstalkClient.prototype.destroy = makeBeanstalkCommand('delete', 'DELETED');

// release(beanstalkJobId, priority, delaySec, callback)
BeanstalkClient.prototype.release = makeBeanstalkCommand('release', 'RELEASED');

// bury(beanstalkJobId, priority, callback)
BeanstalkClient.prototype.bury = makeBeanstalkCommand('bury', 'BURIED');

// touch(beanstalkJobId, callback)
BeanstalkClient.prototype.touch = makeBeanstalkCommand('touch', 'TOUCHED');

// kick(bound, callback)
BeanstalkClient.prototype.kick = makeBeanstalkCommand('kick', 'KICKED');

// kick_job(beanstalkJobId, callback)
BeanstalkClient.prototype.kick_job = makeBeanstalkCommand('kick-job', 'KICKED');

// peek(beanstalkJobId, callback)
BeanstalkClient.prototype.peek = makeBeanstalkCommand('peek', 'FOUND');

// peek_ready(callback)
BeanstalkClient.prototype.peek_ready = makeBeanstalkCommand('peek-ready', 'FOUND');

// peek_delayed(callback)
BeanstalkClient.prototype.peek_delayed = makeBeanstalkCommand('peek-delayed', 'FOUND');

// peek_buried(callback)
BeanstalkClient.prototype.peek_buried = makeBeanstalkCommand('peek-buried', 'FOUND');

// list_tube_used(callback)
BeanstalkClient.prototype.list_tube_used = makeBeanstalkCommand('list-tube-used', 'USING');

// pause_tube(tubename, delaySecs, callback)
BeanstalkClient.prototype.pause_tube = makeBeanstalkCommand('pause-tube', 'PAUSED');

// the server returns yaml files in response to these commands:

// list_tubes(callback)
BeanstalkClient.prototype.list_tubes = makeBeanstalkCommand('list-tubes', 'OK');

// list_tubes_watched(callback)
BeanstalkClient.prototype.list_tubes_watched = makeBeanstalkCommand('list-tubes-watched', 'OK');

// stats(callback)
BeanstalkClient.prototype.stats = makeBeanstalkCommand('stats', 'OK');

// stats_job(beanstalkJobId, callback)
BeanstalkClient.prototype.stats_job = makeBeanstalkCommand('stats-job', 'OK');

// stats_tube(tubename, callback)
BeanstalkClient.prototype.stats_tube = makeBeanstalkCommand('stats-tube', 'OK');

// quit()
BeanstalkClient.prototype.quit = makeBeanstalkCommand('quit', '');

// end beanstalkd commands

module.exports = BeanstalkClient;
BeanstalkClient.LOWEST_PRIORITY = LOWEST_PRIORITY;
BeanstalkClient._makeBeanstalkCommand = makeBeanstalkCommand;