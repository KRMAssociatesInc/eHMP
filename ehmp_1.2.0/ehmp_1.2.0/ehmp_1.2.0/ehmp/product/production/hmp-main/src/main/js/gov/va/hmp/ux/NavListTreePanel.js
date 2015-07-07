/**
 * TreePanel styled like a Twitter Bootstrap nav-list
 */
Ext.define('gov.va.hmp.ux.NavListTreePanel', {
    extend:'Ext.tree.Panel',
    ui: 'nav-list',
//    cls: 'nav-list',
    header: false,
    rootVisible:false,
    lines:false,
    useArrows:true
});