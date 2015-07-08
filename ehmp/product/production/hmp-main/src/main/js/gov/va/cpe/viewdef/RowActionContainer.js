Ext.define('gov.va.cpe.viewdef.RowActionContainer', {
    extend: 'Ext.container.Container',
    requires: ['gov.va.hmp.ux.TightMenu'],
    layout: 'fit',
//    layout: {type: 'vbox', align: 'stretch', constrainAlign: true},
    width: 195,
    componentCls: 'cpe-row-action-ct',
    loadingMsg: 'Loading...',
    emptyMsg: 'No Links/Actions found...',
    menuMax: 8,
	sortVal: {
		'Alerts': 1,
		'Actions': 2,
		'Links': 3
	},
	
    initComponent: function() {
        this.callParent();
        this.emptymsg = this.add({xtype: 'displayfield', enabled: false, value: this.emptyMsg});
        this.loadingmsg = this.add({xtype: 'displayfield', enabled: false, value: this.loadingMsg});
        
        this.menu = this.add(Ext.create('gov.va.hmp.ux.TightMenu', {plain: true, floating: false, menuMax: this.menuMax}));
        this.reset();
    },

    /** Add 1+ actions to the action list */
    addActions: function(actions) {
        // if there is an actions column (alerts) display them...
        if (actions && actions.length) {
            for (var i=0; i < actions.length; i++) {
                var action = actions[i];
                this.addMenuItem({
                    heading: 'Alerts',
                    frameID: action.frameID,
//                	iconCls: "fa-warning",
                    glyph: 'xF071@FontAwesome',
                	text: action.title, tooltip: actions.description, 
                	handler: function() {
                		gov.va.cpe.AlertDialog.open(action);
                	}
                });
            }
        }
    },    

    /** Make an AJAX call to the server to generate any relevant actions */
    fetchActions: function(url, callback) {
        var me = this;
        
        // calculate the current environment as the portion following the ';' on the URL path
        // or null as a backup
        var curenv = window.location.pathname;
		curenv = (curenv.indexOf(';')) ? curenv = curenv.substr(curenv.indexOf(';')+1) : null;
		
        // fetch and render object-specific actions
        this.request1 = Ext.Ajax.request({
            url: url,
            success: function(response) {
            	var cfgs = [];
                var data = Ext.JSON.decode(response.responseText);
                me.loadingmsg.hide();

                var actions = data.actions || [];
                for (var i in actions) {
                	// setup the action with common properties
                	var action = actions[i];
                	var cfg = {text: action.title};
                	if (action.hint) {
                		cfg.tooltip = action.hint;
                	}
                	if (action.disabled === true) {
                		cfg.disabled = true;
                	}
                	
                	// conditional enable depending on environment
                	if (action.enableIfEnvironment) {
                		var envs = action.enableIfEnvironment.split(','); // environment can be a CSL
                		// disable if there is no curenv or curenv is not in the envs list
                		cfg.disabled = (!curenv || !Ext.Array.contains(envs, curenv));
                	}
                	
                	// only show this if it matches the current enviornment
                	// TODO: probably need to find a more generic way of handling this
                	if (action.environment != undefined) {
                		var envs = action.environment.split(','); // environment can be a CSL
                		if (curenv && !Ext.Array.contains(envs, curenv)) {
                			continue; // skip this one
                		}
                	}
                	
                	// its an external link action
                	if (action.url) {
                		cfg.heading = "Links";
                		cfg.href = action.url;
                		cfg.hrefTarget="_blank";
                        cfg.glyph = 'xF08e@FontAwesome'
                    	if (action.heading) {
                    		cfg.text = action.heading + ": " + cfg.text;
                    	}
                	} else if (action.orderDialogID) {
                		// launch order dialog
                		cfg = Ext.apply(cfg, {heading: action.heading || "Actions", text: action.orderMessage, orderDialogID: action.orderDialogID, orderData: action.orderData, orderSummary: action.orderSummary});
            			cfg.handler = function() {
            	           if (this.orderDialogID == "TASK") {
                             var taskWindow = Ext.getCmp('taskWindow');
                             if (!taskWindow) taskWindow = Ext.create('gov.va.cpe.TaskWindow', {});
                             // must show() before updating task edit panel
                             taskWindow.show();
                             taskWindow.updateTaskEditPanel(this.orderData, this.orderSummary);
                             
            	           } else if (this.orderDialogID == 'gov.va.cpe.PatEdWin') {
         						// launch the patient action window
         						var win = Ext.getCmp('patEdWin');
         						if (win) {
         							win.panel.reload({url: this.orderData}, null, false);
         						} else {
         							win = Ext.create('gov.va.cpe.PatEdWin', {viewParams: {url: this.orderData}});
         						}
								win.show();
            	           } else {
                             alert('TODO: Launch order dialog: ' + this.orderDialogID + '. Data: ' + this.orderData);
            	           }
            		    }
                	}
                	
                	cfgs.push(cfg);
                }
                
                // sort, then add each item
                cfgs = cfgs.sort(function (a, b) {
                	var a1=me.sortVal[a.heading] || -1, b1=me.sortVal[b.heading] || -1;
                	return (a1-b1);
                });
                me.addMenuItems(cfgs);

                Ext.callback(callback, me);
            },
            failure: function(response) {
                me.addMenuItem({xtype: 'displayfield', value: 'Error loading actions...'});
            }
        });
    },

    addMenuItem: function (cfg) {
        this.menu.add(cfg);
    },

    /**
     * @param {Array} cfgs
     */
    addMenuItems: function(cfgs) {
        this.menu.add(cfgs); // adding array facilitates only one layout flush instead of one per item
    },

    reset: function() {
        this.emptymsg.hide();
        this.loadingmsg.show();
        
        this.menu.removeAll();
    }
});