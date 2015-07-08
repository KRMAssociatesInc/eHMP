/**
 * This is an action column that has an embedded tooltip that will fetch and interpret 
 * what it can to display infobuttons, alerts and actions.
 * 
 * Will also try to display the appropriate summary icon.
 * 
 * TODO: this needs some CSS cleanup
 */
Ext.define('gov.va.cpe.viewdef.RowActionColumn', {
	extend: 'Ext.grid.column.Action',
	alias: 'widget.rowactioncolumn',
	sortable: false,
	requires: ['gov.va.cpe.AlertDialog'],
	resizable: false,
	hideable: false,
	menuDisabled: true,
	width: 22,

    /*
        Spending time on hairy issues warrants big comments in my opinion.

        Originally, with the move to 4.2.2, we had a problem with the meds panel rows collapsing (showing a one-pixel height gray line.)
        We spent time troubleshooting this and found issues in a few areas, and one issue was the row action columns failing to render.
        During that time we created this empty items array, which seemed to solve the problem.
        However, this affected Search Results in that the SearchDetailPanel was unable to .destroy() itself when this items array remained empty.
        Commenting out the items array seems to fix this issue, and also, the action column seems to be working properly at this point in the
        normal MedsPanel.
     */
    //items: [],

    // private
    innerCls: Ext.baseCSSPrefix + 'grid-cell-inner-rowaction-col',

	// column configuration
	requestAction: 'gov.va.cpe.vpr.rowaction', // if true, will make an invoke request for frames to generate any actions
	showTooltip: true, // if false, sill shows the alert icons in the column, but no hover/click tooltip
	
	constructor: function(config) {
		// the ActionColumn constructor rebuilds the items array, so we have to use contstructor instead of initComponent in 4.07
		Ext.apply(config, {width: this.width, header: '', hideable: this.hideable, renderer: this.renderer});
		this.callParent([config]);
	},
	
	initComponent: function() {
		this.callParent([arguments]);
		this.scope = this;
	},
	
	renderer: function(val, metaData, rec) {
		var actions = rec.get('actions');
		if (actions && actions.length) {
           var qtip = " data-qtip='";
			for (i in actions) {
				var action = actions[i];
				qtip += "<div>" + action.title + "</div>"
			}
			metaData.tdAttr = qtip + "'";
		    return '<i class="fa fa-warning hmp-alert-icon"></i>';
        }
		
		// only show the action hover icon if tooltip is enabled.
		if (this.showTooltip) metaData.tdCls = 'hmp-action-btn-cell';
		return '&nbsp;';
	},
	
	createTip: function(target) {
		this.tooltip = Ext.create('Ext.tip.ToolTip', {
	        target: target,
	        delegate: '.hmp-action-btn-cell',
	        itemId: 'RowActionTooltipID',
	        autoHide: false,
	        closeable: true,
	        anchor: 'right',
	        anchorToTarget: true,
	        hideDelay: 1000,
	        mouseOffset: [0,0],
	        width: 300,
	        title: 'Available Actions'
		});
		
		this.tooltip.emptymsg = this.tooltip.add({xtype: 'displayfield', enabled: false, value: 'No Links/Actions found...'});
		this.tooltip.loadingmsg = this.tooltip.add({xtype: 'displayfield', enabled: false, value: 'Loading...'});
		this.tooltip.alertset = this.tooltip.add(Ext.widget('fieldset', {title: 'Alerts', collapsible: true}));
		this.tooltip.actionset = this.tooltip.add(Ext.widget('fieldset', {title: 'Actions', collapsible: true, defaults: {textAlign:'left'}}));
		this.tooltip.linkset = this.tooltip.add(Ext.widget('fieldset', {title: 'Links', collapsible: true}));
		
		this.tooltip.on('beforeshow', this.updateTip, this);
	},
	
	updateTip: function() {
		var tip = this.tooltip;
		
        tip.emptymsg.hide();
        tip.loadingmsg.show();
		
        tip.actionset.setTitle('Actions');
        tip.actionset.removeAll();
        tip.actionset.hide();
        tip.alertset.setTitle('Alerts');
        tip.alertset.removeAll();
        tip.alertset.hide();
        tip.linkset.setTitle('Links');
        tip.linkset.removeAll();
        tip.linkset.hide();
        
		// get the record
		var row = Ext.get(tip.triggerElement).up(".x-grid-row");
		var rec = this.view.getRecord(row.dom);

        // if there is an actions column (alerts) display them...
        var actions = rec.get('actions');
        if (actions && actions.length) {
            for (var i=0; i < actions.length; i++) {
            	var act = actions[i];
            	tip.alertset.add({xtype: 'button', ui: 'link', frameID: act.frameID, text: act.title, description: act.description, handler: function() {
            		gov.va.cpe.AlertDialog.open(act);
            	}});
            }
            tip.alertset.setTitle('Alerts (' + actions.length + ')');
        	tip.alertset.show();
        }
        
        // cancel any existing request (so 2 sets of results don't display)
        if (this.request1) {
        	Ext.Ajax.abort(this.request1);
        }
        
        // fetch and render object-specific actions
        if (this.requestAction) {
        	this.requestActions(rec, tip);
        }
	},
	
	requestActions: function(rec, tip) {
        // fetch and render object-specific actions
        var uid = rec.get('uid');
        var url = "/frame/exec?entryPoint=" + this.requestAction;
        if (uid) url += '&uid=' + uid;
        this.request1 = Ext.Ajax.request({
        	 url: url,
        	 jsonData: rec.getData(),
             success: function(response) {
            	 var data = Ext.JSON.decode(response.responseText);
            	 tip.loadingmsg.hide();
            	 
            	 var actions = gov.va.cpe.viewdef.RowActionColumn.parseActions(data);
            	 for (var i in actions) {
            		 var action = actions[i];
            		 if (action.cat == 'link') {
        				 tip.linkset.add(action)
            		 } else if (action.cat == 'alert') {
            			 tip.alertset.add(action);
        			 } else {
        			 	 tip.actionset.add(action);
        			 }
            	 }
            	 
        		 // show or hide categories
        		 tip.actionset.setTitle('Actions');
        		 if (tip.actionset.items.length) {
        			 tip.actionset.show();
        		 }
        		 
        		 tip.linkset.setTitle('Links');
        		 if (tip.linkset.items.length) {
        			 tip.linkset.show();
        		 }
             },
             failure: function(response) {
            	 tip.actionset.add({xtype: 'displayfield', value: 'Error loading actions...'});
             }
        });
	},
	
	statics: {
		parseActions: function(data) {
			var ret = [];
			if (!data || !data.actions || data.actions.length == 0) {
				tip.emptymsg.show();
				return ret;
			}
       	 
			 for (var i in data.actions) {
				 var action = data.actions[i];
				 var value = action.title;
				 var cfg = {xtype: 'displayfield', anchor: '100%', value: action.title};
				 if (action.url) {
					 var link = action.title;
					 if (action.heading) {
						 link = action.heading + ": " + link;
					 }
					 cfg.value = '<a class="hmp-external-link" title="' + action.hint + '" target="_blank" href="' + action.url + '">' + link + '</a>';
				 } else if (action.orderDialogID) {
					 cfg.xtype = 'button';
					 cfg.textAlign = 'left';
					 cfg.ui = 'link';
//					 cfg.icon = '/images/icons/action.png',
					 cfg.text = action.orderMessage;
                     cfg.orderDialogID = action.orderDialogID;
                     cfg.orderSummary = action.orderSummary;
                     cfg.orderData = action.orderData;
					 cfg.handler = function() {
                         if (this.orderDialogID == "TASK") {
                            var taskWindow = Ext.getCmp('taskWindow');
                            if (!taskWindow) taskWindow = Ext.create('gov.va.cpe.TaskWindow', {});
                             // must show() before updating task edit panel
                             taskWindow.show();
                             taskWindow.updateTaskEditPanel(this.orderData, this.orderSummary);
                         } else {
                             alert('TODO: Launch order dialog: ' + action.orderDialogID + '. Data: ' + action.orderData);
                         }
					 }
				 }
				 cfg.cat = (action.type) ? action.type : 'action';
				 ret.push(cfg);
			 }
			return ret;
		}
	},
	
	listeners: {
    	render: function(cmp) {
    		var me = this;
			this.view = this.up('gridpanel').getView();
			if (this.showTooltip) this.createTip(this.view.el);
		},
		destroy: function(cmp) {
			if(this.tooltip) {
				this.tooltip.destroy();
			}
		}
	}
});
