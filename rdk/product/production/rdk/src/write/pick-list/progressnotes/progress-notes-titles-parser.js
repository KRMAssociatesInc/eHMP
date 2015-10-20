'use strict';

var _ = require('lodash');

/**
 * @param logger The logger
 * @param line The string to parse
 * @returns An (ien, name) pair
 */
function createProgressNotesTitles(logger, line) {
    logger.debug('progress notes title : ' + line);

    var FIELDS_LENGTH_EXPECTED = 2;

    var fields = line.split('^');
    if (fields.length !== FIELDS_LENGTH_EXPECTED) {
        logger.error('The RPC returned data but we couldn\'t understand it: ' + line);
        return null;
    }

    var obj = {
        ien: fields[0],
        name: fields[1]
    };

    logger.debug({obj: obj});
    return obj;
}

/**
 * Takes the return string from the RPC 'TIU LONG LIST OF TITLES' and parses out the data.
 *
 * @param logger The logger
 * @param rpcData The string to parse
 * @returns Array of (ien, name) pairs.
 */
module.exports.parseProgressNotesTitles = function(logger, rpcData) {
    var retValue = [];
    var filteredProgressNotesTitles = rpcData.split('\r\n');
    filteredProgressNotesTitles = _.filter(filteredProgressNotesTitles, Boolean); //Remove all of the empty Strings.

    _.each(filteredProgressNotesTitles, function(line) {
        var obj = createProgressNotesTitles(logger, line);
        if (obj) {
            retValue.push(obj);
        }
    });

    logger.debug({retValue: retValue});
    return retValue;
};
