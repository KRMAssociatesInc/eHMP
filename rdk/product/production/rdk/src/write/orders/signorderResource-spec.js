'use strict';

var writebackorder_signnote = require('./signorderResource');
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

describe('writebackorder_signOrder:', function() {
    describe('function signOrder', function() {
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
                        order: {
                            content: 'GENTAMICIN BLOOD   SERUM SP *UNSIGNED*\\\r\\\n',
                            entered: '20150706044500',
                            kind: 'Laboratory',
                            lastUpdateTime: '20150706084546',
                            localId: '38741',
                            pid: '9E7A;8',
                            stampTime: '20150706084545',
                            statusName: 'UNRELEASED',
                            summary: 'GENTAMICIN BLOOD   SERUM SP *UNSIGNED*\\\r\\\n',
                            uid: 'urn:va:order:9E7A:8:38741',
                            uidHref: 'http://localhost:8888/resource/patient/record/uid?pid=9E7A%3B8&uid=urn%3Ava%3Aorder%3A9E7A%3A8%3A38741'
                        },
                        locationIEN: 158,
                        patientIEN: 3
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

            writebackorder_signnote._signOrder(req, res);
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
