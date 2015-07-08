Ext.define('gov.va.hmp.EncounterAware', {
    pid:null, // the current patient ID according to this component (null=no patient currently selected)
    encounterAware:true, // this is the way to identify/query for all patient aware mixin objects

    constructor:function (config) {
        this.addEvents(
            'encounterchange')
        return this.callParent(config);
    },

    getEncounterInfo:function () {
        return gov.va.hmp.EncounterContext.getEncounterInfo();
    }
});