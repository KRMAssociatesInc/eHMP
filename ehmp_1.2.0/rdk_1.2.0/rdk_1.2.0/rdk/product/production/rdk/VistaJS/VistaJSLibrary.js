/*jslint node: true */
'use strict';


var net = require('net');
var util = require('util');
var async = require('async');
var _ = require('underscore');
var _str = require('underscore.string');


var PREFIX = '[XWB]';
var RPC_VERSION = '1.108';
var COUNT_WIDTH = 3;
var NUL = '\u0000';
var SOH = '\u0001';
var EOT = '\u0004';
var ENQ = '\u0005';


var CIPHER_PAD = [
    'wkEo-ZJt!dG)49K{nX1BS$vH<&:Myf*>Ae0jQW=;|#PsO`\'%+rmb[gpqN,l6/hFC@DcUa ]z~R}"V\\iIxu?872.(TYL5_3',
    'rKv`R;M/9BqAF%&tSs#Vh)dO1DZP> *fX\'u[.4lY=-mg_ci802N7LTG<]!CWo:3?{+,5Q}(@jaExn$~p\\IyHwzU"|k6Jeb',
    '\\pV(ZJk"WQmCn!Y,y@1d+~8s?[lNMxgHEt=uw|X:qSLjAI*}6zoF{T3#;ca)/h5%`P4$r]G\'9e2if_>UDKb7<v0&- RBO.',
    'depjt3g4W)qD0V~NJar\\B "?OYhcu[<Ms%Z`RIL_6:]AX-zG.#}$@vk7/5x&*m;(yb2Fn+l\'PwUof1K{9,|EQi>H=CT8S!',
    'NZW:1}K$byP;jk)7\'`x90B|cq@iSsEnu,(l-hf.&Y_?J#R]+voQXU8mrV[!p4tg~OMez CAaGFD6H53%L/dT2<*>"{\\wI=',
    'vCiJ<oZ9|phXVNn)m K`t/SI%]A5qOWe\\&?;jT~M!fz1l>[D_0xR32c*4.P"G{r7}E8wUgyudF+6-:B=$(sY,LkbHa#\'@Q',
    'hvMX,\'4Ty;[a8/{6l~F_V"}qLI\\!@x(D7bRmUH]W15J%N0BYPkrs&9:$)Zj>u|zwQ=ieC-oGA.#?tfdcO3gp`S+En K2*<',
    'jd!W5[];4\'<C$/&x|rZ(k{>?ghBzIFN}fAK"#`p_TqtD*1E37XGVs@0nmSe+Y6Qyo-aUu%i8c=H2vJ\\) R:MLb.9,wlO~P',
    '2ThtjEM+!=xXb)7,ZV{*ci3"8@_l-HS69L>]\\AUF/Q%:qD?1~m(yvO0e\'<#o$p4dnIzKP|`NrkaGg.ufCRB[; sJYwW}5&',
    'vB\\5/zl-9y:Pj|=(R\'7QJI *&CTX"p0]_3.idcuOefVU#omwNZ`$Fs?L+1Sk<,b)hM4A6[Y%aDrg@~KqEW8t>H};n!2xG{',
    'sFz0Bo@_HfnK>LR}qWXV+D6`Y28=4Cm~G/7-5A\\b9!a#rP.l&M$hc3ijQk;),TvUd<[:I"u1\'NZSOw]*gxtE{eJp|y (?%',
    'M@,D}|LJyGO8`$*ZqH .j>c~h<d=fimszv[#-53F!+a;NC\'6T91IV?(0x&/{B)w"]Q\\YUWprk4:ol%g2nE7teRKbAPuS_X',
    '.mjY#_0*H<B=Q+FML6]s;r2:e8R}[ic&KA 1w{)vV5d,$u"~xD/Pg?IyfthO@CzWp%!`N4Z\'3-(o|J9XUE7k\\TlqSb>anG',
    'xVa1\']_GU<X`|\\NgM?LS9{"jT%s$}y[nvtlefB2RKJW~(/cIDCPow4,>#zm+:5b@06O3Ap8=*7ZFY!H-uEQk; .q)i&rhd',
    'I]Jz7AG@QX."%3Lq>METUo{Pp_ |a6<0dYVSv8:b)~W9NK`(r\'4fs&wim\\kReC2hg=HOj$1B*/nxt,;c#y+![?lFuZ-5D}',
    'Rr(Ge6F Hx>q$m&C%M~Tn,:"o\'tX/*yP.{lZ!YkiVhuw_<KE5a[;}W0gjsz3]@7cI2\\QN?f#4p|vb1OUBD9)=-LJA+d`S8',
    'I~k>y|m};d)-7DZ"Fe/Y<B:xwojR,Vh]O0Sc[`$sg8GXE!1&Qrzp._W%TNK(=J 3i*2abuHA4C\'?Mv\\Pq{n#56LftUl@9+',
    '~A*>9 WidFN,1KsmwQ)GJM{I4:C%}#Ep(?HB/r;t.&U8o|l[\'Lg"2hRDyZ5`nbf]qjc0!zS-TkYO<_=76a\\X@$Pe3+xVvu',
    'yYgjf"5VdHc#uA,W1i+v\'6|@pr{n;DJ!8(btPGaQM.LT3oe?NB/&9>Z`-}02*%x<7lsqz4OS ~E$\\R]KI[:UwC_=h)kXmF',
    '5:iar.{YU7mBZR@-K|2 "+~`M%8sq4JhPo<_X\\Sg3WC;Tuxz,fvEQ1p9=w}FAI&j/keD0c?)LN6OHV]lGy\'$*>nd[(tb!#'
];



function RpcClient(logger, configuration, rpcCommandList, callback) {
    if (!(this instanceof RpcClient)) {
        return new RpcClient(logger, configuration, rpcCommandList, callback);
    }

    this.logger = logger || require('bunyan').createLogger({
        name: 'RpcClient',
        level: 'info'
    });
    this.configuration = configuration;
    this.rpcTaskList = [];
    this.execList = [];
    this.callback = callback;
    this.socket = new net.Socket();

    if (!rpcCommandList || !_.isArray(rpcCommandList)) {
        throw new Error('RpcCommandList must be an array of RpcCommand objects');
    }

    var self = this;
    rpcCommandList.forEach(function(rpcCommand) {
        var rpcTask = new RpcTask(self.logger, rpcCommand, self.socket);
        self.rpcTaskList.push(rpcTask);
        self.execList.push(rpcTask.execute.bind(rpcCommand));
    });

}

RpcClient.prototype = {
    constructor: RpcClient,

    complete: function(error, results) {
        this.logger.debug('RpcClient.complete()');
        this.close();
        this.callback(error, results);
        // if !error, get last - 1 result and callback
    },

    onError: function(error) {
        this.logger.debug('RpcClient.onError()');
        this.close();
        this.callback(error, null);
    },

    onClose: function() {
        this.logger.debug('RpcClient.onClose()');
        this.close();
    },

    close: function() {
        this.logger.debug('RpcClient.close()');
        this.socket.removeAllListeners();
        this.socket.end();
        this.socket.destroy();
    },

    start: function() {
        this.logger.debug('RpcClient.start()');
        var self = this;

        this.socket.on('error', this.onError.bind(this));
        this.socket.on('close', this.onClose.bind(this));

        this.socket.setEncoding('utf8');
        this.socket.connect(this.configuration.port, this.configuration.host, function() {
            async.series(self.execList, self.complete.bind(self));
        });
    },
};


function RpcTask(logger, rpcCommand, socket) {
    if (!(this instanceof RpcTask)) {
        return new RpcTask(logger, rpcCommand, socket);
    }

    this.logger = logger || require('bunyan').createLogger({
        name: 'RpcClient',
        level: 'info'
    });
    this.buffer = '';
    this.socket = socket;
    this.rpcCommand = rpcCommand;

    this.execute = this.execute.bind(this);
    this.receive = this.receive.bind(this);
}

RpcTask.prototype = {
    constructor: RpcTask,

    execute: function(callback) {
        this.logger.debug('RpcClient.execute()');
        this.callback = callback;
        this.socket.on('data', this.receive.bind(this));
        this.logger.debug(this.rpcCommand.rpc.replace(/[^ -~]+/, '')); // /[\cA-\cZ]+/  /[\x00-\x1F]+/
        this.socket.write(this.rpcCommand.rpc);
    },

    receive: function(data) {
        this.logger.debug('RpcClient.receive()');
        var result;
        var error;

        this.buffer += data;

        if (this.buffer.indexOf(EOT) !== -1) {
            if (this.buffer[0] !== NUL) {
                this.logger.trace(data);
                error = new Error('VistA SECURITY error: ' + extractSecurityErrorMessage(this.buffer));
            } else if (this.buffer[1] !== NUL) {
                this.logger.trace(data);
                error = new Error('VistA APPLICATION error: ' + this.buffer);
            }

            this.buffer = this.buffer.substring(2);

            if (this.buffer.indexOf('M  ERROR') !== -1) {
                this.logger.trace(this.buffer);
                error = new Error(this.buffer);
            }

            result = this.buffer.substring(0, this.buffer.indexOf(EOT));
            this.socket.removeAllListeners('data');
            this.buffer = '';
            if (!error) {
                try {
                    result = this.rpcCommand.process(result);
                } catch (err) {
                    error = err;
                }
            }

            this.logger.trace(error);
            this.logger.trace('RpcClient result: ' + util.inspect(result, {
                depth: null
            }));

            this.callback(error, result);
        }
    }
};

function buildGreetingCommand(logger, configuration) {
    logger.debug('RpcClient.buildGreetingCommand()');
    logger.debug({vistaJS: {configuration: configuration}});

    return {
        rpc: buildRpcGreetingString(configuration.localIP, configuration.localAddress),

        process: function(data) {
            logger.debug('RpcClient greetingCommand.process');
            if (data !== 'accept') {
                throw Error(data);
            }

            logger.debug('RpcClient signOn SUCCESS');

            return 'HANDSHAKE SUCCESSFUL';
        }
    };
}


function buildSignOnSetupCommand(logger) {
    logger.debug('RpcClient.buildSignOnSetupCommand()');

    return {
        rpc: buildRpcString('XUS SIGNON SETUP', null),

        process: function(data) {
            logger.debug('RpcClient signOnSetupCommand.process');
            if (data.length === 0) {
                throw new Error('No response to login callback');
            }

            return 'SIGNON SETUP SUCCESSFUL';
        }
    };
}


function buildVerifyLoginCommand(logger, configuration) {
    logger.debug('RpcClient.buildVerifyLoginCommand()');
    logger.debug({vistaJS: {configuration: configuration}});

    var param = buildEncryptedParamString(configuration.accessCode + ';' + configuration.verifyCode);

    return {
        rpc: buildRpcString('XUS AV CODE', [param]),

        process: function(data) {
            logger.debug('RpcClient.verifyLoginCommand.process()');
            if (data.length === 0) {
                throw new Error('No response to login request');
            }

            var parts = data.split('\r\n');

            if (parts[0] === '0') {
                throw new Error(parts[3]);
            }

            return {
                accessCode: configuration.accessCode,
                verifyCode: configuration.verifyCode,
                duz: parts[0],
                greeting: parts.length > 7 ? parts[7] : 'OK'
            };
        }
    };
}


function buildVerifyLoginTokenCommand(logger, configuration) {
    logger.debug('RpcClient.buildVerifyLoginTokenCommand()');
    logger.debug({vistaJS: {configuration: configuration}});

    var param = buildEncryptedParamString(configuration.accessCode);

    return {
        rpc: buildRpcString('XUS AV CODE', [param]),

        process: function(data) {
            logger.debug('RpcClient.buildVerifyLoginTokenCommand.process()');
            if (data.length === 0) {
                throw new Error('No response to login request');
            }

            var parts = data.split('\r\n');
            logger.debug('VERIFY LOGIN WITH TOKEN', parts);

            if (parts[0] === '0') {
                throw new Error(parts[3]);
            }

            return {
                accessCode: configuration.accessCode,
                verifyCode: configuration.verifyCode,
                duz: parts[0],
                greeting: parts.length > 7 ? parts[7] : 'OK'
            };
        }
    };
}


function buildCreateContextCommand(logger, configuration) {
    logger.debug('RpcClient.buildCreateContextCommand()');
    logger.debug({vistaJS: {configuration: configuration}});

    var param = buildEncryptedParamString(configuration.context);

    return {
        rpc: buildRpcString('XWB CREATE CONTEXT', [param]),

        process: function(data) {
            logger.debug('RpcClient.createContextCommand.process()');
            if (data === '1') {
                return configuration.context;
            }

            throw new Error('Authorization error: ' + data);
        }
    };
}


function buildSignOffCommand(logger) {
    logger.debug('RpcClient.buildSignOffCommand()');

    return {
        rpc: buildRpcSignOffString(),

        process: function() {
            logger.debug('RpcClient.signOffCommand.process()');
            return 'SIGNOFF SUCCESSFUL';
        }
    };
}


function buildConnectionCommandList(logger, configuration) {
    var commandList = [];
    commandList.push(buildGreetingCommand(logger, configuration));
    commandList.push(buildSignOnSetupCommand(logger));
    commandList.push(buildVerifyLoginCommand(logger, configuration));
    commandList.push(buildCreateContextCommand(logger, configuration));

    return commandList;
}


function buildConnectionCommandListForSSO(logger, configuration) {
    var commandList = [];
    commandList.push(buildGreetingCommand(logger, configuration));
    commandList.push(buildSignOnSetupCommand(logger));
    commandList.push(buildVerifyLoginTokenCommand(logger, configuration));
    commandList.push(buildCreateContextCommand(logger, configuration));

    return commandList;
}


function strPack(string, width) {
    return _str.lpad(string.length, width, '0') + string;
}

function prependCount(string) {
    return String.fromCharCode(string.length) + string;
}

function adjustForNumericSearch(string) {
    return Number(string - 1);
}

function adjustForStringSearch(string) {
    if (string.length === 0) {
        return '';
    }

    var result = string.substring(0, string.length - 1);
    var ch = string.charAt(string.length - 1);
    var asciiCode = ch.charCodeAt() - 1;
    ch = String.fromCharCode(asciiCode);
    result = result + ch + '~';
    return result;
}

function adjustForSearch(string) {
    if (isNumeric(string)) {
        return adjustForNumericSearch(string);
    }

    return adjustForStringSearch(string);
}

function isNumeric(string) {
    return /^[0-9]+$/.test(string);
}

function extractSecurityErrorMessage(string) {
    if (string === null || string === undefined) {
        return null;
    }

    var parts = string.split(NUL);
    var message = parts[parts.length - 1];
    if (message.indexOf(EOT) !== -1) {
        message = message.split(EOT)[0];
    }

    return message;
}


function buildLiteralParamString(valueString) {
    return util.format('%s%sf', '0', strPack(valueString, COUNT_WIDTH));
}

function buildEncryptedParamString(valueString, assocIndex, idIndex) {
    if (assocIndex < 0 || assocIndex >= CIPHER_PAD.length ||
        idIndex < 0 || idIndex >= CIPHER_PAD.length) {
        throw new Error(util.format('Encryption Indexes must be from 0 to %s inclusive', (CIPHER_PAD.length - 1)));
    }

    if (assocIndex === null || assocIndex === undefined || idIndex === null || idIndex === undefined) {
        assocIndex = _.random(0, 9);
        idIndex = _.random(0, 9);

        while (assocIndex === idIndex) {
            idIndex = _.random(0, 9);
        }
    }

    var assocStr = CIPHER_PAD[assocIndex];
    var idStr = CIPHER_PAD[idIndex];

    var encryptedValue = Array.prototype.reduce.call(valueString, function(first, second) {
        var pos = assocStr.indexOf(second);
        return first + (pos === -1 ? second : idStr.charAt(pos));
    }, '');


    var encryptedString = String.fromCharCode(assocIndex + 32) + encryptedValue + String.fromCharCode(idIndex + 32);

    return buildLiteralParamString(encryptedString);
}

function buildReferenceParamString(valueString) {
    return util.format('%s%sf', '1', strPack(valueString, COUNT_WIDTH));
}

function buildListParamString(valueList) {
    // each list item should be: { key: '', value: '' }
    if (valueList === null || valueList === undefined || valueList.length === 0) {
        return strPack('', COUNT_WIDTH) + 'f';
    }

    var paramString = valueList.reduce(function(first, second) {
        var paramName = second.key;
        var paramValue = second.value;

        if (paramValue === null || paramValue === undefined || paramValue.length === 0) {
            paramValue = SOH;
        }

        return first + util.format('%s%st',
            strPack(paramName, COUNT_WIDTH),
            strPack(paramValue, COUNT_WIDTH));
    }, '');

    return util.format('%s%sf', '2', paramString.substring(0, paramString.length - 1));
}


function buildRpcGreetingString(ipAddress, hostname) {
    return util.format('[XWB]10304\nTCPConnect50%sf0%sf0%sf%s',
        strPack(buildLiteralParamString(ipAddress), COUNT_WIDTH),
        strPack('0', COUNT_WIDTH),
        strPack(buildLiteralParamString(hostname), COUNT_WIDTH),
        EOT);
}

function buildRpcSignOffString() {
    return util.format('[XWB]10304%s#BYE#%s', ENQ, EOT);
}

function buildParamRpcString(paramStringList) {
    if (paramStringList === null || paramStringList === undefined || paramStringList.length === 0) {
        return '54f';
    }

    return '5' + paramStringList.join('');
}

function buildRpcString(rpcName, paramStringList) {
    return util.format('%s11302%s%s%s%s',
        PREFIX,
        prependCount(RPC_VERSION),
        prependCount(rpcName),
        buildParamRpcString(paramStringList),
        EOT);
}

// PRIVATE functions
module.exports.CIPHER_PAD = CIPHER_PAD;
module.exports.strPack = strPack;
module.exports.prependCount = prependCount;
module.exports.adjustForNumericSearch = adjustForNumericSearch;
module.exports.adjustForStringSearch = adjustForStringSearch;
module.exports.adjustForSearch = adjustForSearch;
module.exports.isNumeric = isNumeric;
module.exports.extractSecurityErrorMessage = extractSecurityErrorMessage;
module.exports.buildLiteralParamString = buildLiteralParamString;
module.exports.buildEncryptedParamString = buildEncryptedParamString;
module.exports.buildReferenceParamString = buildReferenceParamString;
module.exports.buildListParamString = buildListParamString;
module.exports.buildRpcGreetingString = buildRpcGreetingString;
module.exports.buildRpcSignOffString = buildRpcSignOffString;
module.exports.buildParamRpcString = buildParamRpcString;
module.exports.buildRpcString = buildRpcString;
module.exports.RpcClient = RpcClient;
module.exports.RpcTask = RpcTask;
module.exports.buildGreetingCommand = buildGreetingCommand;
module.exports.buildSignOnSetupCommand = buildSignOnSetupCommand;
module.exports.buildVerifyLoginCommand = buildVerifyLoginCommand;
module.exports.buildCreateContextCommand = buildCreateContextCommand;
module.exports.buildSignOffCommand = buildSignOffCommand;
module.exports.buildConnectionCommandList = buildConnectionCommandList;
module.exports.buildVerifyLoginTokenCommand = buildVerifyLoginTokenCommand;
module.exports.buildConnectionCommandListForSSO = buildConnectionCommandListForSSO;
