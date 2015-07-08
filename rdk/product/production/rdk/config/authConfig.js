module.exports = {
    name: 'The running configuration',
    externalProtocol: 'http',
    authServer: {
        port: 8889
    },
    pdpConfig: {
        ruleFile: './rules.js'
    },
    rpcConfig: {
        context: 'HMP UI CONTEXT'
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
    loggers: [{
        name: 'root',
        level: 'debug'
    }, {
        name: 'server',
        streams: [{
            level: 'debug',
            stream: process.stdout
        }, {
            type: 'rotating-file',
            period: '1d',
            count: 10,
            level: 'debug',
            path: '/tmp/rdk-server.log'
        }]
    }, {
        name: 'RDK',
        streams: [{
            level: 'debug',
            stream: process.stdout
        }, {
            type: 'rotating-file',
            period: '1d',
            count: 10,
            level: 'debug',
            path: '/tmp/rdk-rdk.log'
        }]
    }, {
        name: 'req-logger',
        streams: [{
            level: 'debug',
            stream: process.stdout
        }, {
            type: 'rotating-file',
            period: '1d',
            count: 10,
            level: 'debug',
            path: '/tmp/rdk-req-logger.log'
        }]
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
            disabled: true
        },
        pep: {
            disabled: true
        },
        operationalDataCheck: {
            disabled: true
        },
        synchronize: {
            disabled: true
        }
    }
};
