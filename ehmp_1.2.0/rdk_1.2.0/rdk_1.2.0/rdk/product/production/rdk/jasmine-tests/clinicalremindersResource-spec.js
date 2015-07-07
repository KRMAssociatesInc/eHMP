'use strict';

var VistaJS = require('../VistaJS/VistaJS');
var clinicalReminderResource = require('../resources/clinicalreminders/clinicalremindersResource');
var clinicalReminderList = require('../resources/clinicalreminders/getClinicalReminderList');
var clinicalReminderDetail = require('../resources/clinicalreminders/getClinicalReminderDetail');

describe('Clinical Reminders Resource', function() {
    it('tests that getResourceConfig() is setup correctly for clinical reminder list', function() {
        var resources = clinicalReminderResource.getResourceConfig();
        expect(resources.length).toBe(2);

        expect(resources[0].name).toEqual('list');
        expect(resources[0].path).toEqual('/list');
        expect(resources[0].interceptors).toEqual({
            pep: false
        });
        expect(resources[0].healthcheck).toBeDefined();
        expect(resources[0].parameters).toBeDefined();
        expect(resources[0].get).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for clinical reminder detail', function() {
        var resources = clinicalReminderResource.getResourceConfig();
        expect(resources.length).toBe(2);

        expect(resources[1].name).toEqual('detail');
        expect(resources[1].path).toEqual('/detail');
        expect(resources[1].interceptors).toEqual({
            pep: false
        });
        expect(resources[1].healthcheck).toBeDefined();
        expect(resources[1].parameters).toBeDefined();
        expect(resources[1].get).toBeDefined();
    });
});

describe('Clinical Reminder List', function() {

    beforeEach(function() {
        spyOn(VistaJS, 'callRpc');
    });

    it('Test getClinicalReminderList()', function() {
        var req = {
            param: function() {
                return {
                    dfn: 3
                };
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
        expect(VistaJS.callRpc).toHaveBeenCalled();
    });
});

describe('Clinical Reminder Detail', function() {

    beforeEach(function() {
        spyOn(VistaJS, 'callRpc');
    });

    it('Tests getClinicalReminderDetail()', function() {
        var req = {
            param: function() {
                return {
                    dfn: 3,
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
        expect(VistaJS.callRpc).toHaveBeenCalled();
    });
});
