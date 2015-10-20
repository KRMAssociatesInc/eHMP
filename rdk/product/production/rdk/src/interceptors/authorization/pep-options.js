/*jslint node: true */
'use strict';

// policy options required fileds with default values - expected value type is boolean
var policyOptions = {
    breakglass: false,
    sensitive: false,
    hasSSN: true,
    requestingOwnRecord: false,
    rptTabs: false,
    corsTabs: false,
    dgRecordAccess: false,
    dgSensitiveAccess: false,
};

// permission options required fields
var permissionOptions = {
    roles: []
};

module.exports.policyOptions = policyOptions;
module.exports.permissionOptions = permissionOptions;
