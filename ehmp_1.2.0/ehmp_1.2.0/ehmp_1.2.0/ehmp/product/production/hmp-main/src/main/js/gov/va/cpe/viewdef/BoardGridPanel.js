Ext.define('gov.va.cpe.viewdef.BoardGridPanel', {
	extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
	requires: [
        'gov.va.hmp.EventBus',
        'gov.va.cpe.viewdef.ViewDefGridPanel',
        'gov.va.cpe.roster.RosterContext',
        'gov.va.cpe.multi.BoardContext'
    ],
	alias: 'widget.boardgridpanel',
    proxyBaseUrl: '/vpr/board/',
    header: false,
    forceFit: true,
    patientAware: false,
    selType: 'rowmodel',
    scroll: false,
    reconfigureColumnsAlways: true,
    config: {
        rosterUid: null,
        boardUid: null
    },
    initComponent:function() {
        this.callParent(arguments);

        this.setBoardUid(gov.va.cpe.multi.BoardContext.getCurrentBoardUid());
        this.setRosterUid(gov.va.cpe.roster.RosterContext.getCurrentRosterUid());
    },
    initEvents:function() {
        var me = this;
        me.callParent(arguments);

        me.mon(gov.va.cpe.roster.RosterContext, 'rostercontextchange', me.onRosterContextChange, me);
        me.mon(gov.va.cpe.multi.BoardContext, 'boardcontextchange', me.onBoardContextChange, me);
    },
    // private
    onBoxReady:function() {
        this.callParent(arguments);

        gov.va.hmp.EventBus.on('syncStatusChange', this.onSyncStatusChange, this);
        gov.va.hmp.EventBus.on('domainChange', this.onDataChange, this);
    },
    // private
    onDestroy: function() {
        gov.va.hmp.EventBus.un('syncStatusChange', this.onSyncStatusChange, this);
        gov.va.hmp.EventBus.un('domainChange', this.onDataChange, this);

        this.callParent(arguments);
    },
    onBoardContextChange: function(board, oldBoard) {
        this.setBoard(board);
    },
    onRosterContextChange: function(roster, oldRoster) {
        this.setRoster(roster);
    },
	requestOnBoardId: function(reqId) {
		var me = this;
		me.boardReqId = reqId;
		var boardReqId = reqId;
    	Ext.Ajax.request({
    		url: "/vpr/board/deferred/"+boardReqId,
    		method: 'GET',
    		success: function(resp) {
    			var json = Ext.decode(resp.responseText);
    			if(json.tasks && json.tasks.length>0) {
    				for(idx in json.tasks) {
    					var task = json.tasks[idx];
    					if(task.data && task.pid) {
    						// Ugly but functional. GridAdvisor used to do this and there's no way to refactor it in the next hour or two.
    						// This is when we have an object response, but we really only want one value out of it for a simple text field.
    						// Rendering specific fields out of objects is easy, but when the editor gets the value and needs to understand the object, it gets uglier.
    						var coldex = task.dataIndex;
    						var fld = null;
    						var setVal = task.data;
    						var srcJson = task.data;
    						for(cidx in me.gridAdvisor.gridColMetaData.columns) {
    							var col = me.gridAdvisor.gridColMetaData.columns[cidx];
    							if(col.deferred && col.deferred.fieldDataIndex && col.dataIndex==coldex && !col.deferred.fieldDataIndex=="") {
    								setVal = setVal[col.deferred.fieldDataIndex];
    							}
    						}
            				var rec = me.getStore().getAt(me.getStore().find("pid",task.pid,0,false,false,true));
            				if(rec && task.dataIndex) {
            					rec.set(task.dataIndex, setVal);
            					if(!rec.srcJson) {rec.srcJson = {};}
            					rec.srcJson[coldex]=task.data;
            				} else {
            					console.log("Error finding record or data index. Rec: "+rec+"; idx: "+task.dataIndex);
            				}
            			}
    				}
    			}
    			if(json.butWaitTheresMore) {
    				var task = new Ext.util.DelayedTask(function(){
        				me.requestOnBoardId(me.boardReqId);
					});
					task.delay(1000);
    			}
    		},
    		failure: function(resp) {
    			
    		}
    	})
	},
    // private
    onSyncStatusChange: function(event) {
        for(var key in event) {
            var patientUpdate = event[key];
            var pid = patientUpdate.pid;
            var dfn = patientUpdate.dfn;
            var qty = patientUpdate.size;
            var total = patientUpdate.total;
            var record = this.getStore().findRecord('pid',pid);
            var knowed = this.getView().getNode(record);
            // Get or show superimposed HTML element and update with status.
            // Or, remove any such HTML element when the sync is complete.
//            console.log(knowed);
        }

    },
    // private
	onDataChange: function(event) {
        var me = this,
            pid = event.pid,
            domain = event.domain,
            indices = [];

		if(me.gridAdvisor && me.gridAdvisor.gridColMetaData && me.gridAdvisor.gridColMetaData.columns) {
			for(var cidx in me.gridAdvisor.gridColMetaData.columns) {
				var col = me.gridAdvisor.gridColMetaData.columns[cidx];
				if(col.deferred && col.deferred.domainClasses && col.deferred.domainClasses.length>0) {
					for(var dcdex in col.deferred.domainClasses) {
						if(col.deferred.domainClasses[dcdex]==domain) {
							indices.push(col.deferred.sequence);
						}
					}
				}
			}
		}
		if(me.getStore()) {
			var recordIndex = me.getStore().find("pid",pid);
			if(indices.length>0 && recordIndex>-1) {
				Ext.Ajax.request({
					url: "/vpr/board/reload/"+me.boardReqId,
					method: 'GET',
					params: {
						columns: indices,
						pid: pid
					},
					success: function(resp) {
						/*
						 * Funnels back into the same state of "we are expecting column data"
						 */
		    			me.requestOnBoardId(me.boardReqId);
		    		},
		    		failure: function(resp) {
		    			// TODO: handle error response here
		    		}
				})
			}
		}
	},
    /**
     * Called by Sencha Class system by setRosterUid()
     * @private
     * @see "http://www.sencha.com/learn/sencha-class-system"
     */
    updateRosterUid: function (newRosterUid, oldRosterUid) {
//        console.log("new rosterUid: " + newRosterUid);
        if (newRosterUid === oldRosterUid) return;
        this.reload();
    },
    /**
     * Called by Sencha Class system by setBoardUid()
     * @private
     * @see "http://www.sencha.com/learn/sencha-class-system"
     */
    updateBoardUid: function (newBoardUid, oldBoardUid) {
//        console.log("new boardUid: " + newBoardUid);
        if (newBoardUid === oldBoardUid) return;
        this.reload();
    },
    setRoster: function(roster) {
        var me = this;
        if (!roster) return;
        me.setRosterUid(roster.getId());
    },
    setBoard: function(board) {
        var me = this;
        if (!board) return;
        me.setBoardUid(board.getId());
    },
    // private
    reload: function() {
        var me = this,
            boardUid = this.getBoardUid(),
            rosterUid = this.getRosterUid();
        if (rosterUid && boardUid) {
            Ext.suspendLayouts();
            this.setViewDef(this.getBoardUid(),{'roster.uid': this.getRosterUid()});
            Ext.resumeLayouts(true);
        }
    }
});