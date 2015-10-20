define([
    "app/applets/immunizations_add_edit/views/immunizationAddView"
], function(immunizationAddView){
    return {
        id: "immunizations_add_edit",
        getRootView: function() {
            return immunizationAddView;
        }
    };
});
