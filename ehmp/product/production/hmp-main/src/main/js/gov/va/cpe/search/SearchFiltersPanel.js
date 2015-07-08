Ext.define('gov.va.cpe.search.SearchFiltersPanel', {
    extend: 'Ext.Container',
    alias: 'widget.searchfilters',
    padding: '0 5 0 5',
    layout: {
    	type: 'hbox',
    	align: 'middle'
    },
    items: [
        {
            xtype: 'component',
            height: 32,
            hidden: true,
            margin: '2 0 0 0',
            html: '<span style="font-size: 10px; line-height: 22px">Filter</span>'
        },
        {
            xtype: 'tbspacer'
        },
        {
            xtype: 'segmentedbutton',
            itemId: 'typeFilter',
            hidden: true,
            ui: 'pill',
            allowDepress: true,
            allowMultiple: true,
            scale: 'extra-small',
            defaults: {
                margin: '2 1 12 1'
            },
            items: [
                {
                    text: 'All',
                    pressed: true,
                    data: {
                        type: ''
                    }
                },
                {
                    text: 'Meds',
                    data: {
                        type: 'med'
                    }
                },
                {
                    text: 'Labs',
                    data: {
                        type: 'result'
                    }
                },
                {
                    text: 'Orders',
                    data: {
                        type: 'order'
                    }
                },
                {
                    text: 'Vitals',
                    data: {
                        type: 'vital'
                    }
                },
                {
                    text: 'Documents',
                    data: {
                        type: 'document',
                        	
                    }
                },
                {
                    text: 'Observations',
                    data: {
                        type: 'obs'
                    }
                },
                {
                    text: 'Other',
                    data: {
                        type: 'other'
                    }
                }                
            ]
        },
        {
            xtype: 'tbfill'
        },
        {
            xtype: 'component',
            height: 32,
            margin: '2 0 0 0',
            html: '<span style="font-size: 10px; line-height: 22px">Date Range</span>'
        },
        {
            xtype: 'tbspacer'
        },
        {
            xtype: 'segmentedbutton',
            itemId: 'rangeFilter',
            ui: 'pill',
            allowDepress: true,
            scale: 'extra-small',
            defaults: {
                margin: '2 1 12 1'
            },
            items: [
                {
                    text: 'All',
                    pressed: true,
                    data: {
                        dateRange: ''
                    }
                },
                {
                    text: '2y',
                    data: {
                        dateRange: 'T-2y'
                    }
                },
                {
                    text: '1y',
                    data: {
                        dateRange: 'T-1y'
                    }
                },
                {
                    text: '3mo',
                    data: {
                        dateRange: 'T-3m'
                    }
                },
                {
                    text: '1mo',
                    data: {
                        dateRange: 'T-1m'
                    }
                },
                {
                    text: '7d',
                    data: {
                        dateRange: 'T-7d'
                    }
                },
                {
                    text: '72h',
                    data: {
                        dateRange: 'T-72h'
                    }
                },
                {
                    text: '24h',
                    data: {
                        dateRange: 'T-24h'
                    }
                }
            ]
        }
    ],

    initComponent: function() {
    	 var me = this;
         me.callParent(arguments);
         
         // setup listeners for checkbox handling
        me.mon(me.down('#typeFilter'), 'toggle', me.onButtonToggle, me);
        me.mon(me.down('#rangeFilter'), 'toggle', me.onButtonToggle, me);
        me.allfilter = me.down('#typeFilter').down("button[text='All']");
        me.otherfilter = me.down('#typeFilter').down("button[text='Other']");

         // delayed task so we don't trigger too many search requests
         this.searchTask = new Ext.util.DelayedTask(function(){
        	 me.up('searchpanel').reload();
    	 });
    },
    onButtonToggle: function(container, button, pressed){
    	//console.log('onButtonToggle', container, button, pressed);
        if (!this.rendered) return;
        if (pressed && container.itemId === 'typeFilter') {
            if (button === this.allfilter) {
                for (var i = 0; i < container.items.getCount(); i++) {
                    if (container.items.get(i) !== this.allfilter) {
                        container.items.get(i).toggle(false);
                    }
                }
            } else {
                this.allfilter.toggle(false);
            }
        }
        container.refreshPressedButtons();
        this.searchTask.delay(200);
    },
    
    /** reset the filter list and activate the specified filters (list or array).  Empty or null for all. */
    setFilters: function(filterList) {
    	var filters = {};
    	if (filterList && Ext.isArray(filterList)) {
    		for (var i in filterList) {
    			filters[filterList[i]] = true;
    		}
    	} else if (filterList) {
    		var parts = filterList.split(',');
    		for (var i in parts) {
    			filters[parts[i]] = true;
    		}
    	}
        
        // loop through each filter button, toggle if necessary
    	var types = this.down('#typeFilter');
        for (var i = 0; i < types.items.getCount(); i++) {
    		var t = types.items.get(i);
    		var selected = Ext.isDefined(filters[t.data.type]);
            var all = (t.data.type === '' && Ext.Object.isEmpty(filters));
    		t.toggle(selected || all, true);
    	}
        
        // reset the range filter to all
        var range = this.down('#rangeFilter');
        for (var i = 0; i < range.items.getCount(); i++) {
            var t = range.items.get(i);
            t.toggle(t.data.dateRange === '', true);
        }
    },
    
    /**
     * When search results come back, use the facet data to list the number of search results
     * for each filter.  
     */
    updateMetaData: function(meta) {
    	var facets = meta.facets || {},
            tot = meta.unfilteredTotal,
            i, facet, key, 
            typeFilters = this.down('#typeFilter'),
            rangefilters = this.down('#rangeFilter');

        if (!this.rendered) return;

    	// loop through all time filters
    	for (i = 0; i < rangefilters.items.getCount(); i++) {
    		var filter = rangefilters.items.get(i);
    		var val = filter.data.dateRange || "all";
    		filter.getEl().dom.removeAttribute('data-notifications');
            filter.enable();
    		if (Ext.isDefined(facets[val])) {
    			// fetch and remove it so we know whats left at the end
                var resultCount = facets[val];
                delete facets[val];
                if (resultCount >= 100) {
                	resultCount = '99+';
                }

                if (resultCount) {
                    filter.getEl().set({'data-notifications': resultCount});
                } else {
                    filter.disable();
                }
          	}
    	}
    	
    	// manage the type filters (domains) 
        if (tot && tot >= 100) {
            tot = '99+';
        }
    	this.allfilter.getEl().set({'data-notifications': tot});
    	for (i = 0; i < typeFilters.items.getCount(); i++) {
    		var filter = typeFilters.items.get(i);
    		var val = 'domain:' + filter.data.type;
            if (filter != this.allFilter) {
                filter.getEl().dom.removeAttribute('data-notifications');
            }
            filter.enable();
            if (Ext.isDefined(facets[val])) {

    			// fetch and remove it so we know what is left at the end
    			var resultCount = facets[val];
    			delete facets[val];
                if (resultCount >= 100) {
                	resultCount = '99+';
                }

                if (resultCount) {
                    filter.getEl().set({'data-notifications': resultCount});
                } else {
                    filter.disable();
                }
            } else if (filter != this.allfilter) {
                filter.disable();
            }
    	}
    	
    	// compute leftover domain: values, and leave that as other
    	var other = 0;
        var otherKeys = [];
    	for (key in facets) {
    		var val = facets[key];
    		if (key.indexOf('domain:') == 0) {
    			other += facets[key];
                otherKeys.push(key.split('domain:')[1]);
    		}
    	}
    	if (other) {
            this.otherfilter.show();
            this.otherfilter.data.type = otherKeys;
    		this.otherfilter.getEl().set({'data-notifications': other});
    	}
    },
    
    getValues:function() {
    	// get data.type for all pressed buttons
        var types = Ext.Array.map(this.down('#typeFilter').items.items, function(btn){
            if (btn.pressed === true) {
                return btn.data.type;
            }
        });
        var bns = this.down('#rangeFilter').getPressedButtons();
        if((!bns[0]) || (!bns[0].data)) {
        	// IE will sometimes fire when there are no selected buttons, so we need a check for that.
        	return;
        }
        var range = this.down('#rangeFilter').getPressedButtons()[0].data.dateRange;
        return {
            types: Ext.Array.clean(types),
            range: range
        };
    }
});