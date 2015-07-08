Ext.define('gov.va.cpe.search.SearchBar', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.searchbar',
    requires: [
        'gov.va.cpe.search.SearchPanel'
    ],
    
    // custom config
    resultsWin: true, // if true, the results window will appear as a modal/popup.
    expandBy: 0, // auto-expand by this much when focused (0 to disable) 
    
    // standard combobox config
	plugins: ['clearbutton'],
    hideTrigger: true,
    autoSelect: false,
    minChars: 3,
    typeAhead: false,
    hideLabel: true,
    allQuery: 'gov.va.cpe.vpr.search.SuggestSearchFrame|help: syntax',
    enableKeyEvents: true,
    width: 200,
    queryDelay: 200,
    valueField: 'query',
    displayField: 'query',
    emptyText: "Search this Patient's Chart",
    matchFieldWidth: true,
    listConfig: {
    	loadingText: 'Searching...',
        emptyText: 'No suggestions found.'
    },
    tpl: [
        '<tpl for="."><div class="x-boundlist-item {cls}">',
        '<tpl if="type"><span class="label label-default pull-right" style="margin-top: 3px;">{type}</span></tpl>',
        '{display}',
        '<tpl if="category"> <span class="text-muted">in</span> <span class="text-info">{category}</span></tpl>',
        '<tpl if="browse"><i class="fa fa-chevron-right pull-right fa-2x"></i></tpl>',
        '<tpl if="example"><br/><i style="margin-left: 15px;">Example: {example}</i></tpl></div></tpl>'
    ],
    
    // listeners ---------------------------------------------------------
    listeners: {
        /** some suggestions have special properties */
    	beforeselect: function(combo, rec, idx) {
    		if (!rec.get('query')) return false; // rows without a query are not selectable (ie headers)
  
    		// type filter means to reset/apply new type filter defaults
    		var filtersPanel = this.up('searchpanel').filtersPanel;
    		if (rec.get('typeFilter')) {
    			filtersPanel.setFilters(rec.get('typeFilter'));
    		} else {
    			filtersPanel.setFilters("");
    		}
    		
    		// the browse property indicates switch to browse mode (focus on single frame)
    		if (rec.get('browse')) {
    			this.doQuery(rec.get('browse') + "|" + rec.get('query'));
    			return false;
			}
    	},
    	
    	/* special handling of ENTER key:
    	 * - select is primary event being listened on
    	 * - ENTER key needs to trigger a select event in certain circumstances
    	 * - pending suggestion query is also canceled so there is no delayed suggestion list
    	 * 
    	 * Issue here to be wary of:
    	 * - event listeners for ENTER key can trigger double selections when key navigation is
    	 * used to pick a suggestion from the list
    	 */
    	specialkey: function(field, e) {
    		if (e.getKey() == e.ENTER) {
	    		var highlighted = field.getPicker().highlightedItem;
	    		var hidden = field.getPicker().isHidden();
	    		
    			// if there is no suggestion list open or its open but nothing is highlighted, then fire selection
    			if (hidden || !highlighted) {
                  	// cancel any pending suggestions and close the suggestion list
	    			field.doQueryTask.cancel();
	                field.collapse();
	                
					var rec = field.findRecordByValue(field.getValue());
					if (rec !== false) {
						field.fireEvent('beforeselect', field, rec);
						
    				}
					field.fireEvent('select');

    			}
    		}
    		return true;
    	},
    	
    	/** If the value is changed to empty, then close the results */
    	change: function(combo, newval, oldval) {
    		if (newval == '') {
    			this.closeResults(true);
    		}
    	},
    	/** every time we show search suggestions, close the results window */
    	expand: function(field) {
    		this.closeResults(false);
    	},
    	
    	/** on focus, select the current text result and expand the width (if set) */
    	focus: function() {
    		this.selectText(); // select all of the text results
    		this.autoExpandCollapse(true);
    	},
    	
    	/** on blur, collapse the width of the box (if configured) */
    	blur: function() {
    		// only collapse the width if the results window doesn't exist, or is not visible)
    		if (!this.resultsWin || !this.resultsWin.isVisible()) this.autoExpandCollapse(false);
    	}
    },
    
    // methods --------------------------------------------------------------
    initComponent: function() {
    	var me = this;

    	me.callParent(arguments);
    	me.searchBox = me;
    	
    	// initialize the store at runtime to prevent the two search boxes from conflicting
        me.store = Ext.create('Ext.data.Store', {
        	fields:['query','display','type','category','cls','typeFilter','browse','example'],
            proxy:{
                url: '/search/suggest',
                type:'ajax',
                extraParams: {pid: 0}, // updated by changepatient event
                reader: {
                    type: 'json',
                    root: 'data.items',
                    totalProperty: 'totalItems'
                }
            }
        });
    	
        // this indicates this search bar is functioning as a quick search popup window
    	if (me.resultsWin) {
    		me.resultsWin = Ext.create('gov.va.cpe.search.SearchPanel', {
             	height: 500,
				width: 600,
            	floating: true,
				multi: false,
				header: false,
				closable: true,
				closeAction: 'hide',
				showDockedSearchBar: false,
                showFilters: false,
				doAlignTo: me.searchBox,
				fbar: ['->',{xtype:'button', text: 'Close', onClick: function() {me.closeResults(false)}}]
    		});
    		me.resultsWin.bindSearchBox(me.searchBox, me.searchBtn);

    		// listen to this event to hide the search window if a new patient is selected
    		gov.va.hmp.EventBus.on('beforepatientselectconfirmed', me.closeResults, this);
    		
    		// if the window is resized, re-align this floating window to the searchbox
		    Ext.EventManager.onWindowResize(function () {
                if (me.resultsWin && me.resultsWin.rendered && me.resultsWin.isVisible()) {
                    me.resultsWin.alignTo(me.searchBox);
                }
		    });
    		
    		// add a hotkey
    		var map = new Ext.util.KeyMap({target: Ext.getBody(), binding: [
            	{key: 's', ctrl: true, defaultEventAction: 'preventDefault', fn: function() {me.focus();}}
        	]});
    	}
    	
//    	Ext.util.Observable.capture(this, function() {console.log(arguments);});
    },
    
    autoExpandCollapse: function(expand) {
    	if (this.expandBy && expand === true && !this.isAutoExpanded) {
    		this.setWidth(this.getWidth()+this.expandBy);
			this.isAutoExpanded = true;
    	} else if (this.expandBy && expand === false && this.isAutoExpanded === true) {
    		this.setWidth(this.getWidth()-this.expandBy);
			this.isAutoExpanded = false;
    	}
    },
    
    // overloaded to put the triggers on the left and add some extra white background attributes
    getSubTplMarkup: function () {
        var me = this, extra = 'style="background-color: white;"', 
            field = Ext.form.field.Trigger.superclass.getSubTplMarkup.apply(this, arguments);
        return '<table id="' + me.id + '-triggerWrap" class="' + Ext.baseCSSPrefix + 'form-trigger-wrap" ' + extra + ' cellpadding="0" cellspacing="0"><tbody><tr>' +
            me.getTriggerMarkup() +
            '<td id="' + me.id + '-inputCell" class="' + Ext.baseCSSPrefix + 'form-trigger-input-cell">' + field + '</td>' +
            '</tr></tbody></table>';
    },
    closeResults: function(reset) {
		var searchpanel = this.up('searchpanel');
		if (searchpanel) {
            if (reset) {
                searchpanel.reset();
            } else {
                searchpanel.clearResults();
            }
        }
    	if (this.resultsWin && this.resultsWin.isVisible()) {
    		this.resultsWin.close();
    		this.setValue('');
    		this.autoExpandCollapse(false); // also collapse the search (if configured)
    	}
    },
    doAlign: function(){
        var me = this,
            picker = me.picker,
            aboveSfx = '-above',
            isAbove;

        me.picker.alignTo(me.getEl(), me.pickerAlign, me.pickerOffset);
        // add the {openCls}-above class if the picker was aligned above
        // the field due to hitting the bottom of the viewport
        isAbove = picker.el.getY() < me.getEl().getY();
        me.bodyEl[isAbove ? 'addCls' : 'removeCls'](me.openCls + aboveSfx);
        picker[isAbove ? 'addCls' : 'removeCls'](picker.baseCls + aboveSfx);
    }
});