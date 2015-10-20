::: page-description
# Conventions #
Conventions used by ADK and best practices for applet developers
:::

## Applet Level Conventions ##
### Naming and Folder Structure ###
- **applet name** - lower case with underscores (e.g. medication_review).  This is the value provided when issuing a gradle createApplet and used for the applet directory name and applet id.
- **views** - camelCase ...View.js (e.g. _medicationView.js_, _medicationListView.js_)
- **templates** - camelCase ...Template.html (e.g. _medicationTemplate.html_, _medicationListTemplate.html_)
- **JavaScript functions** - all applet functionality should be abstracted into an eventHandler.js file to allow for accessibility in unit test.
- **directory structure**
    - applets are to be created in the applets directory
    - applet.js should exist in the root applet directory
    - every applet will have an **assets** folder that contains the following sub-folders: sass and img
        - this is where applet specific sass and image files should be stored _*_
```
▼ medication_review
   ▼ assets
      ▼ sass
         styles.scss
      ▶ img
   ▼ modal
      modalTemplate.html
      modalView.js
   ▼ templates
      medicationListTemplate.html
      medicationListView.js
      medicationTemplate.html
      medicationView.js
   applet.js
   eventHandler.js
```

### Event Handlers ###
In general, event handlers should go in their own file. This way, the actual view would be a wrapper for the event handler. This will be useful in both testing and debugging.

For unit testing, the event handler will be utilized instead of having a reference to the entire view - just the function to be tested. Additionally, the application would not have to be required in order to test a function - reducing dependencies on unrelated functionalities.

For debugging purposes, the event handler file would prove to be easier to find and correct than an isolated function in the view.

### Writeback ###
All writeback code should live in a **writeback** directory under the appropriate applet folder!

For an example, an orders writeback form would live under: `app/applets/orders/writeback`
```
▼ app
  ▼ applets
    ▼ orders
      ▼ writeback
        addOrder.js // example file
        ...[writeback files live here]...
      applet.js
```

The main writeback file should return an ADK.UI.Form Definition:
```JavaScript
define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars',
    ...
], function(Backbone, Marionette, $, Handlebars...) {

    var Form = ADK.UI.Form.extend({
        ....
    });
    return Form;
});
```
The applet.js file should require the main writback file and add an additional viewType object to the applet's config:
```JavaScript
define([
  'main/ADK',
  'underscore',
  'app/applets/[SAMPLE-APPLET-NAME]/writeback/[MAIN-WRITEBACK-FILE]'
], function (ADK, _, WritebackForm) {
  ...

  var appletConfig = {
    id: '[SAMPLE-APPLET-ID]',
    viewTypes: [
    //...additional view types
    {
      type: 'writeback',
      view: WritebackForm,
      chromeEnabled: false
    }],
    ...
  };

  return appletConfig;
});
```
When an action is performed to enable a writeback form to show you can follow the example below on how to retrieve the form view and show it:
```JavaScript
events: {
  '[some-event]': function(e) {
    e.preventDefault();
    var writebackView = ADK.utils.appletUtils.getAppletView([SAMPLE-APPLET-ID], 'writeback');
    var formModel = new Backbone.Model();
    var workflowOptions = {
      title: "Sample Form Title",
      steps: [{
        view: writebackView,
        viewModel: formModel,
        stepTitle: 'Step 1'
      }]
    };
    ADK.UI.Workflow.show(workflowOptions);
  }
}
```
::: callout
**Note:** The above code sample is only an example!
:::

## Technologies ##
- Use Backbone and Marionette for applet development
- Use Bootstrap for styling and display components
- Use Handlebars for html templates

## 508 Compliance ##
508 compliance is the minimum standard by which accessibility users are enabled to adequately operate the application.  WCAG 2.0 is an extended and more thorough means of ensure operability.  See here for an example of each enhanced Bootstrap object including a description of behavior and usage: [Simple 508 examples][508_Compliance]

## Git Conventions ##
In order to contribute code, you need to be familiar with Git.

### Branches ###
Branch names should be all lowercase letters with dash-separated words.

Branch naming conventions:
 * for new functionality:
    * `us0001-short-description`
    * where us0001 is the user story ID, if applicable
 * for bug fixes:
    * `master-de0001-short-description`
    * where `master` is the branch that the defect was created for (`r1.2`, for example) and `de0001` is the defect ID, if applicable

### Commits ###
A uniform commit message format is important for easy and accurate tracking of history.

The text up to the first blank line of the commit message is treated as the title, and the rest of the message is the body.

Commit message requirements:
 * The title should be no longer than 50 characters.
 * The title should imperatively describe what action the commit makes. For example, "Add authentication unit tests".
    * No declarative statements ("Added authentication unit tests" - BAD)
 * The title should use sentence case (just capitalize the first letter of the sentence).
 * Do not end the title with a period.
 * Wrap the body at 72 characters.
 * Use the body to explain what and why, not to explain how.

Commit change requirements:
 * Commits should be atomic. Commits should do one thing. All changes on a commit must relate to the commit message. Do not add changes which do not relate to the commit message.
    * Commits which have changes unrelated to the commit message make understanding git history difficult.
    * Atomic commits make cherry-picking, resolving merge conflicts, and reverting simple.

Tips:
 * If you've already made many changes without committing along the way, and you have many changes to commit, use `git add --patch` and make sure not to commit with the `-a` flag.
    * SourceTree or `git gui` make this easier with buttons that let you add individual chunks to commit.
 * Git GUI tools are useful for observation, but usually obscure how git commands are performed, so learn the simple git command-line interface to avoid confusion and mistakes.


[508_Compliance]: ./508_compliance.html
