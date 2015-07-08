Ext.define('gov.va.cpe.order.MedOrderButton', {
    extend: 'gov.va.hmp.ux.PopUpButton',
    requires: [
        'gov.va.cpe.order.OrderingPanel'
    ],
    alias: 'widget.medorderbutton',
    ui: 'link',
    text: 'New Order',
    popUp: {
        width: 400,
        height: 600,
        xtype: 'orderingpanel'
    },
    popUpButtons: [
        {
            xtype: 'button',
            text: 'Cancel',
            itemId: "cancelOrderBtn",
            handler: function (btn) {
                var menu = btn.up('menu');
                menu.hide();
            }
        },
        {
            xtype: 'button',
            text: 'Place Order',
            itemId: "placeOrder",
            handler: function (btn) {
                var menu = btn.up('menu');
                if (btn.text == 'Place Order') {
                    menu.down('orderingpanel').placeOrder(function() {
//                    menu.hide();
                    });
                } else {menu.hide()}
            }
        }
    ],
    // @private
    onMenuShow: function(e) {
        var me = this;
        me.callParent(arguments);
        me.menu.down('orderingpanel').reset();
    },
    onBeforeRender:function() {
        this.callParent(arguments);

        var userInfo = gov.va.hmp.UserContext.getUserInfo();
        var productionAccount = userInfo.attributes.productionAccount;
        if (!productionAccount) {
            this.setDisabled(false);
        } else {
            this.setDisabled(true);
        }
    }
});