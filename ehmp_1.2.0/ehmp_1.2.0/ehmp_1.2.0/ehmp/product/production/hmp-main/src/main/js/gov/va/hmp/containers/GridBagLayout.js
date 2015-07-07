/**
 * This is my attempt at trying to make a poor man's version of the most powerful layout manager I know, javax.swing's famous (or infamous, depending on who you ask) GridBagLayout.
 * 
 * For the first go-around I am shooting for the following functionality:
 * - Allocation of cell space horizontally and vertically based on weightX and weightY attributes (highest number across a given row or column dictates space for the whole column, obviously.)
 * - Cell span / row span based on widthX and widthY values.
 * - Skipping all the other attributes such as orientation, padding, insets, etc. for now as it's not part of our current problem space.
 */
Ext.define('gov.va.hmp.containers.GridBagLayout', {

    alias: ['layout.gridbag'],
    extend: 'Ext.layout.container.Auto',
    alternateClassName: 'gov.va.hmp.containers.GridBagLayout',

    monitorResize:false,

    /**
     * The idea here is to add a custom resize control to all panels managed by this GridBagLayout that will, instead of handling the panel's size, 
     * actually affect weights and column / row calculations that are respected by the GridBagLayout. Effectively, resizing one panel will affect
     * all other panels / rows / columns.
     * 
     * Drag vertically or horizontally: Calculate a weightX and/or weightY that will guarantee the new size of this component, while respecting the established weight proportions of the other components in the grid. 
     * 
     * DISCUSS (ADDING COLSPAN / ROWSPAN): One-click without dragging to claim another cell (row span or col span?) How, then, would one reduce? 
     * 	One possibility is to use left-bar for reduce, right-bar for expand, and similarly for top - bottom bars.
     *  Probably unnecessarily complex; I think we'll end up with arrow buttons in the title bar (next to editor widget) for popping out / in other cells.
     */
    panelResizeListeners: {
    	maxHeight: 10000,
    	maxWidth: 10000,
    	constrainTo: null,
		listeners: {
			beforeresize: function(resizer, oldWidth, oldHeight, mouseEvt) {
				
				// Let's first get a snapshot of layout properties when the resize begins.
				// It is important to have this snapshot so we can effectively apply dX and dY during the drag process.
				this.originalWidth = oldWidth;
				this.originalHeight = oldHeight;
				this.originalMouseX = mouseEvt.xy[0];
				this.originalMouseY = mouseEvt.xy[1];
				this.resizeItem = resizer.target;
				this.yMult = null;//(resizer.resizeTracker.activeResizeHandle.region.indexOf('north') > 1 ? -1 : 1);
				this.xMult = null;//(resizer.resizeTracker.activeResizeHandle.region.indexOf('west') > 1 ? -1 : 1);
				
				this.originalMaxColWeights = [];  // I'm thinking maybe this needs to be a property of the layout itself instead of the components?
				this.originalMaxRowWeights = [];
				for(var key in this.items)
				{
					var item = this.items[key];
					var col = item.gridX;
					while(col <= item.gridX + (item.widthX - 1))
					{	
						if(! (this.originalMaxColWeights[col] > item.weightX))
						{
							this.originalMaxColWeights[col] = item.weightX;
						}
						col++;
					}
					var row = item.gridY;
					while(row <= item.gridY + (item.widthY - 1))
					{	
						if(! (this.originalMaxRowWeights[row] > item.weightY))
						{
							this.originalMaxRowWeights[row] = item.weightY;
						}
						row++;
					}
				}	

				return true;
			},
			/**
			 * This routine will, on the fly, figure dX and dY from the original drag origin based on mouse movement.
			 * It calculates differences in grid weighting and applies the difference immediately.
			 * So far, performance seems a bit sluggish when resizing 6 or more viewdefgridpanels, but I hope it is passable. 
			 * If not, we may need to look at making the routine more efficient - for instance, hiding the panels and showing "ghost" panels until resizing is complete.
			 * We need to protect against less-than-one width because of infinity calculations.
			 */
			resizedrag: function(resizer, newWidth /*Not useful - doesn't change during drag.*/, newHeight/*Same here*/, mouseEvt) {
				if(this.xMult==null)
				{
					this.yMult = (resizer.resizeTracker.activeResizeHandle.region.indexOf('north') > -1 ? -1 : (resizer.resizeTracker.activeResizeHandle.region.indexOf('south') > -1 ? 1 : 0));
					this.xMult = (resizer.resizeTracker.activeResizeHandle.region.indexOf('west') > -1 ? -1 : (resizer.resizeTracker.activeResizeHandle.region.indexOf('east') > -1 ? 1 : 0));
				}	
				var dX = (mouseEvt.xy[0] - this.originalMouseX) * this.xMult; // Width Change
				var tW = this.resizeItem.ownerCt.el.dom.clientWidth; // Total DOM Width of Container
				var mW = this.originalWidth + dX; // Resize Width of This Column(s)
				var noW = tW - mW; // The new width of all the other columns, en toto.
				var ooW = tW - this.originalWidth;  // The original width of all the other columns, en toto.
				var moW = ooW / noW; // Ratio of original width to new width; Additional multiplier (?) for new weight of this column.
				
				var dY = (mouseEvt.xy[1] - this.originalMouseY) * this.yMult; 
				var tH = this.resizeItem.ownerCt.el.dom.clientHeight;
				var mH = this.originalHeight + dY;
				var noH = tH - mH; 
				var ooH = tH - this.originalHeight;  
				var moH = ooH / noH;
				
				var columnMaxWeightMultiplierX = ((this.originalWidth + dX) / this.originalWidth) * moW; //100 + 10000 / 100 = 11
				var rowMaxWeightMultiplierY = ((this.originalHeight + dY) / this.originalHeight) * moH;
				
				for(var key in this.items)
				{
					var item = this.items[key];
					if(this.xMult!=0 && item.gridX >= this.resizeItem.gridX && item.gridX < (this.resizeItem.gridX + this.resizeItem.widthX))
					{
						var col = item.gridX;
						item.weightX = this.originalMaxColWeights[col] * columnMaxWeightMultiplierX;
					}
					if(this.yMult!=0 && item.gridY >= this.resizeItem.gridY && item.gridY < (this.resizeItem.gridY + this.resizeItem.widthY))
					{	
						var row = item.gridY;
						item.weightY = this.originalMaxRowWeights[row] * rowMaxWeightMultiplierY;
					}
				}				
				return true;
			},
			resize: function(resizer, newWidth, newHeight, mouseEvt) {
				this.resizeItem.ownerCt.doLayout();				
				return true;
			}
		}
    },

    type: 'gridbag',

    // Table layout is a self-sizing layout. When an item of for example, a dock layout, the Panel must expand to accommodate
    // a table layout. See in particular AbstractDock::onLayout for use of this flag.
    autoSize: true,

//    clearEl: true, // Base class will not create it if already truthy. Not needed in tables.

    targetCls: Ext.baseCSSPrefix + 'table-layout-ct',
    tableCls: Ext.baseCSSPrefix + 'table-layout',
    cellCls: Ext.baseCSSPrefix + 'table-layout-cell',
    
    tableAttrs:null,
    
    renderItems: function(items) {
        var tbody = this.getTable().tBodies[0], // JC 4-20-2012: Once created initially, this returns the previously rendered table element.
            rows = tbody.rows,
            i = 0,
            len = items.length,
            cells, curCell, rowIdx, cellIdx, item, trEl, tdEl, itemCt;

        /*
         * First, let's sort the items in left-to-right, top-to-bottom order.
         * If we don't do this first, the logic to clear cells below will kill values that need to actually be rendered.
         */
        items.sort(function(i1, i2){
        	if(i1.gridY != i2.gridY)
        	{
        		return i1.gridY-i2.gridY;
        	}	
        	return i1.gridX - i2.gridX;
        });
        
        var cellWidths = this.calculateCellWidths(items);
        var rowHeights = this.calculateRowHeights(items);
        
        var cellDexByRow = [];
        // Loop over each item and build table cells accordingly.
        for (; i < len; i++) {
            var item = items[i];
            if(item.collapsible) {
            	item.collapsible = false;
            }
            /*
             * Below code is for debugging coordinates; Leave for future use if issues are found with coordinate space / resizing
             */ 
               	if(!item.originalTitle) {
            			item.originalTitle = item.title + '';
	            	}	
	            	item.title = item.originalTitle + '(' + item.gridX + ',' + item.gridY + ':' + item.widthX + ',' + item.widthY + ')';
             
             
            	
            rowIdx = item.gridY;
            if(cellDexByRow[rowIdx] == null) {cellDexByRow[rowIdx] = 0;} else {cellDexByRow[rowIdx] = cellDexByRow[rowIdx] + 1;} // This instead of item.gridX because, in fact, we don't want to create cells for spanned stuff.
            cellIdx = cellDexByRow[rowIdx];
            
            var width = 0;//cellWidths[item.gridX] + '%';
            var height = 0;//rowHeights[item.gridY] + '%';
            
            /*
             * For col/row span, add to height/width.
             */
            var dX = 0;//item.gridX;
            var dY = 0;//item.gridY;
            
            while(dX<item.widthX)
            {
            	width = width + (cellWidths[item.gridX+dX])
            	dX++;
            }
            
            while(dY<item.widthY)
            {
            	height = height + (rowHeights[item.gridY+dY])
            	dY++;
            }	
            
            var widthPct = (width * 100) + '%';
            var heightPct = (height * 100) + '%';
            
            item.height = Math.round(item.ownerCt.el.dom.clientHeight * height - .5);
            item.width = Math.round(item.ownerCt.el.dom.clientWidth * width - .5);
            if(!Ext.isObject(item.resizable))
            {
            	item.resizable = this.panelResizeListeners;         
            	item.resizable.layout = this;
            	item.resizable.items = items;
            }	
            item.doLayout();

            // If no row present, create and insert one
            trEl = rows[rowIdx];
            if (!trEl) {
                trEl = tbody.insertRow(rowIdx);
                if (this.trAttrs) {
                    trEl.set(this.trAttrs);
                }
            }

            // If no cell present, create and insert one
            if(trEl.cells.length>cellIdx) {
            	itemCt = tdEl = Ext.get(trEl.cells[cellIdx]);
            } else {
            	itemCt = tdEl = Ext.get(trEl.insertCell(cellIdx));
            }

            // Render or move the component into the cell
            if (!item.rendered) {
                this.renderItem(item, itemCt, 0);
            }
            else if (!this.isValidParent(item, itemCt, 0)) {
                this.moveItem(item, itemCt, 0);
            }

            // Set the cell properties
            if (this.tdAttrs) {
                tdEl.set(this.tdAttrs);
            }
            
            tdEl.set({
                colSpan: item.widthX || 1,
                rowSpan: item.widthY || 1,
                id: item.cellId || '',
                cls: this.cellCls + ' ' + (item.cellCls || ''),
                style: {
                	width: widthPct,
                	height: heightPct
                }
            });

            /*
             * TODO: Test all cases after fully developed. We could make this more efficient by instead chopping off columns and rows
             * when the table's boundaries go outside maximum X and Y based on the collection of items.
             * Also, couldn't this be dangerous when we have an ending element from a row above that spans Y down into a cell after the current item?
             * Basically, let's test all cases after we put in row / column spanning.
             */
            if (!items[i + 1] || items[i + 1].gridY !== rowIdx) {
                cellIdx++;
                while (trEl.cells[cellIdx]) {
                    trEl.deleteCell(cellIdx);
                }
            }
        }

        // Delete any extra rows
        rowIdx++;
        while (tbody.rows[rowIdx]) {
            tbody.deleteRow(rowIdx);
        }
        
        for(i=0;i<len;i++) {
        	var itm = items[i];
        }
    },
    
    /**
     * This will return a set of column widths that can be used for table cell width percentages. (TODO: Add them together for width properties of cells that span multiple columns)
     */
    calculateCellWidths: function(items)
    {
    	var cw = []; // Cell width values.
    	var cpct = []; // Calculated cell percentages of total.
    	for(var i = 0; i<items.length; i++)
    	{
    		var item = items[i];
    		var coldex = item.gridX;
    		for(var dX = 0; dX < item.widthX; dX++)
    		{
        		if(! (cw[coldex+dX] >= item.weightX)) // ! operator used so nulls will be handled naturally.
        		{
        			cw[coldex+dX] = item.weightX;
        		}
    		}
    	}
    	var ctot = 0;
    	for(var i in cw)
    	{
    		ctot += cw[i];
    	}
    	for(var i in cw)
    	{
    		cpct[i] = cw[i]/ctot;//(cw[i] * 100 / ctot) + "%";
    	}
    	return cpct;
    },
    
    calculateRowHeights: function(items)
    {
    	var rh = []; // Cell width values.
    	var rpct = []; // Calculated cell percentages of total.
    	for(var i = 0; i<items.length; i++)
    	{
    		var item = items[i];
    		var rowdex = item.gridY;
    		for(var dY = 0; dY < item.widthY; dY++)
    		{
    			if(! (rh[rowdex+dY] >= item.weightY)) // ! operator used so nulls will be handled naturally.
        		{
        			rh[rowdex+dY] = item.weightY;
        		}
    		}	
    	}
    	var rtot = 0;
    	for(var i in rh)
    	{
    		rtot += rh[i];
    	}
    	for(var i in rh)
    	{
    		rpct[i] = rh[i]/rtot;//(rh[i] * 100 / rtot) + "%";
    	}
    	return rpct;
    },

    /**
     * @private
     * Return the layout's table element, creating it if necessary.
     */
    getTable: function() {
        var table = this.table;
        if (!table) {
            table = this.table = this.getTarget().createChild(
                Ext.apply({
                    tag: 'table',
                    role: 'presentation',
                    cls: this.tableCls,
                    cellspacing: 0, //TODO should this be specified or should CSS handle it?
                    cn: {tag: 'tbody'}
                }, this.tableAttrs),
                null, true
            );
        }
        return table;
    },
    
    /**
     * This will provide a best-guess as to the next cell to stick a component that has been added without any grid coordinate / width specification.
     * NOTE: Perhaps adding items could be done with a sticky panel that follows the cursor until a click is performed on an unoccupied space, or on a border for col / row expansion.
     */
    getNextAvailableCellConstraints: function(items, gridBagHint)
    {
    	var config = {widthX: 1, widthY: 1, weightX: 1, weightY: 1};
    	var y = 0;
    	var x = 0;
    	var maxX = 0;
    	var maxY = 0;
    	
    	var cells = [];
    	for(var key in items.items)
    	{
    		var itm = items.items[key];
    		for(var x = itm.gridX; x < (itm.gridX + itm.widthX); x++)
    		{
    			if(x>maxX) { maxX = x; }
    			for(var y = itm.gridY; y < (itm.gridY + itm.widthY); y++)
    			{
        			if(y>maxY) { maxY = y; }
    				if(!cells[y])
    				{
    					cells[y] = [];    					
    				}
    				cells[y][x] = true;
    			}
    		}
    	}
    	
    	for(var y = 0; y <= maxY; y++)
    	{
    		for(var x = 0; x <= maxX; x++)
    		{
    			if(!cells[y] || !cells[y][x])
    			{
    				config.gridX = x;
    				config.gridY = y;
    				return config;
    			}	
    		}	
    	}    	    	

		if(maxX>maxY)
		{
			config.gridY = maxY+1;
			config.gridX = 0;    			
		}	
		else
		{
			config.gridY = 0;
			config.gridX = maxX+1;
		}	
		return config;
    }
});
