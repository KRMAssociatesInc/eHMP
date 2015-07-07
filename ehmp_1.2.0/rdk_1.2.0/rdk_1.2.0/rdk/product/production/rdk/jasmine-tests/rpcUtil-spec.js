/*jslint node: true */
'use strict';

var rpcUtil = require('../utils/rpc/rpcUtil');
var siteHash = '9E7A';
var config = {
    rpcConfig: {
        context: 'HMP UI CONTEXT'
    },
    vistaSites: {
        '9E7A': {
            name: 'PANORAMA',
            division: '500',
            host: '10.2.2.101',
            port: 9210,
            production: false,
            accessCode: 'pu1234',
            verifyCode: 'pu1234!!',
            localIP: '127.0.0.1',
            localAddress: 'localhost'
        },
        'C877': {
            name: 'KODAK',
            division: '500',
            host: '10.2.2.102',
            port: 9210,
            production: false,
            accessCode: 'pu1234',
            verifyCode: 'pu1234!!',
            localIP: '127.0.0.1',
            localAddress: 'localhost'
        }
    }
};


describe('getVistaRpcConfig', function() {
    it('tests that getVistaRpcConfig() correctly builds the rpcConfiguration', function() {
        expect(rpcUtil.getVistaRpcConfiguration(config, siteHash)).toEqual({
            context: 'HMP UI CONTEXT',
            name: 'PANORAMA',
            division: '500',
            host: '10.2.2.101',
            port: 9210,
            production: false,
            accessCode: 'pu1234',
            verifyCode: 'pu1234!!',
            localIP: '127.0.0.1',
            localAddress: 'localhost'
        });
    });

});
