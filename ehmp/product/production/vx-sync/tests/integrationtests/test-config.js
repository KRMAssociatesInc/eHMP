var nconf = require('nconf');

require('../../env-setup');

nconf
    .argv()
    .env()
    .file({
        file: global.VX_ROOT + 'worker-config.json'
    });

var vx_sync_ip = nconf.get('VXSYNC_IP');

module.exports = vx_sync_ip;
