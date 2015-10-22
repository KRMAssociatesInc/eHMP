'use strict';

var scResource = require('./service-connected-resource');
var scdis = require('./get-service-connected-and-rated-disabilities');
var scsel = require('./get-service-connected-and-service-exposure-list');
var rdk = require('../../core/rdk');
var httpUtil = rdk.utils.http;

describe('Service Connected Resource', function(){
    it('should be set up correctly for using getServiceConnectedAndRatedDisabilities', function() {
        var resources = scResource.getResourceConfig();
        expect(resources.length).to.equal(2);

        expect(resources[0].name).to.eql('serviceConnected');
        expect(resources[0].path).to.eql('/serviceconnectedrateddisabilities');
        expect(resources[0].interceptors).to.eql({
            pep: true,
            operationalDataCheck: false,
            synchronize: true,
            convertPid: true
        });
        expect(resources[0].healthcheck).not.to.be.undefined();
        expect(resources[0].get).not.to.be.undefined();
    });

    it('should be set up correctly for using getServiceConnectedAndServiceExposure', function() {
        var resources = scResource.getResourceConfig();
        expect(resources.length).to.equal(2);

        expect(resources[1].name).to.eql('scButtonSelection');
        expect(resources[1].path).to.eql('/serviceconnectedserviceexposurelist');
        expect(resources[1].interceptors).to.eql({
            pep: true,
            operationalDataCheck: false,
            synchronize: true,
            convertPid: true
        });
        expect(resources[1].healthcheck).not.to.be.undefined();
        expect(resources[1].get).not.to.be.undefined();
    });


    describe('getServiceConnectedAndRatedDisabilities', function(){

        beforeEach(function() {
            sinon.stub(httpUtil, 'fetch');
        });

        it('should call httpUtil', function(){
            var req = {
                interceptorResults: {
                    patientIdentifiers: {
                        siteDfn: '9E7A;3'
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
                param: function(name){
                    if(name === 'pid'){
                        return '10108V420871';
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

            scdis._getServiceConnectedAndRatedDisabilities(req, res);
            expect(httpUtil.fetch.called).to.be.true();
        });

    });

    describe('getServiceConnectedAndServiceExposureList', function(){

        beforeEach(function() {
            sinon.stub(httpUtil, 'fetch');
        });

        it('should call httpUtil', function(){
            var req = {
                interceptorResults: {
                    patientIdentifiers: {
                        siteDfn: '9E7A;3'
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
                param: function(name){
                    if(name === 'pid'){
                        return '10108V420871';
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

            scsel._getServiceConnectedAndServiceExposureList(req, res);
            expect(httpUtil.fetch.called).to.be.true();
        });

    });
});
