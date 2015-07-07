'use strict';

var rdk = require('../../rdk/rdk');
var VistaJS = rdk.utils.VistaJS;
var RpcParameter = VistaJS.RpcParameter;
var _ = require('underscore');

var apiDocs = {
    spec: {
        summary: 'Example VistA resource',
        notes: '',
        method: 'GET',
        parameters: []
    }
};

function getResourceConfig() {
    return [{
        name: 'test-vista',
        path: '/test/vista',
        get: exampleVistaGet,
        apiDocs: apiDocs,
        interceptors: {
            operationalDataCheck: false,
            pep: false
        },
        healthcheck: {
            dependencies: []
        },
        permissions: []
    }];
}

function exampleVistaGet(req, res) {
    req.logger.debug('example VistA resource GET called');

    var vistaSite = '9E7A';
    var patientDfn = '3';
    req.audit.patientId = vistaSite + ';' + patientDfn;
    req.audit.logCategory = 'RETRIEVE';

    // Extend onto an empty object to prevent overwriting the
    // running configuration with our custom values in the
    // last object
    var vistaConfig = _.extend({}, req.app.config.vistaSites[vistaSite], {
        context: 'HMP UI CONTEXT',
        accessCode: req.session.user.accessCode,
        verifyCode: req.session.user.password
    });
    var parameters = [];
    var rpcName = 'ORWPT CWAD';
    parameters.push(new RpcParameter.literal(patientDfn));
    return VistaJS.callRpc(
        req.logger, vistaConfig, rpcName, parameters,
        function(err, result) {
            if(err) {
                req.logger.error(err, 'exampleVistaGet response error');
                return res.status(500).send(err);
            }
            return res.send({result: result});
        }
    );
}

module.exports.getResourceConfig = getResourceConfig;
