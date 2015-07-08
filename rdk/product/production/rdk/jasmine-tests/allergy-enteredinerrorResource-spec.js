/*jslint node: true*/
'use strict';

var VistaJS = require('../VistaJS/VistaJS');
var errorResource = require('../resources/writebackallergy/enteredinerrorResource');

describe('Allergy Entered in Error Test', function() {
    var req = {};
    var res = {};

    beforeEach(function() {
        req = {
            param: function() {
                return JSON.stringify(allergyEiEJSON);
            },
            logger: {
                info: function(log) {
                    return log;
                },
                debug: function(debug) {
                    return debug;
                }
            },
            app: {
                config: {
                    rpcConfig: {
                        context: 'HMP UI CONTEXT',
                        siteHash: '9E7A'
                    },
                    vistaSites: {
                        '9E7A': {
                            name: 'PANORAMA',
                            division: '500',
                            host: '10.2.2.101',
                            port: 9210,
                            production: false,
                            accessCode: 'pu1234',
                            verifyCode: 'pu1234!!'
                        },
                        'C877': {
                            name: 'KODAK',
                            division: '500',
                            host: '10.2.2.102',
                            port: 9210,
                            production: false,
                            accessCode: 'pu1234',
                            verifyCode: 'pu1234!!'
                        }
                    }
                }
            },
            session: {
                user: {
                    username: '9E7A;pu1234',
                    password: 'pu1234!!',
                    duz: {
                        '9E7A': '10000000226'
                    },
                    site: '9E7A'
                }
            }
        };

        res = {
            send: function(message, error) {
                console.log(message);
                console.log(error);
                return;
            }
        };

        spyOn(VistaJS, 'callRpc');
    });

    it('tests the permission check', function() {
        errorResource.performPermissionCheck(req, res);
        expect(VistaJS.callRpc).toHaveBeenCalled();
    });
});

var allergyEiEJSON = {
    'param' : {
        'comments': 'something clever',
        'uid' : 'urn:va:domain:9E7A:pid:1234',
    }
};
