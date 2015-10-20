define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars',
    'main/ui_components/forms/component',
    'demo_files/form_components_example/fields',
    'demo_files/form_components_example/model'
], function(Backbone, Marionette, $, Handlebars, ADK_FORM, Fields, Model) {

    var Methods = {
        formView: function(controlId, supportsErrorMessage) {
            var buttons;
            if (supportsErrorMessage) {
                buttons = [{
                    control: "button",
                    label: "Error Message Example",
                    type: "button",
                    extraClasses: ["btn-sm", "btn-danger"],
                    name: "formError"
                }, {
                    control: "button",
                    label: "Submit",
                    extraClasses: ["btn-sm", "btn-primary"],
                    name: "formStatus"
                }];
            } else {
                buttons = [{
                    control: "button",
                    label: "Submit",
                    extraClasses: ["btn-sm", "btn-primary"],
                    name: "formStatus"
                }];
            }
            var FormControlFields = [{
                control: "container",
                extraClasses: ["modal-body esign"],
                items: [{
                    control: "container",
                    extraClasses: ["container-fluid"],
                    items: [{
                        control: "container",
                        extraClasses: ["scroll-enter-form"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-xs-12"],
                            items: Fields[controlId]
                        }]
                    }]
                }]
            }, {
                control: "container",
                template: Handlebars.compile([
                    '<div class="col-xs-12">',
                    '<h6>Changed Model Values</h6>',
                    '<b>' +
                    '{{printedModelValues}}' +
                    '</b>',
                    '</div>'
                ].join("\n")),
                modelListeners: ["printedModelValues"],
                extraClasses: ["order-preview"]

            }, {
                control: "container",
                extraClasses: ["modal-footer"],
                items: [{
                    control: "container",
                    extraClasses: ["col-xs-4"]
                }, {
                    control: "container",
                    extraClasses: ["col-xs-8 text-right"],
                    items: buttons
                }]
            }];
            return ADK_FORM.Form.extend({
                fields: FormControlFields,
                events: {
                    "click .formError button": function() {
                        this.model.errorModel.set(controlId + 'Error', 'This is a sample error message');
                        this.transferFocusToFirstError();
                    },
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
                                setTimeout(function() {
                                    ADK.UI.Workflow.hide();
                                }, 1000);
                            }, 5000);
                        }
                        return false;
                    }
                }
            });
        },
        show: function(model) {
            var supportsErrorMessage = model.get('supportsErrorMessage');
            var controlId = model.get('id');
            var controlLabel = model.get('label');
            var formModel = new Model();
            var workflowOptions = {
                title: controlLabel,
                keyboard: true,
                steps: [{
                    view: Methods.formView(controlId, supportsErrorMessage),
                    viewModel: formModel
                }],
                headerOptions: {
                    actionItems: [{
                        label: 'Close',
                        onClick: function(){
                            ADK.UI.Workflow.hide();
                        }
                    }]
                }
            };
            var workflow = new ADK.UI.Workflow(workflowOptions);
            workflow.show();
            return formModel;
        }
    };

    return Methods;
});
