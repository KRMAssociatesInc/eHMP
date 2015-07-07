/**
 * This is a general purpose animation decorator.
 * 
 * The intended purpose is to allow any widget (A) to be animated open / closed when a target widget (B) is moused-over.
 * 
 * There are config options for static sizing, horizontal- or vertical-only sizing, target component to cover by the sizing, and a delay timer for the close event.
 */

Ext.define('gov.va.hmp.util.Animation', {
    requires: 'Ext.window.Window',
	myWindow: null,
	/**
	 * Milliseconds to wait upon mouseout event before animClose() is called.
	 */
	animCloseDelay: 1000,
	animOpenDelay: 500,
	animOpenTrigger: 'click', // can be click instead.
	/**
	 * The component to be animated (shown)
	 */
	animComponent: null,
	/**
	 * The existing component that, upon mouseover events, will trigger the animComponent window to appear and grow to fit spec'ed cover object / config. Think "hotspot."
	 */
	targetComponent: null,
	/**
	 * False to start as a full horizontal line and grow vertically only (slide out from top/bottom)
	 */
	growHorizontal: true,
	/**
	 * False to start as a full vertical line and grow horizontally only (slide out from side)
	 */
	growVertical: true,
	/**
	 * To cover another component completely (such as a full viewport) pass in the component. To cover a specific coordinate space, pass in coords and dimensions, ex: {x: 0, y: 0, width: 800, height: 100}
	 * Origin of animation will be according to width / height of the cover multiplied by startRelativeToX and startRelativeToY where these are fractions of the width / height. Defaults to 0,0.
	 * ex: {x: 0, y: 0, width: 800, height: 100, startRelativeToX: 0.5, startRelativeToY: 0} will start in the middle of the top of the coverage area.
	 */
	cover: null,
	/**
	 * For internal use only. This is used to build the window that will be the actual resized component.
	 */
	getMyWindow: function()
	{
		if(this.myWindow==null)
		{
			var me = this;
			this.myWindow = Ext.create('Ext.window.Window', {
				items: [this.animComponent],
				header: false,
    			layout: 'fit', 
				height: '1',
				width: '1'
			});
			this.myWindow.on({
				mouseleave: this.triggerClose,
				mouseenter: this.cancelClose,
				element: 'body',
				scope: this
			});
			this.myWindow.show();
		}	
		return this.myWindow;
	},
	
	isVisible: function(deep)
	{
		return this.myWindow.isVisible();
	},
	
	isClosing: false,
	startedClosing: false,
	
	/**
	 * Defer the actual close call by configured # of millis.
	 * 5-25-2012 JC: Presently, this will trigger even when the other target is a window (or tooltip?) This means, for instance, when a combobox selection list appears, it triggers mouseleave and thereby closes. Not sure if we can effectively handle this in a generic way.
	 */
	triggerClose: function(evtObj, el, opts)
	{
		// Hacky, but hold open when any comboboxes are presently open on the target component.
		var boxen = Ext.ComponentQuery.query('combobox', this.myWindow);
		for(var key in boxen)
		{
			if(boxen[key].isExpanded)
			{
				return;
			}	
		}	
		if(!this.isClosing)
		{
			this.isClosing = true;
			Ext.Function.defer(this.animClose, this.animCloseDelay, this);
		}
	},
	cancelClose: function()
	{
		if(this.isClosing && !this.startedClosing)
		{
			this.isClosing = false;
		}
	},
	immediateClose: function()
	{
		this.isClosing = true;
		this.animClose();
	},
	
	animClose: function()
	{
		this.startedClosing = true;
		/*
		 * Searches on ExtJS and thread safety reveal that JS is presently single-threaded.
		 * I hate to rely on that, but if it is the only answer we have, then so be it.
		 * So, if that is true, we should encounter no race conditions here with the isClosing flag.
		 */
		if(this.isClosing)
		{	
			var mw = this.getMyWindow();
			var th = mw.getEl().dom.clientHeight;
			var tw = mw.getEl().dom.clientWidth;
			if(this.growHorizontal)
			{
				var tw = 0;
			}	
			if(this.growVertical)
			{
				var th = 0;
			}	
			var cvr = this.getCoverAsConfig();
			mw.animate({
				to: {
					height: th,
					width: tw,
					x: cvr.x + (cvr.width * (this.startRelativeToX || 0)),
					y: cvr.y + (cvr.height * (this.startRelativeToY || 0))
				},
				duration: 1000,
				listeners: {
					afteranimate: function()
					{
						if(this.isClosing)
						{	
							var mw = this.getMyWindow();
							mw.hide();
						}
						this.isClosing = false;
						this.startedClosing = false;
					},
					scope: this
				}
			});
		}
		this.startedClosing = false;
	},
	/**
	 * Internal use only. Convenience method to get dimensions for animOpen. Will follow change in target component if a component was given as the "cover" parameter.
	 */
	getCoverAsConfig: function()
	{
		if(Ext.isObject(this.cover) && Ext.isFunction(this.cover.getEl))
		{
			/*
			 * Yea, I thought about caching this, but I'd rather be sure we recalculate each time for situations like browser resizing / layout recalculating.
			 * Yea, it could be cleared on the afterrender event of the component, but I ... well, I suppose I could do that.
			 */
			var cvr = {};
			cvr.width = this.cover.getEl().dom.clientWidth;
			cvr.height = this.cover.getEl().dom.clientHeight;
			cvr.x = this.cover.getPosition()[0];
			cvr.y = this.cover.getPosition()[1];
			return cvr;
		}
		else
		{
			return this.cover;
		}
	},
	
	triggerOpen: function(evtObj, el, opts)
	{
		if(!this.isOpening)
		{
			this.isOpening = true;
			Ext.Function.defer(this.animOpen, this.animOpenDelay, this);
		}
	},
	cancelOpen: function()
	{
		if(this.isOpening && !this.startedOpening)
		{
			this.isOpening = false;
		}
	},
	immediateOpen: function()
	{
		this.isOpening = true;
		this.animOpen();
	},
	
	animOpen: function()
	{
		this.startedOpening = true;
		
		if(this.isOpening)
		{	
			var me = this;
			var mw = this.getMyWindow();
			var el = this.targetComponent.getEl();
			var bd = el.dom;

			var cvr = this.getCoverAsConfig();
			mw.setPosition(cvr.x + (cvr.width * (this.startRelativeToX || 0)),cvr.y + (cvr.height * (this.startRelativeToY || 0)));
			mw.setSize((this.growHorizontal)?0:cvr.width, (this.growVertical)?0:cvr.height);
			mw.doLayout();
			mw.show();
			mw.animate({
				to: {
					x: cvr.x,
					y: cvr.y,
					height: cvr.height,
					width: cvr.width
				},
				duration: 1000,
				listeners: {
					afteranimate: function()
					{
						this.isOpening = false;
						this.startedOpening = false;
					},
					scope: this
				}
			});
		}
		this.startedOpening = false;
	},
	
	initAnimationListeners: function()
	{
		/*
		 * mouseover is more common than mouseenter - who knows why.
		 */
		if(this.animOpenTrigger && this.animOpenTrigger != 'manual') {
			this.targetComponent.getEl().addListener(this.animOpenTrigger, this.triggerOpen, this);
		}
		this.targetComponent.getEl().addListener('mouseleave', this.cancelOpen, this);
	},
	getAnimComponent: function()
	{
		// Yuck... this needs to be cleaner. Let's give the poor item an ID and return based on that.
		return this.myWindow.items.items[0];
	},
	statics: {
		/**
		 * Add animation mouse-over listeners to the target component.
		 * targetCmp - The component that will listen for initial mouse-enter events to trigger the animation.
		 * animeCmp - The component that will animate outward. Listens for mouse-exit event to trigger the de-animation.
		 * cover - Either an Ext component (rendered) to "animate to cover" or a dimension / coordinate set, ex. {x: 0, y: 0, width: 800, height: 100}
		 * [config] - Optional configuration for the animation. Ex: {growHorizontal: false, growVertical: true}
		 */
		decorateComponent: function(targetCmp, animeCmp, cover, config, startRelativeToX, startRelativeToY, animOpenTrigger, animOpenDelay)
		{
			var anime = new gov.va.hmp.util.Animation();
			anime.startRelativeToX = startRelativeToX || 0;
			anime.startRelativeToY = startRelativeToY || 0;
			anime.animOpenTrigger = animOpenTrigger || 'mouseover';
			anime.animOpenDelay = animOpenDelay || 500;
			if(anime.animOpenTrigger.indexOf('click')>-1)
			{
				anime.animOpenDelay = 0;
			}	
			if(config)
			{
				Ext.apply(anime, config);
			}
			anime.animComponent = animeCmp;
			anime.targetComponent = targetCmp;
			anime.cover = cover;
			/*
			 * Since this will commonly be added before items are rendered, we have to defer the listeners until after the element has been rendered.
			 * (Listeners have to be added to the body element of the rendered component via Ext.component.Component.getEl() and this returns undefined until the component has been rendered)
			 */
			if(!targetCmp.rendered)
			{
				targetCmp.on({
					afterrender: function(){
						anime.initAnimationListeners();
					},
					scope: this
				});
			}
			else
			{
				anime.initAnimationListeners();
			}	
			anime.getMyWindow(); // Causes the target component to be "rendered" offscreen.
			return anime;
		}
	}
});