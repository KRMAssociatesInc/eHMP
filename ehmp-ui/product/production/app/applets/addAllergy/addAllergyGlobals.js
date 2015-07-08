define([
    "backbone",
    "marionette",
    "underscore"
], function(Backbone, Marionette, _) {
    return {
        addAllergyApplication: new Backbone.Marionette.Application(),
        events: {
            ADD_SYMPTOMS: 'addSymptomsEvent',
            REMOVE_SYMPTOMS: 'removeSymptomsEvent'
        }
    };
});
