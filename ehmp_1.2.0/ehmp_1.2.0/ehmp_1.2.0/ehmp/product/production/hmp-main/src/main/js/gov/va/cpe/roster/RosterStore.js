/**
 * Store containing all rosters.
 */
Ext.define('gov.va.cpe.roster.RosterStore', {
    extend: 'Ext.data.Store',
    requires: [
        'gov.va.cpe.roster.RosterModel'
    ],
    storeId: 'rosters',
    model: 'gov.va.cpe.roster.RosterModel',
    pageSize: 250,
    sortOnLoad: true,
    sorters: {property: 'name', direction: 'ASC'},
    proxy: {
        type: 'ajax',
        url: '/roster/list',
        extraParams: {
            id:'all'
        },
        reader: {
            root: 'data.items',
            totalProperty: 'data.totalItems',
            type: 'json'
        }
    },
    constructor:function(config) {
        this.callParent(arguments);

        gov.va.hmp.EventBus.on('operationalDataChange', this.onOperationalDataChange, this);
    },
    destroy: function(options) {
        gov.va.hmp.EventBus.un('operationalDataChange', this.onOperationalDataChange, this);

        return this.callParent(arguments);
    },
    // private
    onOperationalDataChange: function(event) {
        var me = this;
        if (me.isDestroyed) return;
        if (event.domain !== 'roster') return;
        
        me.load();
        
    }
});