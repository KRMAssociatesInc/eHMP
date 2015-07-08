/**
 * Created with IntelliJ IDEA.
 * User: Jim
 * Date: 2/10/14
 * Time: 5:04 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('gov.va.hmp.jira.JiraAuth', {
    singleton: true,
        doWithAuth: function(fn) {
            if(!gov.va.hmp.jira.JiraAuth.sessionAuthenticated) {
                var submit = function(obj) {
                        var wnd = obj.up('window'), frm = wnd.down('form');
                        frm.hide();
                        wnd.setLoading('Authenticating...');
                        Ext.Ajax.request({
                            url: '/jira/authenticate',
                            method: 'POST',
                            params: frm.getValues(),
                            success: function(resp) {
                                var rj = Ext.decode(resp.responseText);
                                if(rj.authenticated=="true") {
                                    gov.va.hmp.jira.JiraAuth.sessionAuthenticated=true;
                                    gov.va.hmp.jira.JiraAuth.username=rj.username;
                                    fn();
                                    wnd.close();
                                } else {
                                    wnd.setLoading(false);
                                    frm.show();
                                    Ext.MessageBox.alert('Authentication Failed','Unable to authenticate; Check your credentials and try again.');
                                }
                            },
                            failure: function(resp) {
                                console.log(resp.responseText);
                                wnd.setLoading(false);
                                frm.show();
                                Ext.MessageBox.alert("Cannot authenticate; Check error log for details");
                            }
                        });
                    },
                    skey = function(obj, keyEvt) {
                        if(keyEvt.getKey()===keyEvt.ENTER) {
                            submit(obj);
                        }
                    },
                    authFrm = Ext.widget('window',{
                        width: 300,
                        height: 190,
                        layout: 'fit',
                        title: 'Jira Login',
                        items: [{
                            xtype: 'form',
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            items: [{
                                xtype: 'component',
                                autoEl: 'p',
                                html: 'Please enter your JIRA credentials to continue.'
                            },{
                                xtype: 'textfield',
                                fieldLabel: 'Username',
                                name: 'username',
                                flex: 0
                            },{
                                xtype: 'textfield',
                                inputType: 'password',
                                fieldLabel: 'Password',
                                name: 'password',
                                flex: 0
                            }]
                        }],
                        fbar: [
                            {
                                ui: 'primary',
                                text: 'Authenticate',
                                handler: submit
                            }
                        ]
                    });
                authFrm.down('form').items.items[0].on('specialkey', skey);
                authFrm.down('form').items.items[1].on('specialkey', skey);
                authFrm.show();
            } else {
                fn();
            }
        }
});
