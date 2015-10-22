'use strict';

var validTasks = {
    // commonTaskName: [writeback tasks]
    discontinue: [require('./orders-common-discontinue-vista-writer')],
    edit: [require('./orders-common-edit-vista-writer')]
};

/**
 * Some tasks may have the same handling across all order types.
 * This determines if the request is for one of those tasks.
 *
 * @param {String} action may be 'create' or 'update'
 * @param model The validated request body
 * @returns {*} Array of tasks, only if applicable
 */
module.exports = function getCommonOrderTasks(action, model) {
    return validTasks[action];
};
