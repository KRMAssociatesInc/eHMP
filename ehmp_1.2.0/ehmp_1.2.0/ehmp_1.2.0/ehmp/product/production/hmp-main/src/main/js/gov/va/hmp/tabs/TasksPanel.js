Ext.define('gov.va.hmp.tabs.TasksPanel',{
	extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
	requires: [
        'gov.va.cpe.TaskEditPanel',
        'gov.va.cpe.viewdef.FacilityColumn'
    ],
	alias: 'widget.taskspanel',
    title: "Tasks",
    titleTpl: 'Tasks',
    viewID: 'gov.va.cpe.vpr.queryeng.TasksViewDef',
    detailType: 'rowbody',
    selectedIdx: null,
    detail: {
    	xtype: 'taskeditpanel',
    	skipLoader: true
    },
    // uses 'listeners:' and not 'me.on()' to make sure TasksPanel.selcheckFn() only get called when de-selection actually occurs
    listeners: {
      beforedeselect: function(grid, rec, idx, eOpts) {
          return this.onBeforeDeSelect(grid, rec, idx, eOpts);
      },
      beforeitemclick: function(grid, rec, item, idx, e, eOpts) {
        return this.onBeforeItemClick(grid, rec, item, idx, e, eOpts);
      },
      selectionchange: function(model, sel, eOpts) {
        this.onSelectionChange(model, sel, eOpts);
      }
    },
    plugins: ['bufferedrenderer'],
    columns: [
        {dataIndex: "taskName", text: "Task", flex: 5, hideable: false},
        {dataIndex: "createdByName", text: "Created By", hideable: false},
        {dataIndex: "claimedByName", text: "Claimed By", hideable: false},
        {
            xtype: "templatecolumn",
            text: "Due By",
            flex: 2,
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
        },
//        {dataIndex: "completed",  text: "Done", width: 40, sortable: false, groupable: false, hideable: false,
//        	editOpt: {fieldName: "completed", dataType: "boolean"}
//        },
        { xtype: 'facilitycolumn', sortable: false, groupable: false }
    ],
    // store needs to be non-buffered in order to have groupBy functionality to work properly
    viewParams: {
        filter_incomplete: true
    },
    /**
    * @method
    * Upon row deselect, check if task has changed w/o being saved. If ask/warn user.
    */
    onBeforeDeSelect: function(grid, rec, idx, eOpts) {
        var me = this,
            tep = me.detailCmp;
        if (!tep.isTepDirty()) {
            return true;
        }
        Ext.Msg.show({
            title: 'Task data has changed!',
            icon: Ext.Msg.WARNING,
            msg: 'Are you sure want to continue without saving changes?',
            buttons: Ext.Msg.YESNO,
            fn: function(btn) {
                if (btn === 'yes') {
                    tep.finishCancel(me, rec);
                    if (idx !== me.selectedIdx) {
                        me.getSelectionModel().select(me.selectedIdx);
                    } else {
                        me.selectedIdx = null;
                        me.getView().focusRow(idx);
                    }
                } else {
                    // clear saved index if user decides not to go to selected row
                    me.selectedIdx = null;                    
                }

            }
        });
        return false;
    },
    /**
    * @method
    * Save idx for possible use in onBeforeDeSelect in order to select correct row
    */
    onBeforeItemClick: function(grid, rec, item, idx, e, eOpts) {
        this.selectedIdx = idx;
        return true;
    },
    /**
    * @method
    * Clear saved idx from onBeforeItemClick after select complete
    */
    onSelectionChange: function(model, sel, eOpts) {
        this.selectedIdx = null;
    },
    hideRowBody: function(rec) {
        var me = this;
        if (rec !== undefined) {
            var node = Ext.get(me.getView().getNode(rec));
            var rowbody = node.next('.x-grid-rowbody-tr');
            rowbody.addCls('x-grid-row-body-hidden');
        }
    },
    deSelectSelection: function() {
        var me = this,
            selModel = me.getSelectionModel();
        selModel.deselect(selModel.getSelection(), true);
    },
    /**
     * @method
     * <hackery> to avoid clicking on SVG causing a row select / deselect event.
     * Copied for ViewDefGridPanel inline function.
     */
    selcheckFn: function(){
        var me = this;
        me.skipSel = false;   // Reset the skip flag (in case of programmatic selection events later)
    }
});