define([
    'backbone',
    'api/SessionStorage',
    'moment',
    'api/Messaging',
    'api/ResourceService'
], function(Backbone, SessionStorage, moment, Messaging, ResourceService) {
    //'use strict';

    //in minutes
    var logofftime = 15;
    var USERKEY = 'user';


    var SSOLoginService = {

        STATUS: {
            LOGGEDIN: 'loggedin',
            LOGGEDOUT: 'loggedout'
        },
        /**
         * Returns the user object from the session storage
         * @return {Object} user
         */
        getUserSession: function () {
            return SessionStorage.getModel_SessionStoragePreference(USERKEY);
        },

        /**
         * Sets the user on SessionStorage
         * @param {Object} user -the User Model
         */
        setUserSession: function (user) {
            SessionStorage.addModel(USERKEY, user);
        },

        executeSingleSignOn: function (cmUrl, deferred) {
            var participantUrl = ResourceService.buildUrl('vergencevaultproxy-contextparticipant');
            var blob = "";
            var userSession = this.getUserSession();
            console.log("CMURL", cmUrl);
            userSession.save({}, {
                url: ResourceService.buildUrl('vergencevaultproxy-ssoprocess'),
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                processData: false,
                data: JSON.stringify({
                    participantUrl: participantUrl,
                    mContextManagerUrl: cmUrl,
                    blob: blob,
                    site: SessionStorage.getModel('SSO').get('CPRSHostIP')
                }),
                success: function (response, xhr) {
                    userSession = new Backbone.Model(xhr);
                    userSession.set('expires', moment.utc().add(logofftime, 'minutes'));
                    userSession.set('status', SSOLoginService.STATUS.LOGGEDIN);
                    SSOLoginService.setUserSession(userSession);
                    Messaging.trigger('user:sessionStart');
                    isSuccess = true;
                    var ccowObject = userSession.get('ccowObject');
                    SessionStorage.clear('appletStorage');
                    SessionStorage.clear('globalDate');
                    SessionStorage.getModel('patient').set("pid", "");
                    SessionStorage.getModel('patient').set("icn", "");
                    SessionStorage.clear('SSO');
                    deferred.resolve(ccowObject);
                },
                error: function (errorResponse) {
                    isSuccess = false;
                    userSession.set('expires', moment.utc('Thu, 01 Jan 1970 00:00:01 GMT'));
                    userSession.set('status', SSOLoginService.STATUS.LOGGEDOUT);
                    SSOLoginService.setUserSession(userSession);
                    Messaging.trigger('user:sessionEnd');
                    deferred.reject(errorResponse);

                }
            });

            return deferred.promise();
        }
    };

    return SSOLoginService;
});
