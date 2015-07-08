Ext.define('gov.va.cpe.TaskBoard', {
    extend: 'gov.va.hmp.tabs.TasksPanel',
    alias: 'widget.taskboard',
    viewID: 'gov.va.cpe.vpr.queryeng.TaskBoardViewDef',
    patientAware: false,
    header: false,
    // store needs to be non-buffered in order to have groupBy functionality to work properly
    bufferedStore: false,
    onDomainChange: function (event) {
        var me = this,
        domain = event.domainChange,
        args = [me, pid];

	    setTimeout(function () {
	        if (me.getPlugin("CellEditor").editing) {
	            // put the store load in a delayedtask so we dont interrupt current user action
	            Ext.create('Ext.util.DelayedTask', me.onDomainChange(event))
	        } else {
	            if (!me.getStore().isLoading()) {
	                me.getStore().load();
	            }
	        }
	    }, 5000, args);
    },
    onViewDefUpdate: function(msg) {
        var viewId = msg['viewdef.id'];
        if (this.viewID != viewId) return;

        var me = this;
        var store = this.getStore();
		var pid = msg['pid'], uid = msg['uid'], type = msg['type'];
//		console.log("ViewDefGridPanel.onViewDefUpdate", pid, this.pid, uid, type);
		if (!uid || !type || !pid) return; // missing data
		if (type != 'ViewDefRefreshAction' && type != 'ViewDefUpdateAction') return; // unknown type
//		if (pid != this.pid) return; // not the current patient
		if (store.isLoading()) return; // store already loading

		// refresh the viewdef
        if (type == 'ViewDefRefreshAction') {
            this.viewDefRefreshActionHandler(uid);
        }
        else if (type == 'ViewDefUpdateAction') {
            this.viewDefUpdateActionHandler(uid);
        }

	},
    /**
     * @method
     * Inserts a new column at the beginning of TasksPanel grid to display patient name
     * associated with task. However, so that new column only displays on this board, the
     * column is initialized to be 'hidden'. The column is then made visible here after
     * being initialized by the callParent method.
     */
    initComponent: function() {
        Ext.Array.insert(this.columns, 0, [{flex: 2,
                                            dataIndex: 'displayName',
                                            text: 'Patient',
                                            hideable: false,
                                            hidden: true,
                                            itemId: "ptCol"
                                           }]);
        this.callParent(arguments);
        // change patient column so it is visible
        this.down("#ptCol").hidden=false;
    }

});