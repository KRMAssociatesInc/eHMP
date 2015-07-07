/*jslint node: true */
'use strict';

module.exports = function(resourceRegistry) {
    return function(req, res) {
        var baseUrl = (req.app.config.externalProtocol || req.protocol) + '://' + req.get('Host');

        req.audit.logCategory = 'RESOURCEDIRECTORY';

        var serializedResources = JSON.stringify(
            resourceRegistry.getDirectory(baseUrl),
            function replacer(key, value) {
                if (value instanceof RegExp) {
                    return value.toString();
                }
                return value;
            }
        );
        res.type('application/json');
        res.send(serializedResources);
    };
};
