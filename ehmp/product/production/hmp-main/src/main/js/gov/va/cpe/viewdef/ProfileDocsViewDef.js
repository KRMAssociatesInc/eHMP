/**
 * Created with IntelliJ IDEA.
 * User: VHAISLLEES
 * Date: 10/30/13
 * Time: 2:21 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('gov.va.cpe.viewdef.ProfileDocsViewDef', {
    extend: 'Ext.panel.Panel',
    requires: [
        'gov.va.cpe.viewdef.ATypeProfileDocsViewDef',
        'gov.va.cpe.viewdef.CWDFTypeProfileDocsViewDef'
    ],
    alias: 'widget.profiledocsviewdef',
    layout: 'border',
    bodyBorder: true,
//    defaults: {
//        collapsible: true,
//       // split: true,
//        bodyPadding: 15
//    },
    items: [
        {
           // title: 'Allegies' + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'  +  ' Signs / Symptoms',
            xtype: 'atypeprofiledocsviewdef',
            region: 'north',
            height: '50%'
        },
        {
           // title: 'Crisis Notes, Warning Notes, Directives',
            xtype: 'cwdftypeprofiledocsviewdef',
            region: 'center',
            height:  '50%'
        }
     ]
});