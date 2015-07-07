Ext.define('gov.va.hmp.admin.MetricsPanel', {
    extend: 'Ext.container.Container',
    autorefreshEnabled : true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'toolbar',
            items: [
                {
                    xtype: 'button',
                    itemId: 'autorefreshToggleButton',
                    enableToggle: true,
                    pressed: true,
                    text: 'Disable Auto-Refresh'
                },
                '->',
                {
                    xtype: 'component',
                    itemId: 'message',
                    tpl: '<tpl if="success"><span class="text-success">{message}</span><tpl else><span class="text-danger">{message}</span></tpl>'
                },
                {
                    xtype: 'button',
                    itemId: 'resetButton',
                    text: 'Reset'
                }
            ]
        },
        {
            xtype: 'tabpanel',
            flex: 1,
            items: [
                {
                    xtype: 'grid',
                    title: 'Timers',
                    viewConfig: {
                        stripeRows: true
                    },
                    autoScroll: true,
                    store: {
                        fields: [
                            'name',
                            {name: 'count', type: 'int'},
                            {name: 'min', type: 'float'},
                            {name: 'max', type: 'float'},
                            {name: 'mean', type: 'float'},
                            {name: 'p50', type: 'float'},
                            {name: 'p75', type: 'float'},
                            {name: 'p95', type: 'float'},
                            {name: 'p98', type: 'float'},
                            {name: 'p99', type: 'float'},
                            {name: 'p999', type: 'float'},
                            {name: 'stddev', type: 'float'},
                            'duration_units',
                            {name: 'mean_rate', type: 'float'},
                            {name: 'm1_rate', type: 'float'},
                            {name: 'm5_rate', type: 'float'},
                            {name: 'm15_rate', type: 'float'},
                            'rate_units'
                        ]
                    },
                    columns: [
                        { text: 'Name', dataIndex: 'name', flex: 1},
                        { text: 'Count', dataIndex: 'count', align: 'right'},
                        { text: 'Min', dataIndex: 'min', xtype: 'numbercolumn', align: 'right', width: 50},
                        { text: 'Max', dataIndex: 'max', xtype: 'numbercolumn', align: 'right', width: 50},
                        { text: 'Mean', dataIndex: 'mean', xtype: 'numbercolumn', align: 'right', width: 50},
                        { text: '50%', dataIndex: 'p50', xtype: 'numbercolumn', align: 'right', width: 50, hidden: true},
                        { text: '75%', dataIndex: 'p75', xtype: 'numbercolumn', align: 'right', width: 50, hidden: true},
                        { text: '95%', dataIndex: 'p95', xtype: 'numbercolumn', align: 'right', width: 50, hidden: true},
                        { text: '98%', dataIndex: 'p98', xtype: 'numbercolumn', align: 'right', width: 50, hidden: true},
                        { text: '99%', dataIndex: 'p99', xtype: 'numbercolumn', align: 'right', width: 50, hidden: true},
                        { text: '99.9%', dataIndex: 'p999', xtype: 'numbercolumn', align: 'right', width: 50, hidden: true},
                        { text: 'Sigma', dataIndex: 'stddev', xtype: 'numbercolumn', align: 'right', width: 50, hidden: true},
                        { text: 'Mean', dataIndex: 'mean', xtype: 'numbercolumn', align: 'right', width: 50},
                        { text: 'Units', dataIndex: 'duration_units'},
                        { text: '1-min', dataIndex: 'm1_rate', xtype: 'numbercolumn', align: 'right', width: 50},
                        { text: '5-min', dataIndex: 'm5_rate', xtype: 'numbercolumn', align: 'right', width: 50},
                        { text: '15-min', dataIndex: 'm15_rate', xtype: 'numbercolumn', align: 'right', width: 50},
                        { text: 'Rate', dataIndex: 'mean_rate', xtype: 'numbercolumn', align: 'right', width: 50},
                        { text: 'Units', dataIndex: 'rate_units'}
                    ]
                },
                {
                    xtype: 'grid',
                    title: 'Meters',
                    viewConfig: {
                        stripeRows: true
                    },
                    autoScroll: true,
                    store: {
                        fields: [
                            'name',
                            {name: 'count', type: 'int'},
                            'units',
                            {name: 'mean_rate', type: 'float'},
                            {name: 'm1_rate', type: 'float'},
                            {name: 'm5_rate', type: 'float'},
                            {name: 'm15_rate', type: 'float'}
                        ]
                    },
                    columns: [
                        { text: 'Name', dataIndex: 'name', flex: 1},
                        { text: 'Count', dataIndex: 'count', align: 'right'},
                        { text: '1-min', dataIndex: 'm1_rate', xtype: 'numbercolumn', align: 'right', width: 50},
                        { text: '5-min', dataIndex: 'm5_rate', xtype: 'numbercolumn', align: 'right', width: 50},
                        { text: '15-min', dataIndex: 'm15_rate', xtype: 'numbercolumn', align: 'right', width: 50},
                        { text: 'Rate', dataIndex: 'mean_rate', xtype: 'numbercolumn', align: 'right', width: 50},
                        { text: 'Units', dataIndex: 'units'}
                    ]
                },
                {
                    xtype: 'grid',
                    title: 'Gauges',
                    viewConfig: {
                        stripeRows: true
                    },
                    autoScroll: true,
                    store: {
                        fields: ['name', 'value']
                    },
                    columns: [
                        { text: 'Name', dataIndex: 'name', flex: 1},
                        { text: 'Value', dataIndex: 'value', align: 'right'}
                    ]
                },
                {
                    xtype: 'grid',
                    title: 'Counters',
                    viewConfig: {
                        stripeRows: true
                    },
                    autoScroll: true,
                    store: {
                        fields: [
                            'name',
                            {name: 'count', type: 'int'}
                        ]
                    },
                    columns: [
                        { text: 'Name', dataIndex: 'name', flex: 1},
                        { text: 'Count', dataIndex: 'count', align: 'right'}
                    ]
                }
            ]
        }
    ],
    initComponent: function () {
        this.callParent(arguments);

        this.store = Ext.create('Ext.data.Store', {
            storeId: 'metricsStore',
            fields: [
                'name'
            ],
            proxy: {
                type: 'ajax',
                url: '/metrics',
                reader: {
                    type: 'json'
                }
            }
        });
    },
    initEvents: function () {
        this.callParent(arguments);

        this.mon(this.down('#autorefreshToggleButton'), 'toggle', this.onToggleAutorefresh, this);
        this.mon(this.down('#resetButton'), 'click', this.onReset, this);
        this.mon(this.store, 'load', this.onLoad, this);
    },
    onToggleAutorefresh:function(btn, pressed) {
        this.autorefreshEnabled = pressed;
        if (this.autorefreshEnabled) {
            btn.setText("Disable Auto-Refresh");
        } else {
            btn.setText("Enable Auto-Refresh");
        }
    },
    onReset:function(btn) {
        var me = this;
        Ext.Ajax.request({
            url: '/metrics/reset',
            method: 'POST',
            callback: function(options, success, response){
                var json = Ext.JSON.decode(response.responseText);
                this.store.load();
                me.down('#message').update({
                    success: success,
                    message: success ? json.data.message : json.error.message
                });
            }
        });
    },
    onLoad: function (store, records, successful) {
//        console.log("metrics loaded");
        var data = records[0].raw,
            gauges = data.gauges,
            counters = data.counters,
            meters = data.meters,
            timers = data.timers,
            gaugeStore = this.down('grid[title=Gauges]').getStore(),
            counterStore = this.down('grid[title=Counters]').getStore(),
            meterStore = this.down('grid[title=Meters]').getStore(),
            timerStore = this.down('grid[title=Timers]').getStore();

        for (var gaugeName in gauges) {
            gauges[gaugeName].name = gaugeName;
        }
        gauges = Ext.Object.getValues(gauges);
        gaugeStore.loadData(gauges);

        for (var counterName in counters) {
            counters[counterName].name = counterName;
        }
        counters = Ext.Object.getValues(counters);
        counterStore.loadData(counters);

        for (var meterName in meters) {
            meters[meterName].name = meterName;
        }
        meters = Ext.Object.getValues(meters);
        meterStore.loadData(meters);

        for (var timerName in timers) {
            timers[timerName].name = timerName;
        }
        timers = Ext.Object.getValues(timers);
        timerStore.loadData(timers);

    },
    autorefresh: function() {
        if (this.autorefreshEnabled) {
            this.store.load();
        }
    }
});