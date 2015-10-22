'use strict';

var isDisabled = function(config) {

    return 'interceptors' in config && 'pep' in config.interceptors && config.interceptors.pep.disabled;
};

module.exports.isDisabled = isDisabled;
