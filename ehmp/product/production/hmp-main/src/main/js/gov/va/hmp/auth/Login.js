Ext.define('gov.va.hmp.auth.Login', {
    extend: 'gov.va.hmp.Application',
    requires: [
        'gov.va.hmp.Viewport',
        'gov.va.hmp.AppContext',
        'gov.va.hmp.auth.LoginController',
        'gov.va.hmp.ux.ClearButton',
        'gov.va.hmp.auth.VistaAccountsStore',
        'gov.va.hmp.ux.Alert'
    ],
    autoListenForBroadcastEvents: false,
    controllers: [
        'gov.va.hmp.auth.LoginController'
    ],
    launch: function () {
        Ext.create('gov.va.hmp.Viewport', {
            itemId: 'hmpLoginViewport',
            items: [
                {
                    xtype: 'container',
                    region: 'center',
//                    padding: '6 0 0 0',
                    layout: {
                        type: 'vbox',
                        align: 'center'
                    },
                    items: [
                        {
                            xtype: 'image',
                            src: '/images/hmp_logo_straight.png',
                            height: 87,
                            width: 600
                        },
                        {
                            xtype: 'component',
                            autoEl: 'p',
                            cls: 'text-muted',
                            style: {
                                'font-size': '14px'
                            },
                            html: gov.va.hmp.AppContext.getVersion()
                        },
                        {
                            xtype: 'container',
                            width: 680,
                            border: false,
                            layout: {
                                type: 'absolute'
                            },
                            items: [
                                {
                                    xtype: 'component',
                                    itemId: 'welcomeArea',
                                    autoEl: 'pre',
                                    html: '                              No Facility Selected',
                                    height: 241,
                                    width: 661,
                                    border: 1,
                                    style: {
                                        '-moz-box-sizing': 'content-box',
                                        'box-sizing': 'content-box',
                                        'font-size': '14px'
                                    },
                                    overflowY: 'scroll',
                                    loader: {
                                        url: '/auth/welcome',
                                        method: 'post',
                                        loadMask: true,
                                        renderer: function (loader, response, active) {
                                            var text = response.responseText;
                                            loader.getTarget().update(text);
                                            return true;
                                        }
                                    }
                                },
                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'vbox',
                                        align: 'center'
                                    },
                                    x: 0,
                                    y: 266,
                                    height: 20,
                                    items: [
                                        {
                                            xtype: 'component',
                                            height: 20,
                                            itemId: 'message',
                                            cls: 'text-danger',
                                            html: ''
                                        }
                                    ]
                                },
                                {
                                    xtype: 'image',
                                    src: '/images/vaseal.png',
                                    x: 0,
                                    y: 292
                                },
                                {
                                    xtype: 'form',
                                    itemId:'hmpLoginForm',
                                    frame: false,
                                    border: 0,
                                    x: 226,
                                    y: 292,
                                    width: 454,

                                    // Fields will be arranged vertically, stretched to full width
                                    layout: 'anchor',
                                    defaults: {
                                        anchor: '100%'
                                    },

                                    // The fields
                                    defaultType: 'textfield',
                                    items: [
                                        {
                                            xtype: 'combobox',
                                            itemId: 'divisionCombo',
                                            name: 'j_vistaId',
                                            fieldLabel: 'Facility',
                                            autoSelect: false,
                                            emptyText: 'Select a Facility',
                                            valueField: 'vistaId',
                                            displayField: 'name',
                                            editable: false,
                                            disableKeyFilter: true,
                                            queryMode: 'local',
                                            allowBlank: false,
                                            forceSelection: true,
                                            msgTarget: "side"
                                        },
                                        {
                                            fieldLabel: 'Access Code',
                                            emptyText: 'Access Code',
                                            itemId: 'accessCodeField',
                                            name: 'j_access',
                                            value: Ext.util.Cookies.get('access_code'),
                                            inputType: 'password',
                                            allowBlank: false,
                                            plugins: ['clearbutton']
                                        },
                                        {
                                            fieldLabel: 'Verify Code',
                                            emptyText: 'Verify Code',
                                            itemId: 'verifyCodeField',
                                            name: 'j_verify',
                                            value: Ext.util.Cookies.get('verify_code'),
                                            inputType: 'password',
                                            allowBlank: true,
                                            plugins: ['clearbutton']
                                        },
                                        {
                                            fieldLabel: 'New Verify Code',
                                            emptyText: 'New Verify Code',
                                            itemId: 'newVerifyCodeField',
                                            name: 'j_newVerify',
                                            value: Ext.util.Cookies.get('verify_code'),
                                            inputType: 'password',
                                            allowBlank: true,
                                            disabled: true,
                                            hidden: true,
                                            plugins: ['clearbutton']
                                        },
                                        {
                                            fieldLabel: 'Confirm Verify Code',
                                            emptyText: 'Confirm Verify Code',
                                            itemId: 'confirmVerifyCodeField',
                                            name: 'j_confirmVerify',
                                            value: Ext.util.Cookies.get('verify_code'),
                                            inputType: 'password',
                                            allowBlank: true,
                                            disabled: true,
                                            hidden: true,
                                            plugins: ['clearbutton']
                                        }
                                    ],
                                    dockedItems: [
                                        {
                                            xtype: 'container',
                                            dock: 'bottom',
                                            margin: '20 0 0 0',
                                            layout: 'hbox',
                                            items: [
                                                {
                                                    xtype: 'tbfill'
                                                },
                                                {
                                                    xtype: 'button',
                                                    itemId: 'submitButton',
                                                    text: 'Sign In',
                                                    ui: 'primary',
                                                    scale: 'large'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            onBoxReady: function () {
                var combobox = this.down('#divisionCombo');
                combobox.store = Ext.data.StoreManager.containsKey('vistaAccountsStore') ? Ext.getStore('vistaAccountsStore') : Ext.create('gov.va.hmp.auth.VistaAccountsStore');
                combobox.getStore().load();
            }
        });
    }
});