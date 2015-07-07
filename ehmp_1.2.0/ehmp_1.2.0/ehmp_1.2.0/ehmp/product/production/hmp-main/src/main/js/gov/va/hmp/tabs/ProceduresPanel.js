Ext.define('gov.va.hmp.tabs.ProceduresPanel', {
	requires: [
        'gov.va.cpe.viewdef.ViewDefGridPanel',
        'gov.va.hmp.healthtime.PointInTime'
    ],
	extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
	alias: 'widget.procedurespanel',
    title: "Procedures",
    titleTpl: 'Procedures ({total})',
    detailTitleTpl: '{[PointInTime.format(values.DateTime)]}: {Summary}',
    viewID: 'gov.va.cpe.vpr.queryeng.ProceduresViewDef',
    detailType: 'right',
    // TODO: Replace this with the automatic AutoFilterToolbar
    tbar: [
        {
            xtype: 'cycle',
            showText: true,
            prependText: 'Record Filter: ',
            menu: {items: [
                {text: 'None', value: '', checked: true},
                {text: 'Procedures', value: 'Procedure'},
                {text: 'Imaging', value: 'Imaging'},
                {text: 'Consults', value: 'Consult'}
            ]},
            changeHandler: function (btn, activeItem) {
                var grid = this.up('viewdefgridpanel');
                var vals = {'filter_kind': activeItem.value};
                grid.setViewDef(grid.curViewID, Ext.apply(grid.curViewParams, vals));
            }
        }
    ]
});