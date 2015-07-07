/**
 * Created with IntelliJ IDEA.
 * User: Jim
 * Date: 2/10/14
 * Time: 5:38 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('gov.va.hmp.jira.BuyoffWindow', {
    requires: ['gov.va.hmp.jira.JiraTicketBuyoffStore'],
    extend: 'Ext.window.Window',
    layout: 'border',
    height: 600,
    width: 300,
    items: [{
        itemId: 'buyoffGrid',
        xtype: 'dataview',
        tpl: '<tpl for=".">' +
            '<h4>{key}</h4>' +
            '<p class="lead">{fields.description}</p>' +
            '</tpl>',
        itemSelector: 'div.hmp-patient-record-flag',
        store: Ext.create('gov.va.hmp.jira.JiraTicketBuyoffStore')
    }]
});
