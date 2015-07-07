/**
 * @class gov.va.hmp.config.PageColumn
 * @extends Ext.container.Container
 * A layout column class used internally be {@link gov.va.hmp.config.PagePanel}.
 */
Ext.define('gov.va.hmp.config.PageColumn', {
    extend: 'Ext.container.Container',
    alias: 'widget.pagecolumn',
    layout: 'anchor',
    defaults: {
        anchor: '100%'
    }
//    defaultType: 'portlet',
//    cls: 'x-portal-column'

    // This is a class so that it could be easily extended
    // if necessary to provide additional behavior.
});