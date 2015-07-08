'use strict';

var yaml = require('js-yaml');

var CRLF = new Buffer([0x0d, 0x0a]);

function ResponseHandler(logger, expectedResponse) {
    if(!(this instanceof ResponseHandler)) {
        return new ResponseHandler(logger, expectedResponse);
    }

    this.logger = logger;
    this.expectedResponse = expectedResponse;
}

ResponseHandler.prototype.reset = function() {
    this.logger.debug('ResponseHandler.reset()');

    this.complete = false;
    this.success = false;
    this.args = undefined;
    this.header = undefined;
    this.body = undefined;
};

ResponseHandler.prototype.RESPONSES_REQUIRING_BODY = {
    'RESERVED': 'passthrough',
    'FOUND': 'passthrough',
    'OK': 'yaml'
};

function findInBuffer(buffer, bytes) {
    var ptr = 0,
        idx = 0;
    while (ptr < buffer.length) {
        if (buffer[ptr] === bytes[idx]) {
            idx++;
            if (idx === bytes.length) {
                return (ptr - bytes.length + 1);
            }
        } else {
            idx = 0;
        }
        ptr++;
    }
    return -1;
}

ResponseHandler.prototype.process = function(data) {
    this.logger.trace('ResponseHandler.process()');

    var eol = findInBuffer(data, CRLF);
    if (eol > -1) {
        var sliceStart;

        // Header is everything up to the windows line break;
        // body is everything after.
        this.header = data.toString('utf8', 0, eol);
        this.body = data.slice(eol + 2, data.length);
        this.args = this.header.split(' ');

        var response = this.args[0];
        if (response === this.expectedResponse) {
            this.success = true;
            this.args.shift(); // remove it as redundant
        }

        if (this.RESPONSES_REQUIRING_BODY[response]) {
            this.parseBody(this.RESPONSES_REQUIRING_BODY[response]);
            if (this.complete) {
                sliceStart = eol + 2 + data.length + 2;
                if (sliceStart >= data.length) {
                    return new Buffer(0);
                }
                return data.slice(eol + 2 + data.length + 2);
            }
        } else {
            this.complete = true;
            sliceStart = eol + 2;
            if (sliceStart >= data.length) {
                return new Buffer(0);
            }
            return data.slice(eol + 2);
        }
    }

    return data;
};

/*
RESERVED <id> <bytes>\r\n
<data>\r\n

OK <bytes>\r\n
<data>\r\n

Beanstalkd commands like reserve() & stats() return a body.
We must read <bytes> data in response.
*/
ResponseHandler.prototype.parseBody = function(how) {
    this.logger.trace('ResponseHandler.parseBody()');

    if ((this.body === undefined) || (this.body === null)) {
        return;
    }

    var expectedLength = parseInt(this.args[this.args.length - 1], 10);

    if (this.body.length === (expectedLength + 2)) {
        this.args.pop();
        var body = this.body.slice(0, expectedLength);
        this.complete = true;

        switch (how) {
            case 'yaml':
                this.args.push(yaml.load(body.toString()));
                break;

            case 'passthrough':
            default:
                this.args.push(body);
                break;
        }
    }
};

module.exports = ResponseHandler;
ResponseHandler._findInBuffer = findInBuffer;
