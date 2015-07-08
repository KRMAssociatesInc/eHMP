/**
 * An internally used Grid for {@link gov.va.hmp.ux.InfiniteComboBox InfiniteComboBox}.
 */
Ext.define("gov.va.hmp.ux.InfiniteBoundList", {
    extend: 'Ext.grid.Panel',
    alias: 'widget.infiniteboundlist',
    baseCls: Ext.baseCSSPrefix + 'infiniteboundlist',
    floating: true,
    hidden: true,
    focusOnToFront: false,
    header:false,
    hideHeaders: true,
    sortableColumns: false,
    enableColumnMove: false,
    rowLines: true,
    plugins: 'bufferedrenderer',
    viewConfig: {
        stripeRows: false
    },
    selModel: {
        pruneRemoved: false
    },
    beforeRender: function() {
        var me = this;

        me.callParent(arguments);

        // If there's a Menu among our ancestors, then add the menu class.
        // This is so that the MenuManager does not see a mousedown in this Component as a document mousedown, outside the Menu
        if (me.up('menu')) {
            me.addCls(Ext.baseCSSPrefix + 'menu');
        }
    },
    /**
     * @private
     * InfiniteBoundlist-specific implementation of the getBubbleTarget used by {@link Ext.AbstractComponent#up} method.
     * This links to the owning input field so that the FocusManager, when receiving notification of a hide event,
     * can find a focusable parent.
     */
    getBubbleTarget: function() {
        return this.pickerField;
    },
//    listeners: {
//        show: function() {
//            console.log("on show");
//        },
//        hide: function() {
//            console.log("on hide");
//        },
//        blur: function() {
//            console.log("on blur");
//        },
//        focus: function() {
//            console.log("on focus");
//        }
//    }
});