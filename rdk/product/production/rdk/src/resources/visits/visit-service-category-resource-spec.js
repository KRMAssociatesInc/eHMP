'use strict';

var visit_serviceCategory = require('./visit-service-category-resource');
var VistaJS = require('../../VistaJS/VistaJS');

var mock_session = {
    user: {
        username: '9E7A;vk1234',
        password: 'vk1234!!',
        duz: {
            '9E7A': '10000000257'
        },
        site: '9E7A'
    }
};

describe('visit_getServiceCategory', function() {
    describe('function getServiceCategory', function() {
        var req = {};
        // var res = {};

        beforeEach(function() {
            req = {};
            // res = {};
            sinon.stub(VistaJS, 'callRpc');


        });

        it('should call Vista RPCs', function() {
            var req = {
                query: {
                    'locationIEN': 5,
                    'patientStatus': 0
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
                                accessCode: 'vk1234',
                                verifyCode: 'vk1234!!'
                            },
                            'C877': {
                                name: 'KODAK',
                                division: '500',
                                host: '10.2.2.102',
                                port: 9210,
                                production: false,
                                accessCode: 'vk1234',
                                verifyCode: 'vk1234!!'
                            }
                        }
                    }
                },
                session: mock_session
            };

            var res = {
                send: function(message, error) {
                    /*jshint unused: false*/
                    return;
                }
            };

            visit_serviceCategory._getvisitServiceCategory(req, res);
            expect(VistaJS.callRpc.called).to.be.true();
        });

    });

});
