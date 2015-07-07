/*
 * TODO: Use the message and success property to of the main json render?
 * TODO: Implement the save/restore state, but don't actually let it happen automagically.
 * -- looking to capture columns displayed, column widths, etc.
 * TODO: Tooltip configuration: 
 * -- hovering over value displays details (ie Date/Time column might say 7 days ago, hovering will show exact time/date)
 * -- detail tooltip
 * -- infobutton?!?
 * -- tooltip for more detailed column descriptions when hovering over columns?
 * TODO: New column types ( relative DTM display: 2h 34m ago)
 * TODO: no records mask window/message?
 * TODO: auto-refresh interval?
 */

/*
 * This is version 2.0 of the viewenggrid.
 * 
 * Major goals for version 2.0:
 * - Rewrite now that I know EXTjs much better
 * - Embedded detail windows (with several new detail modes: tooltip/window)
 * - Grouping/Sorting/Filtering
 * - Tighter integration with editors/preferences
 * - Pluggable toolbars
 * - Try to take some of the metadata burden off of viewdefs
 */
Ext.define('gov.va.cpe.viewdef.ViewDefGridPanel', {
    extend: 'Ext.grid.Panel',
	requires: [
        'gov.va.hmp.EventBus',
        'gov.va.hmp.ErrorHandler',
        'gov.va.cpe.viewdef.GridDetailPanel',
        'gov.va.cpe.viewdef.HealthTimeColumn',
        'gov.va.cpe.viewdef.InfobuttonColumn',
        'gov.va.cpe.viewdef.GridAdvisor',
        'gov.va.cpe.viewdef.AutoFilterToolbar',
        'gov.va.cpe.viewdef.ViewDefCellEditing',
        'gov.va.cpe.viewdef.ViewDefFilterTool',
        'gov.va.cpe.viewdef.SparklineColumn'
    ],
	alias: 'widget.viewdefgridpanel',
	mixins: {
		patientaware: 'gov.va.hmp.PatientAware',
		stateful: 'Ext.state.Stateful'
	},
	gridAdvisor: null,
	scroll: false,
	  viewConfig: {
		  markDirty: false,
	    style: { overflow: 'auto', overflowX: 'hidden' }
	  },
	plugins: ['viewdefcellediting'], // bufferedrenderer plugin not working with grouping ... it is automatically instantiated/used
                                     // when store buffered = ture ... so looks like it is good to remove it here ...
    // grid configuration
	title: '', // the default title (may be overwritten by titleTpl after data is loaded)
	titleTpl: null, // if specified, reapplies this template as the title after data is loaded.
	//titleTpl: 'Labs <span style="font-weight: normal; font-style: italic;">({fromRecord}-{toRecord} of {total})</span>',
	grouping: true, // if true, the will auto-inject the grouping feature
	groupHeaderTpl: '{name} <span class="badge">{children.length}</span>', // if specified, the grouping template
    handleGrouping: null,  // allow to define action for collapse/expand of groups after store is loaded, e.g.
    bufferedStore: false, // set to False for any views that won't support paging.
	autoScroll: true,
	hideHeaders: false,
	selType: 'rowmodel',
    selModel: {
        allowDeselect: true
    },
	columns: [{header: '', flex: 1}], // columns will be configured dynamically, placeholder column is necessary in 4.1
	emptyText: 'No data found',

	// stateful configuration and editors
	stateful: false, // while this component can save/load state, we do not want to auto load/save state
	editorCmp: 'gov.va.cpe.designer.DataGridDetail', // the editor component (name or instance) use getEditor() to create/get it

	// ViewDef configuration
	viewID: null, // the viewdef to load
	viewParams: null, // the current viewdef params (or the viewdef params to autoLoad)
	curViewID: null, // the currently loaded view (null if no view loaded yet).  Do not modify directly.
	curViewParams: null, // once the view has been loaded, this represents all the parameters passed to the server

	// collapse configuration
	collapseGridIfEmpty: true, // if collapsible is true, then automatically collapse the grid if there are no rows
	collapseFirst: false,
	collapsible: false,
	collapsed: false,
	animCollapse: false,
	titleCollapse: true,
	autoSelectSingleRow: false, // if true and only one row exists in the results, automatically select it (expands rowbody as well)

	// detail panel configuration
    /**
     * The title of the detail panel when a record is selected.
     */
	detailTitle: 'Details', // default title of detail panel (when a record is selected)
    /**
     * @cfg {String} [detailTitleField]
     */
    detailTitleField: null, // (optional; overrides detailTitle) specifies which field of the currently selected record to display as the title.
    /**
     * @cfg {String} [detailTitleTpl]
     */
    detailTitleTpl: null, // (optional; overrides detailTitleField) an XTemplate to be rendered of the selected record
    /**
     * @cfg {"right"/"bottom"/"window"/"tip"/"tooltip"/"rowbody"/"none"} detailType
     * The kind of detail panel to use. Seven values are allowed:
     *
     * - 'right' - Results in the detail component being docked to the right in this panel.
     * - 'bottom' - Results in the detail component being docked to the bottom in this panel.
     * - 'window' - Results in the detail component shown in a {@link Ext.window.Window} when a row is selected.
     * - 'tip' - Results in the detail component being shown in a {@link Ext.tip.Tip} when a row is selected.
     * - 'tooltip' - Results in the detail component being shown in a {@link Ext.tip.ToolTip} when a row is hovered over.
     * - 'rowbody' - Results in the detail component being shown in each row's collapsible 'rowbody'.
     * - 'none' - Results in no master/detail behavior.
     *
     * Defaults to 'none'.
     */
    detailType: 'none', // right, bottom, window, tip (click), tooltip (hover), rowbody, none
	detail: {}, // user detail config
	
	rowBodyTpl: null, // activates the row body feature, essentially becomes an additional preview row
	
	proxyBaseUrl: '/vpr/view/',

    // flag to show that the user is currently editing the data
    underEdit: false,

	// loader used to load details.  Loader is usally on the detail panel, but it seems to work better
	// on the grid since the details can vary so much (window, panel, tooltip, etc.)
	loader: {
		grid: null, // reference to the grid that loaded these details
		rec: null, // reference to the record(s) that this detail is for
		//col: null, // reference to the column clicked on to load the details
		loadMask: true,
		
		ajaxOptions: {
			method: 'GET'
		},
		params: {
			format: 'html'
		},
		listeners:{
			beforeload: function(loader, op, eopts) {
				op.skipErrors = true;
				loader.getTarget().setLoading(false);
			}
		},
		success: function(loader, resp, opts) {
		},
		failure: function(loader, response) {
			var detailPanel = loader.getTarget();
			detailPanel.update("");
            if(response.status!=0) {
                var error = gov.va.hmp.ErrorHandler.handle(response);
                detailPanel.body.mask(error.msg, 'alert alert-danger');
            }

		},
		reload: function() {
			this.loadDetails(this.grid, this.rec);
		},
		loadDetails: function(grid, rec) {
			var detailPanel = this.getTarget();
			if(detailPanel.body)
				detailPanel.body.unmask();

			// update the member variables
			this.grid = grid;
			this.rec = rec;
//			this.col = col;
			
			// expand the compnent (if collapse).
			detailPanel.show();
			if (detailPanel.collapsible && detailPanel.collapsed) {
				detailPanel.expand();
			}
			detailPanel.setTitle(grid.getDetailTitle(rec));
			
			// you can configure which field contains the URL to load details and how its loaded
			var cfg = {};
			var uid = rec.get('uid');
			if(!uid){
				uid = rec.get('UID');
				if(!uid){
					uid = rec.get('Uid');
				}
			}	
			var strs = (grid.detailField || 'selfLink').split('|');
			cfg.params = Ext.apply({}, detailPanel.extraParams);

			cfg.renderer = (strs.length > 1) ? strs[1] : 'html';
			cfg.url = rec.get(strs[0]) || '/vpr/detail/' + encodeURIComponent(uid);
			if (cfg.url) {
//				detailPanel.update();
				this.load(cfg);
			} else {
				detailPanel.update('Unable to fetch detail for this item.  No details LINK or UID specified.');
			}
			detailPanel.body.scrollTo('top', 0);
			if(rec.data['wasViewed'] == false)
			{
				rec.data['wasViewed'] = true;
				grid.reconfigure(); // Want to let this grid know that state has changed on this row.
			}	
		}
	},
    // @private
	initFeatures: function() {
		var me = this;
		
		// inject the grouping feature (if specified)
		var features = [], viewConfig = me.viewConfig || {};
		if (me.grouping === true) {
			features = features.concat([{ftype:'grouping', id: 'grouping', groupHeaderTpl: me.groupHeaderTpl}]);
		}
		
		// inject rowbody feature (if detailtype is rowbody)
		if (me.detailType === 'rowbody') {
            features = features.concat([
                { ftype: 'rowwrap' },
                {
                    ftype: 'rowbody',
                    getAdditionalData: function (data, rowIndex, record, rowValues) {
                        // 'this' references an instance of {@link Ext.grid.feature.RowBody}
                        var headerCt = this.view.headerCt,
                            colspan = headerCt.getColumnCount();
                        return {
                            rowBody: '',
                            rowBodyCls: this.rowBodyHiddenCls,
                            rowBodyColspan: colspan
                        };
                    }
                }
            ]);
		}
		
		// if a rowbody template is specified, inject the proper features to support it
		// TODO: This is currently not compatible with setting detailType='rowbody'
		if (me.rowBodyTpl) {
			// initalize the template
			if (Ext.isString(me.rowBodyTpl)) {
                me.rowBodyTpl = new Ext.XTemplate(me.rowBodyTpl);
			}
			
			features.push({ftype: 'rowwrap'});
			features.push({
                ftype: 'rowbody',
                getAdditionalData: function(data, rowIndex, record, rowValues) {
                    // 'this' references an instance of {@link Ext.grid.feature.RowBody}
                    var headerCt = this.view.headerCt,
                        colspan = headerCt.getColumnCount();
                    return {
                        rowBody: me.rowBodyTpl.applyTemplate(data),
                        rowBodyCls: this.rowBodyCls,
                        rowBodyColspan: colspan
                    };
                }
            });
		}

		// if drag-and-drop is enabled, configure it and add the plugin
		if (this.ddConfig) {
			if (!viewConfig.plugins) viewConfig.plugins = [];
			viewConfig.plugins.push(Ext.applyIf(this.ddConfig, {ptype: 'gridviewdragdrop'}));
			this.viewConfig = viewConfig;
		}

		// add/append features
		if (this.features) {
			this.features = features.concat(this.features);
		} else {
			this.features = features;
		}
	},
    // @private
	initToolbar: function(obj) {
		if (!obj) {
			return null;
		}

		if (Ext.isString(obj) && obj.indexOf('.')) {
			// if there is a . lets assume its a full component name
			obj = Ext.create(obj);
		} else if (Ext.isString(obj)) {
			// otherwise, lets assume its a xtype/widget name
			obj = Ext.widget(obj);
		} else if (Ext.isObject(obj) && obj.xtype) {
			// its not an ext component yet, just a object
			obj = Ext.widget(obj.xtype, obj);
		} else {
			return obj;
		}

		// if there is a bindStore method, then bind the store
		if (Ext.isFunction(obj.bindStore)) {
			obj.bindStore(this.store);
		}
		if (Ext.isFunction(obj.bindGrid)) {
			obj.bindGrid(this);
		}

		return obj;
	},
    // @private
	initComponent: function() {
		var me = this;
		
		// create/configure the store for this grid
		me.store = Ext.create('Ext.data.Store', {
            autoLoad: false,
            buffered: me.bufferedStore,
            remoteSort: true,
            remoteGroup: true,
            // leadingBufferZone and pageSize is set dynamically by the viewdef.
            fields: [], // dynamically created/updated from JSON
            proxy: {
                //simpleSortMode: true,
                type: 'ajax',
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'totalItems'
                },
                limitParam: 'row.count',
                startParam: 'row.start',
                groupParam: 'group',
                sortParam: 'sort',
                directionParam: 'sort.dir',
                timeout: 30000,
                // will be updated by setViewDef()
                extraParams: {
                    mode: 'json'
                }
            }
        });
        me.selModel = Ext.apply(me.selModel, { pruneRemoved: !me.bufferedStore });

    	// initalize gridAdvisor (with a default one) if not set.
		if (Ext.isString(this.gridAdvisor)) {
			this.gridAdvisor = Ext.create(this.gridAdvisor);
		} else if (!Ext.isObject(this.gridAdvisor)) {
			this.gridAdvisor = Ext.create('gov.va.cpe.viewdef.GridAdvisor', this.gridAdvisor || {});
		}
		this.gridAdvisor.grid = this;
		
		// let the grid advisor configure any locally defined columns (columns and columnsConf)
		this.columns = this.gridAdvisor.configColumns(this.columns, this);
		if(this.columnsConf) {
			this.gridAdvisor.columnsConf = this.gridAdvisor.configColumns(this.columnsConf, this);
		}
		
        // initalize/create the toolbars and features
        this.addDocked(this.gridAdvisor.getToolbars());
    	this.tbar = this.initToolbar(this.tbarConfig);
    	this.bbar = this.initToolbar(this.bbarConfig);
    	this.initFeatures();

    	// initalize component (and detail view)
    	this.callParent(arguments);
    	this.setDetailPanel(this.detailType);
    	
    	// compile the title template (if specified) and apply it (if no default title is specified)
    	if (Ext.isString(this.titleTpl) && this.titleTpl != '') {
    		this.titleTpl = new Ext.Template(this.titleTpl, {compiled: true});
    	}
    	this.titleOrig = this.title; // needed later on for saving state.

		// attach listeners
		this.on('patientchange', this.patientchange, this);
        // TODO: consider these in onBindStore()?
        this.store.on('metachange', this.onMetaChange, this);
        this.store.on('load', this.onLoad, this);
//		// handlers for exceptions
        this.store.getProxy().on('exception', function(proxy, response, operation, eOpts) {
        	// clear the store, hide the loading mask, handle the error
            me.store.removeAll();
            if(response.status!=0) {
                var error = gov.va.hmp.ErrorHandler.handle(response);

                if (me.rendered && !me.hidden) {
                    me.setLoading({
                        msg: '<h4>Oops</h4><p>' + error.msg + '</p>' +
                            '<table class="hmp-labeled-values">' +
                            '<tr><td>status</td><td>'+error.statusLine+'</td></tr>' +
                            '<tr><td>url</td><td>'+error.url+'</td></tr>' +
                            '<tr><td>error</td><td>'+error.detail.error+'</td></tr>' +
                            '<tr><td>method</td><td>' + error.detail.className + '.' +  error.detail.methodName + '()</td></tr>' +
                            '<tr><td>line</td><td>'+error.detail.file+':'+error.detail.line+'</td></tr>' +
//                        '<tr><td>stackTrace</td><td style="height: 100px; overflow-y: scroll">'+error.detail.stackTrace+'</td></tr>' +
                            '</table>',
                        cls: 'alert alert-danger'
                    });
                }
            }
        });
		this.store.on('beforeload', function(store, op, eopts) {
		   op.skipErrors = true;
		   store.removeAll();
           me.setLoading(false);
		});
	},
    onDestroy : function() {
        gov.va.hmp.EventBus.un('viewdefUpdate', this.onViewDefUpdate, this);
        gov.va.hmp.EventBus.un('domainChange', this.onDomainChange, this);

        this.callParent(arguments);
    },
	// Listener functions  --------------------------------------------------------------/
    // private
	onMetaChange: function(store, meta) {
	        var me = this;

//	        Ext.log({level:'info', stack: false}, Ext.getClassName(this) + "[" + this.viewID + "]" + ".metachanged()");

	        // set/update the gridAdvisor if the metadata specifies one.
	        if (meta.defaults && meta.defaults['extjs.gridAdvisor']) {
	            var gridClass = meta.defaults['extjs.gridAdvisor'];
	            if (!me.gridAdvisor || me.gridAdvisor['$className'] != gridClass) {
//	                Ext.log({level:'info'}, "creating gridAdvisor " + gridClass);
	                me.gridAdvisor = Ext.create(gridClass);
	            }
	        }
	        // If no columns are defined (first load or different viewdef) then reconfigure the grid with columns
	        // me.columns did not work. It is buried under me.headerCt.gridDataColumns, at least as far as extJS4.0.7.
	        if (((!me.headerCt.gridDataColumns || me.headerCt.gridDataColumns.length <= 1) && !me.initialConfig.columns) || me.forceReconfigure || me.reconfigureColumnsAlways === true /*// Disabled b/c this results in "No Data" in some views when programmatically or UI refreshed.*/) {
	            /*
	             * reconfigure() is an Ext method to rebuild columns.
	             * gridAdvisor should be constructed with any custom user column preferences that have been persisted.
	             */
	        	me.forceReconfigure = false;
	        	var cols = me.gridAdvisor.defineColumns(me, meta);
	        	me.domains = meta.domains;
	            me.reconfigure(store, cols);

                gov.va.hmp.EventBus.on('domainChange', me.onDomainChange, me);
	        }

	        // sortable or not?
	        if (meta.sortable) {
	            me.sortableColumns = meta.sortable;
	            me.headerCt.sortable = meta.sortable;
	        }
    },

	// this is the target of the load event on the store
	onLoad: function(store, records, successful, eOpts) {
//        Ext.log({level:'info', stack: true}, Ext.getClassName(this) + "[" + this.viewID + "]" + ".onLoad()");
		var me = this;

		// colapseGridIfEmpty
		if (me.collapsible === true && me.collapseGridIfEmpty === true && (me.collapsed != (store.getCount() === 0))) {
			me.toggleCollapse();
		}
		
		// if only 1 row, expand row 1 (if setting enabled)
		if (me.autoSelectSingleRow && records.length == 1) {
			me.getSelectionModel().selectAll();
		}

		// update the grid title (if any)
		if (Ext.isObject(me.titleTpl) && Ext.isFunction(me.titleTpl.apply)) {
			// Recalculate the template variables and reapply the template
			// TODO: refactor this into a function?
			var data = {
				total : store.getTotalCount(),
				currentPage : store.currentPage,
				pageCount: Math.ceil(store.getTotalCount() / store.pageSize),
				fromRecord: Math.min(store.getTotalCount(), ((store.currentPage - 1) * store.pageSize) + 1),
				toRecord: Math.min(store.currentPage * store.pageSize, store.getTotalCount())
			};
			me.setTitle(me.titleTpl.apply(data));
		}

        if (me.handleGrouping) {
            me.handleGrouping(gov.va.hmp.PatientContext.isInPatient);
		}
	},
	
	beforeRender: function() {
//        Ext.log(Ext.getClassName(this) + "[" + this.viewID + "]" + ".beforeRender()");
        this.callParent(arguments);

        // apply a pointer cursor to the header
        if (this.collapsible && this.header) {
            this.header.body.setStyle('cursor', 'pointer');
        }
    },
	onBoxReady: function() {
//        Ext.log(Ext.getClassName(this) + "[" + this.viewID + "]" + ".onBoxReady()");
		this.callParent(arguments);

		// tooltip needs its target set after all the elements are created
		if (this.detailCmp && this.detailCmp.setTarget) {
			this.detailCmp.setTarget(this.el);
		}

        if (this.patientAware) {
            this.initPatientContext(); // trigger patientchange event (which in turns calls setViewDef() if pt context is already set
        } else {
        	if(this.viewID){
        		//Do not set the viewID if it's null
        		this.setViewDef(this.viewID);
        	}
        }

        // register listener for updates to view def
        gov.va.hmp.EventBus.on('viewdefUpdate', this.onViewDefUpdate, this);
	},

	// This is the target of the patientchange listener
	patientchange: function(pid) {
//        Ext.log(Ext.getClassName(this) + "[" + this.viewID + "]" + ".patientchange(" + pid + ")");
		this.pid = pid;
		
		//do not enable pages if invalid patient
//		if (this.pid == 0) {
//			return true;
//		} 
		
		// update the view IIF its already been rendered/queried
		this.reload();
	},

	/*
	 * In response to #MSTHRE-591, we need a way to clear out the old viewdef when setting to a different one.
	 */
	clearViewDef: function()
	{
		me.viewParams = {};
		
	},
	
	/*
	 * Primary mechanism responsible for setting the ViewDef that is rendered into the grid.
	 * Causes the viewdef controller to be queried for data to render into the grid.
	 * 
	 * extraParams are applied in addition to the viewParams specified in the config.
	 * They currently do not over-ride
	 */
	setViewDef: function(view, extraParams, forceReload, callback) {
		var me = this;
		var store = me.getStore();
//	    Ext.log({level:'info', stack: true}, Ext.getClassName(this) + "[" + this.viewID + "]" + ".setViewDef()");

		// calculate/update the current view/params and apply them to the proxy
		var sameView = (me.curViewID===view);
		me.curViewID = view;
		me.curViewParams = Ext.apply({}, extraParams, me.viewParams);
		if (me.pid) {
			// if a patient context is set, ensure its passed through (overriding all other values)
			Ext.apply(me.curViewParams, {'pid': this.pid});
		} else {
			store.removeAll();
		}
		if(me.boardReqId) {
			Ext.apply(me.curViewParams, {'boardReqId':this.boardReqId});
		}

        store.getProxy().url = me.proxyBaseUrl + me.curViewID;
		store.getProxy().extraParams = Ext.apply(store.getProxy().extraParams, me.curViewParams);
		store.leadingBufferZone = store.pageSize = me.curViewParams['row.count'] || 1000;
		
		// if we are switching to a new viewdef (or just initalizing the first one)
		if (forceReload || !sameView || (!me.headerCt.gridDataColumns) || me.headerCt.gridDataColumns.length===0) {
			// initalize the current page/limit
			store.currentPage = 1;
			// leading buffer is the essentially 1 page (TODO: probably should be configurable somehow? row.buffer?)
			
			// clear out the store model and grid columns
			this.columns = [];
			store.model.prototype.fields.clear();
			
			// intitalize grouping (if specified)
			var group = me.curViewParams[store.proxy.groupParam];
			// BEB 20130613: group() + clearGrouping() both cause the store to load, 
			// so return right away so we don't get double loading.
			if (this.store.isGrouped() && (!group || group =='')) {
				// grouping is currently set, but no grouping is requested, clear grouping
				this.store.clearGrouping();
				return;
			}
			if (group && group!='') {
				// grouping is requested, set it
				this.store.group(group);
				return;
			}
			this.reconfigure(store);
		}
		// trigger (re)load of the store
		store.load(callback);
	},
	
	/**
	 * Reload/refresh the current viewdef, with an optional different set of parameters.
	 * callback (optional) callback function after reload
	 * regroup (optional, default false) rebuild columns and grouping info? 
	 */
	reload: function(newparams, callback, regroup) {
		var params = Ext.apply(this.curViewParams || {}, newparams || {});
		var regroup = regroup || false;
		if (this.curViewID) {
			this.setViewDef(this.curViewID, params, regroup, callback);
		} else if (this.viewID && this.rendered) {
			// or load the view for the first time (if we are patient aware.
			this.setViewDef(this.viewID, params, regroup, callback);
		}

		// any current details are now no longer valid.  
		if(this.detail && this.detailCmp && this.detailCmp.rendered && this.detailType=="rowbody") {
			// In some cases, most notably when running in IE, the rowbody details get broken thru some weird container hierarchy disjointedness. 
			// Rebuilding the detail panel was the only way I was able to fix this.
			this.setDetailPanel(this.detailType);
		} else {
			this.clearDetail();
		}
	},

	/**
	 * This method creates (or recreates) the detail panel/window/tooltip/etc.
	 * 
	 * It should be safe to call this method multiple times (ie to change the dock type/position dynamically)
	 */
	setDetailPanel: function(type) {
		var me = this;

		// if a detailCmp already exists, destroy it and create a new one (unless its shared/managed externally)
		if (Ext.isDefined(me.detailCmp) && me.detailCmp.rendered && me.detailType !== 'external') {
            me.removeDocked(me.detailCmp);
			try{
                 me.detailCmp.destroy();
            } catch(e) {
				// TODO: Figure out how to make this cleaner.
				// (In some cases, destroying detail components was throwing deep-down EXT errors.
				// Most notably on Task rowbody details.)
				console.log("Error destroying detail component: "+e);
			}
            me.loader.setTarget(null);
            delete me.detailCmp;
		} 

		// update the detail config (in case its state is saved/queried)
        me.detailType = type;

		// create the detail component
		if (type == 'bottom' || type == 'right') {
			Ext.apply(me.detail, {xtype: 'griddetailpanel', cls: 'hmp-panel-detail-' + type, dock: type});
			me.detailCmp = me.addDocked(me.detail)[0];
		} else if (type == 'window') {
			Ext.applyIf(this.detail, {xtype: 'window', modal: true, collapsible: false, closeAction: 'hide',fbar:[{text:'Close',handler:function(btn){btn.up('window').close()}}]});
			this.detailCmp = Ext.widget(this.detail.xtype, this.detail);
		} else if (type == 'rowbody') {
			// create a detail panel that will be moved inside of the rowbody when shown.
            this.detail = Ext.applyIf(this.detail, {
                xtype: 'griddetailpanel',
                header: false,
                autoScroll: false,
                closable: false,
                autoRender: true,
                collapsible: false,
                resizeHandles: 's'
            });
			if(!me.rowBodyToggleEventInit) { // If we call setDetailPanel() multiple times, we don't want these events piling up.
                // <hackery> to avoid clicking on SVG causing a row select / deselect event.
                var selcheckFn = function(grid, rec, idx, eOpts){
                    var rslt = !me.skipSel;
                    me.skipSel = false;   // Reset the skip flag (in case of programmatic selection events later)
                    return rslt;
                };
                me.on({
                    itemclick: me.onItemClick,
                    beforeselect: selcheckFn,
                    beforedeselect: selcheckFn,
                    select: me.onSelect,
                    deselect: me.onDeselect,
                    resize: function() { if (Ext.isDefined(me.detailCmp)) me.detailCmp.doLayout(); },
                    scope: me
                });
                // </hackery>
				me.rowBodyToggleEventInit=true;
			}
		} else if (type == 'tooltip' || type == 'tip') {
			// configure and create the detailCmp with the extra tooltip stuff
			// most of the values in detailDefaultCfg don't really apply (except for the loader)
			var detailCfg = {
					collapsible: false,
					collapsed: false,
					target: this.el, // not defined yet, 
					delegate: '.x-grid-cell',
					autoScroll: true,
					autoHide: false,
					anchor: 'bottom',
					closable: true,
					anchorToTarget: true,
					constrainPosition: false,
					hideDelay: 1000,
					showDelay: 750,
					mouseOffset: [0,15],
					loader:  {loadMask: false}
			};
			Ext.apply(this.detail, detailCfg);
			this.detailCmp = Ext.create((type == 'tooltip') ? 'Ext.tip.ToolTip' : 'Ext.tip.Tip', this.detail);

			if (type == 'tooltip') { 
				this.detailCmp.on('show', function updateTipBody(tip) {
					var cellEl = Ext.get(tip.triggerElement);
					var rowEl = cellEl.findParentNode('.x-grid-row');
					var rec = me.view.getRecord(rowEl);
					var col = me.getSelectedColumn(cellEl, rowEl);

					tip.setTitle('Loading...');

					// call the update method to actually load the details
					return me.updateDetailPanel(rec);
				});
			}

		} else if (Ext.isObject(type) && type.isXType && type.isXType('panel')) {
			// an actual panel instance was passed in
			this.detailCmp = type;
			this.detailType = 'external';
		} else if (type == 'shared') {
			/*
			 * Ignore this, it will be set by the container.
			 * TODO: alternately, we could have the vdgp (this) actively find the first detail panel sibling.
			 */
			this.detailCmp = 'shared-XXX'; // TODO: Perhaps we should have a name that it is associated by.
			this.detailType = 'shared';
		} else if (Ext.isString(type) && type !== 'none') {
			// treat type as a string that references a component ID.
			// Since that component may not exist just yet, let the updateDetailPanel attach to it.
			this.detailCmp = type;
			this.detailType = 'external';
		}
			

		// click/select handler that will be registered (if a detail component was created)
		if (this.detailCmp) {
			this.on('selectionchange', function(rowModel, recs, e) {
                if(recs && recs.length>0) {
                    me.updateDetailPanel(recs[0]);
                } else {
                    if(me.detailCmp.collapsible) {
                        me.detailCmp.collapse();
                    }
                }
			}, this);
		}
	},
    onSelect:function(model, rec, idx, elem, evt, eOpts) {
        var me = this;
        var node = Ext.get(me.getView().getNode(rec));
        var rowbody = node.next('.x-grid-rowbody-tr');
        var rowbodyCt = rowbody.down(".x-grid-rowbody");
        var hiddenCls = 'x-grid-row-body-hidden';
        if (rowbody.hasCls(hiddenCls)) {
            rowbody.removeCls(hiddenCls);
            if (me.detailCmp && me.detailCmp.rendered) {
//                            console.log("about to destroy detailCmp in select listener");
                me.detailCmp.destroy();
                delete me.detailCmp;
            }
            me.detail.renderTo = rowbodyCt;
            me.detailCmp = Ext.widget(me.detail.xtype, me.detail);
            me.updateDetailPanel(rec);
        }
        // resize detailCmp to the rowbody size minus padding for selected row border (except for height)
        var box = rowbody.getBox(true);
//        me.detailCmp.setSize(box.width - 4, null);
//        me.detailCmp.setPagePosition(box.x + 2, box.y);
    },
    onDeselect:function(model, rec, idx, elem, evt, eOpts) {
        var me = this;
        var node = Ext.get(me.getView().getNode(rec));
        if (node) {
            var rowbody = node.next('.x-grid-rowbody-tr');
            var cls = 'x-grid-row-body-hidden';
            if (!(evt && evt.getTarget('svg'))) { // Protect against clicks originating inside of an SVG
                rowbody.addCls('x-grid-row-body-hidden');
            }
        }
    },
    onItemClick:function(a, b, c, d, evt, f) {
        var me = this;
        if (evt && evt.getTarget('svg')) { // Protect against clicks originating inside of an SVG
            me.skipSel = true;
        } else {
            me.skipSel = false;
        }
    },

	/*
	 * Based on the currently selected row, gets the Grid Column assocated with
	 * the specified HTML element.  This element must be the <TD> element that implemented the .x-grid-cell style.
	 */
	getSelectedColumn: function(el, rowEl) {
		rowEl = rowEl || this.view.getSelectedNodes()[0];
		var cols = Ext.DomQuery.select('.x-grid-cell', rowEl);

		// somewhat hacky way to get the column/row index we are hovered over.
		for(var i=0; i < cols.length; i++) {
			if(cols[i] === el) {
				return this.view.headerCt.getHeaderAtIndex(i);
			}
		}
	},
	
	
	// Detail Handling Functions ---------------------------------------------------------------/
	
	/* Resolves the detail component (if its a itemId reference) and returns it.
	 * If there is no detail component specified (detailType=none) then this will return null.
	 */
	getDetailPanel: function() {
		var me = this;
		
		// if the detail is still a string, attempt to resolve it into a component
		if (me.detailCmp && Ext.isString(me.detailCmp)) {
			if(me.detailType == 'shared') {
				var parent = this.ownerCt;
				if(parent)
				{
					for(var i = 0; i<parent.items.length; i++)
					{
						var itm = parent.items.items[i];
						if(itm.isXType && itm.isXType('griddetailpanel') /* && itm.id == this.detailCmp */)
						{
							this.detailCmp = itm;
						}	
					}	
				}	
			}
			else {
				var items = Ext.ComponentQuery.query(me.detailCmp);
				me.detailCmp = (items.length > 0) ? items[0] : null;
			}
		}
		
		return me.detailCmp;
	},
	
	clearDetail: function() {
		var me = this, detailCmp = this.getDetailPanel();
		if (!detailCmp) {
			return;
		}
		
		if (detailCmp.skipLoader !== true) {
			detailCmp.setTitle(detailCmp.emptyTitle || 'Detail:');
			detailCmp.update(detailCmp.emptyHTML);
		}

		// if autoCollapse == true, then collase the details
		if (detailCmp.collapsible === true && detailCmp.autoCollapse === true && detailCmp.rendered === true) {
			detailCmp.collapse();
		}
	},
	
	/*
	 * When a row is selected (or unselected) this method is called to update the detail panel (if any)
	 * if comp and/or rec is null, then it means a record was unselected (also occurs when a next page is selected)
	 */
	updateDetailPanel: function(rec, extraParams) {
		var me = this, detailPanel = this.getDetailPanel();
		
		// ensure the loader is pointing at the correct target and calculate the params
		if (detailPanel.skipLoader !== true) {
			var loader = me.getLoader();
			loader.setTarget(detailPanel);
			detailPanel.loader = loader;
			loader.loadDetails(this, rec);
		}
		
		// if the target is a GridDetailPanel, bind the current grid + selected records to it
		if (detailPanel.isXType('griddetailpanel') || Ext.isFunction(detailPanel.bindGrid)) {
			detailPanel.bindGrid(me, rec);
		}
		
		return true;
	},

	getDetailTitle: function(rec) {
		var me = this;

		// if a detail title template exists and is uncompiled, compile it
		if (me.detailTitleTpl && !Ext.isObject(me.detailTitleTpl)) {
			me.detailTitleTpl = new Ext.XTemplate(me.detailTitleTpl);
		}

		// determine the title and set it.
		var title = me.detailTitle || 'Detail';
		if (me.detailTitleTpl && rec) {
			title = me.detailTitleTpl.apply(rec.data);
		} else if (me.detailTitleField) {
			title = rec.get(me.detailTitleField);
		}
		return title;
	},

	// TODO: Somehow the GridAdvisor will eventually play into this.
	getEditor: function() {
		if (Ext.isObject(this.editorCmp)) {
			return this.editorCmp;
		} else if (Ext.isString(this.editorCmp)) {
			this.editorCmp = Ext.create(this.editorCmp);
			this.editorCmp.setEditorValues(this.getState());
			return this.editorCmp;
		}
		return null;
	},

    getState: function () {
        // default values, only include these in the results if the current value != the default
        // TODO: is there a better way? Can the defaults be stored seperately and referenced instead of re-declared here?
        var defaults = {
            collapseGridIfEmpty: true,
            collapsible: false,
            grouping: true,
            hideHeaders: false
        };

        var ret = {
            xtype: this.getXType(),
            // TODO: should this be the defined/declared view+params or the current/effective view+params?
            viewID: this.viewID,
            viewParams: this.viewParams,
            title: this.titleOrig,
            titleTpl: (Ext.isObject(this.titleTpl) ? this.titleTpl.html : this.titleTpl),
            groupHeaderTpl: this.groupHeaderTpl,
            detailType: this.detailType,
            tabConfig: {
                tooltip: (this.tabConfig && this.tabConfig.tooltip) ? this.tabConfig.tooltip : null
            },
            detail: this.detail
            /**
             * 4-19-2012 JC: When tooltip is chosen, somehow the detail gets set to type "none" and no width/height or anything else.
             */
        };

        this.setFieldValueIfExists(ret, this, 'flex');
        this.setFieldValueIfExists(ret, this, 'region');

        /*
         * Ideally I would like to delegate these properties to the layout, but I can't think of a clean way to do this.
         */
        this.setFieldValueIfExists(ret, this, 'height');
        this.setFieldValueIfExists(ret, this, 'width');
        this.setFieldValueIfExists(ret, this, 'gridX');
        this.setFieldValueIfExists(ret, this, 'gridY');
        this.setFieldValueIfExists(ret, this, 'weightX');
        this.setFieldValueIfExists(ret, this, 'weightY');
        this.setFieldValueIfExists(ret, this, 'widthX');
        this.setFieldValueIfExists(ret, this, 'widthY');

        // apply any non-default values
        for (var key in defaults) {
            if (this[key] !== defaults[key]) {
                ret[key] = this[key]
            }
        }

        /*
         * Storing in a special field tbarConfig will be analysed by initComponent when the component is being constructed from stored state fields.
         */
        this.setFieldValueIfExists(ret, this, 'tbarConfig');
        this.setFieldValueIfExists(ret, this, 'bbarConfig');

        /*
         * Likewise, we want to pack grouped field(s) into a custom field that will be analysed during initFeatures when the component is constructed.
         */
        if (this.features.length > 0) {
            for (var key in this.features) {
                var feature = this.features[key];
                if (feature.ftype == 'viewdefgrouping' && feature.lastGroupField != '' && !Ext.isEmpty(feature.lastGroupField)) {
                    if (!ret.viewParams) {
                        ret.viewParams = {'group': feature.lastGroupField};
                    }
                    else {
                        ret.viewParams.group = feature.lastGroupField;
                    }
//					ret.grouping = true;
                }
            }
        }

        /*
         * Column sequence, size, hide/show
         */
        var columnsConf = [];
        for (key in this.headerCt.gridDataColumns) {
            var col = this.headerCt.gridDataColumns[key];
            columnsConf.push({text: col.initialConfig.text || col.text, width: col.width, hidden: col.hidden});
        }
        if (columnsConf.length > 0) {
            ret.columnsConf = columnsConf;
        }

        /*
         * Sorting; This is stored in the datastore used by the view, the columns have nothing to do with it.
         */
        if (this.store.sorters && this.store.sorters.items && this.store.sorters.items.length > 0) {
            var sorters = [];
            for (var i = 0; i < this.store.sorters.items.length; i++) {
                var sort = this.store.sorters.items[i];
                sorters.push({property: sort.property, direction: sort.direction});
            }
            ret.store = {'sorters': sorters};
        }


        // record current detail panels height/width (if any/applicable)
        if (this.detailCmp && this.detailCmp.rendered) {
            if (ret.detailType != 'right') ret.detail.height = this.detailCmp.height;
            if (ret.detailType != 'bottom') ret.detail.width = this.detailCmp.width;
        }

        return ret;
    },

	/**
	 * Gently set values only if the field actually exists.
	 * This is a hack to avoid setting values that EXT thinks were set explicitly.
	 */
    setFieldValueIfExists: function (dest, src, fldName) {
        if (!Ext.isEmpty(src[fldName])) {
            dest[fldName] = src[fldName];
        }
    },

	applyState: function(state) {
		// TODO: Implement me
	},

	// Event/Update handling --------------------------------------------------
    onDomainChange: function (event) {
        var me = this,
            pid = event.pid,
            domain = event.domainChange,
            args = [me, pid];

        setTimeout(function () {
            if (me.getPlugin("CellEditor").editing) {
                // put the store load in a delayedtask so we dont interrupt current user action
                Ext.create('Ext.util.DelayedTask', me.onDomainChange(event))
            } else {
                if (pid == this.pid && !me.getStore().isLoading()) {
                    me.getStore().load();
                }
            }
        }, 5000, args);
    },
	
	/**
	 * Handles updates sent via the BroadcastService 
	 * either a 1) ViewDefRefreshAction or 2) ViewDefUpdateAction by default.
	 * 
	 * Extenders may override this and do more complex refreshes updates or handle custom Broadcast messages
	 * 
	 * TODO: By inspecting the store/viewdef metadata we shouldn't have to assume uid is the primary key.
	 */
	onViewDefUpdate: function(msg) {
        var viewId = msg['viewdef.id'];
        if (this.viewID != viewId) return;

        var me = this;
        var store = this.getStore();
		var pid = msg['pid'], uid = msg['uid'], type = msg['type'];
//		console.log("ViewDefGridPanel.onViewDefUpdate", pid, this.pid, uid, type);
		if (!uid || !type || !pid) return; // missing data
		if (type != 'ViewDefRefreshAction' && type != 'ViewDefUpdateAction') return; // unknown type
		if (pid != this.pid) return; // not the current patient
		if (store.isLoading()) return; // store already loading

		// refresh the viewdef
        if (type == 'ViewDefRefreshAction') {
            this.viewDefRefreshActionHandler(uid);
        }
        else if (type == 'ViewDefUpdateAction') {
            this.viewDefUpdateActionHandler(uid);
        }

	},
    // viewDefRefreshActionHandler should be overridden if the way to locate the row is not using uid
    viewDefRefreshActionHandler: function(uid) {
        var me = this;
        me.reload(null, function() {
            // try to highlight the updated row after reload
            var rec = me.getStore().findRecord('uid', uid);
            var idx = me.getStore().indexOf(rec);
            if(!rec) return; // record not found
            var node = me.getView().getNode(rec);
            if(!node) return; // Not sure how to handle this in a buffered store situation. (When we activated buffering, this node started returning null)
            Ext.fly(node).select('td').setStyle('backgroundColor', '#ffff9c');
        });
    },
    // viewDefUpdateActionHandler should be overridden if the row should be refreshed with date from the server
    viewDefUpdateActionHandler: function(uid) {

        // surgically update the store with the new record
        var rec = this.getStore().findRecord('uid', uid);
        var idx = this.getStore().indexOfId(uid);
        if(!rec) return; // record not found


        // apply new row payload (if any)
//		if (msg.updatedRow && Ext.isObject(msg.updatedRow)) {
//			rec.set(msg.updatedRow);
//		}

        // apply event param fields (if any; mostly for manual testing)
//		if (msg.event.params && Ext.isObject(msg.event.params)) {
//			rec.set(msg.event.params);
//		}

        // refresh the node and highlight all the TD values
        // since refreshing a TR doesn't work.
        this.getView().refreshNode(idx);
        var node = this.getView().getNode(rec);
        Ext.fly(node).select('td').setStyle('backgroundColor', '#ffff9c');
    }
});

