Ext.define('gov.va.hmp.config.LayoutPicker', {
    extend: 'Ext.container.Container',
    requires: [
        'gov.va.hmp.config.NumberOfColumnsButton'
    ],
    alias: 'widget.layoutpicker',
    layout: {
        type: 'hbox',
        defaultMargins: {
            right: 2,
            left: 2
        }
    },
    items: [
        {
            xtype: 'numcolumnsbutton',
            num: 1
        },
        {
            xtype: 'numcolumnsbutton',
            pressed: true,
            num: 2
        },
        {
            xtype: 'numcolumnsbutton',
            num: 3
        },
        {
            xtype: 'numcolumnsbutton',
            num: 4
        }
    ],
    initComponent: function(){
        this.callParent(arguments);
        this.addEvents([
        /**
         * @event select
         * Fires when a layout is selected
         * @param {gov.va.hmp.config.LayoutPicker} this
         * @param {Integer} numColumns The number of columns selected.
         */
            'select'
        ])
    },
    // @private
    onBoxReady: function(){
        this.callParent(arguments);
        var buttons = this.query('numcolumnsbutton');
        for (var i = 0; i < buttons.length; i++) {
            this.mon(buttons[i], 'toggle', this.onButtonToggle, this);
        }
    },
    // @private
    onButtonToggle: function(btn, pressed) {
        if (!pressed) return;
        this.fireEvent('select', this, btn.num);
    }
});