Ext.define('gov.va.cpe.multi.BoardColumnAddButton', {
    extend: 'Ext.button.Button',
    requires: [
        'gov.va.cpe.multi.BoardColumnOption'
    ],
    alias: 'widget.boardColumnAddButton',
    ui: 'link',
    text: 'Add Column',
    menu: {
        width: 400,
        height: 300,
        layout: 'fit',
        items: [
            {
                xtype: 'grid',
                padding: 0,
                hideHeaders: true,
                store: {
                    model: 'gov.va.cpe.multi.BoardColumnOption',
                    sorters: ['name'],
                    proxy: {
                        type: 'ajax',
                        url: '/config/column/list',
                        reader: {
                            type: 'json'
                        }
                    }
                },
                columns: [
                    {
                        xtype: 'templatecolumn',
                        flex: 1,
                        tpl: '<div>' +
                            '<strong>{name}</strong>' +
                            '<div style="white-space: normal">{description}</div>' +
                            '</div>'
                    }
                ]
            }
        ]
    },
    initComponent:function() {
        this.callParent(arguments);
        this.relayEvents(this.menu.down('grid'), ['beforeselect', 'beforedeselect', 'select', 'deselect', 'selectionchange']);
    },
    initEvents: function() {
        this.mon(this.menu.down('grid'), 'select', this.onSelect, this);
    },
    onBoxReady: function () {
        this.callParent(arguments);
        this.menu.down('grid').getStore().load();
    },
    // private
    onSelect:function() {
        this.hideMenu();
    },
    // private
    onMenuShow:function() {
        this.menu.down('grid').getSelectionModel().deselectAll(true);
    }
});