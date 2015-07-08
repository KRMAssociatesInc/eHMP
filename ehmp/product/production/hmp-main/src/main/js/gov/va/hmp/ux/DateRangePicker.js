Ext.define('gov.va.hmp.ux.DateRangePicker', {
    extend: 'gov.va.hmp.ux.SegmentedButton',
    alias: 'widget.daterangepicker',
    ui: 'pill',
    scale: 'extra-small',
    allowDepress: true,
    items: [
        {text: '1d', dateRangeExp: 'T-1'},
        {text: '1w', dateRangeExp: 'T-8'},
        {text: '1m', dateRangeExp: 'T-31'},
        {text: '3m', dateRangeExp: 'T-183'},
        {text: '6m', dateRangeExp: 'T-183'},
        {text: '1y', dateRangeExp: 'T-366'},
        {text: '2y', dateRangeExp: 'T-732'},
        {text: 'All', dateRangeExp: 'T-50000', pressed: true}
    ],
    initComponent: function () {
        this.callParent(arguments);

        this.addEvents(
            /**
             * @event select
             * Fires when a date range is selected.
             * @param {gov.va.hmp.ux.DateRangePicker} btn This picker
             * @param {String} dateRangeExp The selected date range expression ("T-6m", for example)
             */
            'select'
        );
    },
    initEvents: function () {
        var me = this;
        me.callParent(arguments);
        me.mon(me, 'toggle', me.onToggle, me);
    },
    /** @private */
    onToggle: function (cmp, btn, pressed) {
        if (!pressed) return;
        this.fireEvent('select', this, btn.dateRangeExp);
    }
});