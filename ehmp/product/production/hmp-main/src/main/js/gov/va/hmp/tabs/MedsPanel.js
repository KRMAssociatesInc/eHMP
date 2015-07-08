Ext.define('gov.va.hmp.tabs.MedsPanel', {
	extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
	requires: [
        'gov.va.hmp.ux.SegmentedButton',
        'gov.va.cpe.viewdef.RowActionColumn',
        'gov.va.cpe.viewdef.SparklineColumn',
        'gov.va.cpe.PatEdWin'
    ],
	alias: 'widget.medspanel',
    title: 'Meds Review',
    viewID: 'gov.va.cpe.vpr.queryeng.MedHistViewDef',
    viewParams: {group: 'groupName', filter_current: true},
    hideHeaders: true,
    detailType: 'rowbody',
    detailTitleField: 'name',
    detail: {actionDock: 'left', smartHeight: false, minHeight: 225, bodyPadding: '0 5 0 5', collapsible: false, collapsed: false},
    autoSelectSingleRow: true, // auto expand if only 1 row
    columns: [
   		{xtype: 'rowactioncolumn', dataIndex: "rowactions", showTooltip: false, width: 20},
	    {
	    	xtype: 'templatecolumn', 
	    	width: 262,
	    	text: 'Medication', 
	    	sortable: false, groupable: false, hidable: false, 
	    	tpl: "<strong style='text-overflow: ellipsis;' title='{name}'>{name}</strong><br/><div>{tagline}</div>"
	    },
	    
	    {
	    	xtype: 'templatecolumn', 
	    	width: 150, 
	    	text: 'Current Dose', 
	    	sortable: false, 
	    	groupable: false, 
	    	hidable: false, 
	    	tpl: [
	    	     "<b title='{doseStrTitle}'>{doseStr}</b>",
	    	     "<br/><tpl if='dailyDose'><span class='text-muted'>{dailyDosePrefix}</span> {dailyDose} {dailyDoseUnits}<tpl else>&nbsp;</tpl>",
	    	     "{doseScheduleStr}"
	        ]
	    },
		{dataIndex: "status", text: "Status / Action Date", width: 160, sortable: false, groupable: false, hideable: false},
		{xtype: "sparklinecolumn", dataIndex: "svg", text: "Dose/Fill Hx", width: 210, sortable: false, groupable: false, hideable: false}                   
    ],
    tbarConfig: [
          'Sort',
          {
              xtype: 'segmentedbutton',
              ui: 'pill',
              allowDepress: true,
              items: [
                  {
                      text: 'Status',
                      viewParams: {group: 'groupName', sort: 'type'},
                      tooltip: 'Sort by status',
                      tooltipType: 'title',
                	  pressed: true
                  },
                  {
                      text: 'A-Z',
                      viewParams: {group: 'groupName', sort: 'az'},
                      tooltip: 'Sort alphabetically (A-Z)',
                      tooltipType: 'title'
                  }
              ]
          },
          '','-','',
          'Filters',
          {
              xtype: 'segmentedbutton',
              ui: 'pill',
              allowDepress: true,
              items: [
                  {
                      text: 'Recent Meds',
                      viewParams: {filter_current: true},
                      tooltip: 'include following status: active, pending, hold, suspend, recently expired and recently discontinued medications where ' +
                          'recently expired and discontinued is within the last 120 days',
                      tooltipType: 'title',
                      pressed: true
                  },
                  {
                      text: 'All Meds',
                      viewParams: {filter_current: false},
                      tooltip: 'Show both active and inactive medications',
                      tooltipType: 'title'
                  }
              ]
          }
    ],
    onBoxReady: function() {
    	this.callParent(arguments);
    	var me = this;
    	var toggleFn = function (container, btn, pressed) {
            if (pressed === true) {
            	me.reload(btn.viewParams, null, true);
//            	var newparams = Ext.apply(me.curViewParams, btn.viewParams);
//            	me.setViewDef(me.curViewID, newparams, true);
            }
        };
		
		
    	var tbarItems = Ext.ComponentQuery.query('segmentedbutton', this);
    	for(key in tbarItems) {
    		tbarItems[key].on('toggle', toggleFn);
    	}

		// reset the group/filters to the first item on patient change    	
    	this.on('patientchange', function() {
			tbarItems[0].setPressedButtons([tbarItems[0].items.getAt(0)]);
			tbarItems[1].setPressedButtons([tbarItems[1].items.getAt(0)]);
    	});
    },
    handleGrouping: function(isInPat) {
        var me = this;
        if (me.curViewParams['group'] == 'groupName') {
            var inPatRecFound = me.getStore().findRecord('groupName', 'Inpatient Meds') != null ? true : false;
            var grouping = me.getView().getFeature('grouping');
            if (isInPat) {
                grouping.collapseAll();
                if (inPatRecFound && grouping.groupCache['Inpatient Meds']) {
                    grouping.expand('Inpatient Meds', true);
                }
            } else {
                grouping.expandAll();
                if (inPatRecFound && grouping.groupCache['Inpatient Meds']) {
                    grouping.collapse('Inpatient Meds', false);
                }
            }
        }
    },
    // provide MedsPanel specific way to update the row by retrieving the new med info from the server
    viewDefRefreshActionHandler: function(uid) {
        var me = this;
        this.reload(null, function() {
            // try to highlight the updated row after reload
            Ext.Ajax.request({
                url:  me.proxyBaseUrl + me.curViewID,
                params: {
                    uid: uid,
                    pid: me.pid,
                    filter_current: me.filter_current
                },
                method: 'GET',
                success: function(resp) {
                    var json = Ext.decode(resp.responseText);
                    if(json !== null && json.data !== null && json.data.length > 0) {
                        var newMed = json.data[0];
                        var name = newMed['name'];
                        me.getStore().filter('groupName', newMed['groupName']);
                        var rec = me.getStore().findRecord('name', name);
                        me.getStore().clearFilter();
                        if (rec) {
                            var node = me.getView().getNode(rec);
                            Ext.fly(node).select('td').setStyle('backgroundColor', '#ffff9c');
                        }
                    }
                },
                failure: function(resp) {
                }
            });
        });
    },
    // this method may be used when and if we want to update the view without refreshing the view
    // not quite working yet ... need to modify MedHistViewDef.java and to collect more info from clinicians
    viewDefUpdateActionHandler: function(uid) {
        var me = this;
        // try to highlight the updated row after reload
        Ext.Ajax.request({
            url:  me.proxyBaseUrl + me.curViewID,
            params: {
                uid: uid,
                pid: me.pid,
                filter_current: me.filter_current
            },
            method: 'GET',
            success: function(resp) {
                var json = Ext.decode(resp.responseText);
                if(json.data.length > 0) {
                    var newMed = json.data[0];
                    var name = newMed['name'];
                    me.getStore().filter('groupName', newMed['groupName']);
                    var rec = me.getStore().findRecord('name', name);
                    if (rec) {
                        rec.set(newMed);
                        var node = me.getView().getNode(rec);
                        Ext.fly(node).select('td').setStyle('backgroundColor', '#ffff9c');
                    }
                }
            },
            failure: function(resp) {
            }
        });
    }
});