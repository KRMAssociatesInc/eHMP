Ext.define('gov.va.hmp.ux.PopupMenu', {
	alias: 'widget.popupmenu',
	extend: 'Ext.menu.Menu',
    cls: 'hmp-popupbutton-menu',
    plain: true,
    allowOtherMenus: true,
    enableKeyNav: false,
    layout: 'fit',
	onMouseOver: Ext.emptyFn// This function we leave empty for the sake of menu popup forms.
});