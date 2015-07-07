/*
 * TODO: Figure out a columns vs rows layout?  Or better yet, a table layout (3x3)
 * TODO: Need to trigger stateSave on drag/drop target event.
 * 
 */
Ext.define('gov.va.hmp.containers.PortalPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.portalpanel',
    cls: 'x-portal',
	editMode: true, // true to allow the user to edit/add tabs
	//stateId: 'brian-1', // automatically set by tabpanel
	stateful: false,
    bodyCls: 'x-portal-body',
    defaultType: 'portalcolumn',
    componentLayout: 'body',
    autoScroll: true,
    border: 0,
    initComponent : function() {
        var me = this;
        // Implement a Container beforeLayout call from the layout to this Container
        this.layout = {
            type : 'hbox',
            align: 'stretch',
            padding: '0 6 0 0'
        };
        this.callParent();
        
        // tools may also be rendered as menu items in some cases, so use the icon/text elements as well.
    	// cant use the addTools() method because we need this data intact prior to render.
        this.tools = [{
        	type: 'plus',
        	icon: '/images/icons/ic_plus.png',
        	tooltip: 'Add Column',
        	text: 'Add Column',
        	handler: function() {
				me.add({});
			}
        },{
        	type: 'expand',
        	icon: '/images/icons/ic_plus.png',
        	tooltip: 'Add Item',
        	text: 'Add Item',
        	handler: function() {
				var col = me.items.get(0);
				// TODO: how to make this a menu/selection of different things to add?
				col.insert(0, {xtype: 'viewdefgridpanel', title: 'New Item', html: 'Click Edit...'});
			}
		}];

        this.addEvents({
            validatedrop: true,
            beforedragover: true,
            dragover: true,
            beforedrop: true,
            drop: true
        });
        this.on('drop', this.doLayout, this);
    },

    // Set columnWidth, and set first and last column classes to allow exact CSS targeting.
    beforeLayout: function() {
        var items = this.layout.getLayoutItems(),
            len = items.length,
            i = 0,
            item;

        for (; i < len; i++) {
            item = items[i];
            item.columnWidth = 1 / len;
            item.removeCls(['x-portal-column-first', 'x-portal-column-last']);
        }
        items[0].addCls('x-portal-column-first');
        items[len - 1].addCls('x-portal-column-last');
        return this.callParent(arguments);
    },

    // private
    initEvents : function(){
        this.callParent();
        this.dd = Ext.create('Ext.app.PortalDropZone', this, this.dropConfig);
    },

    // private
    beforeDestroy : function() {
        if (this.dd) {
            this.dd.unreg();
        }
        this.callParent();
    },
    
    /**
     * JC 4-13-2012 
     */
    getState: function() {
        var me = this, state = {title: this.title, xtype: 'portalpanel', items: []};
        
        // for each column defined (2-3 usually)
        for (var i=0; i < me.items.length; i++) {
        	var col = me.items.get(i);
        	var stateItm = {items: []};
        	state.items[i]=stateItm;
        	
        	// loop through each panel in a col
        	for (var j=0; j < col.items.length; j++) {
        		var panel = col.items.get(j);
           		stateItm.items[j] = panel.getState();
        	}
        	
        }
        return state;
    }
});


Ext.define('Ext.app.PortalColumn', {
    extend: 'Ext.container.Container',
    alias: 'widget.portalcolumn',
    layout: {
        type: 'anchor'
    },
    cls: 'x-portal-column',
    autoHeight: true,
    flex: 1,
    //style: {border: '2px solid red'},
    defaults: function(config) {
    	// all the default defaults :)
		Ext.apply(config, {
	    	cls: 'x-portlet',
	    	frame: false,
	    	closable: true, // TODO: IIF editable
	    	//collapsible: true, // 
	    	//animCollapse: false,
	    	draggable: true,
	        resizable: {
	        	dynamic: false,
	        	handles: 's'
	        }
		});
    }
});

Ext.define('Ext.app.PortalDropZone', {
    extend: 'Ext.dd.DropTarget',

    constructor: function(portal, cfg) {
        this.portal = portal; // Reference to the PortalPanel (NOT the column)
        Ext.dd.ScrollManager.register(portal.body); // Not sure if this is required; It registers a scrollpane to scroll to available areas 
        Ext.app.PortalDropZone.superclass.constructor.call(this, portal.body, cfg);
        portal.body.ddScrollConfig = this.ddScrollConfig;
    },

    ddScrollConfig: {
        vthresh: 50,
        hthresh: -1,
        animate: true,
        increment: 200
    },

    createEvent: function(dd, e, data, col, c, pos) {
        return {
            portal: this.portal,
            panel: data.panel,
            columnIndex: col,
            column: c,
            position: pos,
            data: data,
            source: dd,
            rawEvent: e,
            status: this.dropAllowed
        };
    },

    /*
     * The function a Ext.dd.DragSource calls continuously while it is being dragged over the target. This method will be called on every mouse movement while the drag source is over the drop target. 
     * (The default implementation simply returns the dropAllowed config value.)
     */
    notifyOver: function(dd, e, data) {
        var xy = e.getXY(),
            portal = this.portal,
            proxy = dd.proxy;

        // case column widths
        if (!this.grid) {
            this.grid = this.getGrid();
        }

        // handle case scroll where scrollbars appear during drag
        var cw = portal.body.dom.clientWidth;
        if (!this.lastCW) {
            // set initial client width
            this.lastCW = cw;
        } else if (this.lastCW != cw) {
            // client width has changed, so refresh layout & grid calcs
            this.lastCW = cw;
            //portal.doLayout();
            this.grid = this.getGrid();
        }

        // determine column
        var colIndex = 0,
            colRight = 0,
            cols = this.grid.columnX,
            len = cols.length,
            cmatch = false;

        for (len; colIndex < len; colIndex++) {
            colRight = cols[colIndex].x + cols[colIndex].w;
            if (xy[0] < colRight) {
                cmatch = true;
                break;
            }
        }
        // no match, fix last index
        if (!cmatch) {
            colIndex--;
        }

        // find insert position
        var overPortlet, 
        	pos = 0,
            h = 0,
            match = false,
            overColumn = portal.items.getAt(colIndex),
            portlets = overColumn.items.items,
            overSelf = false;

        len = portlets.length;

        for (len; pos < len; pos++) {
            overPortlet = portlets[pos];
            h = overPortlet.el.getHeight();
            if (h === 0) {
                overSelf = true;
            } else if ((overPortlet.el.getY() + (h / 2)) > xy[1]) {
                match = true;
                break;
            }
        }

        pos = (match && overPortlet ? pos : overColumn.items.getCount()) + (overSelf ? -1 : 0);
        var overEvent = this.createEvent(dd, e, data, colIndex, overColumn, pos);

        if (portal.fireEvent('validatedrop', overEvent) !== false && portal.fireEvent('beforedragover', overEvent) !== false) {

            // make sure proxy width is fluid in different width columns
            proxy.getProxy().setWidth('auto');

            if (overPortlet) {
                proxy.moveProxy(overPortlet.el.dom.parentNode, match ? overPortlet.el.dom : null);
            } else {
                proxy.moveProxy(overColumn.el.dom, null);
            }

            this.lastPos = {
                c: overColumn,
                col: colIndex,
                p: overSelf || (match && overPortlet) ? pos : false
            };
            this.scrollPos = portal.body.getScroll();

            portal.fireEvent('dragover', overEvent);
            return overEvent.status;
        } else {
            return overEvent.status;
        }

    },

    notifyOut: function() {
        delete this.grid;
    },

    notifyDrop: function(dd, e, data) {
        delete this.grid;
        if (!this.lastPos) {
            return;
        }
        var c = this.lastPos.c,
            col = this.lastPos.col,
            pos = this.lastPos.p,
            panel = dd.panel,
            dropEvent = this.createEvent(dd, e, data, col, c, pos !== false ? pos : c.items.getCount());

        if (this.portal.fireEvent('validatedrop', dropEvent) !== false && this.portal.fireEvent('beforedrop', dropEvent) !== false) {

            // make sure panel is visible prior to inserting so that the layout doesn't ignore it
            panel.el.dom.style.display = '';

            if (pos !== false) {
                c.insert(pos, panel);
            } else {
                c.add(panel);
            }

            dd.proxy.hide();
            this.portal.fireEvent('drop', dropEvent);

            // scroll position is lost on drop, fix it
            var st = this.scrollPos.top;
            if (st) {
                var d = this.portal.body.dom;
                setTimeout(function() {
                    d.scrollTop = st;
                },
                10);
            }

        }
        delete this.lastPos;
        return true;
    },

    // internal cache of body and column coords
    getGrid: function() {
        var box = this.portal.body.getBox();
        box.columnX = [];
        this.portal.items.each(function(c) {
            box.columnX.push({
                x: c.el.getX(),
                w: c.el.getWidth()
            });
        });
        return box;
    },

    // unregister the dropzone from ScrollManager
    unreg: function() {
        Ext.dd.ScrollManager.unregister(this.portal.body);
        this.callParent();
    }
});
