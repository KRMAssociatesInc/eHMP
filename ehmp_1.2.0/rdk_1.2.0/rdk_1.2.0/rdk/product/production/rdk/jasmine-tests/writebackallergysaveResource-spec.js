/*jslint node: true */
'use strict';

// var writebacksaveallergy = require('../resources/writebackallergy/writebackallergysaveResource');
var VistaJS = require('../VistaJS/VistaJS');

describe('writebacksaveallergy', function() {
    describe('call function performWriteBack', function() {
        var req = {};

        beforeEach(function() {
            req = {};
            spyOn(VistaJS, 'callRpc');
        });

        it('with natureOfReaction set to \'P^Pharmacological\', ' +
            'allergyName set to \'INDERAL^198;PSNDF(50.67,\', ' +
            'originatorIEN set to \'10000000224\', ' +
            'historicalOrObserved set to \'h^HISTORICAL\', ' +
            'eventDateTime set to \'20140818134015\', ' +
            'symptoms set to \'1^HIVES\', ' +
            'localId set to \'3\'', function() {
                var allergyObjectFromView = {
                    'param': {
                        'allergyName': 'INDERAL^198;PSNDF(50.67,',
                        'eventDateTime': '20140818134015',
                        'originatorIEN': '10000000224',
                        'historicalOrObserved': 'h^HISTORICAL',
                        'localId': '3',
                        'natureOfReaction': 'P^Pharmacological',
                        'symptoms': ['1^HIVES']
                    }
                };

                req.session = {
                    user: {
                        site: '9E7A',
                        duz: {
                            '9E7A': '10000000224'
                        },
                        username: 'USER;9E7A',
                        password: 'password'
                    }
                };
                req.logger = {
                    info: function(log) {
                        return log;
                    },
                    debug: function(debug) {
                        return debug;
                    },
                    error: function(error) {
                        return error;
                    }
                };
                req.app = {
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
                req.on = function(name, callback) {
                    switch (name) {
                        case 'data':
                            callback(JSON.stringify(allergyObjectFromView));
                            break;
                        case 'end':
                            callback();
                    }
                };
            });
    });
});
