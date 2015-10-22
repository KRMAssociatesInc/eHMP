'use strict';

var rdk = require('../../core/rdk');
var writebackWorkflow = require('../core/writeback-workflow');
var validateExample = require('./example-validator');
var writeExampleToVista = require('./example-vista-writer');
var writeVprToJds = require('../core/jds-direct-writer');

var testApiDocs = {};
testApiDocs.post = {
    /*
     See https://github.com/swagger-api/swagger-node-express
     for more detailed usage. The nickname, path, and method spec parameters
     can be automatically filled in by rdk.
     */
    spec: {
        summary: 'Example resource',
        notes: '',
        parameters: [
            // Feel free to turn the following expression into one line.
            // It's separated out here to annotate what each argument is.
            rdk.docs.swagger.paramTypes.path(
                'pid',                  //name
                'unique patient id',    //description
                'string',               //type
                undefined,              //allowableValuesEnum
                undefined               //defaultValue
            ),
            rdk.docs.swagger.paramTypes.body(
                'NewThing',     //name
                undefined,      //description
                'newThing',     //type -> model
                undefined,      //default
                true            //required
            )
        ],
        models: {
            'newThing': {
                required: ['name'],
                properties: {
                    name: {
                        type: 'string',
                        description: 'name of thing'
                    }
                }
            }
        }
    }
};

testApiDocs.put = {
    /*
     See https://github.com/swagger-api/swagger-node-express
     for more detailed usage. The nickname, path, and method spec parameters
     can be automatically filled in by rdk.
     */
    spec: {
        path: '/:resourceId',
        summary: 'Example resource',
        notes: '',
        parameters: [
            // Feel free to turn the following expression into one line.
            // It's separated out here to annotate what each argument is.
            rdk.docs.swagger.paramTypes.path(
                'pid',                  //name
                'unique patient id',    //description
                'string',               //type
                undefined,              //allowableValuesEnum
                undefined               //defaultValue
            ),
            rdk.docs.swagger.paramTypes.path(
                'resourceId',           //name
                'unique resource id',   //description
                'string',    //type
                undefined,              //allowableValuesEnum
                undefined               //defaultValue
            ),
            rdk.docs.swagger.paramTypes.body(
                'AddCommentToThing',     //name
                undefined,               //description
                'AddCommentToThing',     //type -> model
                undefined,               //default
                true                     //required
            )
        ],
        models: {
            'AddCommentToThing': {
                required: ['id', 'comment'],
                properties: {
                    id: {
                        type: 'string',
                        description: 'unique id of thing'
                    },
                    comment: {
                        type: 'string',
                        description: 'new comment about thing with unique id = id'
                    }
                }
            }
        }
    }
};

testApiDocs.get = {
    /*
     See https://github.com/swagger-api/swagger-node-express
     for more detailed usage. The nickname, path, and method spec parameters
     can be automatically filled in by rdk.
     */
    spec: {
        summary: 'Example resource',
        notes: '',
        parameters: [
            // Feel free to turn the following expression into one line.
            // It's separated out here to annotate what each argument is.
            rdk.docs.swagger.paramTypes.path(
                'pid',                  //name
                'unique patient id',    //description
                'string',               //type
                undefined,              //allowableValuesEnum
                undefined               //defaultValue
            ),
            rdk.docs.swagger.paramTypes.query(
                'myQueryParam',             // name
                'Example query parameter',  // description
                'string',                   // type
                true                        // required
            )
        ]
    }
};

module.exports.getResourceConfig = function() {
    return [{
        name: 'add',
        path: '',
        post: addExample,
        apiDocs: testApiDocs.post,  // Swagger documentation
        interceptors: {
            operationalDataCheck: false,
            synchronize: false
        },
        permissions: []  // TODO set permissions. See https://wiki.vistacore.us/display/VACORE/Writeback+Edition+Permissions
    }, {
        name: 'update',
        path: '/:resourceId',
        put: updateExample,
        apiDocs: testApiDocs.put,  // Swagger documentation
        interceptors: {
            operationalDataCheck: false,
            synchronize: false
        },
        permissions: []  // TODO set permissions. See https://wiki.vistacore.us/display/VACORE/Writeback+Edition+Permissions
    }, {
        name: 'get',
        path: '',
        post: getNexTime,
        apiDocs: testApiDocs.get,  // Swagger documentation
        interceptors: {
            operationalDataCheck: false,
            synchronize: false
        },
        permissions: []  // TODO set permissions. See https://wiki.vistacore.us/display/VACORE/Writeback+Edition+Permissions
    }];
};

function addExample(req, res) {
    var tasks = [
        validateExample.create,
        writeExampleToVista.create,
        writeVprToJds
    ];
    writebackWorkflow(req, res, tasks);
}

function updateExample(req, res) {
    var tasks = [
        validateExample.update,
        writeExampleToVista.update,
        writeVprToJds
    ];
    writebackWorkflow(req, res, tasks);
}

function getNexTime(req, res, next) {
    var tasks = [
        writeExampleToVista.readNexTime
    ];
    writebackWorkflow(req, res, tasks);
}
