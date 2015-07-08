Ext.define('gov.va.hmp.config.PageBuilder', {
    extend: 'Ext.container.Container',
    requires: [
        'gov.va.hmp.config.PagePanel'
    ],
    alias: 'widget.pagebuilder',
    layout: 'border',
    items: [
        {
            xtype: 'grid',
            region: 'west',
            frame: true,
            title: 'Page Definitions',
            emptyText: 'No Page Definitions Found',
            minWidth: 250,
            width: 250,
            split: true,
            collapsible: true,
            animCollapse: true,
            displayField: 'name',
            hideHeaders: true,
            columns: [
                { text: 'Name', dataIndex: 'name', flex: 1 }
            ],
            store: Ext.create('Ext.data.Store', {
                storeId: 'pages',
                fields: ['uid', 'name', 'view'],
                proxy: {
                    type: 'ajax',
                    url: '/page/v1/list',
                    reader: {
                        root: 'data.items',
                        type: 'json'
                    }
                }
            }),
            tools: [
                {
                    xtype: 'button',
                    ui: 'link',
                    itemId: 'createPageButton',
                    text: 'New Page'
                }
            ]
        },
        {
            xtype: 'pagepanel',
            region: 'center'
        }
    ],
    // private
    onBoxReady: function () {
        this.callParent(arguments);
        this.mon(this.down('layoutpicker'), 'select', this.onLayoutSelect, this);
        this.down('grid').getStore().load();
    },
    // private
    onLayoutSelect: function (picker, numColumns) {
        var pagepanel = this.down('pagepanel');
        var columnWidth = 1.0 / numColumns;
        for (var i = 0; i < pagepanel.items.length; i++) {
            pagepanel.getComponent(i).columnWidth = columnWidth;
        }
        pagepanel.doLayout();
    }
});