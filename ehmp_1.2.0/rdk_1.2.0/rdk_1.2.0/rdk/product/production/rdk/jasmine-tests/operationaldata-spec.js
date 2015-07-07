/*jslint node: true */
'use strict';

var opData = require('../resources/writebackallergy/operationaldataResource');
var VistaJS = require('../VistaJS/VistaJS');

describe('Operational Data Transform', function() {
    it('tests that the Allergen search return string from VistaJS is built into an object', function() {
        var retObj = opData._buildSearchResults(sampleSearchRetStr);
        expect(retObj).toEqual(expectedSearchRetObj);
    });
    it('tests that the Symptom return string from VistaJS is built into an object', function() {
        var retObj = opData._buildSymptomResults(sampleSympRetStr);
        expect(retObj).toEqual(expectedSympRetObj);
    });
});

describe('Operational data RPC Call', function() {
    var req = {};

    beforeEach(function() {
        req = {};
        spyOn(VistaJS, 'callRpc');
    });

    it('tests valid causitive agent request', function() {
        var param = {
            searchParam: 'pen'
        };

        var req = {
            param: function() {
                return JSON.stringify(param);
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
                    duz: {
                    '9E7A': '10000000226'
                    },
                    site: '9E7A'
                }
            }
        };

        var res = {
            send: function() {
                return;
            }
        };

        opData._performSearch(req, res);
        expect(VistaJS.callRpc).toHaveBeenCalled();
    });

    it('tests valid Symptom request', function() {
        var param = {
            dir: '',
            from: ''
        };

        var req = {
            param: function() {
                return JSON.stringify(param);
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
                    duz: {
                    '9E7A': '10000000226'
                    },
                    site: '9E7A'
                }
            }
        };

        var res = {
            send: function() {
                return;
            }
        };

        opData._getSymptoms(req, res);
        expect(VistaJS.callRpc).toHaveBeenCalled();
    });
});

var sampleSearchRetStr = '1^VA Allergies File^^^TOP^+\r\n' +
    '3^National Drug File - Generic Drug Name^^^TOP^+\r\n' +
    '3740^ERTAPENEM^PSNDF(50.6,\'B\')^D^3\r\n' +
    '4^National Drug file - Trade Name^^^TOP^+\r\n' +
    '92^ERTHROMYCIN STEARATE^PSNDF(50.67,\'T\')^D^4\r\n' +
    '92^ERTHROMYCIN ESTOLATE^PSNDF(50.67,\'T\')^D^4\r\n' +
    '3973^ERTACZO 2% CREAM^PSNDF(50.67,\'T\')^D^4\r\n' +
    '3973^ERTACZO^PSNDF(50.67,\'T\')^D^4\r\n' +
    '5^Local Drug File^^^TOP^+\r\n' +
    '7^Drug Ingredients File^^^TOP^+\r\n' +
    '3955^ERTAPENEM^PS(50.416,\'P\')^D^7\r\n' +
    '8^VA Drug Class File^^^TOP^+';

var sampleSympRetStr = '20^WHEEZING\r\n' +
    '312^WHITE BLOOD CELLS INCREASED\t<LEUKOCYTOSIS>^LEUKOCYTOSIS';

var expectedSympRetObj = {
    'data': {
        'items': [{
            'IEN': '20',
            'name': 'WHEEZING'
        }, {
            'IEN': '312',
            'name': 'WHITE BLOOD CELLS INCREASED\t<LEUKOCYTOSIS>'
        }]
    }
};

var expectedSearchRetObj = {
    'numResults': 6,
    'data': {
        'items': [{
            'fileName': 'VA Allergies File',
            'fileNumber': '1',
            'results': []
        }, {
            'fileName': 'National Drug File - Generic Drug Name',
            'fileNumber': '3',
            'results': [{
                'name': 'ERTAPENEM',
                'IEN': '3740',
                'location': 'PSNDF(50.6,\'B\')',
                'type': 'D',
                'fileNumber': '3'
            }]
        }, {
            'fileName': 'National Drug file - Trade Name',
            'fileNumber': '4',
            'results': [{
                'name': 'ERTHROMYCIN STEARATE',
                'IEN': '92',
                'location': 'PSNDF(50.67,\'T\')',
                'type': 'D',
                'fileNumber': '4'
            }, {
                'name': 'ERTHROMYCIN ESTOLATE',
                'IEN': '92',
                'location': 'PSNDF(50.67,\'T\')',
                'type': 'D',
                'fileNumber': '4'
            }, {
                'name': 'ERTACZO 2% CREAM',
                'IEN': '3973',
                'location': 'PSNDF(50.67,\'T\')',
                'type': 'D',
                'fileNumber': '4'
            }, {
                'name': 'ERTACZO',
                'IEN': '3973',
                'location': 'PSNDF(50.67,\'T\')',
                'type': 'D',
                'fileNumber': '4'
            }]
        }, {
            'fileName': 'Local Drug File',
            'fileNumber': '5',
            'results': []
        }, {
            'fileName': 'Drug Ingredients File',
            'fileNumber': '7',
            'results': [{
                'name': 'ERTAPENEM',
                'IEN': '3955',
                'location': 'PS(50.416,\'P\')',
                'type': 'D',
                'fileNumber': '7'
            }]
        }, {
            'fileName': 'VA Drug Class File',
            'fileNumber': '8',
            'results': []
        }]
    }
};
