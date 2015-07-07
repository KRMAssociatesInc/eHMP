/**
 * This is a column that is used to load SVG images and then attach some special handlers
 * once loaded.
 * 
 * - It can handle raw SVG data or a URL to load to fetch the SVG data in another call
 * - attaches drag/scroll listeners to each SVG
 * - attaches some special click handlers, to facilitate the interaction between an SVG and the rest of the row/detail
 * 
 * - TODO: create a visual scroll/click left/right element to indicate when there is more data
 * - TODO: attach the same column function to each SVG instead of building new ones
 * - TODO: create a crosshairs option for lab sparklines  
 */
Ext.define('gov.va.cpe.viewdef.SparklineColumn', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.sparklinecolumn',
	sortable: false,
	resizable: true,
	hideable: false,
	menuDisabled: true,
	svgs: [], // the SVG wrapper DIV element id's
	
	initComponent: function() {
		this.callParent([arguments]);
		this.scope = this;
		this.delayActionTask = new Ext.util.DelayedTask(function() {
			var x= Ext.fly(this.delayActionEl); 
			if (x) x.dom.click();
		}, this);
	},

	
	listeners: {
		resize: function(comp, width, height, oldWidth, oldHeight, eOpts) {
			for (var i in this.svgs) {
                if(Ext.fly(this.svgs[i])) {

                    var svg = Ext.fly(this.svgs[i]).down('svg');

                    // adjust the SVG viewbox width to equal the column width
                    svg.dom.viewBox.baseVal.width = width;
                    svg.setStyle("width", width + "px");

                    // try to refocus the timeline to the right
//				svg.dom.viewBox.baseVal.x = svg.dom.width-width;
//				console.log('newwidth', width, svg.getAttribute('width'));
                }
			}
		}
	},
	
	renderer: function(val, metaData, rec, rowIdx, colIdx, store, view) {
		if (val == null) return;
		var id = Ext.id();
		var me = this;
		this.svgs.push(id);
		
		// remove the padding
		metaData.style="padding: 0px;";
		
		if (val.indexOf('/') == 0) {
			console.log('load svg at: ' + val);
			
//			Ext.Ajax.request({
//				url: val, 
//				success: function(resp) {
//					console.log('svg resp: ', resp);
//					var wrapper = Ext.fly(id);
//					if (wrapper) wrapper.setHTML(resp.responseText);
//				}
//			});
			
			return '<div class="hmp-sparkline-wrapper" style="" id="' + id + '">' + val + "</div>";
		}
		
		Ext.TaskManager.start({
			scope: this,
			interval: 100,
			repeat: 1,
			run: function() {
				var wrap = Ext.fly(id);
				if (!wrap) return;
				var svg = wrap.down('svg');
				if (!svg) return;
				
				svg.on('mouseout', function(evt) {
					// weird case were dragging over other inner SVG elements (lines rectangles, etc)
					// causes a mouse out, suppress these to make the scrolling less finicky
					var target = evt.getTarget();
					if (target.ownerSVGElement) {
						return;
					}
					
					// exit drag mode
					this.dom.hmpDragX = null;
				});
				svg.on('mouseup', function(evt) {
					// exit drag mode
					this.dom.hmpDragX = null;
				});
				
				svg.on('mousemove', function(evt) {
					// quit if not in drag mode
					if (!this.dom.hmpDragX) return;
					
					// how far to scroll?
					var diff = this.dom.hmpDragX- evt.getX();

					// if we are at the far left, stop scrolling
					var newx = this.dom.viewBox.baseVal.x + diff;
					if (newx <= 0) return;
					
					// if we are at the far right, stop scrolling
					if ((newx + this.dom.viewBox.baseVal.width) > this.dom.width.baseVal.value) {
						return;
					}
					
					// update the start x and then set then update the viewbox
					this.dom.hmpDragX = evt.getX();
					this.dom.viewBox.baseVal.x += diff;
				});
				
				svg.on('mousedown', function(evt) {
//					console.log('drag start',evt, evt.getX(), evt.getY());
//					var diff = -5;
//					if (evt.button !== 0) diff = diff * -1;
//					this.dom.viewBox.baseVal.x += diff;
					this.dom.hmpDragX = evt.getX();
				});
				
				// attach actions
				var rects = svg.select('rect[data-target]');
				rects.on('click', function(evt, target) {
					var elementId = this.getAttribute('data-target');
					if (elementId) {
						var target = Ext.fly(elementId);
						if (target) {
							target.dom.click()
						} else {
							// might be loading in progress... wait a bit and try again
							me.delayActionEl = elementId;
							me.delayActionTask.delay(500);
						}
					}
				});
			}
		});
		
		// WIP: <div class="hmp-sparkline-left hmp-sparkline-active">&nbsp;</div>
		return '<div class="hmp-sparkline-wrapper" style="" id="' + id + '">' + val + "</div>";
	}
	
});