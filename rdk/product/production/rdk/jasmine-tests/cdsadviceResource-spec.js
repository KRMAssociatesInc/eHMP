'use strict';

var cdsAdviceResource = require('../resources/cdsadvice/cdsAdviceResource');

describe('CDS Advice Resource', function () {
    var resources = cdsAdviceResource.getResourceConfig();

    it('has two endpoints configured', function () {
        expect(resources.length).toBe(2);
    });

    it('has correct configuration for \'list\' endpoint', function () {
        var r = resources[0];
        expect(r.name).toEqual('list');
        expect(r.path).toEqual('/list');
        expect(r.interceptors).toEqual({
            pep: false
        });
        expect(r.healthcheck).toBeDefined();
        expect(r.parameters).toBeDefined();
        expect(r.parameters.get).toBeDefined();
        expect(r.parameters.get.pid).toBeDefined();
        expect(r.parameters.get.use).toBeDefined();
        expect(r.parameters).toBeDefined();
    });

    it('has correct configuration for \'detail\' endpoint', function () {
        var r = resources[1];
        expect(r.name).toEqual('detail');
        expect(r.path).toEqual('/detail');
        expect(r.interceptors).toEqual({
            pep: false
        });
        expect(r.healthcheck).toBeDefined();
        expect(r.parameters).toBeDefined();
        expect(r.parameters.get).toBeDefined();
        expect(r.parameters.get.pid).toBeDefined();
        expect(r.parameters.get['advice.id']).toBeDefined();
        expect(r.parameters.get.use).toBeDefined();
        expect(r.get).toBeDefined();
    });
});

//describe('CDS Advice List', function () {
//
//    it('Test getCDSAdviceList()', function () {
//        var req = {
//            param: function () {
//                return {
//                    pid: 3333,
//                    use: 'test'
//                };
//            },
//            logger: {
//                info: function (log) {
//                    return log;
//                },
//                debug: function (debug) {
//                    return debug;
//                }
//            },
//            session: {
//                user: {
//                    site: '9E7A'
//                }
//            },
//            app: {
//                config: {
//                    rpcConfig: {
//                        context: 'HMP UI CONTEXT',
//                        siteHash: '9E7A'
//                    },
//                    vistaSites: {
//                        '9E7A': {
//                            name: 'PANORAMA',
//                            division: '500',
//                            host: '10.2.2.101',
//                            port: 9210,
//                            production: false,
//                            accessCode: 'pu1234',
//                            verifyCode: 'pu1234!!'
//                        },
//                        'C877': {
//                            name: 'KODAK',
//                            division: '500',
//                            host: '10.2.2.102',
//                            port: 9210,
//                            production: false,
//                            accessCode: 'pu1234',
//                            verifyCode: 'pu1234!!'
//                        }
//                    }
//                }
//            }
//        };
//
//        var res = {
//            send: function (message, error) {
//                console.log(message);
//                console.log(error);
//                return;
//            }
//        };
//
//        rulesResultsList.getRulesResultsList(req, res);
//    });
//});
