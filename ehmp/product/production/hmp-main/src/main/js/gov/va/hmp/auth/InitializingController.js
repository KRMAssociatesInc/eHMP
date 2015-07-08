Ext.define('gov.va.hmp.auth.InitializingController', {
    extend: 'gov.va.hmp.Controller',
    requires: ['gov.va.hmp.auth.VistaAccountsStore'],
    refs: [
        {
            ref: 'welcomeArea',
            selector: '#welcomeArea'
        },
        {
            ref: 'stat',
            selector: '#syncStatusProgressArea'
        }
    ],
    onLaunch:function() {
        var me = this;
        Ext.util.TaskManager.start({
            run: me.checkSyncStatus,
            interval: 1000,
            scope: me
        });
        var vistaAccountsStore = Ext.getStore('vistaAccountsStore');
        if(!vistaAccountsStore) {vistaAccountsStore = Ext.create('gov.va.hmp.auth.VistaAccountsStore');}
        vistaAccountsStore.on('load', me.onVistaAccountsLoad, me);
        vistaAccountsStore.load();
    },
    onVistaAccountsLoad:function(store, records, successful) {
        // save selected division
        var vistaId = Ext.state.Manager.get("vistaId");
        if (!Ext.isEmpty(vistaId)) {
            var vistaAccount = store.findRecord("vistaId", vistaId);
            if (vistaAccount != null) {

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
    },
    checkSyncStatus: function() {
        var me = this;
        Ext.Ajax.request({
            url: '/sync/operationalSyncStatus',
            method: 'GET',
            success: function(resp) {
                var json = Ext.decode(resp.responseText);
                me.onSyncStatusChange(json);
            },
            failure: function(resp) {
                console.log('Whooops! '+resp.responseText);
            }
        });
    },
    onSyncStatusChange: function(syncStatus) {
        if(!Ext.isDefined(syncStatus)) {return;}
        if(syncStatus.syncOperationalComplete) {
            window.location="../auth/login";
        }
        var cmp = this.getStat();
        if(syncStatus.operationalSyncStatus) {
            for(var key in syncStatus.operationalSyncStatus.domainExpectedTotals) {
                var dtot = syncStatus.operationalSyncStatus.domainExpectedTotals[key];
                if(dtot) {
                    var dval = dtot.count / dtot.total;
                    var statcmp = cmp.down('#'+key);
                    if(!statcmp) {
                        statcmp = cmp.add({
                            xtype: 'progressbar',
                            itemId: key,
                            value: dval,
                            width: 680,
                            text: 'Loading '+key+' data',
                            margin: '6 0 0 0'
                        })
                    } else {
                        statcmp.updateProgress(dval);
                    }
                }
            }
        }
    }
});