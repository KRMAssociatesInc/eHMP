Ext.define('gov.va.hmp.TestBenchApp', {
    extend:'gov.va.hmp.Application',
    requires:[
        'gov.va.hmp.Viewport',
        'gov.va.hmp.ux.layout.SlidingCard',
        'gov.va.hmp.UserContext',
        'gov.va.hmp.PatientContext'
    ],
    
    /**
     * TODO: Stuff to do in here
     * - cookie to track most recent panels, reopen last used tabs, etc.
     * - some sort of script eval() mechanism so you can configure/lanch components as needed.
     * - some way to get a list of all tabs (like MedReview, LabReview, etc.)
     */
    launch:function () {
        Ext.create('gov.va.hmp.Viewport', {
            items:[{xtype: 'testpanel'}]
        });
    }
});

Ext.define('gov.va.hmp.TestPanel', {
	extend: 'Ext.panel.Panel',
    region:'center',
    layout: 'slidingcard',
    alias: 'widget.testpanel',
    bodyPadding: 10,
    initComponent: function() {
    	var me = this;
    	this.callParent(arguments);
    	
    	// initalize
    	var appInfo = gov.va.hmp.AppContext.getAppInfo();

    	// setup references
    	this.pidField = this.down('#pidFieldID');
    	this.panelField = this.down('#panelFieldID');
    	this.tabpanel = this.down('tabpanel');
    	
    	// reload handler
    	this.down('#reloadBtnID').on('click', function() {
    		window.location.reload();
    	}, this);
    	
    	// setup pid setting handlers
    	this.down('#pidBtnID').on('click', this.doSetPID, this);
    	this.pidField.on('specialkey', function(field, e) {
            if (e.getKey() == e.ENTER) {
                me.doSetPID();
            }
        }, this);
    	
    	// setup add tab handlers
    	this.down('#addBtnID').on('click', this.doAddPanel, this);
    	this.panelField.on('specialkey', function(field, e) {
            if (e.getKey() == e.ENTER) {
                me.doAddPanel();
            }
        }, this);
    	
        // restore patient context
        var params = Ext.Object.fromQueryString(window.location.search);
        if (params && params.pid) {
            gov.va.hmp.PatientContext.setPatientContext(params.pid);
            this.pidField.setValue(params.pid);
        } else if (Ext.isDefined(appInfo.contexts.pid) && appInfo.contexts.pid != null) {
            gov.va.hmp.PatientContext.setPatientContext(appInfo.contexts.pid);
            this.pidField.setValue(appInfo.contexts.pid);
        }
        
        // restore last tab/panel
        var cookie = Ext.util.Cookies.get('HMP-TESTER-PANEL'); 
        if (cookie) {
        	this.panelField.setValue(cookie);
        	this.doAddPanel();
        }
        
    },
    
    doSetPID: function() {
		var pid = this.pidField.getValue();
		if (Ext.isNumeric(pid)) {
			gov.va.hmp.PatientContext.setPatientContext(pid);
		}
    },
    
    doAddPanel: function() {
    	var panel = this.panelField.getValue();
    	if (panel) {
    		var cfg = {tabConfig: {closable: true}};
    		var newPanel = this.tabpanel.add(Ext.create(panel, cfg));
    		this.tabpanel.setActiveTab(newPanel);
    		Ext.util.Cookies.set('HMP-TESTER-PANEL', panel);
    	}
    },
    
    dockedItems:[
        {
            xtype:'toolbar',
            dock:'top',
            items:[
                {
                    emptyText:'select a PID',
                    itemId: 'pidFieldID',
                    width: 75,
                    xtype: 'textfield'
                },
                {xtype: 'button', itemId: 'pidBtnID', text: 'Set PID'},
                {xtype: 'button', itemId: 'reloadBtnID', text: 'Reload'},
                '->',
                {
                    emptyText:'Add Panel...',
                    width: 400,
                    itemId: 'panelFieldID',
                    xtype: 'textfield'
                },
                {xtype: 'button', itemId: 'addBtnID', text: 'Add Tab'}
            ]
        }
    ],
    items:[
        {
            xtype:'tabpanel', itemId: 'tabsID'
        }
    ]
});
