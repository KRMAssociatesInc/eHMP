Ext.define('gov.va.hmp.config.HmpComponentPicker', {
    extend: 'Ext.view.View',
    alias: 'widget.hmpcomponentpicker',
    title: 'Add Content',
    overflowY: 'scroll',
    trackOver: true,
    overItemCls: 'x-item-over',
    emptyText: 'No components found',
    store: Ext.create('Ext.data.Store', {
        fields: [
            'id',
            'name',
            'description'
        ],
        proxy: {
            type: 'ajax',
            url: '/page/v1/component/list',
            reader: {
                type: 'json',
                root: 'data.items'
            }
        }
    }),
    itemSelector: 'div.hmp-cmp-descriptor',
    tpl: '<tpl for=".">' +
        '<div class="hmp-cmp-descriptor media" style="height: 70px;border: 1px solid #ccc; border-radius: 4px; padding: 4px">' +
        '<i class="pull-left media-object fa-list-alt" style="font-size: 64px; color: #ccc"></i>' +
        '<div class="media-body">' +
        '<h5 class="media-heading">{name:htmlEncode}</h5>' +
        '<div style="word-wrap: normal">{description:htmlEncode}</div>' +
        '</div>' +
        '</div>' +
        '</tpl>',
    onBoxReady: function () {
        this.callParent(arguments);
        this.getStore().load();
    }
});