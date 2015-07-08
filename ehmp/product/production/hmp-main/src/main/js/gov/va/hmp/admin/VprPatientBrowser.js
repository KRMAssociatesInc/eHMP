Ext.define('gov.va.hmp.admin.VprPatientBrowser', {
    extend:'gov.va.cpe.viewdef.ViewDefGridPanel',
    alias:'widget.vprpatientbrowser',
    itemId:'vpr-patients',
    title:'Patients',
    viewID:'gov.va.cpe.vpr.queryeng.VprPatientsViewDef',
    patientAware:false,
    bufferedStore: true,
    viewConfig:{
        stripeRows: true,
        emptyText:'No patients in the VPR'
    },
    viewParams: {'row.count': 50},
    scroll: true,
    autorefreshEnabled : false,
    columns: [
        { text:'PID', dataIndex: 'pid'},
        { text:'Patient', dataIndex: 'displayName', width: 180},
        { text:'Errs', dataIndex: 'error', width: 60}
        // other columns filled in programmatically in initComponent()
    ],
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [
            {
                xtype: 'button',
                itemId: 'autorefreshToggleButton',
                text: 'Enable Auto-Refresh'
            },
            {
                xtype: 'button',
                itemId: 'autoResizeButton',
                text: "Auto Size Columns"
            }] // end of items inside of docked items
    }], //end of docked items list,
    initComponent: function() {
       var domainTitles = {
           allergy:'Allergies',
           document:'Docs',
           educationtopic:'Pt Ed',
           encounter: 'Encounter',
           exam:'Exam',
           healthfactor:'HFs',
           image:'Imgs',
           immunization:'Immun',
           result: 'Labs',
           medication: 'Meds',
           mentalhealth: 'MH',
           observation: 'Observ',
           order: 'Orders',
           purposeofvisit: 'POV',
           problem:'Probs',
           procedure:'Procs',
           roadtrip:'Road',
           skintest:'Skin',
           surgery:'Surg',
           task:'Task',
           treatment: 'Treat',
           visittreatment:'PTF',
           visitcptcode:'CPT',
           vitalsign:'Vitals'
       };
        for (var domain in domainTitles) {
            var title = domainTitles[domain];
            var jdsCountKey = 'jds' + Ext.String.capitalize(domain);
            var solrCountKey = 'solr' + Ext.String.capitalize(domain);
            this.columns.push({
                xtype: 'templatecolumn',
                text: title,
                width: 60,
                tpl:'<tpl if="' + jdsCountKey + ' !== ' + solrCountKey + '"><span class="text-danger"><tpl if="'+jdsCountKey+' != undefined &amp;&amp; '+jdsCountKey+' &gt; 0">{'+jdsCountKey+'}/<tpl if="'+solrCountKey+' &gt; 0">{'+solrCountKey+'}<tpl else>0</tpl></tpl></span><tpl else>{'+jdsCountKey+'}</tpl>'
            });
        }

//       this.dockedItems.push({
//    		xtype: 'pagingtoolbar',
//        	store: this.getStore(),
//        	dock: 'bottom',
//        	displayInfo: true
//    	});
    	this.callParent(arguments);
    },
    // private
    initEvents: function () {
        this.callParent(arguments);

        this.mon(this.down('#autorefreshToggleButton'), 'click', this.onToggleAutorefresh, this);
        this.mon(this.down('#autoResizeButton'), 'click', this.onAutoResizeColumns, this);
    },

    // private
    onToggleAutorefresh:function(btn) {
        this.autorefreshEnabled = !this.autorefreshEnabled;
        if (this.autorefreshEnabled) {
            btn.setText("Disable Auto-Refresh");
        } else {
            btn.setText("Enable Auto-Refresh");
        }
    },
    // private
    onAutoResizeColumns:function(btn) {
        var cols = btn.nextNode().headerCt.gridDataColumns;
        var store = btn.nextNode().getStore();
        var totalWidth = 0;
        var maxInColumn = [];
        var pixelSize = [];
        var sizer = new Ext.util.TextMetrics();
        for (var i = 0; i < cols.length; i++) {
            maxInColumn[i] = 0;
            store.each(function (record) {
                var fld = record.get(this.col.dataIndex);
                if (fld) {
                    var len = record.get(this.col.dataIndex).length;
                    if (this.col.dataIndex === "infoBtnUrl") {
                        len = 25;
                    }
                    if (len > this.hd[this.index]) {
                        this.hd[this.index] = len;
                        this.px[this.index] = sizer.getWidth(record.get(this.col.dataIndex)) + 25;
                    }
                }
            }, {hd: maxInColumn, col: cols[i], index: i, px: pixelSize});
        }
        for (var i = 0; i < cols.length; i++) {
            cols[i].width = pixelSize[i];
        }
        btn.nextNode().headerCt.updateLayout();
    },
    autorefresh: function () {
        if (this.rendered && this.autorefreshEnabled) {
            var store = this.getStore();
            if(store.buffered) {
                store.data.clear();
                store.loadPage(1);
            } else {
                this.getStore().reload();
            }
        }
    }
});