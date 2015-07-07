Ext.define('gov.va.cprs.DischargeSummaries', {
    extend: 'Ext.container.Container',
    requires: [
        'gov.va.cpe.viewdef.HealthTimeColumn',
        'gov.va.cpe.viewdef.FacilityColumn',
        'gov.va.hmp.ux.UnderConstruction'
    ],
    title: 'D/C Summaries',
    height: '100%',
    layout: {type: 'vbox', align: 'stretch'},
    items: [
        {
        	xtype: 'viewdefgridpanel',
            flex: 1,
            viewID: 'gov.va.cprs.CprsClassicDischargeSummaryViewDef',
            addFilterTool: true,
            title: 'Discharge Summaries',
            detailTitleTpl: '{localTitle}',
            detailType: 'right',
            detail: {
            	width: 400
            },
            columns: [
                {text: 'Date/Time', xtype: 'healthtimecolumn', dataIndex: 'dateTime'},
                {text:'Title', flex: 1, dataIndex:'summary'},
                {text: 'Author', dataIndex: 'authorDisplayName'},
                {xtype: 'facilitycolumn'}
            ]
        }
    ]
});