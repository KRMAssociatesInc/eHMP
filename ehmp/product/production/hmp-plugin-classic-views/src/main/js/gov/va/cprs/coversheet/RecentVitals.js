Ext.define('gov.va.cprs.coversheet.RecentVitals', {
    extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
    title: 'Vitals',
    hideHeaders: true,
    frame: true,
    viewID: 'gov.va.cprs.ClassicLastVitalsViewDef',
    detailType: 'window',
    detailTitleTpl: '{[PointInTime.format(values.observed)]} {summary}',
    detail: {
        width: 600,
        height: 400
    },
    columns: [
        {text: 'Type', dataIndex: 'displayName', width: 40},
        {text: 'Result', xtype: 'templatecolumn', width: 70, tpl: '{result}<tpl if="metricResult">&nbsp;{units}</tpl>'},
        {text: 'Date/Time', dataIndex: 'observed', xtype: 'healthtimecolumn', width: 120},
        {text: 'Metric Result', xtype: 'templatecolumn', width: 80, tpl: '<tpl if="metricResult">({metricResult}&nbsp;{metricUnits})</tpl>'},
        {text: 'Spacer', flex: 1}
    ]
});