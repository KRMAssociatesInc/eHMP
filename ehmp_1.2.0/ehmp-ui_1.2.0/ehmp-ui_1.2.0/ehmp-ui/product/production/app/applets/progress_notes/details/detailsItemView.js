define([
	"backbone",
	"marionette",
	"underscore",
	"hbs!app/applets/progress_notes/details/row"
], function(Backbone, Marionette, _, detailsRowTemplate) {
    return Backbone.Marionette.ItemView.extend({
        tagName: "tr",
        template: detailsRowTemplate
    });
});
