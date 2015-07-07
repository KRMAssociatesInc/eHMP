/*
 * Primary toolbar.
 * Support both authenticated and non-authenticated.
 * 
 * TODO: The MyApps menu colors should match the active theme somehow.
 * TODO: AppBar would be a great place to put a global user notification message (ie 'system going down in 5 min')
 * TODO: the currentApp setting doesn't really work well and is probably not necessary.
 * TODO: AppBar could display TEST/PRODUCTION/ETC. environment warning and debug info (VISTA account, IP, etc.)
 */
Ext.define('gov.va.hmp.appbar.AppBar', {
    extend: 'Ext.toolbar.Toolbar',
    requires: [
        'gov.va.hmp.AppContext',
        'gov.va.hmp.UserContext',
        'gov.va.hmp.ErrorHandler',
        'gov.va.hmp.EventBus',
        'gov.va.hmp.appbar.UserButton',
        'gov.va.cpe.ChatWindow',
        'gov.va.hmp.ux.PopUpButton'
    ],
    uses: [
        'gov.va.hmp.ux.Alert'
    ],
    alias: 'widget.appbar',
    ui: 'hmp-appbar',
    id: 'AppBar',
    itemId: 'AppBar',
    centerAppMenu: false,
    autoRender: true,
    padding: '0 0 0 4',
    height: 26,
    menus: {},
    defaults: {
        scale: 'small'
    },
    items: [
        {
            xtype: 'image',
            src: '/images/tri-16a.png',
            height: 16,
            width: 16
        },
        {
            xtype: 'button',
            ui: 'transparent',
            text: 'My Workspaces',
            itemId: 'mainMenuButton',
            hidden: true,
            menu: {
                minWidth: 150,
                showSeparator: false,
                items: []
            }
        },
        '-',
        {
            xtype: 'toolbar',
            ui: 'plain',
            flex: 1,
            itemId: 'AppMenuID',
            padding: 0,
            style: {
                border: 'none'
            },
            defaults: {
                ui: 'transparent',
                scale: 'small'
            },
            items: []
        },
        '-',
        {
            xtype: 'userbutton',
            ui: 'transparent',
            hidden: true,
            itemId: 'UserBtnID'
        },
        {
            xtype: 'button',
            ui: 'transparent',
            text: 'Help',
            menu: {
                xtype: 'menu',
                items: [
                    {
                        text: 'Help Topics',
                        glyph: 'xF059@FontAwesome',
                        iconCls: 'text-info',
                        href: '/help/GeneralInstructions/SelectApplication.html',
                        hrefTarget: '_blank'
                    },
                    {
                        xtype: 'menuseparator'
                    },
                    {
                        text: 'HMP Wiki',
                        iconCls: 'text-info',
                        href: 'https://vahmp.vainnovations.us:8080/',
                        hrefTarget: '_blank'
                    },
                    {
                        text: 'New and Noteworthy',
                        glyph: 'xF0E7@FontAwesome',
                        iconCls: 'text-warning',
                        href: 'https://vahmp.vainnovations.us:8080/label/sandbox/releasenotes',
                        hrefTarget: '_blank'
                    },
                    {
                        xtype: 'menuseparator'
                    },
                    {
                        icon: '/images/tri-16a.png',
                        href: 'http://hi2.domain.ext/',
                        hrefTarget: '_blank',
                        text: 'About the Health Informatics Initiative (HI<sup>2</sup>)'
                    },
                    {
                        itemId: 'submitTicketMenuItem',
                        glyph: 'xF188@FontAwesome',
                        text: 'Submit Trouble Ticket',
                        hidden: true,
                        handler: function() {
                            gov.va.hmp.jira.TroubleTicket.showTicket();
                        }
                    },
//                    {
//                        icon: '/images/themes/hmp-theme-base/shared/icon-question.png',
//                        text: 'Check Buy-off Status',
//                        handler: function() {
//                            var me = this;
//                            if(me.buyoffWindow) {
//                                me.buyoffWindow.show();
//                            } else {
//                                gov.va.hmp.jira.JiraAuth.doWithAuth(function() {
//                                    var bw = Ext.create('gov.va.hmp.jira.BuyoffWindow');
//                                    bw.down('dataview').getStore().load();
//                                    bw.show();
//                                    me.buyoffWindow = bw;
//                                });
//                            }
//                        }
//                    },
                    {
                        itemId: 'diagnosticsMenuItem',
                        glyph: 'xF0F1@FontAwesome',
                        text: 'Diagnostics',
                        hidden: true,
                        handler: function() {
                            gov.va.hmp.appbar.ErrorWindow.show();
                        }
                    },
                    {
                        xtype: 'menuseparator'
                    },
                    {
                        itemId: 'VersionInfoID',
                        canActivate: false,
                        disabled: true
                    },
                    {
                        itemId: 'buildInfo',
                        canActivate: false,
                        disabled: true
                    }
                ]
            }
        }
    ],
    initComponent: function() {
        var me = this;

        if (me.centerAppMenu) {
        	me.items[3].layout = {type: 'hbox', pack: 'center'};
        }

        me.callParent(arguments);

        me.apps = {};

        me.authenticated = false;
        if (!gov.va.hmp.UserContext.isAuthenticated())
            gov.va.hmp.UserContext.on('userchange', me.onUserChange, me);
        else
            me.onUserChange(gov.va.hmp.UserContext.getUserInfo());

        // place the version info into the menu
        me.down('#VersionInfoID').text = "Version " + gov.va.hmp.AppContext.getVersion();
        me.down('#buildInfo').text = gov.va.hmp.AppContext.getBuildString();

        var appInfo = gov.va.hmp.AppContext.getAppInfo();
        // add the menus
        var menus = appInfo.menus;
        if (Ext.isDefined(menus)) {
            me.refreshMenus(menus);
        }
        if (Ext.isDefined(appInfo.autoUpdateEnabled) && !appInfo.autoUpdateEnabled) {
            me.insert(4, {
                xtype: 'popupbutton',
                itemId: 'autoUpdateWarning',
                ui: 'danger',
                text: 'Automatic Updates Disabled',
                popUp: {
                    xtype: 'component',
                    width: 260,
                    tpl: '<p style="white-space: pre-wrap"><span class="fa fa-exclamation-circle text-danger" style="font-size: 32px; float: left; margin-right: 10px"></span> ' +
                        'Automatic updates between the HMP and the VistA system you are signed into are currently disabled. ' +
                        'There may be data missing from the display since the last update was successfully received. ' +
                        'Proceed with caution.</p>'
                }
            });
        }
        if(appInfo.operationalDataSynching) {
            me.insertOperationalWarning(me);
        }

        if(gov.va.hmp.UserContext.isAuthenticated()) {
            if (gov.va.hmp.UserContext.currentUserHasAuthority('VISTA_KEY_VPR_ADMIN') || gov.va.hmp.UserContext.currentUserHasAuthority('VISTA_KEY_XUPROG')) {
                me.down('#submitTicketMenuItem').setVisible(true);
                me.down('#diagnosticsMenuItem').setVisible(true);
            }

            gov.va.hmp.BroadcastEventListener.startListener();
        }
        gov.va.hmp.EventBus.on('mainmenuchange', me.onMainMenuChange, me);
        gov.va.hmp.EventBus.on('operationalSync', me.onOperationalSyncStatusChange, me);
        gov.va.hmp.EventBus.on('dataStreamDisabled', me.onDataStreamDisabled, me);
    },
    insertOperationalWarning: function(cmp) {
        cmp.insert(4, {
            xtype: 'popupbutton',
            itemId: 'operationalDataSynchingWarning',
            ui: 'danger',
            text: 'Initializing Data Store',
            popUp: {
                xtype: 'component',
                width: 260,
                tpl: '<p style="white-space: pre-wrap"><span class="icon icon-exclamation-signtext-dangerr" style="font-size: 32px; float: left; margin-right: 10px"></span> ' +
                    'The application is performing its initial data sets (patients / users / orderable items / etc.). ' +
                    'Some features of the system will not work properly until this startup phase is complete.</p>'
            }
        });
    },
    addApp: function(code, text, href, hrefTarget, category, acceptStatus) {
        var menuitem = {
            code: code,
            text: text,
            acceptStatus: acceptStatus,
            href: href,
            hrefTarget: (hrefTarget ? hrefTarget : '_self'),
            listeners: {
                click: function (cmp) {
                    if (cmp.href) {
                        if (cmp.hrefTarget == '_self') {
                            location.href = cmp.href;
                        } else {
                            window.open(cmp.href);
                        }
                    }
                }
            }
        };

        // first append to the my apps button/menu
        if (text != '') {
            var mainMenu = this.down('#mainMenuButton').menu;

            // check for more than one menu item with same name and qualify with acceptStatus
            var dups = mainMenu.queryBy(function(item) {
                 return Ext.String.startsWith(item.text, text);
            });
            if (dups.length > 0) {
                menuitem.text = menuitem.text + ' <span class="label label-default">' + acceptStatus + '</span>';

                Ext.each(dups, function(dup) {
                    dup.setText(dup.text + ' <span class="label label-default">' + dup.acceptStatus + '</span>');
                });
            }

            // generate the category header if necessary
            if (category) {
                var header = null;
                if (!this.menus[category]) {
                    this.menus[category] = category;
                    header = mainMenu.add({
                        text: category,
                        canActivate: false,
                        disabled: true,
                        plain: true,
                        cls: 'dropdown-header'
                    });
                    mainMenu.add(menuitem);
                } else {
                    header = mainMenu.down('[text='+category+']');
                    var idx = mainMenu.items.indexOf(header);
                    var it = mainMenu.items.get(++idx);
                    while (Ext.isDefined(it) && it != null) {
                        it = mainMenu.items.get(++idx);
                        if (Ext.isDefined(it) && it.cls.indexOf('dropdown-header') != -1) {
                            it = null;
                        }
                    }
//                    console.log('inserting ' + menuitem.text + ' at position ' + idx);
                    mainMenu.insert(idx, menuitem);
                }
            } else {
                mainMenu.add(menuitem);
            }
        }

        // if this app is the current app, then update the button name
        if (href && window.location.href.indexOf(href) > 0) {
            this.down('#mainMenuButton').setText(text);
        }
   },
    onUserChange: function(userInfo) {
        if (gov.va.hmp.UserContext.isAuthenticated()) {
            this.items.each(function(it){
                it.setVisible(true);
            });
            this.add({ui: 'link', href:'/auth/logout', hrefTarget:'_self', text:'Sign&nbsp;Out'});
//            suspendContext();
        }
    },
    // @private
    onMainMenuChange: function(event) {
        var mainmenu = event.mainmenu;
        if (Ext.isDefined(mainmenu)) {
            this.refreshMenus(mainmenu);
        }
    },
    onOperationalSyncStatusChange: function(event) {
        var stat, bn;
        stat = event.syncStatus;
        bn = this.down('#operationalDataSynchingWarning');
        if(Ext.isDefined(stat)) {
            if(stat.syncComplete) {
                if(bn) {
                    bn.hide();
                }
            } else {
                if(bn) {
                    bn.show();
                } else {
                    this.insertOperationalWarning(this);
                }
            }
        }
    },
    onDataStreamDisabled: function(event) {
        var me = this;
        var wnd = Ext.create('gov.va.hmp.ux.Alert', {
            ui: 'warning',
            title: 'VistA Integration Problem',
            msg: event.disabledMsg+'<p>HMP had a problem receiving new data events from VistA. Until this issue is resolved, HMP will not retrieve data for newly-selected patients, and other patient data in HMP may be out-of-date.</p>',
            block: false,
            tpl: '<h4>{title}</h4>' +
                '<div>{msg}</div>' +
                '<a href="/auth/logout">Return to Welcome Screen</a>' +
                '<button id="{id}-closeEl" type="button" class="btn btn-link btn-small" style="float: right">Ignore and Continue</button>',
            floating: true,
            maxWidth: 616,
            maxHeight: 800
        });
        wnd.show();
    },
    refreshMenus:function(menus) {
        var me = this,
            mainMenu = this.down('#mainMenuButton').menu;

        for (var i = 0; i < menus.length; i++) {
            var menu = menus[i];
            me.addApp(menu.code, menu.name, menu.href, menu.hrefTarget, menu.menu, menu.acceptStatus);
        }
    }
});
