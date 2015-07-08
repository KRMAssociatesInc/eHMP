Ext.define('gov.va.cpe.roster.RosterSourcePicker', {
    requires: [
        'gov.va.cpe.roster.RosterSourceFoo'
    ],
    extend: 'gov.va.hmp.ux.SearchableList',
    alias: 'widget.rostersourcepicker',
    displayField: 'name',
    listConfig: {
        emptyText: 'No matching sources found.'
    },
    sourceType: '',
    initComponent: function () {
        var me = this;
        this.emptyText = 'Search '+this.sourceType;
        var sourceName = 'rostersource'+this.sourceType;
        me.store = Ext.data.StoreManager.containsKey(sourceName) ? Ext.getStore(sourceName) : Ext.create('Ext.data.Store', {
    	    storeId: sourceName,
    	    model: 'gov.va.cpe.roster.RosterSourceFoo',
    	    sortOnLoad: true,
    	    sorters: {property: 'name', direction: 'ASC'},
    	    proxy: {
    	        type: 'ajax',
    	        url: '/roster/source',
    	        extraParams: {
    	            id:'all',
    	            filter:''
    	        },
    	        reader: {
    	            root: 'data',
    	            type: 'json'
    	        }
    	    }
        });
        var parms = me.store.getProxy().extraParams;
        parms = Ext.apply(parms, {id: this.sourceType});
        me.store.getProxy().extraParams = parms;
        me.callParent(arguments);
    }
});