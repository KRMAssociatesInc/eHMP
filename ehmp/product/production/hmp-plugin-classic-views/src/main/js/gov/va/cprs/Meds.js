Ext.define('gov.va.cprs.Meds', {
    extend: 'Ext.container.Container',
    requires: [
        'gov.va.cpe.viewdef.HealthTimeColumn',
        'gov.va.cpe.viewdef.FacilityColumn',
        'gov.va.cpe.viewdef.ViewDefGridPanel'
    ],
    title: 'Meds',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'viewdefgridpanel',
            flex:1,
            viewID: 'gov.va.cpe.vpr.queryeng.MedsViewDef',
            viewParams: {
                filter_kind: 'O'
            },
            emptyText: 'No Outpatient Medications found',
            columns:[
                { text: "Action", width: 46 },
                { text:'Outpatient Medications', dataIndex:'summary', flex: 1 },
                { xtype: 'healthtimecolumn', text:'Expires', dataIndex:'expires',width:120},
                { text:'Status', dataIndex:'vaStatus',width:120},
                { xtype: 'healthtimecolumn', text:'Last Filled', dataIndex:'lastFilled',width:120},
                { text:'Refills', dataIndex:'refills'},
                {xtype: 'facilitycolumn'}
            ]
        },
        {
            xtype: 'viewdefgridpanel',
            flex:1,
            viewID: 'gov.va.cpe.vpr.queryeng.MedsViewDef',
            viewParams: {
                filter_kind: 'N'
            },
            emptyText: 'No Non-VA Medications found',
            columns: [
                { text: "Action", width: 46 },
                { text:'Non-VA Medications', dataIndex:'summary', flex: 1 },
                { xtype: 'healthtimecolumn', text:'Start Date', dataIndex:'overallStart', width:120},
                { text:'Status', dataIndex:'medStatusName'},
                {xtype: 'facilitycolumn'}
            ]
        },
        {
            xtype: 'viewdefgridpanel',
            flex:1,
            viewID: 'gov.va.cpe.vpr.queryeng.MedsViewDef',
            viewParams: {
                filter_kind: 'I'
            },
            emptyText: 'No Inpatient Medications found',
            columns: [
                { text: "Action", width: 46 },
                { text:'Inpatient Medications', dataIndex:'summary', flex: 1 },
                { xtype: 'healthtimecolumn', text:'Stop Date', dataIndex:'overallStop', width:120},
                { text:'Status', dataIndex:'vaStatus', width:120},
                { text:'Location', dataIndex:'location'},
                {xtype: 'facilitycolumn'}
            ]
        }
    ]
});