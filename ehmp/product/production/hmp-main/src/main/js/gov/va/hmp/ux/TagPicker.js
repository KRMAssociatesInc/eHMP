/**
 * A tag picker. This class is used by the gov.va.hmp.ux.TagField to allow browsing and selection tags in a popup next to the field, but may also be used with other components.
 */
Ext.define('gov.va.hmp.ux.TagPicker', {
    extend: 'Ext.view.View',
    alias: 'widget.tagpicker',
    cls: 'hmp-tag-picker',
    emptyText: 'No tags found.',
    itemSelector: '.hmp-tag-tile',
    tpl: '<tpl for="."><div class="hmp-tag-tile"><span class="label label-info">{name}</span><p>{description}</p></div></tpl>',
    overItemCls: 'hmp-tag-tile-over',
    // couldn't get these styles to stick in hmp-tag-picker for some reason, that is probably where they belong
    border: 1,
    style: {
        borderColor: '#b5b5b5',
        borderStyle: 'solid'
    },
    height: 400,
    // @private
    onBoxReady: function() {
        this.callParent(arguments);
        this.getStore().load();
    },
    refresh:function() {
        this.callParent(arguments);
    }
});