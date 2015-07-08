module.exports = {
    name: 'Node Mock Services running configuration',
    appName: 'Node Mock Services',
    appPasscode: '',
    port: 8896,
    logger: {
        name: 'mock-server',
        streams: [{
            level: 'trace',
            stream: process.stdout
        }, {
            type: 'rotating-file',
            level: 'debug',
            period: '1d',
            count: 10,
            path: '/tmp/mock-server.log'
        }]
    }
};
