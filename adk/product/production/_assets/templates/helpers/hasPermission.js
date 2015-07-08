define(['handlebars', 'api/UserService', 'underscore'], function(Handlebars, UserService, _) {
    function hasPermission(args, options) {
        'use strict';
        var authorized;
        var permissions = args.split(/[|&]/);

        if (args.match(/&/)) {
            authorized = _.all(permissions, function(permission) {
                return UserService.hasPermission(permission);
            });
        } else {
            authorized = _.any(permissions, function(permission) {
                return UserService.hasPermission(permission);
            });
        }

        if (authorized) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    }

    Handlebars.registerHelper('hasPermission', hasPermission);
    return hasPermission;
});

//Example:
//{{#hasPermission 'editRecord&addRecord'}} => passes if user has both editRecord AND addRecord
//    test
//{{/hasPermission}}

//Example:
//{{#hasPermission 'editRecord|addRecord'}} => passes if user has editRecord OR addRecord
//    test
//{{/hasPermission}}