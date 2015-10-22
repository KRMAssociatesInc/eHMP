'use strict';
/**
 * Returns the configuration for the roles resources
 *  - getUserRoles : gets the roles for an ehmp user
 *  - add: adds a role to the list of roles for an ehmp user
 *  - edit : replaces a role with another role for an ehmp user
 *  - delete : deletes a role for an ehmp user
 *  - list : list of all RDK Roles
 *
 * @return {Array}      -an array containing the objects needed to configure the authentication resource
 *
 */
module.exports.getResourceConfig = function() {
    return [{
        name: 'edit',
        path: '/edit',
        post: require('./edit'),
        interceptors: {
            pep: false,
            synchronize: false
        },
        permissions: [],
        healthcheck: {
            dependencies: []
        },
        parameters: require('./edit').parameters,
        apiDocs: require('./edit').apiDocs

    }, {
        name: 'getUserRoles',
        path: '/getUserRoles',
        get: require('./get-user-roles'),
        interceptors: {
            pep: false,
            synchronize: false
        },
        permissions: [],
        healthcheck: {
            dependencies: []
        },
        parameters: require('./get-user-roles').parameters,
        apiDocs: require('./get-user-roles').apiDocs
    }, {
        name: 'list',
        path: '/list',
        get: require('./list'),
        interceptors: {
            pep: false,
            synchronize: false
        },
        permissions: [],
        healthcheck: {
            dependencies: []
        },
        parameters: [],
        apiDocs: require('./list').apiDocs
    }];
}
