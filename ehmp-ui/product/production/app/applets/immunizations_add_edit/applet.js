define([
    "app/applets/immunizations_add_edit/views/addEditImmunizationView"
], function(addEditImmunizationView){
    return {
        id: "immunizations_add_edit",
        getRootView: function() {
            return addEditImmunizationView;
        }
    };
});
