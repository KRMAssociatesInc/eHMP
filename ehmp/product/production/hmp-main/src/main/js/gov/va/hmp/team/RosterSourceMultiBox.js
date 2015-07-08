Ext.define('gov.va.hmp.team.RosterSourceMultiBox', {
	alias: 'widget.rostersourcemultibox',
	extend: 'Ext.form.field.ComboBox',
	allowBlank: false,
    displayField: 'name',
    valueField: 'localId',
    hideTrigger: true,
    listConfig: {
        minHeight: 50,
        emptyText: 'No matching records found...',
        loadingText: 'Searching....'
    },
    emptyText: 'Select a value...',
    forceSelection: true,
    queryParam: 'filter',
    minChars: 4,
    queryMode: 'remote',
    listeners: {
        select: function (combo, recs) {
            // both the displayField and valueField must end up in the edited record
            // this seems like the only way I can figure to get access to the displayField later.
            combo.lastDisplay = recs[0].data.name;
        }
    }
});