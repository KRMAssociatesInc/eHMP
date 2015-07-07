define([
    "backbone",
    "marionette",
    "hbs!app/applets/patient_search/templates/mySitePillsTemplate",
    "hbs!app/applets/patient_search/templates/common/blankTemplate"
], function(Backbone, Marionette, mySitePillsTemplate, blankTemplate) {
    var PillsModel = Backbone.Model.extend({
        defaults: {
            'template': mySitePillsTemplate,
            'pillsType': 'all'
        }
    });
    var PillsView = Backbone.Marionette.ItemView.extend({
        tagName: "ul",
        className: "nav nav-pills",
        events : {
            'click li' : 'changePillType'
        },
        initialize: function() {
            this.model = new PillsModel();
            this.listenTo(this.model, 'change:template', this.render);
        },
        getTemplate: function() {
            return this.model.get('template');
        },
        onRender: function() {
            $(this.el).find('#' + this.model.get('pillsType')).addClass('active');
        },
        changePillType: function(event){
            $("#patient-search-confirmation").addClass('hide');
            this.model.set({
                'pillsType': $(event.currentTarget).attr('id')
            });
            this.render();
        },
        changeTemplate: function(searchType) {
            $("#patient-search-confirmation").addClass('hide');
            if (searchType == "mySite") {
                this.model.set({
                    'template': mySitePillsTemplate
                });
            } else {
                this.model.set({
                    'template': blankTemplate
                });
            }
        },
        resetModels: function() {
            this.model.set({
                pillsType: 'all'
            });
        }
    });

    return PillsView;
});
