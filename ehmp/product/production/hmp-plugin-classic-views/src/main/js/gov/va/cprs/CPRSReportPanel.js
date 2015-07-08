Ext.define('gov.va.cprs.CPRSReportPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'gov.va.hmp.ux.DateRangePicker'
    ],
    xtype: 'cprsreportpanel',
	mixins: {
		patientaware: 'gov.va.hmp.PatientAware'
	},
    autoScroll: true,
    rpcurl: '',
    tbar: [
        '->',
        {
            xtype: 'component',
            html: 'Date Range'
        },
        ' ',

        {
            xtype: 'daterangepicker',
            itemId: 'dateBtnID'
        }
    ],
    
    showGrid: function(cols) {
    	if (this.grid) {
    		console.log('grid', this.grid);
    		this.gridstore.removeAll();
    		this.grid.reconfigure(null, cols);
    		return; // already exists
    	}
    	console.log('build grid', cols);
    	this.gridstore = Ext.create('Ext.data.Store', {
    		model: 'gov.va.cprs.CPRSReportModel',
    		data : []
		});
    	this.grid = this.addDocked({xtype:'grid', dock:'top', store: this.gridstore, height: 350, columns: cols})[0];
    },
    
    initComponent: function() {
    	var me = this;
        me.callParent();
        me.on('patientchange', me.patientchange, me);
        me.date = me.down('#dateBtnID');
        me.date.on('select', function(cmp,dateRangeExp) {
            console.log('range: ' + dateRangeExp);
            me.startdate = me.calcFileManDate(dateRangeExp.substring(2));
            console.log('new startdate: ' + me.startdate);
        });
    },
    
    loadTableCols: function(reportid, rpcurl) {
    	var me = this;
    	var colDefURL = "/rpc/execute?context=VPR UI CONTEXT&name=ORWRP COLUMN HEADERS&params=" + reportid;
    	Ext.Ajax.request({
    		url: colDefURL,
    		success: function (resp) {
    			var lines = resp.responseText.split("\n");
    			var cols = [];
    			var diff = 0;
    			for (i in lines) {
					var line = lines[i].trim();
					var comps = line.split('^');
					var key = 'c' + (parseInt(comps[2]) + diff);
					var width = parseInt(comps[5])*10;
					if (comps[0] == 'ID') { diff = -1; continue; } 
					cols.push({text: comps[0], widthx: width, dataIndex: key});
    			}
    			me.showGrid(cols);
    			
    			// now load the data
    			me.fetchRPC(rpcurl, function(resp) {
    				console.log('report grid data', resp.responseText);
    				var lines = resp.responseText.split("\n");
    				var recs = [];
    				var rec = null;
    				for (i in lines) {
    					var line = lines[i].trim();
    					var comps = line.split('^');
    					var key = 'c' + (parseInt(i) +1);
    					if (comps[0] == '1') {
    						if (rec != null) recs.push(rec);
    						rec = {};
    					}
    					
    					rec[key] = comps[1];
    				}
    				recs.push(rec);
    				console.log('recs', recs);
    				me.gridstore.add(recs);
    			});
    		}
    	});
    },
    
    fetchRPC: function(rpcurl, fxn) {
    	var me = this;
    	var tpl = new Ext.XTemplate(rpcurl);
    	var data = {
    		pid: gov.va.hmp.PatientContext.pid, 
    		dfn: gov.va.hmp.PatientContext.patientInfo.dfn,
    		startAt: me.startdate, 
    		endAt: me.calcFileManDate(0), 
    		daysRange: 183
		};
    	this.rpcurl = rpcurl;
    	rpcurl = tpl.apply(data);
    	Ext.Ajax.request({
    		url: rpcurl,
    		success: function(resp) {
    			fxn.call(me, resp);
    		}
		});    	
    },
    
    loadRPC: function(rpcurl, grid) {
    	var me = this;
    	var tpl = new Ext.XTemplate(rpcurl);
    	var data = {
    		pid: gov.va.hmp.PatientContext.pid, 
    		dfn: gov.va.hmp.PatientContext.patientInfo.dfn,
    		startAt: me.startdate, 
    		endAt: me.calcFileManDate(0), 
    		daysRange: 183
		};
    	this.rpcurl = rpcurl;
    	rpcurl = tpl.apply(data);
    	Ext.Ajax.request({
    		url: rpcurl,
    		success: function(resp) {
    			me.update(me.reportText(resp.responseText));
    		}
		});
    },
 
    /** this is a quick-and-dirty FileMan date calculator, not a very good one though */
    calcFileManDate: function(daysBack) {
        var today = new Date();
    	var year = today.getFullYear() + Math.floor(daysBack/365);
    	daysBack = daysBack % 365;
    	var month = today.getMonth() + Math.floor(daysBack/30) + 1;
    	daysBack = daysBack % 30;
    	var day = today.getDate() + daysBack;
    	if (month <= 9) month = '0' + month;
    	if (day <= 9) day = '0' + day;
    	return '' + (year -1700) + '' + month + '' + day;
    },
    
    reportText: function(text) {
    	var idx = text.indexOf("[REPORT TEXT]");
    	if (idx > 0) {
    		return '<pre>' + text.substr(idx+13) + '</pre>';
    	}
    	return '<pre style="overflow: auto;">' + text + '</pre>';
    },
    
	patientchange: function(pid) {
		this.pid = pid;
		
		if (!pid) {
			this.update(''); // clear
		} else if (this.rpcurl) {
			this.loadRPC(this.rpcurl);
		}
	}
});