Ext.define('gov.va.cpe.roster.RosterSearchableList', {
    extend: 'gov.va.hmp.ux.SearchableList',
    requires: [
        'gov.va.cpe.roster.RosterStore'
    ],
    alias: 'widget.rostersearchlist',
    emptyText: 'Search Patient Lists',
    displayField: 'name',
    queryMode: 'local',
    listConfig: {
        emptyText: 'No matching patient lists found.'
    },
    initComponent: function () {
        var me = this;
        me.store = Ext.data.StoreManager.containsKey('rosters') ? Ext.getStore('rosters') : Ext.create('gov.va.cpe.roster.RosterStore');
        me.callParent(arguments);
    },
    onBoxReady: function () {
        this.callParent(arguments);
        this.store.load();
    }
});