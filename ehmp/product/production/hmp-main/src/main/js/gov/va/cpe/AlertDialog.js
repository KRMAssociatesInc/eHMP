/**
 * TODO: Need to submit the feedback/suppresion/etc somewhere
 * TODO: Tab to show frame/alert configuration?  Maybe customize the configuration?
 * TODO: How does this dialog integrate into detail views? 
 */
Ext.define('gov.va.cpe.AlertDialog', {
	extend: 'Ext.window.Window',
	title: 'Alert Dialog',
	height: 300,
	width: 600,
	layout: 'fit',
	singleton: true,
	closeAction: 'hide',
	modal: true,
	id: 'AlertDialogWinID',
	items: {
		xtype: 'tabpanel',
		defaults:{ autoScroll:true },
		items: [
			{xtype: 'form', title: 'Alert', loader: {url:'/frame/alert', scripts: true}},
			{
				title: 'Suppress',
				items: [{
					xtype: 'fieldcontainer',
					defaultType: 'radiofield',
					defaults: {flex: 1},
					fieldLabel: "Don't show me this alert for this patient for x days"
						// TODO: Duration of this encounter
						// TODO: Dont show this alert/frame forever for this patient.
				}]
			},
			{title: 'Info', loader: {url:'/frame/info'}},
			{
				title: 'Feedback',
				items: [{
					xtype: 'fieldset',
					title: 'Disposition',
					defaultType: 'radiofield',
					defaults: {
						flex: 1
					},
					items: [{
						boxLabel: 'Correct - Alert fired correctly and was useful',
						name: 'disposition'
					},{
						boxLabel: 'Inaccurate - Alert should not have fired',
						name: 'disposition'
					},{
						boxLabel: 'Noisy - Alert could be more tuned to filter out this situation',
						name: 'disposition'
					}]
				},{
					xtype: 'fieldset',
					defaultType: 'radiofield',
					layout: {type: 'hbox', align: 'stretch'},
					height: 40,
					title: 'Rate this alert ',
					items: [
				        {boxLabel: '1', name: 'rating', inputValue: '1'},
				        {boxLabel: '2', name: 'rating', inputValue: '2'},
				        {boxLabel: '3', name: 'rating', inputValue: '3'},
				        {boxLabel: '4', name: 'rating', inputValue: '4'},
				        {boxLabel: '5', name: 'rating', inputValue: '5'}
			        ]
				},{
					fieldLabel: 'Comments / Reason / Rational / Feedback',
					xtype: 'textarea',
					width: 400,
					height: 150
				}]
			},
			{title: 'Debug', scripts: true}
		]
	},
	buttons: [
        {
        	text: 'Close',                     
        	listeners: {
	            click: function() {
	                Ext.getCmp('AlertDialogWinID').close();
	            }
        	}	
        },
        {
        	text: 'Save', 
        	listeners: {
        		click: function() {
        			Ext.getCmp('AlertDialogWinID').save();
        		}
        	}
        }
    ],
	loader: {
		url: '/frame/info' 
	},
	initComponent: function() {
		this.callParent();
		var me = this;
		me.tabwin = this.items.get(0); 
		me.alertpanel = me.down('panel[title="Alert"]');
		me.infopanel = me.down('panel[title="Info"]');
		me.feedbackpanel = me.down('panel[title="Feedback"]');
		me.debugpanel = me.down('panel[title="Debug"]');
	},
	obs: function(key, value, observed) {
		console.log('AlertDialog.obs', arguments);
		var pid = gov.va.hmp.PatientContext.pid;
		Ext.Ajax.request({
			url: '/frame/obs/set/' + pid + "/" + key + "?value=" + value + ((observed) ? "&observed=" + observed : ''),
			success: function() {
				console.log('success', arguments);
			}
		});
	},
	save: function() {
		var el = this.alertpanel.getEl();
		console.log('AlertDialog.save', arguments, el, el.getById('AlertDialogFormID'));
	},
	open: function(obj) {
		var me = this;
		me.title = obj.title;
		me.infopanel.getLoader().load({params: {uid: obj.frameID}});
		me.alertpanel.getLoader().load({jsonData: obj});
		me.debugpanel.update('<pre class="brush: js">' + Ext.JSON.encode(obj) + '</pre>');
		
		// reset to tab and scrollers
		me.tabwin.setActiveTab(0);
		me.alertpanel.scrollBy(-1000, -1000, false);
		me.show();
	}
});