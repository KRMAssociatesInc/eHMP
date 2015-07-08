'use strict';

require('../../../env-setup');

var fsUtil = require(global.VX_UTILS + 'fs-utils');
var config = require(global.VX_ROOT + 'worker-config');

// since this checks the local file system, it cannot work on the VM
// TODO: reenable
xdescribe('Libre Office', function(){
    it('Libre Office installed and configured', function() {
        var appLocation = config.documentStorage.officeLocation;
        expect(fsUtil.fileExistsSync(appLocation + 'soffice')).toBeTruthy();
    });
});