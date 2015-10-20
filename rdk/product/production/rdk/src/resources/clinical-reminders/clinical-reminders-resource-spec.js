'use strict';

var VistaJS = require('../../VistaJS/VistaJS');
var clinicalReminderResource = require('./clinical-reminders-resource');
var clinicalReminderList = require('./get-clinical-reminder-list');
var clinicalReminderDetail = require('./get-clinical-reminder-detail');

describe('Clinical Reminders Resource', function() {
    it('tests that getResourceConfig() is setup correctly for clinical reminder list', function() {
        var resources = clinicalReminderResource.getResourceConfig();
        expect(resources.length).to.equal(2);

        expect(resources[0].name).to.equal('list');
        expect(resources[0].path).to.equal('/list');
        expect(resources[0].interceptors).to.eql({
            pep: false,
            synchronize: false,
            convertPid: true
        });
        expect(resources[0].healthcheck).not.to.be.undefined();
        expect(resources[0].parameters).not.to.be.undefined();
        expect(resources[0].get).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for clinical reminder detail', function() {
        var resources = clinicalReminderResource.getResourceConfig();
        expect(resources.length).to.equal(2);

        expect(resources[1].name).to.equal('detail');
        expect(resources[1].path).to.equal('/detail');
        expect(resources[1].interceptors).to.eql({
            pep: false,
            synchronize: false,
            convertPid: true
        });
        expect(resources[1].healthcheck).not.to.be.undefined();
        expect(resources[1].parameters).not.to.be.undefined();
        expect(resources[1].get).not.to.be.undefined();
    });
});

describe('Clinical Reminder List', function() {

    beforeEach(function() {
        sinon.stub(VistaJS, 'callRpc');
    });

    it('Test getClinicalReminderList()', function() {
        var req = {
            interceptorResults: {
                patientIdentifiers: {
                    dfn: 3
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
            session: {
                user: {
                    site: '9E7A'
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
            audit: {}
        };

        var res = {
            send: function(message, error) {
                return;
            }
        };

        clinicalReminderList._getClinicalReminderList(req, res);
        expect(VistaJS.callRpc.called).to.be.true();
    });
});

describe('Clinical Reminder Detail', function() {

    beforeEach(function() {
        sinon.stub(VistaJS, 'callRpc');
    });

    it('Tests getClinicalReminderDetail()', function() {
        var req = {
            interceptorResults: {
                patientIdentifiers: {
                    dfn: 3
                }
            },
            param: function() {
                return {
                    reminderId: 26
                };
            },
            session: {
                user: {
                    site: '9E7A'
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
                        context: 'VPR UI CONTEXT',
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
            audit: {}
        };

        var res = {
            send: function(message, error) {
                return;
            }
        };

        clinicalReminderDetail._getClinicalReminderDetail(req, res);
        expect(VistaJS.callRpc.called).to.be.true();
    });
});
