Ext.define('gov.va.hmp.auth.SystemUnavailable', {
    extend: 'gov.va.hmp.Viewport',
    alias: 'widget.systemunavailable',
    items: [
        {
            xtype: 'container',
            region: 'center',
            padding: '6 0 0 0',
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
                    cls: 'muted',
                    style: {
                        'font-size': '14px'
                    }
                },
                {
                    xtype: 'component',
                    autoEl: 'p',
                    cls: 'muted',
                    style: {
                        'font-size': '14px'
                    }
                },
                {
                    xtype: 'component',
                    itemId: 'welcomeArea',
                    autoEl: 'pre',
                    height: 260,
                    width: 680,
                    border: 1,
                    style: {
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
                }
            ]
        }
    ],
    initComponent: function() {
        if(this.addlItems) {
            Ext.Array.push(this.items[0].items, this.addlItems);
        }
        this.items[0].items[1].html = gov.va.hmp.AppContext.getVersion();
        this.callParent(arguments);
    },
    onBoxReady: function() {
        var vistaAccountsStore = Ext.getStore('vistaAccountsStore');
        if(!vistaAccountsStore) {vistaAccountsStore = Ext.create('gov.va.hmp.auth.VistaAccountsStore');}
        vistaAccountsStore.on('load', this.onVistaAccountsLoad, this);
        vistaAccountsStore.load();
    },
    onVistaAccountsLoad:function(store, records, successful) {
        // save selected division
        var vistaId = Ext.state.Manager.get("vistaId");
        if (!Ext.isEmpty(vistaId)) {
            var vistaAccount = store.findRecord("vistaId", vistaId);
            if (vistaAccount != null) {
                var welcomeArea = this.down('#welcomeArea');
                welcomeArea.update('');
                var welcomeAreaLoader = welcomeArea.getLoader();
                welcomeAreaLoader.load({
                    params: {
                        vistaId: vistaAccount.get('vistaId'),
                        host: vistaAccount.get('host'),
                        port: vistaAccount.get('port')
                    }
                });
            }
        }
    }
})