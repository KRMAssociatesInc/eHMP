module.exports = {
    name: 'Mock backend with Solr pointing to search listener',
    externalProtocol: 'http',
    appServer: {
        port: 9898
    },
    adminServer: {
        port: 9899
    },
    rpcConfig: {
        context: 'HMP UI CONTEXT'
    },
    pdpConfig: {
        ruleFile: './rules.js'
    },
    vistaSites: {
        '9E7A': {
            name: 'PANORAMA',
            division: '500',
            host: '10.2.2.101',
            localIP: '10.2.2.1',
            localAddress: 'localhost',
            port: 9210,
            production: false,
            accessCode: 'pu1234',
            verifyCode: 'pu1234!!',
            infoButtonOid: '1.3.6.1.4.1.3768'
        },
        'C877': {
            name: 'KODAK',
            division: '500',
            host: '10.2.2.102',
            localIP: '10.2.2.2',
            localAddress: 'localhost',
            port: 9210,
            production: false,
            accessCode: 'pu1234',
            verifyCode: 'pu1234!!',
            infoButtonOid: '1.3.6.1.4.1.2000'
        }
    },
    mvi: {
        host: '10.4.4.205',
        protocol: 'http',
        senderCode: '200EHMP',
        port: 8896,
        search: {
            path: '/mvi'
        },
        sync: {
            path: '/mvi'
        }
    },
    vhic: {
        host: '10.4.4.205',
        protocol: 'http',
        senderCode: '200EHMP',
        port: 8896,
        search: {
            path: '/vhic'
        },
        sync: {
            path: '/vhic'
        }
    },
    responseTimeoutMillis: 300000,
    solrServer: {
        host: '127.0.0.1',
        port: '9080',
        path: '/solr/vpr'
    },
    jdsServer: {
        host: '127.0.0.1',
        port: 8080
    },
    jdsSync: {
        syncPatientLoad: {
            timeoutMillis: 300000,
            protocol: 'http',
            options: {
                host: '127.0.0.1',
                port: 8080,
                path: '/admin/sync',
                method: 'PUT',
                rejectUnauthorized: false,
                requestCert: true,
                agent: false
            }
        },
        syncPatientClear: {
            timeoutMillis: 300000,
            protocol: 'http',
            options: {
                host: '127.0.0.1',
                port: 8080,
                path: '/admin/sync',
                method: 'DELETE',
                rejectUnauthorized: false,
                requestCert: true,
                agent: false
            }
        },
        syncPatientStatus: {
            timeoutMillis: 300000,
            protocol: 'http',
            options: {
                host: '127.0.0.1',
                port: 8080,
                path: '/admin/sync',
                method: 'GET',
                rejectUnauthorized: false,
                requestCert: true,
                agent: false
            }
        },
        syncOperationalStatus: {
            timeoutMillis: 300000,
            protocol: 'http',
            options: {
                host: '127.0.0.1',
                port: 8080,
                path: '/admin/sync/operational',
                method: 'GET',
                rejectUnauthorized: false,
                requestCert: true,
                agent: false
            }
        }
    },
    loggers: [{
        name: 'root',
        level: 'debug'
    }, {
        name: 'server',
        level: 'debug'
    }, {
        name: 'RDK',
        level: 'debug'
    }, {
        name: 'req-logger',
        level: 'debug'
    }, {
        name: 'audit',
        streams: [{
            type: 'rotating-file',
            period: '1d',
            count: 10,
            path: '/tmp/audit.log',
            level: 'info'
        }]
    }],
    interceptors: {
        authentication: {
            disabled: false
        },
        pep: {
            disabled: false
        },
        operationalDataCheck: {
            disabled: false
        },
        synchronize: {
            disabled: false
        }
    }
};
