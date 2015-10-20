define([
    'backbone',
    'marionette',
    'jquery',
    'main/Session',
    'api/Messaging'
], function(Backbone, Marionette, $, session, Messaging) {
    'use strict';

    var APPLET_STORAGE_KEY = 'appletStorage';

    var Storage = {
        check: {
            supportsSessionStorage: function() {
                if (typeof(window.sessionStorage) === 'undefined') {
                    return false;
                }
                return true;
            },
            existsInSessionStorage: function(key) {
                if (window.sessionStorage.hasOwnProperty(key)) {
                    return true;
                }
                return false;
            },
            existsInMemory: function(key) {
                if ((typeof(session) === 'undefined') || typeof(session[key]) === 'undefined') {
                    return false;
                }
                return true;
            },
            appletHasSessionStorage: function(appletId, model) {
                if (!model) {
                    model = Storage.get.sessionModel(APPLET_STORAGE_KEY);
                }
                if (!(model.has(appletId))) {
                    return false;
                }
                return true;
            }
        },
        set: {
            sessionModel: function(key, value, preference) {
                if (Storage.check.supportsSessionStorage()) {
                    window.sessionStorage.setItem(key, JSON.stringify(value.toJSON()));
                }
                if ((!preference || preference === 'session') && Storage.check.existsInMemory(key)) {
                    session[key].set(value.toJSON());
                }
            },
            appletStorageModel: function(workspaceId, appletId, key, value) {
                var appletKey = Storage.getAppletStorageKey(workspaceId, appletId);
                var model = Storage.get.appletStorageModel(workspaceId, appletId, key);
                model.get(appletKey)[key] = value;
                Storage.set.sessionModel(APPLET_STORAGE_KEY, model);
            }
        },
        get: {
            sessionModel: function(key, preference) {
                if ((!preference || preference === 'session') && Storage.check.existsInMemory(key)) {
                    return session[key];
                } else if (Storage.check.supportsSessionStorage()) {
                    return new Backbone.Model(JSON.parse(window.sessionStorage.getItem(key)));
                }
                return null;
            },
            appletStorageModel: function(workspaceId, appletId) {
                var key = Storage.getAppletStorageKey(workspaceId, appletId);
                var model = Storage.get.sessionModel(APPLET_STORAGE_KEY);
                if (!Storage.check.appletHasSessionStorage(key, model)) {
                    model.set(key, {});
                }
                return model;
            }
        },
        delete: {
            sessionModel: function(key, setDefault) {
                if (Storage.check.existsInMemory(key)) {
                    session.clearSessionModel(key, setDefault);
                } else if (Storage.check.supportsSessionStorage()) {
                    window.sessionStorage.removeItem(key);
                }
            },
            appletStorageModel: function(workspaceId, appletId) {
                var key = Storage.getAppletStorageKey(workspaceId, appletId);
                var model = Storage.get.sessionModel(APPLET_STORAGE_KEY);

                if (Storage.check.appletHasSessionStorage(key, model)) {
                    model.unset(key);
                    Storage.set.sessionModel(APPLET_STORAGE_KEY, model);
                }
            },
            all: function() {
                session.clearAllSessionModels();
                window.sessionStorage.clear();
            }
        },

        //---------OLD METHODS------------------//
        addModel: function(key, value) {
            this.set.sessionModel(key, value);
        },
        getModel: function(key) {
            return this.get.sessionModel(key);
        },
        clear: function(key) {
            this.delete.sessionModel(key);
        },
        getModel_SessionStoragePreference: function(key) {
            return this.get.sessionModel(key);
        },
        getAppletStorageKey: function(workspaceId, appletId) {
            return workspaceId + '$' + appletId;
        },
        setAppletStorageModel: function(appletId, key, value, bindToWorkspace) {
            var workspaceId = Messaging.request('get:current:screen').config.id;
            if (!_.isUndefined(bindToWorkspace) && !bindToWorkspace) {
                workspaceId = 'unbound-' + appletId;
            }
            this.set.appletStorageModel(workspaceId, appletId, key, value);
        },
        getAppletStorageModel: function(appletId, key, boundToWorkspace) {
            var workspaceId = Messaging.request('get:current:screen').config.id;
            if (!_.isUndefined(boundToWorkspace) && !boundToWorkspace) {
                workspaceId = 'unbound-' + appletId;
            }
            var appletKey = this.getAppletStorageKey(workspaceId, appletId);
            return this.get.appletStorageModel(workspaceId, appletId).get(appletKey)[key];
        },
        clearAppletStorageModel: function(appletId) {
            var workspaceId = Messaging.request('get:current:screen').config.id;
            this.delete.appletStorageModel(workspaceId, appletId);
        }
    };

    session.user.on('change', Storage.set.sessionModel('user', session.user, 'sessionStorage'));
    session.patient.on('change', Storage.set.sessionModel('patient', session.patient, 'sessionStorage'));
    session.globalDate.on('change', Storage.set.sessionModel('globalDate', session.globalDate, 'sessionStorage'));

    return Storage;
});
