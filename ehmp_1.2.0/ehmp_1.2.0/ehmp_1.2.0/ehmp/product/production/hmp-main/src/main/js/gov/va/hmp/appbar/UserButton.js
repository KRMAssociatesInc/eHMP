Ext.define('gov.va.hmp.appbar.UserButton', {
    extend:'Ext.button.Button',
    requires:[
        'gov.va.hmp.UserContext',
        'gov.va.hmp.appbar.PrefWin'
    ],
    uses:[
        'gov.va.hmp.appbar.ChangePhotoWindow',
        'gov.va.hmp.appbar.ChangePasswordWindow'
    ],
    alias:'widget.userbutton',
    cls:'hmp-user-button',
    text:'[User Name]',
    menu:{
        cls: 'hmp-popupbutton-menu',
        plain:true,
        items:[
            {
                xtype:'panel',
//                height:160,
//                width:400,
//                padding:6,
                layout:'hbox',
                items:[
                    {
                        xtype:'image',
                        itemId:'userPicture',
                        minWidth:74
                    },
                    {
                        xtype:'container',
                        defaults:{
                            xtype:'displayField'
                        },
                        items:[
                            {
                                xtype:'displayfield',
                                itemId:'userName'
                            },
                            {
                                xtype:'displayfield',
                                fieldLabel:'Title',
                                itemId:'userTitle'
                            },
                            {
                                xtype:'displayfield',
                                fieldLabel:'Facility',
                                itemId:'userDivision'
                            },
                            {
                                xtype:'displayfield',
                                fieldLabel:'Service/Section',
                                itemId:'userService'
                            }
                        ]
                    }
                ],
                tbar:[
                    {
                        xtype:'button',
                        itemId:'changePhotoButton',
                        ui:'link',
                        text:'Change Photo'
                    }
                ]
            }
        ],
        fbar:[
            {
                xtype:'button',
                itemId:'cvcButton',
                text:'Change Verify Code',
                handler:function () {
                    var cpwin = Ext.create('gov.va.hmp.appbar.ChangePasswordWindow', {
                        itemId:'ChangePasswordWindowID',
                        modal:true,
                        minHeight:200, minWidth:300,
                        title:'Change Credentials'
                    });
                    cpwin.show();
                }
            },
            '->',
            {
                xtype:'button',
                itemId:'UserPrefID',
                ui:'primary',
                text:'Edit User Preferences'
            }
        ]
    },
    initComponent:function () {
        var me = this;

        me.callParent(arguments);

        if (gov.va.hmp.UserContext.isAuthenticated()) {
            me.setText(gov.va.hmp.UserContext.getUserInfo().displayName);
            me.refreshPhoto();
            me.menu.down('#userTitle').setValue(gov.va.hmp.UserContext.getUserInfo().displayTitle);
            me.menu.down('#userDivision').setValue(gov.va.hmp.UserContext.getUserInfo().displayDivisionName);
            me.menu.down('#userService').setValue(gov.va.hmp.UserContext.getUserInfo().displayServiceSection);
        }

        me.menu.down('#changePhotoButton').on('click', function () {
            var win = Ext.create('gov.va.hmp.appbar.ChangePhotoWindow', {
                title:'Edit User Photo',
                modal:true,
                listeners:{
                    load:function () {
                        me.refreshPhoto();
                    }
                }
            });
            win.show();
        });

        me.menu.down('#UserPrefID').on('click', function () {
            if (!me.prefwin) {
                me.prefwin = Ext.create('gov.va.hmp.appbar.PrefWin');
            }
            me.prefwin.show();
        });
    },
    refreshPhoto:function () {
        var me = this;
        var pnl = me.menu.down('panel');
        var photoUrl = '/person/v1/' + gov.va.hmp.UserContext.getUserInfo().uid + '/photo?_dc=' + (new Date().getTime());
//        console.log("refreshPhoto(" + photoUrl + ")");

        pnl.remove(pnl.getComponent(0), true);
        pnl.insert(0, {
            xtype:'image',
            src:photoUrl,
            minWidth:76
        });
        pnl.doLayout();

        me.setIcon(null);
        me.setIcon(photoUrl);
    }
});