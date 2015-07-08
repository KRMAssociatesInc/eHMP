Ext.define('gov.va.cpe.search.SearchResultsPanel', {
    extend: 'Ext.grid.Panel',
    require: [
        'gov.va.hmp.PointInTime'
    ],
    mixins: {
        patientaware: 'gov.va.hmp.PatientAware'
    },
    alias: 'widget.searchresults',
    margin: '0 0 5 5',
    layout: 'fit',
    header: false,
    hideHeaders: true,
    emptyText: 'No matches found.',
    features: [{
    	ftype:'grouping', 
    	id:'grouping', 
    	startCollapsed: true, 
    	// to only hide the badge for a certain domain add: <tpl if="this.showBadge(values,'document')">foo</tpl>
    	groupHeaderTpl: [
    	     // per discussion, temporarily removing badges from categories to see if it helps users comprehend the results
             //'{name}  <tpl if="children.length &gt; 1"><span class="badge pull-right">{children.length}</span></tpl>',
             '{name}',
             {
            	 // logic to determine which badges to hide/show (if needed)
            	 showBadge: function(values, domain) {
            		 return domain && values && values.children && Ext.isArray(values.children) && 
            		 		values.children[0].get("type") !== domain;
            	 }
             }
        ]
	}],
    columns:[
        { header:'',
            xtype:'templatecolumn',
            flex:1,
            tpl:'<tpl for=".">' +
            		// header row
                    '<div class="cpe-search-result">' +
                    '<div><tpl if="count &gt; 0"><span class="badge badge-well cpe-search-result-count"><tpl if="count &gt; 99">99<tpl else>{count}</tpl></span></tpl><span class="cpe-search-result-summary">{summary}</span></div>' +

                    // show up to 3 highlight rows (and n-more if there are more)
                    '<tpl if="type!==\'document\'">' +
                        '<tpl for="highlights">{% if (xindex > 3) break; %}<div class="cpe-search-result-highlight">...{.}...</div></tpl>' +
                        '<tpl if="highlights.length &gt; 3"><a target="">More match highlights &raquo;</a></tpl>' +

                        // footer row
                        '<div class="cpe-search-result-attributes text-muted"><tpl if="datetime"><span class="text-info">{[PointInTime.format(values.datetime)]}</span> - </tpl>' +
                        '{kind} <tpl if="where">- {where}</tpl>' +
                        '</div>' +
                    '</tpl>' +
                    '</div>' +
                '</tpl>'
        }
    ],
    listeners: {
        beforepatientchange: function(pid, appChange, ccowSurvey, ccowChange) {
            this.getStore().removeAll();
        },
        patientchange: function(pid) {
            var me = this;
            this.pid = pid;
            if (pid != 0) {
                me.setDisabled(false);
                var store = me.getStore();
                store.getProxy().url = '/vpr/v1/search';
            } else {
            	me.setTitle('');
                me.setDisabled(true);
            }
        }
    },
    
    tbar: [
        {
        	xtype:'component', 
        	itemId: 'resultStatusBarID', 
        	tpl: [
    	        '<span class="text-muted">Search for \'{query}\' returned <b>{count}</b> results in <b>{time}</b> seconds.',
        	    '<tpl if="diff && diff &gt; 0"> (<b>{diff}</b> results filtered out)</tpl></span>'
        	]
		}
    ],
    
    initComponent: function() {
        var me = this;
        
        // initialize the store at runtime to prevent tab + quicksearch conflicts
        this.store = Ext.create('Ext.data.Store', {
            fields: ['uid', 'summary', 'type', 'kind', 'datetime', 'where', 'highlights', 'count','detailType','detailTitle','detailCfg'],
            groupField: 'kind',
            proxy: {
                type: 'ajax',
                extraParams: {
                    format: 'json'
                },
                reader: {
                    type: 'json',
                    root: 'data.items',
                    totalProperty: 'totalItems'
                }
            }
        });
        
        // the startCollapsed property only works the first time, 
        // re-collapse the groups after search search
        this.store.on('load', function() {
        	var grouping = me.getView().getFeature('grouping');
        	if (grouping) {
        		grouping.collapseAll();
        	}
        });

        me.callParent(arguments);

        var selModel = me.getComponent(0).getSelectionModel();
        
        this.statusBar = me.down('#resultStatusBarID');
        
        me.relayEvents(selModel, [
        /**
         * @event selectionchange
         * @alias Ext.selection.Model#selectionchange
         */
            'selectionchange'
        ]);
    },
    onBoxReady:function() {
        this.initPatientContext();
        this.callParent(arguments);
        this.filtersPanel = this.up('searchpanel').filtersPanel;
    },
    searchFor: function(text, params) {
    	var me = this;
    	var params = params || {};
    	var startAt = new Date();
        var store = this.getStore();

        params.query = text;
        var pid = this.pid;
//        while(pid.indexOf(';') != -1) {
//            pid = pid.substring(0, pid.indexOf(';')) + '%3B' + pid.substring(pid.indexOf(';')+1);
//        }
        params.pid = pid;
        
        store.load({
            params: params,
            scope: me,
            callback: function(recs, op, success) {
              	var time = new Date().getTime() - startAt.getTime();
            	// TODO: Its ugly to be re-decoding this json response but don't see another way right now
            	var data = Ext.JSON.decode(op.response.responseText).data;
            	
            	// update status bar and filter bar with metadata
            	this.statusBar.update({
            		query: Ext.String.htmlEncode(text),
            		count: data.foundItemsTotal,
            		unfilteredTotal: data.unfilteredTotal,
            		diff: data.unfilteredTotal-data.foundItemsTotal,
            		time: Ext.util.Format.round(time/1000,1)
        		});
            	this.statusBar.show();
            	this.filtersPanel.updateMetaData(data);
            }
        });
    }
});