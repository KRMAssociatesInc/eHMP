'use strict';

var writebackWorkflow = require('../core/writeback-workflow');
var validateMedOrders = require('./med-orders-validator');
var writeMedOrderToVista = require('./med-orders-vista-writer');
var writeVprToJds = require('../core/jds-direct-writer');

module.exports.getResourceConfig = function() {
    return [{
        name: 'add',
        path: '',
        post: addMedOrders,
        interceptors: {
            operationalDataCheck: false
        },
        permissions: []  // TODO set permissions. See https://wiki.vistacore.us/display/VACORE/Writeback+Edition+Permissions
    }];
};

function addMedOrders(req, res) {
    var tasks = [
        validateMedOrders,
        writeMedOrderToVista,
        writeVprToJds
    ];
    writebackWorkflow(req, res, tasks);
}

var addMedOrder = {
    // VPR+ template model for add med order
};
