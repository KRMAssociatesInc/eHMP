Ext.define('gov.va.hmp.auth.ReindexingController', {
    extend: 'gov.va.hmp.Controller',
    requires: ['gov.va.hmp.auth.VistaAccountsStore'],
    refs: [
        {
            ref: 'welcomeArea',
            selector: '#welcomeArea'
        },
        {
            ref: 'stat',
            selector: '#reindexStatusProgressArea'
        }
    ],
    onLaunch:function() {
        var me = this;
        Ext.util.TaskManager.start({
            run: me.checkReindexStatus,
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
    checkReindexStatus: function() {
        var me = this;
        Ext.Ajax.request({
            url: '/sync/reindexStatus',
            method: 'GET',
            success: function(resp) {
                var json = Ext.decode(resp.responseText);
                me.onReindexStatusChange(json);
            },
            failure: function(resp) {
                console.log('Whooops! '+resp.responseText);
            }
        });
    },
    onReindexStatusChange: function(reindexStatus) {
        if(!Ext.isDefined(reindexStatus)) {return;}
        if(reindexStatus.reindexComplete) {
            window.location="../auth/login";
        }
        if(reindexStatus.pidCounts) {
        var cmp = this.getStat();
                var dval = reindexStatus.pidCounts.solrPidCount / reindexStatus.pidCounts.jdsPidCount;
                var statcmp = cmp.down('#reindexstatbar');
                if(!statcmp) {
                    statcmp = cmp.add({
                        xtype: 'progressbar',
                        itemId: 'reindexstatbar',
                        value: dval,
                        width: 680,
                        text: 'Reindexing Patients',
                        margin: '6 0 0 0'
                    });
                } else {
                    statcmp.updateProgress(dval);
                }
        }
    }
});