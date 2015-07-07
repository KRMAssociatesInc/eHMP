define([
    'backbone',
    'marionette',
    'main/ADK',
    'api/SessionStorage',
    'api/CCOWService',
    'api/ResourceService',
    'hbs!main/components/views/ccowTemplate',
    'api/SSOLoginService'
], function(Backbone, Marionette, ADK, SessionStorage, CCOWService, ResourceService, CCOWTemplate, ssoLoginService) {
    'use strict';

    var CCOWObjectsModel = Backbone.Model.extend({
        defaults: {
            localUrl: '_assets/activex'
        }
    });

    function buildParticipantUrl(){
        var resourceUrl = ResourceService.buildUrl('vergencevaultproxy-contextparticipant'),
            participantUrl;
        if(resourceUrl.substring(0, 4) === 'http'){
            participantUrl = resourceUrl;
        }else {
            participantUrl = location.protocol + '//' + location.hostname + (location.port ? ':'+location.port: '') + resourceUrl;
        }

        return participantUrl;
    }

    var CCOWObjectsView = Backbone.Marionette.ItemView.extend({
        template: CCOWTemplate,
        initialize: function () {
            this.model = new CCOWObjectsModel();
            try {
                new ActiveXObject('Sentillion.WebLocator.1');
            } catch(e) {
                this.model.set('failed', 'yes');
            }
            this.ccowSession = SessionStorage.getModel('ccow');
            var state = this.ccowSession.get('state');

            if(!this.model.get('failed')){
                if(!state){
                    this.ccowSession.set('state', 'initial');
                    var participantUrl = buildParticipantUrl();
                    this.model.set('participantUrl', participantUrl);
                    this.ccowSession.set('participantUrl', participantUrl);
                } else if(state === 'listening'){
                    this.loadModelFromSession();
                }
            }
        },
        loadModelFromSession: function () {
            this.model.set('contextManagerUrl', this.ccowSession.get('contextManagerUrl'));
            this.model.set('contextCoupon', this.ccowSession.get('contextCoupon'));
            this.model.set('participantCoupon', this.ccowSession.get('participantCoupon'));
        },
        onDomRefresh: function() {
            var state = this.ccowSession.get('state');
            var failed = this.model.get('failed');

            if (!failed && state === 'initial') {
                var _view = this;
                var runContextManager = $.Deferred();
                var isSsoSession = SessionStorage.getModel('SSO').get('CPRSHostIP');
                var loginDeferred = $.Deferred();

                loginDeferred.done(function (ccowObject) {
                    console.log(ccowObject);
                    _view.loadSessionObject(ccowObject);
                });
                loginDeferred.fail(function () {
                    ADK.Messaging.trigger('user:sessionEnd');
                    _view.ccowSession.set('status', 'NotConnected');
                    _view.persistCcowSession();
                });

                var self = this;
                runContextManager.fail(function () {
                    SessionStorage.clear('SSO');
                    _view.ccowSession.set('status', 'NotConnected');
                    _view.persistCcowSession();
                    if (isSsoSession) {
                        window.location.href = '/';
                    }
                });


                runContextManager.done(function (cmUrl) {
                    _view.ccowSession.set('contextManagerUrl', cmUrl);
                    _view.ccowSession.set('state', 'ranlocator');
                    if (isSsoSession) {
                        ssoLoginService.executeSingleSignOn(cmUrl, loginDeferred);
                    } else {
                        _view.persistCcowSession();
                        _view.retrieveListener();
                    }
                });

                var cmUrl;
                try {
                    cmUrl = WebLocator.Run();
                    if (cmUrl.length > 0)
                        runContextManager.resolve(cmUrl);
                    else
                        runContextManager.reject();
                } catch (e) {
                    runContextManager.reject();
                }

            } else if (state === 'ranlocator') {
                this.retrieveListener();
            } else if (state === 'listening') {
                try {
                    WebListener.Run();
                } catch (e) {
                    //DO Nothing
                }
            }

        },
        persistCcowSession: function () {
            SessionStorage.clear('ccow');
            SessionStorage.addModel('ccow', this.ccowSession);
        },
        retrieveListener: function () {
            var _view = this;
            CCOWService.connectToContext(this.ccowSession.get('blob'), this.ccowSession.get('participantUrl'), this.ccowSession.get('contextManagerUrl'), function (response) {
                _view.loadSessionObject(response);

            });
        },
        loadSessionObject: function (ccowObject) {
            var _view = this;
            _view.model.set('participantCoupon', ccowObject.participantCoupon);
            _view.ccowSession.set('participantCoupon', ccowObject.participantCoupon);
            _view.model.set('contextCoupon', ccowObject.contextCoupon);
            _view.ccowSession.set('contextCoupon', ccowObject.contextCoupon);
            _view.ccowSession.set('blob', ccowObject.blob);
            _view.ccowSession.set('contextItems', ccowObject.contextItems);
            _view.ccowSession.set('contextManagerUrl', ccowObject.contextManagerUrl);
            _view.ccowSession.set('pid', ccowObject.pid);
            _view.ccowSession.set('state', 'listening');
            _view.ccowSession.set('status', 'Connected');
            _view.persistCcowSession();
            CCOWService.navigateToPatient(ccowObject.pid);

        }

    });

    return CCOWObjectsView;

});
