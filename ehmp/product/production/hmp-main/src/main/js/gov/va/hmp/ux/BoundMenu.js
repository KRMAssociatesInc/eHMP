/**
 * Extends menu so that its menu items are set based on the contents of a {@link Ext.data.Store}
 */
Ext.define('gov.va.hmp.ux.BoundMenu', {
    extend: 'Ext.menu.Menu',
    mixins: {
        bindable: 'Ext.util.Bindable'
    },
    alias: 'widget.boundmenu',
//    plain: true,
    /**
     * @cfg {Ext.data.Store} store (required)
     * The {@link Ext.data.Store} to bind this menu's menu items to.
     */
    /**
     * @cfg {String} emptyText
     * The text to display in the menu when there is no data to display.
     */
    emptyText: "",
    /**
     * @cfg {String} displayField
     * The underlying {@link Ext.data.Field#name data field name} to bind to this menu's menu items.
     *
     * See also `{@link #valueField}`.
     */
    displayField: 'text',
    /**
     * @cfg {Function} createMenuItemFn
     * A custom function which is passed each item in the {@link Ext.data.Store} in turn. Should return
     * a {@link Ext.menu.MenuItem} instance to include in the menu.
     */
    initComponent: function () {
        var me = this;


        me.items = [
            this.createEmptyMenuItem()
        ];

        me.callParent(arguments);

        // Look up the configured Store. If none configured, use the fieldless, empty Store defined in Ext.data.Store.
        me.store = Ext.data.StoreManager.lookup(me.store || 'ext-empty-store');
        me.bindStore(me.store, true);

        me.addEvents(
            /**
             * @event select
             * Fires when a menu item is selected.
             * @param {gov.va.hmp.ux.BoundMenu} menu This menu
             * @param {Object} record The selected record
             */
            'select'
        );
    },
    onItemClick:function(menuitem, event) {
        var record = menuitem.data;
        this.fireEvent('select', this, record);
    },
//    onBindStore: function(store, initial) {
//
//    },
    onUnbindStore: function (store, initial) {
        this.clear();
    },
    getStoreListeners: function () {
        var me = this;
        return {
            refresh: me.refresh,
            add: me.onStoreAdd,
            bulkremove: me.onStoreRemove,
            update: me.onStoreUpdate,
            clear: me.refresh
        };
    },
    /**
     * Refreshes the menu by reloading the data from the store and re-adding menu items.
     */
    refresh: function () {
        var me = this;
        if (me.isDestroyed) {
            return;
        }
        Ext.suspendLayouts();
        me.removeAll();
        var records = me.store.getRange();
        if (records.length == 0) {
            this.add(this.createEmptyMenuItem());
        } else {
            for (var i = 0; i < records.length; i++) {
                var record = records[i];
                var text = record.get(me.displayField);
                if (!text) text = "";

                var menuitem = me.createMenuItemFn ? me.createMenuItemFn.call(this, text, record) : me.createMenuItem(text, record);
                this.mon(menuitem, 'click', this.onItemClick, this);
                me.add(menuitem);
            }
        }
        Ext.resumeLayouts();
    },
    clear: function() {
        this.removeAll();
        this.add(this.createEmptyMenuItem());
    },
    // private
    createEmptyMenuItem:function() {
       return  {text:this.emptyText, disabled: true};
    },
    // @protected
    createMenuItem:function(text, record) {
        var me = this;
        var menuitem = Ext.widget('menuitem', {
            text: text,
            iconCls: 'none',
            data: record
        });
        return menuitem;
    },
    // private
    onStoreUpdate: function (store, record) {
        var me = this,
            index,
            node;
    },

    // private
    onStoreAdd: function (store, records, index) {
        var me = this,
            nodes;

        if (me.rendered) {
            // If we are adding into an empty view, we must refresh in order that the *full tpl* is applied
            // which might create boilerplate content *around* the record nodes.
            if (me.all.getCount() === 0) {
                me.refresh();
            }
        }

    },
    // private
    onStoreRemove: function (ds, records, indexes) {
        var me = this,
            fireItemRemove = me.hasListeners.itemremove,
            i,
            record,
            index;

        if (me.all.getCount()) {
            if (me.store.getCount() === 0) {
                // Refresh so emptyText can be applied if necessary
//                if (fireItemRemove) {
//                    for (i = indexes.length - 1; i >= 0; --i) {
//                        me.fireEvent('itemremove', records[i], indexes[i]);
//                    }
//                }
                me.refresh();
//            } else {
//                // Just remove the elements which corresponds to the removed records
//                // The tpl's full HTML will still be in place.
//                for (i = indexes.length - 1; i >= 0; --i) {
//                    record = records[i];
//                    index = indexes[i];
//                    me.doRemove(record, index);
//                    if (fireItemRemove) {
//                        me.fireEvent('itemremove', record, index);
//                    }
//                }
//                if (me.selModel.refreshOnRemove) {
//                    me.selModel.refresh();
//                }
//                me.updateIndexes(indexes[0]);
            }

            // Ensure layout system knows about new content height
//            this.refreshSize();
        }
    }
});