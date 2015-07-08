Ext.define('gov.va.hmp.team.TeamField', {
    extend: 'Ext.form.field.ComboBox',
    requires: [
        'gov.va.hmp.team.TeamStore',
        'gov.va.hmp.team.CurrentUserTeamStore'
    ],
    alias: 'widget.teamfield',
    queryMode: 'local',
    queryParam: 'filter',
    grow: true,
    typeAhead: true,
    emptyText: 'Select a Team',
    displayField: 'displayName',
    valueField: 'uid',
    initComponent: function () {
        var store = this.store;
        if (store === 'teams') {
            store = Ext.data.StoreManager.containsKey('teams') ? Ext.getStore('teams') : Ext.create('gov.va.hmp.team.TeamStore');
        } else if (!Ext.isDefined(store) || store === 'currentUserTeams') {
            store = Ext.data.StoreManager.containsKey('currentUserTeams') ? Ext.getStore('currentUserTeams') : Ext.create('gov.va.hmp.team.CurrentUserTeamStore', {
                listeners: {
                    'load': function (store, records, options) {
                        if (records.length == 0) {
                            store.add({displayName: 'You currently do not occupy any positions on any Teams', value: null});
                        }
                    }}
            });
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