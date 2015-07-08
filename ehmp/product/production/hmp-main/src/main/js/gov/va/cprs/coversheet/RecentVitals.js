Ext.define('gov.va.cprs.coversheet.RecentVitals', {
    extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
    title: 'Vitals',
    hideHeaders: true,
//    frame: true,
    viewID: 'gov.va.cprs.ClassicLastVitalsViewDef',
    detailType: 'window',
    detailTitleTpl: '{[PointInTime.format(values.observed)]} {summary}',
    detail: {
        width: 640,
        height: 480
    },
    columns: [
        {text: 'Type', xtype: 'templatecolumn', width: 26, align:'right', tpl: '<span class="text-muted text-right">{displayName}</span>'},
        {text: 'Result', xtype: 'templatecolumn', minWidth: 74, flex: 1, tpl: '{result}&nbsp;<span class="text-muted">{units}</span>'},
        {text: 'Date/Time', dataIndex: 'observed', xtype: 'healthtimecolumn', width: 124},
        {text: 'Metric Result', xtype: 'templatecolumn', width: 80, tpl: '<tpl if="metricResult">({metricResult}&nbsp;<span class="text-muted">{metricUnits}</span>)</tpl>'},
    ]
});