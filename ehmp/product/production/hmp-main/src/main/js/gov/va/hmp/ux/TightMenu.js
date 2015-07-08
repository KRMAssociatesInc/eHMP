/**
 * Extention of standard Menu to add the following:
 * - Menu headings: automatically groups menu items under similar headings
 * - Overflow: capability to limit total number of menu items shown and max items per heading
 * 
 * Headings are not sorted, so they will be appended to the menu in the order 
 * they are declared/added so you should add the most important items/headings first, so that less
 * important stuff will be collapsed into sub-menus.
 * 
 * TODO: It would probably be more efficent to do all the index/reordering as part of add(Object[]) and
 *       ensure that all items are added as an array, so we only need to compute everything once.
 * TODO: Idea to make this the first "Card" implementation for the card layout?
 */
Ext.define('gov.va.hmp.ux.TightMenu', {
    extend: 'Ext.menu.Menu',
//    ui: 'link',
    showSeperator: false,
    debug: false,
    menuMax: 8, // maximum # of items that can be displayed in the menu
    headingMin: 3, //
    headingMax: 3, // max items to display per heading/grouping.  If exceeded, the last item will be converted to "n-more" submenu
    
    defaults: {
        xtype: 'menuitem',
        ui: 'link'
//    	tooltipType: 'title'
    },
    
    /**
     * Returns the heading index, or -1 if it doesn't exist yet
     */
    getHeadingIdx: function(heading) {
    	var i, item;
    	for (i=0; i < this.items.length; i++) {
    		item = this.items.get(i);
    		if (item.isHeading === true && item.text === heading) {
    			return i;
    		}
    	}
    	return -1;
    },

    getHeadingsCount: function() {
    	var i, item, ret = {};
    	for (i=0; i < this.items.length; i++) {
    		item = this.items.get(i);
    		if (item.isHeading === true) {
    			ret[item.text] = 0;
    		} else if (Ext.isDefined(item.heading)) {
    			ret[item.heading]++;
    		} else {
    			if (!Ext.isDefined(ret[null])) ret[null]=0;
    			ret[null]++;
    		}
    	}
    	return ret;
    },
    
    /**
     * Determines the proper index for where CMP should be grouped.  All cmp's with the same heading value
     * should be grouped together under that heading.  If cmp.heading doesn't exist, then
     * they are grouped at the top, as part of the same nameless group.
     *
     * this function basically determines where to insert CMP into this.items.
     */
    getLastGroupIdx: function(cmp) {
    	var i, item, heading = cmp.heading, ret=-1;
    	for (i=0; i < this.items.length; i++) {
    		item = this.items.get(i);
    		if (item.isHeading === true || item === cmp) {
    			continue; // ignore self and headings...
    		} else if (item.heading === heading) {
    			ret = i; // heading is declared and matches
    		} else if (!Ext.isDefined(item.heading) && !Ext.isDefined(heading)) {
    			ret = i; // heading is undefined, but search heading is also undefined
    		} else if (ret > -1) {
    			break;
    		}
    	}
    	if (this.debug) console.log('getLastGroupIdx: ', cmp, heading, ret);
    	return ret;
    },
    
    buildSubMenu: function(cmp) {
    	return Ext.create('Ext.menu.Item', {
            ui: 'link-submenu',
    		text: 'More...', 
    		heading: cmp.heading, 
    		isSubMenuItem: true, 
    		menu: {
                xtype: "menu",
                items: [cmp.initialConfig] // TODO: There is a bug in cmp.getInitialConfig(). cmp.initialConfig is a workaround. Update when fixed.
    		}
    	});
    },
    
    removeAll: function() {
    	this.callParent(arguments);
    	
    	// some items seem to get stuck, try to clear them out here.
    	if (this.el) this.el.select(".x-menu-item").remove();
    },
    
    onAdd: function(cmp, pos) {
    	// if no heading, just return add as normal
    	if (cmp.isHeading === true || cmp.isSubMenuItem === true) return;
        var lastIdx = this.getLastGroupIdx(cmp);

        // if necessary, move the new item under its appropriate heading
    	if (Ext.isDefined(cmp.heading) && this.getHeadingIdx(cmp.heading) === -1) {
    		// insert the heading if it doesn't exist yet
    		this.insert(pos, {isHeading: true, text: cmp.heading, cls: 'dropdown-header', disabled: true, plain: true, canActivate: false});
    		return;
    	} else if (lastIdx != pos) {
    		// move this item to the last item under the grouping
    		var curItem = this.items.get(lastIdx);
    		if (this.debug) console.log('HeadingMenu.moveToLastUnderGrouping', cmp, pos, lastIdx, curItem);
    		if (curItem && curItem.isSubMenuItem === true) {
                this.remove(cmp);
                // last item is a submenu, move new item to the submenu
                // TODO: There is a bug in cmp.getInitialConfig(). cmp.initialConfig is a workaround. Update when fixed.
                curItem.menu.add(cmp.initialConfig);
    			return; // doesn't change overall size, so quit here.
    		} else {
                this.move(cmp, lastIdx + 1);
//    			this.items.insert(lastIdx+1, this.remove(cmp));
    		}
    	}
    	
    	// menu size limit exceeded, compress the menu
    	var headingCounts = this.getHeadingsCount();
    	if (this.items.length > this.menuMax) {
    		// get the prior item
    		var prevIdx = this.items.indexOf(cmp)-1;
    		var prevItem = this.items.get(prevIdx);
    		if (prevItem && prevItem.menu && prevItem.isSubMenuItem) {
    			this.remove(cmp);
    			prevItem.menu.add(cmp);
    		} else if (this.items.length > (this.menuMax + 1)) {
                this.insertMoreMenu(cmp);
    		}
    	} else if (headingCounts[cmp.heading || null] > (this.headingMax + 1)) {
            this.insertMoreMenu(cmp);
    	}
    },
    /**
     * @method insertMoreMenu
     * Inserts a 'More..."  sub-menu {Ext.menu.Menu} at the position of cmp - 1 item and places the cmp and cmp - 1 items on the sub-menu.
     * @param {Ext.menu.Item} cmp Menu item whose position is 1 greater than max allowed
     */
    insertMoreMenu: function(cmp) {
        var prevIdx = this.items.indexOf(cmp)- 1,
            prevItem = this.items.get(prevIdx),
            moreMenuItem = this.buildSubMenu(prevItem);

        // add cmp to new More sub-menu just created
        moreMenuItem.menu.add(cmp.initialConfig);
        this.remove(prevItem);
        // now add new More sub-menu 'this' menu
        this.insert(prevIdx, moreMenuItem);
        this.remove(cmp);
    }
});