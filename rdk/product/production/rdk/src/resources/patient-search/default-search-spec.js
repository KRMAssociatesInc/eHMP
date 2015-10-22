'use strict';

var search = require('./default-search');

describe('Default Search', function() {
    it('Vista Configuration', function() {
        var request = {
            session: {
                user: {
                    site: 'abc123',
                    accessCode: 'def456',
                    verifyCode: 'def456!!'
                }
            },
            app: {
                config: {
                    rpcConfig: {
                        host: '127.0.0.1',
                        port: '9999'
                    },
                    vistaSites: {
                        badsite: {},
                        abc123: {
                            path: '/give/me/data'
                        },
                        def456: {}
                    }
                }
            }
        };
        var expected = {
            accessCode: 'def456',
            verifyCode: 'def456!!',
            siteCode: 'abc123',
            host: '127.0.0.1',
            port: '9999',
            path: '/give/me/data'
        };
        expect(search._getVistaConfig(request)).to.eql(expected);
    });
});
