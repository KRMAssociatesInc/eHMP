Ext.define('gov.va.cprs.Consults', {
    extend: 'Ext.container.Container',
    requires: [
        'gov.va.cpe.viewdef.HealthTimeColumn',
        'gov.va.cpe.viewdef.FacilityColumn',
        'gov.va.hmp.ux.UnderConstruction'
    ],
    alias: 'widget.classicconsultstab',
    title: 'Consults',
    height: '100%',
    layout: {type: 'vbox', align: 'stretch'},
    items: [
        {
        	xtype: 'viewdefgridpanel',
            viewID: 'gov.va.cprs.CprsClassicConsultsViewDef',
            addFilterTool: true,
            title: 'Consults',
            detailTitleTpl: '{localTitle}',
            detailType: 'right',
            detail: {
                flex: 1,
            	width: 400
            },
            columns: [
                {text: 'Date/Time', xtype: 'healthtimecolumn', dataIndex: 'dateTime'},
                {text:'Title', flex: 1, dataIndex:'summary'},
                {text: 'Provider', dataIndex: 'providerDisplayName'},
                {xtype: 'facilitycolumn'}
            ]
        }
    ]
});