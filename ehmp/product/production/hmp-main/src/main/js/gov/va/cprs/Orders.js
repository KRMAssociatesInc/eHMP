Ext.define('gov.va.cprs.Orders', {
    extend: 'Ext.container.Container',
    requires: [
        'gov.va.cpe.viewdef.HealthTimeColumn',
        'gov.va.cpe.viewdef.FacilityColumn',
        'gov.va.hmp.ux.UnderConstruction'
    ],
    alias: 'widget.classicorderstab',
    title: 'Orders',
    layout: {type: 'vbox', align: 'stretch'},
    items: [
        {
        	xtype: 'viewdefgridpanel',
            flex: 1,
            viewID: 'gov.va.cprs.CprsClassicOrdersViewDef',
            addFilterTool: true,
            title: 'Orders',
            detailTitleTpl: '{localTitle}',
            detailType: 'right',
            detail: {
            	width: 400
            },
            columns: [
                {text: 'Order', flex: 1, dataIndex: 'summary', minWidth: 125 },
//                {text: 'Group', dataIndex: 'displayGroup'},
                {text: 'Status', dataIndex: 'statusName', width: 50},
                {text: 'V.Nurse', dataIndex: 'nurseVerify', hidden: true},
                {text: 'V.Clerk', dataIndex: 'clerkVerify', hidden: true},
                {text: 'Ordering Provider', dataIndex: 'providerDisplayName', width: 125},
                {xtype: 'healthtimecolumn', text: 'Start Date', dataIndex: 'start', width: 75},
                {xtype: 'healthtimecolumn', text: 'Stop Date', dataIndex: 'stop', width: 75},
                {text: 'Location', dataIndex: 'locationName'},
                {xtype:'facilitycolumn'}
            ]
        }
    ]
});