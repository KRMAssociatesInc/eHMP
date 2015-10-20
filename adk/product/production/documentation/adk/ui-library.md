::: page-description
# ADK UI Library #
Standardized Components and Templates that are 508 Compliant
:::

## Components ##
::: definition
UI Components can be acccessed and used by calling:
### **ADK.UI.[component-name]** ###
:::

### Alert (window) ###

**ADK.UI.Alert** provides a standard approach for generating and showing an alert window that is 508 compliant and has consistent HTML styling. _ADK.UI.Alert_ should be used for simple prompts that require an action, such as confirming a submission. In other words, this is not an alternative to **ADK.UI.Modal** or **ADK.UI.Workflow**.

_ADK.UI.Alert_ is a Backbone.Marionette layout view constructor. The following is an example of creating and showing a new _ADK.UI.Alert_ view:

```JavaScript
var SimpleAlertItemView = Backbone.Marionette.ItemView.extend({
    template: Handlebars.compile([
        '<h3>I am a simple item view</h3>',
        '<p>Simple Example Text</p>'
    ].join('\n'))
});
var SimpleAlertFooterItemView = Backbone.Marionette.ItemView.extend({
    template: Handlebars.compile([
        '{{ui-button "Cancel" classes="btn-default alert-cancel" title="Click to cancel"}}',
        '{{ui-button "Continue" classes="btn-primary alert-continue" title="Click to continue"}}''
    ].join('\n')),
    events: {
        'click button': function() {
            // hide is available on the ADK.UI.Alert constructor
            // see table below for more details
            ADK.UI.Alert.hide();
        }
    }
});
var alertView = new ADK.UI.Alert({
    // available options go here, see table below for full descriptions
    title: "Example Alert",
    icon: "fa-info",
    messageView: SimpleAlertItemView,
    footerView: SimpleAlertFooterItemView
});
// displays alert
alertView.show();
```

The following are methods available to call upon the ADK.UI.Alert constructor:

| Method   | Parameter         | Description                                                           |
|----------|-------------------|-----------------------------------------------------------------------|
| hide     |                   | hides and destroys any currently open alert windows.<br />**Example**: `ADK.UI.Alert.hide()`   |

The following are the available options to pass to the _ADK.UI.Alert_ constructor:

| Required                          | Option          | Type                       | Description                                                    |
|:---------------------------------:|-----------------|----------------------------|----------------------------------------------------------------|
|<i class="fa fa-check-circle"></i>| **title**       | string                     | the title or topic of the alert message |
|                                  | **icon**        | string                     | font awesome class to use on the icon <br />**default**: _"fa-exclamation-triangle"_ |
|                                  | **messageView** | Marionette View definition | view to show in the body of the alert |
|                                  | **footerView**  | Marionette View definition | view to show in the footer of the alert |


### Form ###
> **A list of supported form controls can be found by [clicking here][FormControls].**

The ADK provides a way to generate, render and capture user input with an HTML form.  The data entered by the user is retrieved and stored in a Backbone model.  The form is rendered with a Marionette view. Any changes to the form are reflected back to the model and vice versa.  In order to POST (or PUT) the form to the server, a developer will simply have call the Backbone model's save method.

**ADK.UI.Form** provides a standard approach for developing forms including: form generation, model binding, and form validation. Form validation will be handled by Backbone.Model's validate method, which will have to be extended on a per-model basis and thus will be handled by the developer.  The form's html pieces have all been test and certified as 508 compliant.
#### Form Structure ####
**ADK.UI.Form** is the base form view that handles the form generation.  Each individual form can be customized by extending the base view with the following available options:

| Required     | Option          | Type   | Description                                                                                             |
|:------------:|-----------------|--------|---------------------------------------------------------------------------------------------------------|
|<i class="fa fa-check-circle"></i> | **model** | instance of a Backbone.Model | a model that the field's values will be binded to  |
|<i class="fa fa-check-circle note">*</i> | **fields** | array of controls | configuration of controls and how they are layed out in the form's UI |
|              | **events** | hash / function | see [backbone's documentation on events][BackboneViewEvents] |
|              | **modelEvents** | hash / function | see [marionette's documentation on modelEvents][MarionetteModelEvents] |

::: callout
**<i class="fa fa-check-circle note">\*</i> Note:** the fields array is composed of a list of control objects.  Please see the [section below](#Form-Controls) for more information on what a control object is.
:::

```JavaScript
var ExampleFormView = ADK.UI.Form.extend({
    model: new Backbone.Model(),
    fields: [],
    events: {
        "event-selector": "callback-function"
        ...
    },
    modelEvents: {
        "event-selector": "callback-function"
        ...
    }
});
```
::: callout
**Note:** ADK.UI.Form returns a Marionette View, and in order to create an instance of the view you must call **new** on the view returned. `var formViewInstance = new ExampleFormView(); `
:::

#### Form Controls ####
The ADK has created a collection of form controls that are 508 Compliant and are avaiable for use in the the **fields** array definition of ADK.UI.Form.  Each form control has a set of avabile attrbutes used to customize its look/feel and functionality.
::: callout
All form control objects **must** contain the attribute of **"control"** which tells the base view (ADK.UI.Form) which control is being defined/used.

Most controls also have a attribute of **"name"** which gets used to bind the control's value back to the form's model.
:::

The following is an example of creating a Form with one input field, who's value is binded to the model's _"input1"_ attribute:
```JSON
var ExampleFormView = ADK.UI.Form.extend({
    model: new Backbone.Model({
        input1: ""
    }),
    fields: [{
        control: "input",
        name: "input1",
        label: "Input Label",
        placeholder: "Enter text..."
    }]
});
```

::: side-note
**The complete list of supported form controls can be found by [clicking here][FormControls].**
:::

#### Form Control Function Calling ####
Some controls implement functions that can be called via a form instance. See each control's [documentation][FormControls] for more details about its exposed functions.

```JavaScript
    var stateCollection = new Backbone.Collection[{
            label: 'California',
            value: 'CA'
        },
        ...
    ];

    form.callControlFunction({
        controlType: 'select',
        controlName: 'stateList',
        functionName: 'setPickList',
        options: {
            pickList: stateCollection
        }
    });
});
```
::: side-note
** Note that those control functions take only one argument called *options*.

#### Form Validation ####
Form validation will be handled by Backbone.Model's **validate** method, which will have to be extended on a per-model basis and thus will be handled by the developer.

The validate method receives the model attributes as well as any options passed to set or save. If the attributes are valid, don't return anything from validate. If they are invalid return an error of your choosing. It can be as simple as a string error message to be displayed, or a complete error object that describes the error programmatically. If validate returns an error, save will not continue, and the model attributes will not be modified on the server. Failed validations trigger an "invalid" event, and set the validationError property on the model with the value returned by this method.

---

Below is an example of validating the model to ensure that the attribute _"numberInput"_ is between 10 and 20:
```JavaScript
var Model = Backbone.Model.extend({
    defaults: {
        numberInput: 1,
    },
    validate: function(attributes, options) {
        this.errorModel.clear();
        var number = parseFloat(this.get("numberInput"), 10);
        if (isNaN(number)) {
            this.errorModel.set({
                numberInput: "Not a number!"
            });
        } else if (number <= 10 || number >= 20) {
            this.errorModel.set({
                numberInput: "Must be between 10 and 20"
            });
        }
        if (!_.isEmpty(this.errorModel.toJSON())) {
            return "Validation errors. Please fix.";
        }
    }
});
```
``` JavaScript
var FormView = ADK.UI.Form.extend({
    events: {
        "submit": function(e) {
            e.preventDefault();
            // calling the form model's validate method
            if (this.model.isValid())
                // logic for when the model is valid
            else {
                // logic for when the model is not valid
            }
        }
    }
    ...
});
```
View [Backbone's Documentation on validate][BackboneModelValidate] for more details

#### Setting focus on first error field ####
If the model does not pass validation (`[form model].isValid()`) generally the user's focus should be placed at the first failing form field.

By calling `[form view].transferFocusToFirstError()` the first form field with an error message will recieve focus.
``` JavaScript
var FormView = ADK.UI.Form.extend({
    events: {
        "submit": function(e) {
            e.preventDefault();
            // calling the form model's validate method
            if (this.model.isValid())
                // logic for when the model is valid
            else {
                // logic for when the model is not valid
                // ...
                this.transferFocusToFirstError();
            }
        }
    }
    ...
});
```

#### Dynamic Hiding and Showing of Form Elements ####
Hiding and showing of form elements dynamically, should be hanndled by Marionette's **modelEvents** object.  The _modelEvents_ object parameter can be added to the form's view like shown in the example below:

```JavaScript
var ExampleFormView = ADK.UI.Form.extend({
    model: new Backbone.Model(),
    fields: [],
    modelEvents: {
        "event-selector": "callback-function"
    }
});
```

An example case where you might need to hide/show form elements dynmaically could be to allow the user to provide more specific information on a particular selection.  So the following example is to show how once the user selects an option from the select dropdown, if the option they select is email then the appropriately email field will be enabled and required, otherwise if they choose phone-number then similarly the phone number input field will be enabled and required.

```JavaScript
var ExampleFormModel = Backbone.Model.extend({
    defaults: {
        perferredMethodOfContact: '',
        email: '',
        phoneNumber: ''
    }
});
ExampleFormView = ADK.UI.Form.extend({
    model: new ExampleFormModel(),
    ui: {
        "phoneNumberField": ".phoneNumber",
        "emailField": ".email",
    },
    fields: [{
        control: "select",
        name: "perferredMethodOfContact",
        label: "What is your perferred method of contact?",
        options: [{
            label: "Email",
            value: "email"
        }, {
            label: "Phone",
            value: "phone"
        }],
        required: true
    }, {
        control: "input",
        name: "email",
        label: "Email Address",
        placeholder: "Enter youremail...",
        type: "email",
        extraClasses: ["hidden"],
        required: true
    }, {
        control: "input",
        name: "phoneNumber",
        label: "Phone Number",
        placeholder: "Enter your phone number...",
        type: "input",
        extraClasses: ["hidden"],
        required: true
    }],
    modelEvents: {
        'change:perferredMethodOfContact': function() {
            var method = this.model.get('perferredMethodOfContact');
            if (method === "email") {
                this.$(this.ui.phoneNumberField).trigger('control:hidden', true);
                this.$(this.ui.emailField).trigger('control:hidden', false);
            } else if (method === "phone") {
                this.$(this.ui.emailField).trigger('control:hidden', true);
                this.$(this.ui.phoneNumberField).trigger('control:hidden', false);
            } else {
                this.$(this.ui.emailField).trigger('control:hidden', true);
                this.$(this.ui.phoneNumberField).trigger('control:hidden', true);
            }
        }
    }
});
```
::: callout
**Please refer to each componet's documentation individually to ensure which events are supported for each.** (Not all controls will support the events used above example)
:::



### Modal (window) ###

#### Create clickable item ####

Add a unique id to the HTML tag.  See example below:

```HTML
<button id="modalButton">CLICK ME</button>
```

#### Tie clickable item to event function ####
Under the events field in the extend Backbone ItemView use the unique id assign to the clickable item to listen for a click event.
The event should call a function that creates your new instance of your modal view and assigned this.model to be the model for that view.
Finally, instantiate the **ADK.UI.Modal** constructor with the appropriate options, and use the **show** function to display the view.  (see below)

```JavaScript
events: {
    'click #modalButton': 'showModal'
},
showModal: function(event) {
    event.preventDefault(); //prevent the page from jumping back to the top

    //Note: the view shown in the modal window can be any view
    var view = new exampleView();
    view.model = this.model;

    //Note: this is optional and only an example.
    //      this example creates a view that has a "Exit" button, that will be displayed in the modal's footer
    var footerView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile("<button type='button' class='btn btn-default' data-dismiss='modal'>Exit</button>")
    });

    //Note: this is optional and only an example.
    //Specifying your own header view will remove the default x-close button -> create your own if needed
    // This example creates a view that has a title as well as a "Previous" and "Next" button
    var headerView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile("<h1>Hi I'm a Modal Header</h1><button type='button' class='btn btn-default'>Previous</button><button type='button' class='btn btn-default'>Next</button>")
    });

    //Note: passing in modalOptions is optional
    var modalOptions = {
        'title': this.model.get('name'),
        'size': "medium",
        'backdrop': true,
        'keyboard': true,
        'callShow': true,
        'headerView': headerView,
        'footerView': footerView
    }
    var modalView = new ADK.UI.Modal({view: view, options: modalOptions});
    modalView.show();
}
```

#### Modal Options ####
_*Note:_ The **ADK.UI.Modal** constructor can take in one options object that contains two attributes.
- The first attribute is the **view** that gets shown in the modal: _required_
- The second attribute is the **options** object, an object variable with the modal options: _optional_
- Example: `new ADK.UI.Modal({view: exampleView, options: modalOptions})`

The following are the available options/attributes for the _options_ object:

| Required  | Option          | Type                                | Description                                                      |
|:---------:|-----------------|-------------------------------------|------------------------------------------------------------------|
|           | **title**       | string                              | displays a string as the title to the modal |
|           | **size**        | string                              | valid modal widths include: "xlarge" / "large" / "medium" <br />**default**: _"medium"_ |
|           | **backdrop**    | boolean / "static"                  | Includes a modal-backdrop element. Alternatively, specify static for a backdrop which doesn't close the modal on click. <br />**default**: _true_ |
|           | **keyboard**    | boolean                             | closes the modal when escape key is pressed <br />**default**: _true_ |
|           | **callShow**    | boolean                             | Shows the modal when initialized <br />**default**: "true" <br />**Note:** If the developer wishes to issue $("#mainModal").modal('show') or use data-toggle this MUST be set to _false_ |
|           | **footerView**  | Marionette view definition / string | overwrites the default modal footer (close button) with a specified view <br />**Note:** if set to _'none'_ no footer region will be shown |
|           | **headerView**  | Marionette view definition          | overwrites the default modal header (x-close button and title) with a specified view |

::: side-note

**Note**: When ADK.UI.Modal({view: view, options: modalOptions}) is issued by some method other than an element with the data-toggle="modal" data-target="#modalElement" (such as through the channeling service or JavaScript), the modal must have the 'callShow' option set to true.

**Also Note**: Instantiating the _ADK.UI.Modal_ constructor returns the modal's Layout View which includes modal-header, modal-body and modal-footer.
:::

#### Ways to Hide/Terminate Modal ####
There are two ways to terminate a modal. A developer can apply 'data-dismiss="modal"' to a button and by default a click of that button will close the modal and destroy all associated views. Programatically, a developer can issue an ADK.UI.Modal.hide() call (for instance, in a 'success' callback) which will also terminate a modal and destroy all views.


### Notification  ###

**ADK.UI.Notification** provides a standard approach for generating and showing a growl-type alert that is 508 compliant and has consistent HTML styling. _ADK.UI.Notification_ should be used for notifications of actions completed, such as successfully submitting a form.

_ADK.UI.Notification_ is an object constructor. The following is an example of creating and showing a new _ADK.UI.Notification_:

```JavaScript
// example: displays notification on submit button click
var exampleView = Backbone.Marionette.ItemView.extend({
    template: Handlebars.compile([
        {{ui-button "Submit" classes="btn-primary" type="submit"}}
    ].join('\n')),
    events: {
        'submit': function() {
            // displays the notification
            simpleNotification.show();
        }
    },
    initialize: function() {
        this.simpleNotification = new ADK.UI.Notification({
            // available options go here, see table below for full descriptions
            title: "Example Alert",
            icon: "fa-check", // only matters if type: "basic"
            message: SimpleAlertItemView,
            type: "basic"
        });
    }
})
```

The following are methods available to call upon the ADK.UI.Notification constructor:

| Method   | Parameter         | Description                                                           |
|----------|-------------------|-----------------------------------------------------------------------|
| hide     |                   | hides and destroys any currently open notifcations.<br />**Example**: `ADK.UI.Notification.hide()`   |

The following are the available options to pass to the _ADK.UI.Notification_ constructor:

| Required                          | Option          | Type                       | Description                                                    |
|:---------------------------------:|-----------------|----------------------------|----------------------------------------------------------------|
|<i class="fa fa-check-circle"></i>| **title**       | string                     | the title or topic of the notification message<br />**Example**: `title: "Example Title"` |
|                                  | **icon**        | string                     | font awesome class to use on the icon<br />**Note**: only used if _type_ is `"basic"`, otherwise will be determined by _type_ <br />**Example**: `icon: "fa-info"` |
|                                  | **message**        | string                     | message to be displayed in the "body" of the notification<br />**Example**: `message: "This is an example of notification text"` |
|                                  | **type**        | string                     | determines color and icon of notification (specifying _"basic"_ will allow icon to be specified) <br />**Options**: _"basic"_(default), _"success"_, _"info"_, _"warning"_, and _"danger"_<br />**Example**: `type: "success"`|


### Tabs  ###

**ADK.UI.Tabs** provides a standard approach for generating and showing bootstrap tabs that are 508 compliant and has consistant HTML styling.

The following are the available options to pass into **ADK.UI.Tabs** constuctor upon initialization:

**Note**: Must be passed in as an array of objects to a **tabs** attribute, with each tab consisting of one object (Example: `new ADK.UI.Tabs({tabs: tabConfigArray}))`

| Required                          | Option      | Type                                 | Description                                              |
|:---------------------------------:|-------------|--------------------------------------|----------------------------------------------------------|
|<i class="fa fa-check-circle"></i> | **label**   | string   | Label / title to be displayed on a particular tab                  |
|<i class="fa fa-check-circle"></i>| **view**    | view     | View to be shown when its matching tab is selected |

The following is an example of instantiating the _ADK.UI.Tabs_ constructor. **Note**: This returns a view that must be shown by some parent view.

``` JavaScript
var exampleParentView = Backbone.Marionette.LayoutView.extend({
    ... // regions and template set up here
    initialize: function() {
        var tabsConfig = [{
            label: 'Tab 1',
            view: Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('tab 1 content')
            })
        }, {
            label: 'Tab 2',
            view: Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('tab 2 content')
            })
        }, {
            label: 'Tab 3',
            view: Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('tab 3 content')
            })
        }, {
            label: 'Tab 4',
            view: Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('tab 4 content')
            })
        }];
        // returns a Backbone.Marionette view
        this.exampleTabsView = new ADK.UI.Tabs({tabs: tabsConfig});
    },
    onBeforeShow: function() {
        this.showChildView('tabs-region', this.exampleTabsView);
    }
});
```

### Workflow (window) ###
#### Overview ####
A Workflow is a collection of form views that represent a writeback applet. Unlike a modal, a workflow allows a developer to open multiple form views at once and be able to step between them.  All form views will persist in the DOM elements until the workflow is abandonded or completes successfully.

The first thing to note is that a workflow should always be triggered programatically. Any button that either initiates the workflow, or adds another item to the workflow, needs to use event binding that triggers ADK.UI.Workflow.show(). Do not set 'data-toggle="modal" data-target="#mainWorkflow"'' on the DOM element. This will cause unwanted behavior and is not supported.

#### Basic Usage ####
A typical invokation is as follows:

```JavaScript
var workflowOptions = {
    title: "Example Workflow"
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
var workflowController = new ADK.UI.Workflow(workflowOptions);
workflowController.show();
```

::: side-note
**Note:** Instantiating the **ADK.UI.Workflow** constructor with the appropriate options will return the Marionette View Instance of the WorkflowController.

The **WorkflowController** has the following properties/methods that you can use.

| Method        | Parameter         | Description                                                               |
|---------------|-------------------|---------------------------------------------------------------------------|
| getFormView   | integer           | uses the given index to return the appropriate step's form view           |

Example Usage:
``` JavaScript
var workflowController = new ADK.UI.Workflow(workflowOptions);

var firstForm = workflowController.getFormView(0);
var secondForm = workflowController.getFormView(1);
//....and so on for every step in the workflow
```
:::

The following are the available attributes for the workflowOptions object:

| Required                                | Option          | Type               | Description                                                      |
|:---------------------------------------:|-----------------|--------------------|------------------------------------------------------------------|
|<i class="fa fa-check-circle"></i>       | **title**       | string             | the title or topic of the workflow form |
|<i class="fa fa-check-circle note">*</i> | **steps**       | array of objects   | configuration of workflow step objects (details listed below in the following table) |
|                                         | **showProgress**| boolean            | a model that the field's values will be binded to  |
|                                         | **size**        | string             | valid workflow widths include: "xlarge" / "large" / "medium" <br />**default**: _"medium"_ |
|                                         | **backdrop**    | boolean / "static" | Includes a modal-backdrop element. Alternatively, specify static for a backdrop which doesn't close the workflow on click. <br />**default**: _true_ |
|                                         | **keyboard**    | boolean            | closes the workflow when escape key is pressed <br />**default**: _true_ |
|                                         | **headerOptions**    | object            | Contains an **actionItems** (array of objects) attribute with each object containing a **label** (string) attribute and **onClick** (function) attribute. If _headerOptions_ is present, a dropdown menu will be displayed and each object in the _actionItems_ array will correspond to a menu item. <br />**Note**: in the function specified for _onClick_, `this` is a reference to the form. <br />**Example**: `headerOptions: {actionItems:[{label: 'Close', onClick: function(){ ADK.UI.Workflow.hide();} }] }` |

::: callout
**<i class="fa fa-check-circle note">\*</i> Note:** the views array is composed of a list of workflow step objects.  Each workflow step object defines a step in the workflow in which the user can/will encounter.
:::

#### Workflow Step Object ####
A **workflow step object** is composed of the following available attributes:

| Required                         | Option       | Type                       | Description                                                        |
|:--------------------------------:|--------------|----------------------------|--------------------------------------------------------------------|
|<i class="fa fa-check-circle"></i>| **view**     | Marionette view definition | the view to display for that particular step in the workflow  |
|<i class="fa fa-check-circle"></i>| **viewModel**| Backbone model instance    | model instance that the provided view will be tied to |
|<i class="fa fa-check-circle">*</i>| **stepTitle**| string                    | String to display in the workflow progress bar <br />**\* Note**: this attribute must be defined if showProgress is set to true |

#### Extra Form Properties to take advantage of: ####
::: side-note
It is important to note that when calling show each step view in the workflow will be assign a **workflow** property and a **stepIndex** property.
- **workflow** : pointer back to the workflow view which has helper methods to navigate between steps. Below is a table of the helper methods:

    | Method        | Parameter | Description                                                      |
    |---------------|-----------|------------------------------------------------------------------|
    | goToNext      |           | shows the next step's view in the provided steps array           |
    | goToPrevious  |           | shows the previous step's view in the provided steps array       |
    | goToIndex     | integer   | uses the given index to show the appropriate step's view         |

- **stepIndex** : step view's reference to it own view's index in the workflow

Example Usage:
``` JavaScript
ADK.UI.Form.extend({
...
    events: {
        "click button.continue": function(e) {
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
        ...
    }
})
```
:::

#### Ways to Hide/Terminate Workflow ####
There are two ways to terminate a workflow. Like Modal, a developer can apply 'data-dismiss="modal"'' to a button and by default a click of that button will close the workflow and destroy all associated views. Programatically, a developer can issue an ADK.UI.Workflow.hide() call (for instance, in a 'success' callback) which will also terminate a workflow and destroy all views.



## Template Helpers ##
::: definition
UI Template Helpers can be acccessed and used in handlebar templates by calling:
### **{{ui-[template-helper-name] ...}}** ###
:::
### Button ###
::: side-note
<button type="button" class="btn btn-default example-form-button" title="This is an active button">Active</button>
<button type="button" class="btn btn-default selected" title="This is an active button">Selected</button>
<button type="button" class="btn btn-default hover" title="This is an active button">Hover</button>
<button type="button" class="btn btn-default disabled" title="This is an active button">Disabled</button> <!-- or disabled=true -->
<h4>Buttons with Icons</h4>
<button type="button" class="btn btn-default" title="View Coversheet"><i class="fa fa-th"></i> Coversheet</button>
<button type="button" class="btn btn-default" title="View Timeline"><i class="fa fa-bar-chart"></i> Timeline</button>
<button type="button" class="btn btn-default" title="View Meds Review"><i class="fa fa-clipboard"></i> Meds Review</button>
<button type="button" class="btn btn-default" title="View Documents"><i class="fa fa-file-text-o"></i> Documents</button>
<h4>Size</h4>
<button type="button" class="btn btn-default btn-lg" title="This is a large button">Large Button</button>
<button type="button" class="btn btn-default" title="This is the default size button">Default Button</button>
<button type="button" class="btn btn-default btn-sm" title="This is a small button">Small Button</button>
<button type="button" class="btn btn-default btn-xs" title="This is a very small button">Extra Small Button</button>
:::
Code for the above example:
```HTML
    {{ui-button "Active" classes="example-form-button" title="This is an active button"}}
    {{ui-button "Selected" title="This is an active button" state="selected"}}
    {{ui-button "Hover" title="This is an active button" state="hover"}}
    {{ui-button "Disabled" title="This is an active button" state="disabled"}}

    {{ui-button "Coversheet" title="View Coversheet" icon="fa-th"}}
    {{ui-button "Timeline" title="View Timeline" icon="fa-bar-chart"}}
    {{ui-button "Meds Review" title="View Meds Review" icon="fa-clipboard"}}
    {{ui-button "Documents" title="View Documents" icon="fa-file-text-o"}}

    {{ui-button "Large Button" title="This is a large button" size="lg"}}
    {{ui-button "Default Button" title="This is the default size button"}}
    {{ui-button "Small Button" title="This is a small button" size="sm"}}
    {{ui-button "Extra Small Button" title="This is a very small button" size="xs"}}
```

[FormControls]: form-controls.md
[BackboneViewEvents]: http://backbonejs.org/#View-delegateEvents
[BackboneModelValidate]: http://backbonejs.org/#Model-validate
[MarionetteModelEvents]: http://marionettejs.com/docs/v2.4.1/marionette.itemview.html#modelevents-and-collectionevents