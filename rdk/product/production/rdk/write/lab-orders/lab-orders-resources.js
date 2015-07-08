'use strict';

var writebackWorkflow = require('../core/writeback-workflow');
var validateLabOrders = require('./lab-orders-validator');
var writeLabOrderToVista = require('./lab-orders-vista-writer');
var writeVprToJds = require('../core/jds-direct-writer');

module.exports.getResourceConfig = function() {
    return [{
        name: 'add',
        path: '',
        post: addLabOrders,
        interceptors: {
            operationalDataCheck: false
        },
        permissions: []  // TODO set permissions. See https://wiki.vistacore.us/display/VACORE/Writeback+Edition+Permissions
    }];
};

function addLabOrders(req, res) {
    var tasks = [
        validateLabOrders,
        writeLabOrderToVista,
        writeVprToJds
    ];
    writebackWorkflow(req, res, tasks);
}

var addLabOrder = {
    // VPR+ template model for add lab order
};
