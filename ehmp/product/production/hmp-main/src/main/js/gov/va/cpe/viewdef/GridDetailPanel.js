/**
 * Attempting to consolodate detail panels from ViewDefGridPanel and MultiGridPanel.js into 1 reusable panel.
 * 
 * I'm trying to figure out if/how to migrate some ViewDefGridPanel functionality here.
 * I need to support the following:
 * 1) Detail panel needs toolbar, menu, tools, etc to toggle different detail flavors.
 * -- having difficulting figuring out how/if/where to have the detail panel reload to a different detail flavor?
 * 2) Detail panel may need to take cue from multiple grids (condition review scenario)
 * 3) Going back-and-forth trying to figure out if the loader should belong to ViewDefGridPanel and/or GridDetailPanel?
 * -- Seems like redundant configuration to have it be part of the detail tip/window/etc.
 * 4) Is there a use case for multi-select selection model?  How does that effect the details?
 * -- Array of recs?
 * 
 * 5/4/2012 ideas:
 * - how can GridAdvisor contribute detail panel configuration?
 * - turn into a card layout with predefined "cards" chart/table/html?
 * - cards get a toolbar/buttons generated automatically to swap/switch between them?
 * - chart card gets rewritten if/when needed (for multi-series)
 * - since chart/table may be driven by an alternate ViewDef, use its GridAdvisor to build a toolbar for details?!?
 * - create an API function for handling its update (which card to activate, etc
 * 
 * TODO: Stacked chart mode?
 */
Ext.define('gov.va.cpe.viewdef.GridDetailPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.griddetailpanel',
    requires: [
        'gov.va.cpe.viewdef.RowActionContainer',
        'gov.va.cpe.ChartPanel',
        'gov.va.hmp.util.LayoutUtil'
    ],

    //dock: 'bottom',
	resizable: true, // is the detail window resizable (applies to all detailTypes, except none).  For right, bottom, the detailBorder will be ajusted appropriately
	//resizeHandles: 'w',
	itemId: 'griddetailpanelid',
	collapseFirst: false,
	collapsible: true, // collapse is only applicable to right and bottom detailTypes
	collapseDirection: 'right', 
	collapsed: true,
	titleCollapse: true, 
	animCollapse: false, 
	autoCollapse: true, // if collapsible is true and there is no detail record to display, then collapse the detail automatically.
	
	autoScroll: true,
	minHeight: 150,
	minWidth: 250,

	emptyTitle: 'Detail', // displayed when there when no record is selected
	emptyHTML: '<span class="text-muted">No item selected</span>',
	
	extraParams: null, // if defined, additional params that are added to the details URL/POST.
	layout: 'card',
	tools: [],

	// currently bound grid + records (if any)  
	boundGrid: null,
	boundRecs: null,
	deselectMode: true, // iif true, attempt to deselect any currently selected record on another grid
	
	// dock the action
	actionDock: null, // left, right, none/null - where to automatically dock the action menu (if any)

	/**
	 * TODO: I'm having trouble finding a way to monitor the content for changes and to automatically 
	 * change the height of this componentent to prevent any scrollbars (maybe up to a max).
	 */
	smartHeight: true,
	chartCfg: {
		xtype: 'chartpanel',
		legend: {position: 'top'}
	},
	
	items: [{xtype: 'component', tag:'detail'}],

	initComponent: function() {
        var me = this;

		if (this.collapsible && this.autoCollapse) {
			this.collapsed = true;
		}
		
        delete this.height;
	    // bottom has some slight differences from right
	    if (this.dock == 'bottom' && this.resizable === true) {
	    	Ext.apply(this, {resizeHandles: 'n', collapseDirection: 'top'});
	    }
	    
    	this.callParent(arguments);
    	
    	// create the action menu and dock it (if configured)
    	if (this.actionDock && this.actionDock !== 'none') {
    		this.actionPanel = Ext.create('gov.va.cpe.viewdef.RowActionContainer', {dock: this.actionDock});
    		this.addDocked(this.actionPanel);
    	}

        // if we are using smartHeight, attach a doLayout() command to the window resize event
        // to properly resize the component whent the window is resized
        if(me.smartHeight === true) {
            Ext.EventManager.onWindowResize(function () {
                me.doLayout();
            });
        }

    	this.setTitle(this.emptyTitle);
    	//this.update(this.emptyHTML);
	},
    afterRender: function() {
      this.callParent(arguments);
        // apply a pointer cursor to the header
        if (this.collapsible && this.header) {
            this.header.body.setStyle('cursor', 'pointer');
        }
    },
	setCard: function(idx) {
		if (this.rendered) {
			// adjust the active card
			this.getLayout().setActiveItem(idx);
			
			// also make sure the toggle button is selected
			var btn = this.down('button[cardIdx=' + idx + ']');
			if (btn && btn.enableToggle === true) {
				btn.toggle(true);
			}
			
			// expand if collapsed (and the ownerCt layout will support the expand() method)
			if(this.collapsed && Ext.isFunction(this.ownerCt.calculateChildBoxes))
			{
				this.expand();
			}

//			// remove error mask, if there is one
//			var item = this.getLayout().getActiveItem(idx);
//		    var area = (item.body)?item.body:item.el
//		    if(area){area.unmask();}

		}
	},
	
	/*
	 * This overrides the default update and redirects it to card#1 which is where the actual
	 * html details should be shown.  To update one of the other cards (ie chart), use updateChart()
	 */
	update: function(htmlOrData, loadScripts, callback) {
		// redirect update to the first card (and ensure its visible)
		this.items.get(0).update(htmlOrData, true, callback);
		//this.items.get(0).body.unmask();
		this.setCard(0);
	},
	
	/**
	 * This details panel sometimes needs to know which grid/records its currently bound to.
	 */
	bindGrid: function(grid, recs) {
		var me = this;
		
		// if deselect is active, and this is a different grid than the previously bound grid...
		if (this.deselectMode === true && this.boundGrid != grid && this.boundRecs) {
			this.boundGrid.getSelectionModel().deselect(this.boundRecs);
		}
		
		// store which grid/rec we are bound to (rec may be an array)
		this.boundGrid = grid;
		this.boundRecs = recs;
		
		// if there is a bound action panel, refresh it
		if (this.actionPanel && recs && recs.get('uid')) {
			this.actionPanel.reset();
			
			// make call to load any actions for this UID
			var url = "/frame/exec?entryPoint=gov.va.cpe.vpr.rowaction&uid=" + recs.get('uid');
			this.actionPanel.fetchActions(url, function() {
				// if the smartHeight is enabled, try to resize the panel after the details are loaded
				if (me.smartHeight === true) {
                    me.doLayout();
//					me.updateLayout({defer: false});
				}
			});
			
			// load any actions already part of the record
			if (recs.get("actions")) {
				this.actionPanel.addActions(recs.get("actions"));
			}
		}
	},

	reload: function(extraParams) {
		var loader = this.getLoader();
		if (extraParams) {
			this.extraParams = extraParams;
		}
		if (loader) {
			loader.reload();
		}
	}
});
