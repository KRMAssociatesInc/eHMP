Ext.define('gov.va.hmp.team.TeamPicker', {
    extend: 'Ext.grid.Panel',
    requires: [
        'gov.va.hmp.team.TeamStore',
        'gov.va.hmp.team.CurrentUserTeamStore'
    ],
    alias: 'widget.teampicker',
//    /**
//     * @cfg
//     */
//    mode: 'all',
    columns: [
        { header: 'Team', dataIndex: 'displayName'}
    ],
    initComponent: function () {
        var store = this.store;
        if (store === 'teams') {
            store = Ext.data.StoreManager.containsKey('teams') ? Ext.getStore('teams') : Ext.create('gov.va.hmp.team.TeamStore');
        } else if (!Ext.isDefined(store) || store === 'currentUserTeams') {
            store = Ext.data.StoreManager.containsKey('currentUserTeams') ? Ext.getStore('currentUserTeams') : Ext.create('gov.va.hmp.team.CurrentUserTeamStore');
        }
        this.store = store;

        this.callParent(arguments);
    },
    onBoxReady: function () {
        this.callParent(arguments);

        var store = this.getStore();
        if (store.storeId == 'currentUserTeams') {
            if (!store.isLoading()) store.load();
        }
    }
});