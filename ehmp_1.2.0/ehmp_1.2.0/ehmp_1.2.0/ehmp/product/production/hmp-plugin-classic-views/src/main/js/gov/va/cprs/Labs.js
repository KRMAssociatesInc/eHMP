Ext.define('gov.va.cprs.Labs', {
    extend: 'Ext.container.Container',
    title: 'Labs',
    requires: [
       'gov.va.cprs.CPRSReportPanel'
    ],
    startAt: 3110528,
    layout: 'fit',
    items: [
        {xtype: 'cprsreportpanel', itemId: 'contentarea'}
    ],
	initComponent: function() {
		this.callParent();
		var me = this;
		
		this.disp = me.down("#contentarea");
		this.view = {
        	xtype:'button', itemId: 'viewBtnID', text: 'View', 
        	menu: {
        		items: [
   		            {text: "Most Recent", disabled: true},
        		    {text: 'Cumulative', rpcurl: '/rpc/execute?context=VPR UI CONTEXT&name=ORWLR CUMULATIVE REPORT&params={dfn},{daysRange}'},
        		    {text: "All Tests By Date", rpcurl: '/rpc/execute?context=VPR UI CONTEXT&name=ORWLRR INTERIM&params={dfn},{startAt},{endAt}'},
		            {text: "Selected Tests By Date", disabled: true},
		            {text: "Worksheet", disabled: true},
		            {text: "Graph", disabled: true},
		            {text: "Microbiology", disabled: true},
		            {text: "Blood Bank", rpcurl: '/rpc/execute?context=VPR UI CONTEXT&name=ORWRP REPORT TEXT&params={dfn},L:2,0,9999,1,0,0'},
		            {text: "Lab Status", rpcurl: '/rpc/execute?context=VPR UI CONTEXT&name=ORWRP REPORT TEXT&params={dfn},L:10,,183,,3121127,3130529.2359'},
		            {text: 'Anatomic Pathology', menu: {items: [
    		                {text: "Autopsy", disabled: true},
    		                {text: "Cytology", disabled: true},
    		                {text: "Electron Microscopy", disabled: true},
    		                {text: "Surgical Pathology", disabled: true}
                    ]}}
        		]
            }
    	};

		this.view = this.disp.down('toolbar').insert(0, this.view);
		this.view.menu.on('click', function(menu, item, e) {
			if (item && item.rpcurl) {
				me.disp.loadRPC(item.rpcurl);
			}
		});
    },

});