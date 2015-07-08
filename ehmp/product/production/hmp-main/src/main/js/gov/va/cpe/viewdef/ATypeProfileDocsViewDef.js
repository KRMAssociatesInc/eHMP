/**
 * Created with IntelliJ IDEA.
 * User: VHAISLLEES
 * Date: 10/30/13
 * Time: 1:19 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('gov.va.cpe.viewdef.ATypeProfileDocsViewDef', {
    extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
    alias: 'widget.atypeprofiledocsviewdef',
    viewParams: { profile_doc_type: 'a' },
    autoScroll: true,
    hideHeaders: false,
    viewID: 'gov.va.cpe.vpr.queryeng.ProfileDocsViewDef',
    detailType: 'rowbody',
    //collapsible: true,
    columns: [
        {
            text: 'Allergies',
            dataIndex: 'products',
            flex: 1
        },
        {
            text: 'Signs / Symptoms',
            dataIndex: 'reactions',
            flex: 1
        }
    ]

});