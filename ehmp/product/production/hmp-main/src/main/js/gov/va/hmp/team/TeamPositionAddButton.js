Ext.define('gov.va.hmp.team.TeamPositionAddButton', {
    extend:'Ext.button.Button',
    requires:[
        'gov.va.hmp.ux.SearchableList',
        'gov.va.hmp.team.TeamPositionStore'
    ],
    alias:'widget.teamPositionAddButton',
    ui: 'link',
    text: 'Add Position',
    menu: {
        width: 400,
        height: 300,
        layout: 'fit',
        items: [
            {
                xtype: 'searchablelist',
                emptyText: 'Search Team Positions',
                padding:0,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'uid',
                displayTpl: '<div>' +
                    '<strong>{name}</strong>' +
                    '<div style="white-space: normal">{description}</div>' +
                    '</div>',
                listConfig: {
                    emptyText: 'No matching team positions found.'
                }
            }
        ]
    },
    initComponent:function () {
        this.menu.items[0].store = Ext.data.StoreManager.containsKey('teamPositions') ? Ext.getStore('teamPositions') : Ext.create('gov.va.hmp.team.TeamPositionStore');

        this.callParent(arguments);

        this.relayEvents(this.menu.down('searchablelist'), ['beforeselect', 'beforedeselect', 'select', 'deselect', 'selectionchange']);
    },
    initEvents: function() {
        this.mon(this.menu.down('searchablelist'), 'selectionchange', this.onSelect, this);
    },
    onBoxReady: function () {
        this.callParent(arguments);
        this.menu.down('searchablelist').getStore().load();
    },
    // private
    onSelect:function() {
        this.hideMenu();
    },
    // private
    onMenuShow:function() {
        this.menu.down('searchablelist').getSelectionModel().deselectAll(true);
    }
});