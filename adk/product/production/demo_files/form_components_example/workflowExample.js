define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars',
    'app/applets/ui_components_demo/modelExample',
    'app/applets/ui_components_demo/formFields',
    'app/applets/ui_components_demo/formFieldsModal'
], function(Backbone, Marionette, $, Handlebars, Model, fields, modalFields) {

    var formModel = new Model();
    var exampleFormView = ADK.UI.Form.extend({
        fields: modalFields.form1,
        events: {
            "submit": function(e) {
                e.preventDefault();
                if (!this.model.isValid())
                    this.model.set("formStatus", {
                        status: "error",
                        message: self.model.validationError
                    });
                else {
                    this.model.unset("formStatus");
                    this.workflow.goToNext();
                }
                return false;
            }
        }
    });
    var exampleFormView2 = ADK.UI.Form.extend({
        fields: modalFields.form2,
        events: {
            "submit": function(e) {
                e.preventDefault();
                this.model.set("formStatus", {
                    status: "pending",
                    message: "sending......"
                });
                var self = this;
                if (!this.model.isValid())
                    this.model.set("formStatus", {
                        status: "error",
                        message: self.model.validationError
                    });
                else {
                    var form = this;
                    setTimeout(function() {
                        form.model.set("formStatus", {
                            status: "success",
                            message: "Success!"
                        });
                        ADK.UI.Workflow.hide();
                    }, 5000);
                }
                return false;
            },
            "click button.previous": function(e) {
                e.preventDefault();
                if (!this.model.isValid())
                    this.model.set("formStatus", {
                        status: "error",
                        message: self.model.validationError
                    });
                else {
                    this.model.unset("formStatus");
                    this.workflow.goToPrevious();
                }
                return false;
            }
        }
    });
    var workflowOptions = {
        showProgress: true,
        steps: [{
            view: exampleFormView,
            viewModel: formModel,
            stepTitle: 'Step 1'
        }, {
            view: exampleFormView2,
            viewModel: formModel,
            stepTitle: 'Step 2'
        }]
    };
    return ADK.UI.Workflow.create(workflowOptions);
});