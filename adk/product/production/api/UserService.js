define([
    "backbone",
    "jquery",
    "api/UrlBuilder",
    "sessionstorage",
    'moment',
    'api/Messaging',
    'api/SessionStorage'
], function(Backbone, $, UrlBuilder, sessionStorage, moment, Messaging, SessionStorage) {
    'use strict';

    //in minutes
    var logofftime = 15;
    var USERKEY = 'user';

    var UserService = {

        STATUS: {
            LOGGEDIN: 'loggedin',
            LOGGEDOUT: 'loggedout'
        },

        /**
         * Returns the user object from the session storage
         * @return {Object} user
         */
        getUserSession: function() {
            return SessionStorage.get.sessionModel(USERKEY);
        },

        /**
         * Sets the user on SessionStorage
         * @param {Object} user -the User Model
         */
        setUserSession: function(user) {
            SessionStorage.set.sessionModel(USERKEY, user);
        },

        /**
         * Uses an RDK endpoint to authenticate the user
         * @param  {String} userName
         * @param  {String} password
         * @param  {String} facility
         * @return {boolean}
         *
         * TODO: the nonLegacy if/else can be removed after a couple days once people have caught up in both repos
         */
        authenticate: function(userName, password, facility) {
            var resourceTitle = "authentication-authentication";
            var userSession = this.getUserSession();
            userSession.url = UrlBuilder.buildUrl(resourceTitle);
            var deferred = $.Deferred();

            userSession.save({
                'accessCode': userName,
                'verifyCode': password,
                'site': facility
            }, {
                type: 'POST',
                contentType: 'application/json',
                success: function(response, xhr) {
                    if (xhr.data) {
                        userSession = new Backbone.Model(xhr.data);
                    } else {
                        userSession = new Backbone.Model(xhr);
                    }
                    userSession.set('expires', moment.utc().add(logofftime, 'minutes'));
                    userSession.set('status', UserService.STATUS.LOGGEDIN);
                    //for demo purposes
                    if (userSession.get('facility') === 'PANORAMA') {
                        userSession.set('infobutton-oid', '1.3.6.1.4.1.3768.86'); //Portland
                    } else if (userSession.get('facility') === 'KODAK') {
                        userSession.set('infobutton-oid', '1.3.6.1.4.1.3768.97'); //Utah
                    } else {
                        userSession.set('infobutton-oid', '1.3.6.1.4.1.3768'); //default
                    }
                    userSession.set('infobutton-site', 'http://service.oib.utah.edu:8080/infobutton-service/infoRequest?');
                    SessionStorage.delete.sessionModel('user');
                    UserService.setUserSession(userSession);
                    Messaging.trigger('app:logged-in');
                    deferred.resolve();
                },
                error: function(model, errorResponse) {
                    console.log("Failed to authenticate with error response status: " + errorResponse.status);
                    userSession.set('expires', moment.utc('Thu, 01 Jan 1970 00:00:01 GMT'));
                    SessionStorage.delete.sessionModel('user');
                    UserService.setUserSession(userSession);
                    deferred.reject(errorResponse);
                }
            });

            return deferred.promise();

        },

        /**
         * Destroys the session on the RDK server
         * @return {undefined}
         */
        clearUserSession: function() {
            Messaging.trigger('user:beginSessionEnd');
            var resourceTitle = "authentication-destroySession";
            var userSession = SessionStorage.get.sessionModel(USERKEY);
            userSession.url = UrlBuilder.buildUrl(resourceTitle);
            var status = userSession.get('status');
            console.log(status);

            if (status && status !== UserService.STATUS.LOGGEDOUT) {

                userSession.sync('delete', userSession, {
                    success: function(model, response, options) {
                        console.log('Successfully cleared user session on server.');
                    },
                    error: function(model, response, options) {
                        console.log('Error: Could not destroy user session');
                    },
                    async: true
                });
                //This clears the ADK Session storage and the browser session storage
                userSession.set('status', UserService.STATUS.LOGGEDOUT);
                SessionStorage.delete.all();
                Backbone.fetchCache._cache = {};
                Messaging.trigger('user:sessionEnd');
            }
        },

        /**
         * Checks a user token exipration to ensure the user is still authenticated
         * This happens, at least, on every screen change
         * @return {boolean} - either a user has a valid session expiration or they don't
         */
        checkUserSession: function() {
            var timeLeft = this.checkUserToken();
            if (timeLeft <= 0) {
                this.clearUserSession();
                return false;
            } else {
                Messaging.trigger('user:sessionCheck');
                return true;
            }
        },

        /**
         * Checks the user token expiration for minutes left
         *
         *  //TODO
         *  Currently this is a local expiration time being set as there is no access to
         *  the server cookie, in the near future this check needs to be on the cookie
         *  expiration set by the server to stay synced with the server session at all times
         *
         * @return {number}
         */
        checkUserToken: function() {
            //check the cookie expriation time here
            var timeLeft = 0;
            var userSession = this.getUserSession();

            if (userSession.has('expires')) {
                //Maths now - token.expires  in Minutes
                timeLeft = Math.floor(moment(userSession.get('expires')).diff(moment.utc()) / (60000));

                if (timeLeft <= 0) {
                    timeLeft = 0;
                }
            }

            return timeLeft;
        },

        /**
         * Resets the token expiration on the server to keep the server and client session alive
         * @return {undefined}
         */
        refreshUserToken: function() {
            var resourceTitle = "authentication-refreshToken";
            var userSession = this.getUserSession();
            userSession.url = UrlBuilder.buildUrl(resourceTitle);

            userSession.fetch({
                success: function(model, response, options) {
                    if (model.data) {
                        model = model.data;
                    }
                    userSession = model;
                    userSession.set('expires', moment.utc().add(logofftime, 'minutes'), {
                        silent: true
                    });
                    userSession.set('status', UserService.STATUS.LOGGEDIN, {
                        silent: true
                    });
                    UserService.setUserSession(userSession);
                },
                error: function(model, response, options) {
                    //console.info("Refresh Session Error");
                },
                async: true
            });
        },

        /**
         * Sets the temporary logoff time. In the future RDK session cookie/token expiration
         * will determine this in it's configuration
         * @param {Number} minutes the minutes desired for an automatic logoff of a user
         */
        setLogoffTime: function(minutes) {
            if (minutes instanceof Number) {
                logofftime = minutes;
            }
        },

        /**
         * A method to get the logoff time externally
         * @return {Number}
         */
        getLogoffTime: function() {
            return logofftime;
        },

        getStatus: function() {
            return this.getUserSession().get('status');
        },

        /**
         * A method to check a user permission
         * @return {boolean}
         */
        hasPermission: function(permission) {
            var user = this.getUserSession();
            var permissions = user.get('permissions') || [];
            return _.contains(permissions, permission);
        },

        /**
         * A method to check a user permission given a string of permissions
         * @return {boolean}
         */
        hasPermissions: function(args) {
            var permissions = args.split(/[|&]/);

            if (args.match(/&/)) {
                return _.all(permissions, function(permission) {
                    return this.hasPermission(permission);
                }, this);
            } else {
                return _.any(permissions, function(permission) {
                    return this.hasPermission(permission);
                }, this);
            }
        }
    };

    Messaging.on('app:logout', UserService.clearUserSession);

    return UserService;
});
