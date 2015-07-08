Ext.define('gov.va.hmp.appbar.ChangePasswordWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.cpwin',
    items: [
        {
            xtype: 'form',
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            fieldDefaults: {
                labelWidth: 120
            },
            defaultType: 'textfield',
            items: [
                {
                    fieldLabel: 'Access Code',
                    itemId: 'accessCodeField',
                    name: 'j_access',
                    value: Ext.util.Cookies.get('access_code'),
                    inputType:'password',
                    allowBlank: false,
                    listeners: {
                        specialkey: function(field, e) {
                            if (e.getKey() == e.ENTER) {
                                field.up('cpwin').submitAuth();
                            }
                            else if(e.getKey() == e.TAB) {
                                field.nextSibling().focus();
                            }
                        }
                    }
                },
                {
                    fieldLabel: 'Verify Code',
                    itemId: 'verifyCodeField',
                    name: 'j_verify',
                    value: Ext.util.Cookies.get('verify_code'),
                    inputType:'password',
                    allowBlank: false,
                    listeners: {
                        specialkey: function(field, e) {
                            if (e.getKey() == e.ENTER) {
                                field.up('cpwin').submitAuth();
                            }
                            else if(e.getKey() == e.TAB) {
                                field.nextSibling().focus();
                            }
                        }
                    }
                },
                {
                    fieldLabel: 'New Verify Code',
                    itemId: 'newVerifyCodeField',
                    name: 'j_newVerify',
                    value: Ext.util.Cookies.get('verify_code'),
                    inputType:'password',
                    allowBlank: false,
                    listeners: {
                        specialkey: function(field, e) {
                            if (e.getKey() == e.ENTER) {
                                field.up('cpwin').submitAuth();
                            }
                            else if(e.getKey() == e.TAB) {
                                field.nextSibling().focus();
                            }
                        }
                    }
                },
                {
                    fieldLabel: 'Confirm Verify Code',
                    itemId: 'confirmVerifyCodeField',
                    name: 'j_confirmVerify',
                    value: Ext.util.Cookies.get('verify_code'),
                    inputType:'password',
                    allowBlank: false,
                    listeners: {
                        specialkey: function(field, e) {
                            if (e.getKey() == e.ENTER) {
                                field.up('cpwin').submitAuth();
                            }
                        }
                    }
                }
            ],
            fbar: [
                {
                    xtype: 'button',
                    text: 'Cancel',
                    handler: function(bn, e) {
                        bn.up('cpwin').hide();
                    }
                },
                {
                    xtype: 'button',
                    ui: 'primary',
                    text: 'Change Verify Code',
                    handler: function(bn, e) {
                        bn.up('cpwin').doSubmit();
                    }
                }
            ]
        }
    ],
    doSubmit: function()
    {
        var frm = this.down('form');
        if(frm)
        {
            var vals = frm.getValues();
            if ( vals.j_newVerify != vals.j_confirmVerify ) {
            	Ext.Msg.alert("Error", 'New Verify Code and Confirm Verify Code are not matched');
            }
            else {
	            Ext.apply(vals, {j_vistaId: Ext.state.Manager.get("vistaId"), j_division: Ext.state.Manager.get("vistaDiv")});
	            Ext.Ajax.request({
	                //url: '/j_spring_security_check',
	            	url: '/auth/update/verifycode',
	                method: 'POST',
	                params: vals,
	                success: function(resp) {
	                    // Refresh window?
	                    Ext.MessageBox.alert('Change Credentials', 'Credentials successfully changed.');
	                },
	                failure: function(resp) {
	                	var json = Ext.decode(resp.responseText);
	                	var msg = resp.statusText;
	                	if(json && json.error && json.error.message) {
	                		msg = json.error.message;
	                	}
	                    Ext.MessageBox.alert('Change Credentials', 'Credentials were not changed: '+msg);
	                }
	            });
            }
        }
    }
});