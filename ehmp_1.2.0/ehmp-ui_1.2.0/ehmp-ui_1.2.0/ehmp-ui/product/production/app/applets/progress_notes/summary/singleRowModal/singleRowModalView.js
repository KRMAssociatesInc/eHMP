define([
	"backbone",
	"marionette",
	"underscore",
	"hbs!app/applets/progress_notes/summary/singleRowModal/table"
], function(Backbone, Marionette, _, modalTemplate) {
	return Backbone.Marionette.ItemView.extend({
		template: modalTemplate,
		className: "modal-content"
	});
});
