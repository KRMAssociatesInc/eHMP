/**
 * A {@link Ext.toolbar.Toolbar} where child buttons are styled as links.
 */
Ext.define('gov.va.hmp.containers.LinkBar', {
    extend:'Ext.toolbar.Toolbar',
    alias:'widget.linkbar',
    ui:'plain',
    // private
    onBeforeAdd: function(component) {
        this.callParent(arguments);

        if (component.is('button')) {
            component.ui = 'link-toolbar';
        }
    }
});