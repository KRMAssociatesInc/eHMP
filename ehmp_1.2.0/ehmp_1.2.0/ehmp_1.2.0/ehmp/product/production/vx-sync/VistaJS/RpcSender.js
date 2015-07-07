'use strict';

var _ = require('underscore');
var _str = require('underscore.string');
var Socket = require('net').Socket;
var format = require('util').format;

var NUL = '\u0000';
var SOH = '\u0001';
var EOT = '\u0004';
var ENQ = '\u0005';

var undefMsg = 'response was undefined';
var nullMsg = 'response was null';
var shortMsg = 'response too short (length: %s)';
var securityMsg = 'VistA SECURITY error (byte 0 was \'\\u%s\'): %s';
var appMsg = 'VistA APPLICATION error (byte 1 was \'\\u%s\')';
var truncMsg = 'response was truncated, did not contain EOT (\'\\u0004\')';
var merrMsg = '"M  ERROR" returned by server';


function RpcSender(logger, config) {
    if (!(this instanceof RpcSender)) {
        return new RpcSender(logger, config);
    }

    this.logger = logger;
    this.config = config;
    this.buffer = '';
}


/*
This function is present for unit testing
to allow overriding to return a mock socket
*/
RpcSender.prototype.createSocket = function() {
    return new Socket();
};


RpcSender.prototype.connect = function(callback) {
    var self = this;
    var port = self.config.port;
    var host = self.config.host;

    self.logger.debug('Sender.connect(%s:%s)', host, port);

    self.close();

    self.socket = this.createSocket();
    self.setSocketTimeout(self.config.connectTimeout);


    self.logger.debug('connect to %s:%s', host, port);
    self.socket.connect(port, host, function connectCallback() {
        self.logger.debug('connected to %s:%s', host, port);
        self.setSocketTimeout(0);
        removeAllListeners(self.socket);
        callback(null, 'connected');
    });

    self.socket.on('error', function errorCallback(error) {
        self.logger.error('error: %j', error);
        self.setSocketTimeout(0);
        removeAllListeners(self.socket);
        self.close();
        callback(error);
    });

    self.socket.on('timeout', function timeoutCallback(error) {
        self.logger.error('error: timeout');
        self.setSocketTimeout(0);
        removeAllListeners(self.socket);
        self.close();
        callback(error);
    });
};


RpcSender.prototype.send = function(rpcString, callback) {
    var self = this;

    if (!self.socket) {
        return setTimeout(callback, 0, 'no socket instance');
    }

    self.logger.debug('Sender.send(%s:%s) => ', this.config.host, this.config.port, makeVisible(rpcString));

    self.socket.on('error', function errorCallback(error) {
        self.logger.error('error (%s:%s): %j', self.config.host, self.config.port, error);
        if (self.socket) {
            self.setSocketTimeout(0);
            removeAllListeners(self.socket);
            self.close();
        }
        callback(error);
    });

    self.socket.on('timeout', function timeoutCallback(error) {
        self.logger.error('error: timeout');
        self.setSocketTimeout(0);
        removeAllListeners(self.socket);
        self.close();
        callback(error);
    });

    self.socket.on('data', function receive(data) {
        self.logger.trace('Sender.receive(%s:%s)', self.config.host, self.config.port);
        self.logger.trace('Sender.receive(\'%s\')', makeVisible(data.toString()));

        var result;

        self.buffer += data;

        // self.logger.trace('isFrameComplete? %s', isFrameComplete(self.buffer));
        self.logger.trace(self.buffer);

        // check for security error, application error, or end of transmission (EOT)
        if (isFrameComplete(self.buffer)) {
            result = parseMessage(self.buffer);
            self.buffer = '';

            self.setSocketTimeout(0);
            removeAllListeners(self.socket);
            // self.logger.debug('frame complete, calling callback()');
            callback(result.error, result.response);
        }
    });

    self.setSocketTimeout(self.config.sendTimeout);
    self.socket.write(rpcString, function() {
        self.logger.debug('wrote command => %s', makeVisible(rpcString));
    });
};


function removeAllListeners(socket) {
    if (socket) {
        socket.removeAllListeners('timeout');
        socket.removeAllListeners('connect');
        socket.removeAllListeners('error');
        socket.removeAllListeners('data');
    }
}

RpcSender.prototype.close = function() {
    this.logger.debug('Sender.close(%s:%s)', this.config.host, this.config.port);

    if (this.socket) {
        this.logger.debug('destroy current socket');
        this.logger.debug('close() removeAllListeners()');
        this.socket.removeAllListeners();
        this.socket.destroy();
        this.socket = null;
    }
};

RpcSender.prototype.setSocketTimeout = function(timeoutMillis) {
    if (this.socket) {
        this.socket.setTimeout(timeoutMillis);
    }
};

///////////////////////////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////////////////////////


function parseMessage(frame) {
    if (_.isUndefined(frame)) {
        return createResponse(undefined, undefMsg);
    }

    if (_.isNull(frame)) {
        return createResponse(null, nullMsg);
    }

    if (frame.length < 3) {
        return createResponse(frame, format(shortMsg, frame.length));
    }

    if (frame.charAt(0) !== NUL) {
        return createResponse(frame, format(securityMsg, extractAndPad(frame, 0), extractSecurityErrorMessage(frame)));
    }

    if (frame.charAt(1) !== NUL) {
        return createResponse(frame, format(appMsg, extractAndPad(frame, 1)));
    }

    if (!_.contains(frame, EOT)) {
        return createResponse(frame, truncMsg);
    }

    frame = stripEOTs(frame.substring(2));

    // if (_str.startsWith(response, 'M  ERROR')) {
    if (frame.indexOf('M  ERROR') !== -1) {
        return createResponse(frame, merrMsg);
    }

    return {
        response: frame
    };
}

function isFrameComplete(buffer) {
    return buffer[0] !== NUL || buffer[1] !== NUL || _.contains(buffer, EOT);
}

function extractAndPad(string, idx) {
    return _str.lpad(string.charCodeAt(idx).toString(16), 4, '0');
}

function createResponse(responseMessage, errorMessage) {
    var response = {
        response: responseMessage
    };

    if (!_.isUndefined(errorMessage) && !_.isNull(errorMessage)) {
        var msg = errorMessage;
        if (arguments.length > 2) {
            msg = format.apply(null, _.rest(arguments));
        }

        response.error = msg;
    }

    return response;
}


function extractSecurityErrorMessage(string) {
    if (_.isEmpty(string)) {
        return '';
    }

    var message = string.substr(1, string.charCodeAt(0));

    return stripEOTs(message);
}

function stripEOTs(string) {
    if (_.isUndefined(string) || _.isNull(string)) {
        return string;
    }

    return string.replace(new RegExp('[' + EOT + ']', 'g'), '');
}


function makeVisible(string, openChar, closeChar) {
    string = string || '';
    openChar = openChar || '[';
    closeChar = closeChar || ']';

    return _.reduce(string, function(memo, ch) {
        var code = ch.charCodeAt();
        return memo + (code < 32 ? (openChar + code + closeChar) : ch);
    }, '');
}


module.exports.RpcSender = RpcSender;


module.exports.extractSecurityErrorMessage = extractSecurityErrorMessage;
module.exports.parseMessage = parseMessage;
module.exports.makeVisible = makeVisible;
module.exports.stripEOTs = stripEOTs;
module.exports.isFrameComplete = isFrameComplete;

module.exports._createResponse = createResponse;
module.exports._extractAndPad = extractAndPad;

module.exports.NUL = NUL;
module.exports.SOH = SOH;
module.exports.EOT = EOT;
module.exports.ENQ = ENQ;

module.exports._undefMsg = undefMsg;
module.exports._nullMsg = nullMsg;
module.exports._shortMsg = shortMsg;
module.exports._securityMsg = securityMsg;
module.exports._appMsg = appMsg;
module.exports._truncMsg = truncMsg;
module.exports._merrMsg = merrMsg;