/**
 * This is the primary search results/details/navigation panel.
 * 
 * It coordinates with 4 other components:
 * 1) SearchBar (a toolbar with a search box)
 * 2) SearchFiltersPanel (domain and date filter options)
 * 3) SearchResultsPanel (the actual search results, grouped + sorted)
 * 4) SearchDetailsPanel (when a search item is selected, the details show in this panel)
 * 
 * There are 2 modes of operation, one for a full panel, one for a popup/modal window.
 * 
 * The default mode is to show both the search results and search details at the same time.
 * 
 * Alternatively, (when multi=false) the results and details will expand and collapse as needed
 * so that less screen area is needed.
 * 
 * TODO: Try to get rid of SearchResultsPanel, is it the same as ViewDefDetailsPanel?
 */
Ext.define('gov.va.cpe.search.SearchPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'gov.va.cpe.search.SearchResultsPanel',
        'gov.va.cpe.search.SearchDetailPanel',
        'gov.va.cpe.search.SearchFiltersPanel',
        'gov.va.cpe.search.SearchByCategoryButton',
        'gov.va.hmp.util.LayoutUtil'
    ],
    mixins: {
        patientaware: 'gov.va.hmp.PatientAware'
    },
    uses: [
        'gov.va.cpe.search.SearchBar'
    ],
    alias: 'widget.searchpanel',
    frame: false,
    border: 0,
    title: 'Search',
    /**
     * @cfg {Boolean [multi=true]
     * if true, filters, results, details are all allowed open at the same time.  False for smaller window mode
     */
    multi: true,
    /**
     * @cfg {Boolean} [showDockedSearchBar=true]
     * true to add a toolbar with searchbox as docked item and bind to it
     */
    showDockedSearchBar: true,
    /**
     * @cfg {Boolean} [showFilters=true]
     * true to add filters above results and details
     */
    showFilters: true,
    layout: 'border',
    itemId:'searchpanel',
    defaults: {
    	collapsible: true, hideCollapseTool: true
    },
    items: [
        {
        	xtype: 'searchfilters',
        	region: 'north',
            hidden: true
        },
        {
            xtype: 'container',
            region: 'center',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'searchresults',
                    hidden: true,
                    flex: 3
                },
                {
                    xtype: 'splitter',
                    hidden: true
                },
                {
                    xtype: 'searchdetail',
                    hidden: true,
                    height: 'auto',
                    flex: 5
                }
            ]
        }
    ],
    listeners: {
        patientchange: function(pid) {
            if (this.searchBox) {
                this.searchBox.getStore().removeAll();
                this.searchBox.getStore().getProxy().setExtraParam('pid', '');
                this.searchBox.setValue('');
            }
            this.down('searchresults').store.removeAll();
            this.down('searchresults').store.getProxy().url = '';

            this.pid = pid;

            if (this.searchBox) { // not fully initialized yet
                this.searchBox.getStore().getProxy().setExtraParam('pid', pid);
                this.down('searchresults').store.getProxy().url = '/vpr/v1/search';
                /* disabled per discussion
                // rerun search under new pid
                if (pid != null) {
                    // patientchange event handlers are out of order in this courtroom! So, I need to set it here, even tho the SearchResultsPanel seems to do this in its handler correctly (but too late in the game)
                    this.down('searchresults').store.getProxy().url = '/vpr/v1/search';
                    this.reload();
                }
                */
            }

            return true;
        }
    },
    // @private
    backgroundVisibleStyle: {
        margin: '20px 0px 0px 0px',
        padding: '220px 60px 220px 140px',
        'background-image': 'url("/images/shutterstock_110545871.jpg")',
        'background-color': '#fff',
        'background-repeat': 'no-repeat',
        'background-position': '50% 50%',
        'background-size': '85% auto'
    },
    // @private
    backgroundHiddenStyle: {
       margin: '0px',
       padding: '20px 60px 0px 140px',
       'background-image': 'none'
    },
    initComponent: function() {
        var me = this;

        me.callParent(arguments);
        
    	this.initPatientContext(); // TODO: Why isn't this happening automatically anymore?
    	
        me.resultsPanel = this.down('searchresults');
        me.detailPanel = this.down('searchdetail');
        me.filtersPanel = this.down('searchfilters');
        
        // to add the search box or not?
        if (me.showDockedSearchBar === true) {
        	var bar = me.addDocked({
                xtype: 'container',
                itemId: 'searchBarCt',
                dock: 'top',
                style: me.backgroundVisibleStyle,
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                items: [
                    {
                        xtype: 'searchbar',
                        cls: 'search-group-field',
                        flex: 1,
                        hideTrigger: true,
                        resultsWin: false
                    },
                    {
                        xtype: 'button',
                        itemId: 'searchBtn',
                        ui: 'primary',
                        cls: 'hmp-input-group-btn-right search-group-btn',
                        glyph: 'xF002@FontAwesome'
                    },
                    {
                        xtype: 'tbspacer',
                        width: 4
                    },
                    Ext.create('gov.va.cpe.search.SearchByCategoryButton', {
                        itemId: 'searchByCategoryBtn'
                    })
                ]
            })[0];
        	me.bindSearchBox(bar.down('searchbar').searchBox);
        }
        
    	// add a 'return to search results' toolbar/button
    	if (!this.multi) {
    		this.getDetailPanel().addDocked({
    			xtype:'toolbar', dock: 'top', 
    			items: [{xtype: 'button', text: '&laquo; Back to Results', ui: 'link', onClick: function() {me.showResults()}}]
    		});
    	}

        var detail = me.getDetailPanel();
        detail.setDecorateFn(Ext.bind(this.highlightDetail, this));

        /*
         * For some reason I can't figure out, this event gets fired twice for each selection on the grid.
         * This results in a double-call to the loader on the panel, and that gives us a nice JS exception from deep within the bowels of EXT.
         * So I've made a condition not to call it twice if the "appliedItem" has already been set.
         */
        me.getSearchResultsPanel().on('selectionchange', function(selModel, selected) {
            if (selected.length == 0) {
                if(detail.appliedItem!=null) {
                    detail.applyDetailItem(null);
                    detail.appliedItem = null;
                }
            } else {
            	this.showDetails();
            	if(detail.appliedItem!=selected[0]) {
                    detail.applyDetailItem(selected[0], this.getFiltersPanel().getValues());
                    detail.appliedItem = selected[0];
            	}
            }
        }, me);
        
        
//        Ext.util.Observable.capture(this, function() {console.log('searchpanel', arguments);});
    },
    initEvents: function () {
        this.callParent(arguments);

        if (this.showDockedSearchBar) {
           this.mon(this.down('#searchBtn'), 'click', this.search, this);
           this.mon(this.down('#searchByCategoryBtn'), 'select', this.onSelectSearchCategory, this);
        }
    },

    onSelectSearchCategory: function(menuitem, record) {
        var browse = record.get('browse'),
            query = record.get('query');
        if (!browse) {
            this.searchBox.setRawValue(query);
            this.searchBox.focus();
            this.search();
        }
    },

    /**
     * Set the search box + button to respond to.  
     * Usually only used if you set showDockedSearchBar=false and want to use a different searchbox
     */
    bindSearchBox: function(searchBox) {
    	var me = this;
        me.searchBox = searchBox;
    	
    	// bind to both the select and the specialkey event (for enter)
    	searchBox.on('select', me.search, me);
    },

    /** 
     * when showing results, ensure the window is visible, collapse the previous details
     * and show the filters (if multi=true)
     */
    showResults: function() {
        // hide the background image
        var searchBarCt = this.down('#searchBarCt');
        if (searchBarCt) {
            var searchBarCtEl = searchBarCt.getEl();
            for (var styleName in this.backgroundHiddenStyle) {
                searchBarCtEl.setStyle(styleName, this.backgroundHiddenStyle[styleName]);
            }
        }

        if (this.showFilters) {
            this.getFiltersPanel().show();
        }
        this.getSearchResultsPanel().show();
    	// if details is a floating window, ensure its shown() and aligned properly.
    	var detail = this.getDetailPanel();
        detail.hide();
        if (this.floating) {
    		this.show();
       		if (this.doAlignTo) {
       			this.alignTo(this.doAlignTo);
       		}
    	}
    },

    showDetails: function() {
        this.down('splitter').show();
    	this.getDetailPanel().show();
//    	this.getDetailPanel().expand();
    	if (!this.multi) {
	    	this.getSearchResultsPanel().hide();
//            this.down('splitter').hide();
    	}
    },

    getSearchResultsPanel: function() {
        return this.resultsPanel;
    },

    getDetailPanel: function() {
    	return this.detailPanel;
    },

    getFiltersPanel: function() {
    	return this.filtersPanel;
    },

    getSearchTerm: function() {
        return this.searchBox.getValue();
    },
    
    getSearchParams: function() {
    	return this.getFiltersPanel().getValues();
    },

    /** repeat the last search (if any).  Usually called when adjusting filters or switching patients */
    reload: function() {
    	if (this.lastSearchTerm && !this.isHidden()) {
            this.searchBox.setValue(this.lastSearchTerm);
    		this.showResults();
    		this.getSearchResultsPanel().searchFor(this.lastSearchTerm, this.getSearchParams());
    	}
    },
    
    /** main function to kick off a search */
    search: function() {
        var searchTerm = this.getSearchTerm();
        if (!searchTerm) return;
       	this.showResults();
        this.getSearchResultsPanel().searchFor(searchTerm, this.getSearchParams());
        this.lastSearchTerm = searchTerm;
    },
    
    /** clear results and reset filters/counts/etc. */
    clearResults: function() {
        this.lastSearchTerm = null;

        Ext.suspendLayouts();
        if (this.showFilters) {
            this.getFiltersPanel().hide();
        }
        this.getSearchResultsPanel().hide();
        this.down('splitter').hide();
        this.getDetailPanel().hide();
        this.getDetailPanel().applyDetailItem(null);
    	this.getSearchResultsPanel().statusBar.hide();
    	this.getFiltersPanel().updateMetaData({});
    	this.getSearchResultsPanel().store.removeAll();

        Ext.resumeLayouts();
    },
    reset: function() {
        this.clearResults();

        // show the background image
        if (this.rendered) {
            var searchBarCt = this.down('#searchBarCt').getEl();
            for (var styleName in this.backgroundVisibleStyle) {
                searchBarCt.setStyle(styleName, this.backgroundVisibleStyle[styleName]);
            }
        }
    },
    highlightDetail: function(text) {
        var searchTerm = this.getSearchTerm();
        if (searchTerm) {
            text = this.highlightMatches(text, searchTerm);
        }
        return text;
    },
    highlightMatches: function(text, searchTerm) {

        var inNode= false;
        for(var i = 0; i < text.length; ++i) {
            // check every character, compare against the search string and note when we are in a tag
            if(inNode) {
                // fast forward to ending bracket
                while(text[i] != '>') {
                    ++i;
                }
                inNode = false;
            }
            if(text[i].toUpperCase() === searchTerm[0].toUpperCase() && !inNode) {
                // found a character of the search term, lets see if the word is present
                var j = 0;
                while(j < searchTerm.length && text[i+j].toUpperCase() === searchTerm[j].toUpperCase()){
                    ++j;
                }
                if(j == searchTerm.length) {
                    // found a match, wrap it
                    text = text.substring(0, i) + '<span class="cpe-search-term-match">' + text.substring(i, i + searchTerm.length) + '</span>' + text.substring(i + searchTerm.length, text.length);
                    i = i + 43;
                }
            }
            if(text[i] === '<') {inNode = true;}
        }
        return text;
    }
});
