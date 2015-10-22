/*
The comments in this annotated file are intentionally verbose for the sake of explaining
what parts of the file mean. In all other files, please only write comments
explaining why something is done, not what something is or how something is
done. The what and how should be explained by variable names.
 */
'use strict';

var rdk = require('../../core/rdk');

var testApiDocs = {};
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
            rdk.docs.swagger.paramTypes.query(
                'myQueryParam',  // name
                'Example query parameter',  // description
                'string',  // type
                true  // required
            )
        ]
    }
};

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
            rdk.docs.swagger.paramTypes.body(
                'myPostBodyParam',  // name
                'Example post body parameter',  // description
                'string',  // type
                null,  // default value
                false  // required
            )
        ]
    }
};

// The following line has the jshint ignore comment because the unused app
// variable is passed in to demonstrate that the resource server passes it in.
// Please don't ignore jshint warnings in real code.
function getResourceConfig(app) {  // jshint ignore:line
    // app is available in case you need to build the resource config
    // in a way that depends on app. For example, you might want to get
    // a configuration option from app.config

    // These resource configurations make the following endpoints:
    // POST /<family-path>/test
    // GET /<family-path>/test

    // Use only one HTTP method per resource config object.
    return [{
        name: 'test',  // name of the resource (relative to its family name)
        path: '/test',  // path of the resource (relative to its family path)
        get: sampleGet,  // HTTP GET handler
        apiDocs: testApiDocs.get,  // Swagger documentation
        interceptors: {
            // Disabling default interceptors is not recommended unless you
            // have a good reason to.
            pep: false,  // disable the pep interceptor which is enabled by default
            jdsFilter: true  // enable the jdsFilter interceptor
        },  // incoming middleware
        permissions: [],
        healthcheck: {
            dependencies: ['jds']  // external data sources that this resource depends on
        }
    }, {
        name: 'test',  // name of the resource (relative to its family name)
        path: '/test',  // path of the resource (relative to its family path)
        post: samplePost,  // HTTP POST handler
        // put: samplePut,  // more than one HTTP method is not supported
        apiDocs: testApiDocs.post,  // Swagger documentation
        interceptors: {
            pep: false,
            jdsFilter: true,
            synchronize: false
        },  // incoming middleware
        permissions: [],
        healthcheck: {
            dependencies: ['jds']  // external data sources that this resource depends on
        }
    }];
}

function sampleGet(req, res, next) {
    req.logger.debug('sample resource GET called');

    var myQueryParam = req.param('myQueryParam');
    if(!myQueryParam) {
        req.logger.info('myQueryParam not provided');
        return next();
    }

    // default response status is 200
    return res.rdkSend({
        message: 'GET successful'
    });
}

function samplePost(req, res) {
    req.logger.warn('sample resource POST called');
    req.audit.logCategory = 'SAMPLE';

    var optionalParameter = req.param('myPostBodyParam');
    if(optionalParameter) {
        return res.status(200).rdkSend({
            message: optionalParameter
        });
    }
    return res.status(418).rdkSend({
        message: 'Example'
    });
}

module.exports.getResourceConfig = getResourceConfig;
