/**
 * Extends button so that its menu items are set based on the contents of a {@link Ext.data.Store}
 */
Ext.define('gov.va.hmp.ux.BoundMenuButton', {
    extend: 'Ext.button.Button',
    requires: [
        'gov.va.hmp.ux.BoundMenu'
    ],
    mixins: {
        bindable: 'Ext.util.Bindable'
    },
    alias: 'widget.boundmenubutton',
    /**
     * @cfg {Ext.data.Store} store (required)
     * The {@link Ext.data.Store} to bind this button's menu items to.
     */
    /**
     * @cfg {String} emptyText
     * The text to display in the menu when there is no data to display.
     */
    emptyText: "",
    /**
     * @cfg {String} displayField
     * The underlying {@link Ext.data.Field#name data field name} to bind to this button's menu items.
     *
     * See also `{@link #valueField}`.
     */
    displayField: 'text',
    initComponent: function () {
        var me = this;
        me.menu = {
            xtype: 'boundmenu',
            store: me.store,
            emptyText: me.emptyText,
            displayField: me.displayField,
            createMenuItemFn: me.createMenuItemFn ? me.createMenuItemFn : null
        };

        me.callParent(arguments);

        me.relayEvents(me.menu, ['select']);
//        me.addEvents(
//            /**
//             * @event select
//             * Fires when a menu item is selected.
//             * @param {gov.va.hmp.ux.BoundMenuButton} btn This button
//             * @param {Object} record The selected record
//             */
//            'select'
//        );
    },
    onBoxReady: function() {
        this.callParent(arguments);
        if (this.getStore()) {
            this.getStore().load();
        }
    },
    getStore: function() {
        return this.menu.getStore();
    }
});