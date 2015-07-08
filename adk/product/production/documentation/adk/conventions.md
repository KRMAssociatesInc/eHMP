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
- medication_review
   - assets
      - sass
         styles.scss
      + img
   - modal
      modalTemplate.html
      modalView.js
   - templates
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

## Technologies ##
- Use Backbone and Marionette for applet development
- Use Bootstrap for styling and display components
- Use Handlebars for html templates

## 508 Compliance ##
508 compliance is the minimum standard by which accessibility users are enabled to adequately operate the application.  WCAG 2.0 is an extended and more thorough means of ensure operability.  See here for an example of each enhanced Bootstrap object including a description of behavior and usage: [Simple 508 examples][508_Compliance]

[508_Compliance]: ./508_compliance.html
