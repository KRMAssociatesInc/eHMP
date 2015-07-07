/*jslint node: true */
'use strict';

var _ = require('lodash');
var async = require('async');
var rdk = require('../../rdk/rdk');
var util = require('util');
var httpUtil = require('../../utils/http-wrapper/http');
var nullchecker = require('../../utils/nullchecker/nullchecker');
var jdsUtils = require('../../subsystems/jdsSync/jdsUtils');
var jdsSync = require('../../subsystems/jdsSync/jdsSync');

var parameters = {
    post: {
        pid: {
            required: true,
            description: 'patient icn or dfn.'
        },
        vistaId: {
            required: true,
            description: 'secondary site id (e.g.: DOD, CDS, DAS) '
        },
        time: {
            required: false,
            description: 'HL7-formatted timestamp string'
        }
    }
};

module.exports.apiDocs = {
    spec: {
        summary: '',
        notes: '',
        parameters: [
            rdk.docs.commonParams.pid,
            rdk.docs.swagger.paramTypes.query('vistaId', 'secondary site id (e.g.: DOD, CDS, DAS)', 'string', true),  // todo: enum
            rdk.docs.swagger.paramTypes.query('time', 'HL7-formatted timestamp', 'string', false)  // todo: pattern
        ],
        responseMessages: []
    }
};

function setExpireOn(req, res, next) {

    req.logger.debug('setExpireOn');
    var pid = req.param('pid');
    var vistaId = req.param('vistaId');

    if(nullchecker.isNullish(pid) || nullchecker.isNullish(vistaId)) {
        return next();
    }


    req.logger.debug('setExpireOn: Pid:' + pid + ',vistaId:' + vistaId);

    req.audit.patientId = pid;
    req.audit.logCategory = 'EXPIRE';

    async.waterfall([
            function (callback){
                jdsSync._getSyncStatus(pid,req, callback);
            },
            function(syncstatus, callback){
                if (syncstatus.status === 404){
                    return callback(syncstatus);
                }
                expirepatientdata(pid,vistaId, req, callback);
            }],
        function (err, result) {
            if (err) {
                if (err.status === 404){
                    res.status(err.status).send(jdsUtils.createJsonErrorResponse(404, util.format('patient %s is unsynced.', pid)));
                }
                else
                {
                    res.status(rdk.httpstatus.internal_server_error).send(err.message);
                }

            } else {
                return res.send(result);
            }
        });
}

function expirepatientdata(pid,vistaId, req, callback){
    var ehmp = _.clone(req.app.config.hmpServer),
        config = _.clone(req.app.config.jdsSync.syncExpirePatientData);

    config.options.host = ehmp.host;
    config.options.port = ehmp.port;
    config.options.headers = {
        Authorization: getHmpHeader(req),
        Accept: 'application/json'
    };

    config = jdsUtils.createConfig(config, null, req.logger);


    var params = '';
    if(jdsUtils.isIcn(pid)){
        params = 'icn=' + pid;
    }
    else{
        params = 'dfn=' + pid;
    }

    var time = req.param('time');

    params = params + '&&vistaId=' + vistaId;
    if (nullchecker.isNotNullish(time)){
        params = params + '&&time=' + time;
    }

    config.options.path =  config.options.path + params;

    httpUtil.fetch(config, function(error, resp){
        if(_.isNull(resp)){
            req.logger.error(error);
            callback(error, null);
        }
        else{
            callback(null, resp);
        }
    }, expirePatientDataResultProcessor);
}

function expirePatientDataResultProcessor(status, data) {

    if (status === 200) {
        return {
            status: 200,
            data: JSON.parse(data)
        };
    }

    return jdsUtils.standardErrorResponse;
}

function getHmpHeader(req){
    var hmp = _.clone(req.app.config.hmpServer),
        token = hmp.accessCode + ':' + hmp.verifyCode;

    token = new Buffer(token).toString('base64');
    return 'Basic ' + token;
}

module.exports.parameters = parameters;
module.exports.setExpireOn = setExpireOn;
