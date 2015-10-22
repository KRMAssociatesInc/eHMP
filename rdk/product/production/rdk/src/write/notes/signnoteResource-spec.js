'use strict';

var writebacknote_signnote = require('./signnoteResource');
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
var note={
    'derivReferenceDate': '08/06/2015',
    'derivReferenceTime': '17:10',
    'formStatus': {
        'status': 'pending',
        'message': 'sending......'
    },
    'author': 'KHAN,VIHAAN',
    'authorDisplayName': 'KHAN,VIHAAN',
    'authorUid': '10000000257',
    'documentClass': 'PROGRESS NOTES',
    'documentDefUid': 'urn:va:doc-def:9E7A:8',
    'documentTypeName': 'Progress Note',
    'encounterName': '7A GEN MED Aug 14, 2014',
    'encounterUid': 'urn:va:visit:9E7A:3:11420',
    'entered': '20150604140113',
    'facilityCode': '998',
    'facilityName': 'ABILENE (CAA)',
    'isInterdisciplinary': 'false',
    'lastUpdateTime': '2015-07-06T14:10:23.567Z',
    'localId': '11583',
    'localTitle': 'ADVANCE DIRECTIVE',
    'nationalTitle': {
        'name': 'SURGERY RESIDENT NOTE',
        'vuid': 'urn:va:vuid:4695458'
    },
    'patientIcn': '10110V004877',
    'pid': '8',
    'referenceDateTime': '20150706171000',
    'signedDateTime': null,
    'signer': null,
    'signerDisplayName': null,
    'signerUid': '10000000257',
    'status': 'UNSIGNED',
    'statusDisplayName': 'Unsigned',
    'summary': 'GENERAL SURGERY RESIDENT NOTE  ',
    'text': [{
        'author': 'KHAN,VIHAAN',
        'authorDisplayName': 'KHAN,VIHAAN',
        'authorUid': '10000000257',
        'content': 'asdasdasdasd',
        'dateTime': '201505201418',
        'signer': null,
        'signerDisplayName': null,
        'signerUid': '10000000257',
        'status': 'UNSIGNED'
    }],
    'facilityDisplay': 'Bay Pines CIO Test',
    'facilityMoniker': 'BAY'
};
describe('writebacknote_signNote:', function() {
    describe('function signNote', function() {
        var req = {};
        // var res = {};

        beforeEach(function() {
            req = {};
            // res = {};
            sinon.stub(VistaJS, 'callRpc');


        });

        it('should call Vista RPCs', function() {
            var req = {
                param: function(param) {
                    return param;
                },
                body: {
                    param: {
                        signatureCode: '$+9-7i/ll ',
                        note: note,
                        locationIEN: 158,
                        patientIEN: 8
                    }
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

            writebacknote_signnote._signNote(req, res);
            expect(VistaJS.callRpc.called).to.be.true();
        // });
        // it('should verify the user is a Provider with: "TIU WHICH SIGNATURE ACTION"', function() {
        //     writebacknote_signnote._signNote(req, res);
            // expect(VistaJS.callRpc.calledWith(sinon.match.any, sinon.match.any, sinon.match('TIU WHICH SIGNATURE ACTION'))).to.be.true();
        // });
        // it('should verify the user is authorized with: "TIU AUTHORIZATION"', function() {
        //     writebacknote_signnote._signNote(req, res);
            // expect(VistaJS.callRpc.calledWith(sinon.match.any, sinon.match.any, sinon.match('TIU AUTHORIZATION'))).to.be.true();
        // });
        // it('should lock the note with: "TIU LOCK RECORD"', function() {
        //     writebacknote_signnote._signNote(req, res);
            // expect(VistaJS.callRpc.calledWith(sinon.match.any, sinon.match.any, sinon.match('TIU LOCK RECORD'))).to.be.true();
        // });
        // it('should verify the signatureCode with: "ORWU VALIDSIG"', function() {
        //     writebacknote_signnote._signNote(req, res);
            // expect(VistaJS.callRpc.calledWith(sinon.match.any, sinon.match.any, sinon.match('ORWU VALIDSIG'))).to.be.true();
        });

    });

});
