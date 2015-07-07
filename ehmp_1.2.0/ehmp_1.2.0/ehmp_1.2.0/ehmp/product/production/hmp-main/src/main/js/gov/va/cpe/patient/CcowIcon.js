Ext.define('gov.va.cpe.patient.CcowIcon', {
    extend: 'gov.va.hmp.ux.PopUpButton',
    requires: [
        'gov.va.hmp.CcowContext',
        'gov.va.hmp.PatientContext'
    ],
    alias: 'widget.ccowiconbutton',
    itemId: 'ccowIcon',
//    text: 'Ccow Status Icon',
//    icon: '/images/ccow/ccow_context.png',
    cls: 'hmp-ccow-background',
    width: 44,
    maxWidth: 44,
    hidden: true,
    enabled: false,
    popUp: {
        xtype: 'panel',
        layout: {
            type: 'vbox'
        },
        items: [
            {
                xtype: 'button',
                text: 'Break Link',
                itemId: "breakLinkBtn",
                ui: 'link',
                handler: function (btn) {
                    gov.va.hmp.CcowContext.suspendContext();
                }
            },
            {
                xtype: 'button',
                text: 'Resume Context',
                itemId: "rejoinContextBtn",
                ui: 'link',
//                ui: 'transparent',
//            href: 'cprs:\\',
//            hrefTarget: '_self',
                listeners: {
                    click: function () {
                        gov.va.hmp.CcowContext.resumeContext();
                    }
                }
            },
            {
                xtype: 'button',
                text: 'Disable Context',
                itemId: "disableContextBtn",
                ui: 'link',
                listeners: {
                    click: function (btn) {
                        gov.va.hmp.CcowContext.noCcow();
                        btn.up('ccowiconbutton').setDisabled(true)
                    }
                }
            }
//            ,
//            {
//                xtype: 'button',
//                text: 'Clear Vault',
//                itemId: "clearVaultBtn",
//                ui: 'link',
//                listeners: {
//                    click: function (btn) {
//                        gov.va.hmp.CcowContext.removeAll();
//                    }
//                }
//            }
        ]
    },

    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        if (gov.va.hmp.CcowContext.isNoCcow() == true) {
            me.hide();
        } else if (gov.va.hmp.CcowContext.ccowOff() == true) {
        	me.show();
            me.setDisabled(true);
        } else {
        	me.show();
        }
        me.setDisabled(false);
    },

    contextChange: function (type) {
        //inContext =1
        //Broken    =2
        //changing  =3
        //unknown   =4
        var me = this;
        if (type == 1) {
            me.setIcon('/images/ccow/ccow_context.png');
            me.setBtnStates(type)
        } else if (type == 2) {
            me.setIcon('/images/ccow/ccow_broken.png');
            me.setBtnStates(type)
        } else if (type == 3) {
            me.setIcon('/images/ccow/ccow_changing.png');
            me.setBtnStates(type)
        } else {
            me.setIcon('/images/ccow/ccow_changing.png');
            me.setBtnStates(type);
        }

    },

    setBtnStates: function (state) {
//        console.log('in setBtnStates: ' + state);
        var me = this;
//        var panel = me.down('panel');
        if (state == 1) {
            me.menu.down('#breakLinkBtn').setDisabled(false);
            me.menu.down('#rejoinContextBtn').setDisabled(true);
            me.menu.down('#disableContextBtn').setDisabled(false);
        } else if (state == 2) {
            me.menu.down('#breakLinkBtn').setDisabled(true);
            me.menu.down('#rejoinContextBtn').setDisabled(false);
            me.menu.down('#disableContextBtn').setDisabled(false);
        } else if (state == 3) {
            me.menu.down('#breakLinkBtn').setDisabled(true);
            me.menu.down('#rejoinContextBtn').setDisabled(true);
            me.menu.down('#disableContextBtn').setDisabled(true);
        } else {
            me.menu.down('#breakLinkBtn').setDisabled(true);
            me.menu.down('#rejoinContextBtn').setDisabled(true);
            me.menu.down('#disableContextBtn').setDisabled(true);
        }

    }


});
