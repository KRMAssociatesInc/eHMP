Ext.define('gov.va.cpe.NewsFeedCoverSheet', {
    extend: 'Ext.panel.Panel',
    requires: [
        'gov.va.hmp.tabs.NewsFeedPanel',
        'gov.va.cpe.coversheet.ActiveProblems',
        'gov.va.cpe.coversheet.Tasks',
        'gov.va.cprs.coversheet.ActiveMedications',
        'gov.va.cprs.coversheet.Allergies'
    ],
    alias: 'widget.newsfeedcoversheet',
    title: 'News Feed',
//    padding: '0 5',
//    layout: 'border',
    padding: '0 10 10 10',
    overflowY: 'scroll',
    layout: {
        type: 'column',
        reserveScrollbar: true
    },
    dockedItems: [{
        xtype: 'patientawarepanel',
        header: false,
        resizable: false,
        height: 55,
        minHeight: 55,
        detailURL: '/vpr/view/gov.va.cpe.vpr.queryeng.RecentViewDef?mode=/patientDomain/timeline3&pid={pid}&datetime=-5y&row.count=5000',
        dock: 'top'
    }],
    items: [
        {
            xtype: 'container',
            itemId: 'col1',
            columnWidth: 0.65,
            margin: '0 20 0 0',
            defaults: {
                margin: '10 0'
            },
            items: [
                {
                    xtype: 'newsfeedpanel'
                }
            ]
        },
        {
            xtype: 'container',
            itemId: 'col2',
            columnWidth: 0.35,
            defaults: {
                margin: '10 0'
            }
        }
    ],
    
    onBoxReady:function() {
    	var me = this;
        this.callParent(arguments);
        var grid = this.query('newsfeedpanel')[0];
        this.body.on('scroll', function() {
			// compute the first/last visible record timestamps, and update the SVG timeline accordingly
        	var pos = me.getFirstLastVisibleRec(grid, grid.getView());
			me.updateSVGHighlight(pos.begin, pos.end);
			
			// if the highlight will be off the screen to the left, reload/refocus the SVG
			if (pos.end.before(me.dtmPitS)) {
				//console.log('TODO: shift SVG left', me.dtmPrev, pos.end);
			} else if (pos.begin.after(me.dtmPitE)) {
				//console.log('TODO: shift SVG right', me.dtmNext, pos.start);				
			}
        }, me);
    },
    
    initComponent: function () {
		var me = this;
        this.items[1].items = [
            Ext.create('gov.va.cpe.coversheet.ActiveProblems'),
            Ext.create('gov.va.cprs.coversheet.ActiveMedications', {
                ui: 'underlined-title-condensed',
                rowLines: false,
                columns: [
                    { xtype: 'templatecolumn', flex: 1, tpl: '{[values.products[0].ingredientName]} {[values.dosages[0].dose]} {[values.dosages[0].routeName]} {[values.dosages[0].scheduleName]}'}
                ]
            }),
            Ext.create('gov.va.cpe.coversheet.Tasks')
        ];

        this.callParent(arguments);

		// once the SVG is loaded, setup the click handlers		
		var svgPanel = this.getDockedComponent(0);
		svgPanel.getLoader().on('load', function() {
			var grid = me.query('newsfeedpanel')[0];
			
			// resize the SVG
			var svg = svgPanel.getEl().select('svg');
			svg.setSize('100%', 50);
			
        	var els = svgPanel.getEl().select('svg .placeholder');
			els.on('click', function(evt, el) {
				var start = gov.va.hmp.healthtime.PointInTime.parse(el.getAttribute('x-start'));
				var node = me.findFirstRecForDate(grid, start);
				if (node) {
					// afer some trial and error, this seems like the best scroll element
					// the obvious getEl() and body cause weird problems
					var comp = me.body.child('div');
					node.scrollIntoView(comp, false, false, false);
				}
			});
			
		});
    },
    initEvents: function () {
        var me = this;

        me.callParent(arguments);

        var components = me.query('gridpanel');
        for (var i = 0; i < components.length; i++) {
            me.mon(components[i], 'selectionchange', me.onSelectionChange, me);
        }
        
		// initialize the highlighted period the when store loads
        var grid = this.query('newsfeedpanel')[0];
        grid.getStore().on('load', function() {
    		var pos = me.getFirstLastVisibleRec(grid, grid.getView());
    		me.updateSVGHighlight(pos.begin, pos.end);
        });

    },
    // coordinates only one selection amongst all cover sheet components
    onSelectionChange: function (selModel, selection) {
        var me = this;
        var components = me.query('gridpanel');
        for (var i = 0; i < components.length; i++) {
            if (components[i].getSelectionModel() !== selModel) {
                components[i].getSelectionModel().deselectAll();
            }
        }
    },
	
	/** called to move/adjust the highlighted rectangle in the SVG to the specified begin/end point (as PointInTime's) */
	updateSVGHighlight: function(begin, end) {
      	// TODO: Move most of this calculation to the java end since its probably easier
        var svg = Ext.get('pt-timeline-highlight');
		this.dtmPrev = svg.getAttribute("xprev");
  		this.dtmNext = svg.getAttribute("xnext");
		this.dtmPitS = gov.va.hmp.healthtime.PointInTime.parse(svg.getAttribute("xs"));
		this.dtmPitE = gov.va.hmp.healthtime.PointInTime.parse(svg.getAttribute("xe"));
		this.dtmS = this.dtmPitS.toDate().getTime();
		this.dtmE = this.dtmPitE.toDate().getTime();
		this.dtmW = svg.getAttribute("xw");
		this.xPerEpoch = parseInt(this.dtmW)/(this.dtmE-this.dtmS);
	   
	    //console.log('firstNode', firstNode, firstRec.data.when);
        //console.log('lastNode', lastNode, lastRec.data.when);

        // move the highlight RECT to the proper X and width coordinates
        // TODO: Externalize this to a function so we can call to initialize
        var dtm1 = begin.toDate().getTime();
        var dtm2 = end.toDate().getTime();
        var x1 = (dtm2-this.dtmS)*this.xPerEpoch;
        var x2 = (dtm1-this.dtmS)*this.xPerEpoch;
        //console.log('x1', x1, 'x2', x2);
        
        svg.set({'x': x1, 'width': x2-x1, 'x1': begin.toString(), 'x2': end.toString()});
	},
    
    /** based on the current scroll position, find the first visible record in the specified
	grid that intersects with the body region */
    getFirstLastVisibleRec: function(grid, view) {
        var store = grid.getStore();
  	  	var first = view.getFirstVisibleRowIndex();
        var firstRec = store.getAt(first);
        var firstNode = view.getNode(firstRec);
        var gridRegion = this.body.getRegion();
        
        // first visible isn't necessarily visible (its out of scroll)
        // loop through until we find one that intersects the grid region
        while (firstNode) {
          var reg = Ext.util.Region.getRegion(firstNode);
          if (reg.intersect(gridRegion)) {
              firstRec = store.getAt(view.indexOf(firstNode));
              break;
          }
          firstNode = view.getNode(++first);
        }
        
        // now loop through and find the last visible row that
        // intersects the grid region
        var lastRec = firstRec;
        var lastNode = firstNode;
        var prevNode = lastNode;
        while (lastNode) {
            var reg = Ext.util.Region.getRegion(lastNode);
            if (!reg.intersect(gridRegion)) {
                lastNode = prevNode;
                lastRec = store.getAt(view.indexOf(prevNode));
                break;
            }
            prevNode = lastNode;
            lastNode = view.getNode(++first);
        }
		
		return {
			begin: gov.va.hmp.healthtime.PointInTime.parse(firstRec.data.when), 
			end: gov.va.hmp.healthtime.PointInTime.parse(lastRec.data.when)
		}
    },
	
	/** returns the record that is the closest match for the specified datetime */
	findFirstRecForDate: function(grid, pit) {
		var store = grid.getStore();
		var idx = 0;
		var rec = store.getAt(idx);
		var prev = rec;
		var when = gov.va.hmp.healthtime.PointInTime.parse(rec.data.when);
		
		//console.log('firstRec', pit, rec);
		while (rec && pit.before(when)) {
			prev = rec;
			rec = store.getAt(++idx);
			when = (rec) ? gov.va.hmp.healthtime.PointInTime.parse(rec.data.when) : null;
		}
		//console.log('findFirstRecForDate', prev.data.when);
		return grid.getView().getNode(prev);
	}
});
