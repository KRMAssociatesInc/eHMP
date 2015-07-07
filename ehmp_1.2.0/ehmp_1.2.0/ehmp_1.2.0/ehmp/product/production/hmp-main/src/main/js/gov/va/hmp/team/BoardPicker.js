Ext.define('gov.va.hmp.team.BoardPicker', {
    extend: 'gov.va.hmp.ux.SearchableList',
    requires: [
        'gov.va.cpe.multi.BoardStore'
    ],
    alias: 'widget.boardpicker',
    emptyText: 'Search Boards',
    displayField: 'name',
    dragGroup: 'team',
    queryMode: 'local',
    listConfig: {
        emptyText: 'No matching boards found.'
    },
    initComponent: function () {
        var me = this;
        me.store = Ext.data.StoreManager.containsKey('boards') ? Ext.getStore('boards') : Ext.create('gov.va.cpe.multi.BoardStore');
        me.callParent(arguments);
    },
    onBoxReady: function() {
        this.callParent(arguments);
        this.store.load();
    }
});