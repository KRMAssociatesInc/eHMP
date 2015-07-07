Ext.define('gov.va.hmp.auth.LoginController', {
    extend: 'gov.va.hmp.Controller',
    refs: [
        {
            ref: 'welcomeArea',
            selector: '#welcomeArea'
        },
        {
            ref: 'loginForm',
            selector: '#hmpLoginForm'
        },
        {
            ref: 'loginViewport',
            selector: '#hmpLoginViewport'
        },
        {
            ref: 'message',
            selector: '#message'
        },
        {
            ref: 'submitButton',
            selector: '#submitButton'
        }
    ],
    config: {
    	// list of predefined error messages you can pass to the login screen,
    	// per WASA, we can't permit user-controllable messages which could lead to social engineering attacks
    	// TODO: to allow for more dynamic messages, may want to turn this into XTemplates that can substitute some simple values
    	msgs: {
    		'TIMEOUT': "Your session has expired! Please sign in again.",
    		'SSO_FAIL': 'CPRS Single Sign-on Failed',
    		'SSO_TIMEOUT': 'CPRS Single Sign-on Time Limit Exceeded; Please log in.'
    	}
    },
    init: function () {
//        console.log(Ext.getClassName(this) + ".init()");
        var me = this;
        me.control({
            '#divisionCombo': {
                select: me.onDivisionSelect
            },
            '#submitButton': {
                click: me.submitAuth
            },
            '#accessCodeField': {
                specialkey: me.onSpecialKey
            },
            '#verifyCodeField': {
                specialkey: me.onSpecialKey
            },
            '#newVerifyCodeField': {
                specialkey: me.onSpecialKey
            },
            '#confirmVerifyCodeField': {
                specialkey: me.onSpecialKey
            }
        });
     },
    onLaunch:function() {
        var me = this;
        var vistaAccountsStore = Ext.getStore('vistaAccountsStore');
        vistaAccountsStore.on('load', me.onVistaAccountsLoad, me);
        vistaAccountsStore.load();
        
        // initial error message? Lookup from defined list
        var msg = location.search.indexOf('msg') != -1 ? Ext.Object.fromQueryString(location.search).msg : null;
        if (msg != null) {
        	me.getMessage().update(me.getMsgs()[msg] || 'Undefined Message');
        }
        
    },
    onVistaAccountsLoad:function(store, records, successful) {
        // save selected division
        var vistaId = Ext.state.Manager.get("vistaId");
        var formCmp = this.getLoginForm();
        var form = formCmp.getForm();
        var vistaIdField = form.findField('j_vistaId');
        if (!Ext.isEmpty(vistaId)) {
            var vistaAccount = vistaIdField.store.findRecord("vistaId", vistaId);
            if (vistaAccount != null) {
                vistaIdField.setValue(vistaAccount);
                form.findField('j_access').focus();

                var welcomeArea = this.getWelcomeArea();
                welcomeArea.update('');
                var welcomeAreaLoader = welcomeArea.getLoader();
                welcomeAreaLoader.load({
                    params: {
                        vistaId: vistaAccount.get('vistaId')
                    }
                });
            }
        } else {
            vistaIdField.focus();
        }
    },
    onDivisionSelect: function (comboBox, records) {
        var vistaId = records[0].get("vistaId");
        var form = this.getLoginForm().getForm();
        var vistaIdField = form.findField('j_vistaId');
        if (!Ext.isEmpty(vistaId)) {
            var vistaAccount = vistaIdField.store.findRecord("vistaId", vistaId);
            if (vistaAccount != null) {
                form.findField('j_access').focus();

                var welcomeArea = this.getWelcomeArea();
                welcomeArea.update('');

                var welcomeAreaLoader = welcomeArea.getLoader();
                welcomeAreaLoader.load({
                    params: {
                        vistaId: vistaAccount.get('vistaId')
                    }
                });
            }
        }
        vistaIdField.focus();
    },
    onSpecialKey: function (field, e) {
        if (e.getKey() == e.ENTER) {
            this.submitAuth();
        }
    },
    submitAuth: function () {
        var me = this;
        // check for validity
        var formComponent = me.getLoginForm();
        var form = formComponent.getForm();
        var msgComponent = me.getMessage();
        msgComponent.update('');
        var vistaIdField = form.findField('j_vistaId');
        var vistaId = vistaIdField.getValue();
        if (form.isValid()) {
            formComponent.setLoading("Authenticating...", true);
            formComponent.down('button').disable();
            formComponent.down('button').hide();

            form.submit({
                url: '/j_spring_security_check',
                params: {
                    'j_division': Ext.getStore('vistaAccountsStore').findRecord('vistaId', vistaId).get('division')
                },
                scope: me,
                success: me.onAuthenticationSuccess,
                failure: me.onAuthenticationFailure
            });
        }
        // save selected division
        if (!Ext.isEmpty(vistaIdField)) {
            Ext.state.Manager.set("vistaId", vistaId);
            Ext.state.Manager.set("vistaDiv", Ext.getStore('vistaAccountsStore').findRecord('vistaId', vistaId).get('division'));
        }
    },
    onAuthenticationSuccess:function(form, action) {
        this.getLoginViewport().removeAll();
        var json = Ext.decode(action.response.responseText);
        window.location = json.data.targetUrl;
        Ext.state.Manager.set("DUZ", json.DUZ);
    },
    onAuthenticationFailure:function(form, action) {
        var formComponent = this.getLoginForm();
        formComponent.setLoading(false);
        formComponent.down('button').enable();
        formComponent.down('button').show();

        var msgComponent = this.getMessage();
        msgComponent.removeCls('text-success');
        msgComponent.addCls('text-danger');

        if (action.response.status === 0) {
            if (action.response.timedout) {
                msgComponent.update("Unable to sign in due to network problems causing it to take longer than expected.");
            } else {
                msgComponent.update("Unable to sign in due to network or server unavailability.");
            }
        } else {
            var json = Ext.decode(action.response.responseText);
            if (json.error.code === 401 && json.error.message.indexOf("VERIFY CODE must be changed before continued use.") > -1) {
                formComponent.down('#newVerifyCodeField').enable();
                formComponent.down('#confirmVerifyCodeField').enable();
                formComponent.down('#newVerifyCodeField').show();
                formComponent.down('#confirmVerifyCodeField').show();
                formComponent.down('button').setText('Change Verify Code');
                msgComponent.update("VERIFY CODE must be changed before continued use.");
            } else {
                msgComponent.update(json.error.message);
            }
        }
    }
});