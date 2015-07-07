Ext.define('gov.va.cpe.coversheet.Tasks', {
    extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
    ui: 'underlined-title-condensed',
    title: 'Tasks',
    viewID: 'gov.va.cpe.vpr.queryeng.TasksViewDef',
    emptyText: 'No tasks found',
    rowLines: false,
    hideHeaders: true,
    bufferedStore: false,
    detailType: 'window',
    detailTitleField: 'taskName',
    detail: {
        width: 600,
        height: 400
    },
    columns: [
        {dataIndex: "taskName", text: "Task", flex: 1, hideable: false},
        {
            xtype: "templatecolumn",
            text: "Due By",
            minWidth: 160,
            sortable: true,
            groupable: false,
            hideable: false,
            dataIndex: "dueDate",
            tpl: new Ext.XTemplate('<tpl if="this.isPastDue(dueDate)"><span class="label label-danger">Past Due</span></tpl>' +
                '<tpl if="this.isDueToday(dueDate)"><span class="label label-warning">Due Today</span></tpl>' +
                ' {[PointInTime.format(values.dueDate)]}',{
                disableFormats: true,
                // member functions:
                isPastDue: function(dueDate){
                    var now = Ext.Date.format(new Date(), Ext.Date.patterns.HL7Date);
                    return dueDate < now;
                },
                isDueToday: function(dueDate) {
                    var now = Ext.Date.format(new Date(), Ext.Date.patterns.HL7Date);
                    return dueDate === now;
                }
            })
        }
    ]
});