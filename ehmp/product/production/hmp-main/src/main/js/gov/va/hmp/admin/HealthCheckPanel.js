Ext.define('gov.va.hmp.admin.HealthCheckPanel', {
    extend: 'Ext.panel.Panel',
    title: 'Health Checks',
//    layout: {
//        type: 'vbox',
//        align: 'stretch'
//    },
    items: [
        {
            xtype: 'dataview',
            store: Ext.create('Ext.data.Store', {
                storeId: 'healthChecksStore',
                fields: [
                    {name:'name', type: 'string'},
                    {name:'healthy', type: 'boolean', convert: function(v, record) {
                        return new Boolean(record.raw.health.healthy);
                    }},
                    {name: 'errorMessage', type: 'string', convert: function(v, record) {
                        if (Ext.isDefined(record.raw.health.error) && Ext.isDefined(record.raw.health.error.message)) {
                            return record.raw.health.error.message;
                        } else {
                            return null;
                        }
                    }},
                    {name: 'vistaName', type: 'string', convert: function(v, record) {
                        if (Ext.isDefined(record.raw.vista)) {
                            return record.raw.vista.name;
                        } else {
                            return null;
                        }
                    }},
                    {name: 'vistaId', type: 'string', convert: function(v, record) {
                        if (Ext.isDefined(record.raw.vista)) {
                            return record.raw.vista.vistaId;
                        } else {
                            return null;
                        }
                    }},
                ],
                proxy: {
                    type: 'ajax',
                    url: '/health',
                    reader: {
                        type: 'json',
                        root: 'data.items'
                    }
                }
            }),
            tpl: '<table><tpl for=".">' +
                '<tr>' +
                    '<td style="text-align: right; white-space: nowrap"><tpl if="vistaName"><span class="label label-info">VistA</span> <span class="text-muted">{vistaId}</span> {vistaName}<tpl else>{name}</tpl></td>' +
                    '<td style="font-size: 20px"><tpl if="healthy == true"><i class="fa fa-check-circle text-success"/><tpl else><i class="fa fa-exclamation-circle text-danger"/></tpl></td>' +
                    '<td><tpl if="healthy == false"><span class="text-danger">{errorMessage}</span></tpl></td>' +
                '</tr>' +
                '</tpl></table>',
            itemSelector: 'tr',
            emptyText: 'No Health Checks Configured.'
        }
    ],
//    initComponent: function () {
//        this.callParent(arguments);
//    },
    onBoxReady: function () {
        this.callParent(arguments);

        this.down('dataview').getStore().load();
    }
});