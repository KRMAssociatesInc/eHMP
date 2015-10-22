'use strict';

var VistaJS = require('../../core/VistaJS');

function parse(logger, result) {
    var obj = {
        enabled: (result === '1')
    };
    return obj;
}

/**
 * Returns JSON containing a true/false value for 'enabled' indicating whether the PKI Digital Signature is enabled on the site.
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 */
module.exports.fetch = function(logger, configuration, callback) {
    VistaJS.callRpc(logger, configuration, 'ORWOR PKISITE', function(err, rpcData) {
        if (err)
            return callback(err.message);

        try {
            logger.debug(rpcData);
            var obj = parse(logger, rpcData);
            callback(null, obj);
        }
        catch (parseError) {
            return callback(parseError.message);
        }
    });
};
