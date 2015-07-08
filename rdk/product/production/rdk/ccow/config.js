module.exports = {
    name: 'The running configuration',
    appName: 'eHMP',
    appPasscode: '',
    port: 8890,
    logger: {
        name: 'ccow-server',
        streams: [{
            level: 'debug',
            stream: process.stdout
        }, {
            type: 'rotating-file',
            level: 'debug',
            period: '1d',
            count: 10,
            path: '/tmp/ccow.log'
        }]
    }
};
