::: page-description
# ADK Libraries #
Which libraries are available with sample implementations
:::

## 3rd Party Libraries ##

| Library                                                                                       | Require shortcut           | Version | License    |
|-----------------------------------------------------------------------------------------------|----------------------------|---------|------------|
| **Backbone** <br/> _http://backbonejs.org/_                                                   | backbone                   | 1.1.2   | MIT        |
| **Backbone Fetch Cache** <br/> _https://github.com/mrappleton/backbone-fetch-cache.git_       | backbone.fetch-cache       | 1.4.0   | MIT        |
| **Backbone Local Storage** <br/> _https://github.com/jeromegn/Backbone.localStorage_          | localstorage               | 1.1.5   | MIT        |
| **Backbone Paginator** <br/> _https://github.com/backbone-paginator/backbone.paginator_       | backbone.paginator         | 2.0.0   | MIT        |
| **Backbone Radio** <br/> _https://github.com/marionettejs/backbone.radio_                     | backbone.radio             | 0.6.0   | MIT        |
| **Backbone Session Storage** <br/> _https://gist.github.com/davemo/3875274_                   | sessionstorage             |         |            |
| **Backbone Sorted Collection** <br/> _https://github.com/jmorrell/backbone-sorted-collection_ | backbone-sorted-collection | 0.3.8   | MIT        |
| **Backgrid** <br/> _http://backgridjs.com/_                                                   | backgrid                   | 0.3.5   | MIT        |
| **Backgrid Filter** <br/> _http://backgridjs.com/ref/extensions/filter.html_                  | backgrid.filter            | 0.3.5   | MIT        |
| **Backgrid Moment Cell** <br/> _https://github.com/wyuenho/backgrid-moment-cell_              | backgrid-moment-cell       | 0.3.5   | MIT        |
| **Backgrid Paginator** <br/> _http://backgridjs.com/ref/extensions/paginator.html_            | backgrid.paginator         |         | MIT        |
| **Bootstrap** <br/> _http://getbootstrap.com/getting-started_                                 | bootstrap                  | 3.2.0   | MIT        |
| **Bootstrap-Datepicker** <br/> _http://bootstrap-datepicker.readthedocs.org/en/release/_      | bootstrap-datepicker       | 1.3.1   | Apache 2.0 |
| **Bootstrap-Timepicker** <br/> _http://jdewit.github.io/bootstrap-timepicker/_                | bootstrap-timepicker       | 0.2.6   | MIT        |
| **Bootstrap-Accessibility** <br/> _http://paypal.github.io/bootstrap-accessibility-plugin/_   | bootstrap-accessibilty     | 3.1.1   | PayPal     |
| **Crossfilter** <br/> _https://github.com/square/crossfilter/wiki/API-Reference_              | crossfilter                | 1.3.11  | MIT        |
| **Fastclick** <br/> _https://github.com/ftlabs/fastclick_                                     | fastclick                  | 4.2.0   | MIT        |
| **Font-Awesome** <br/> _http://fortawesome.github.io/Font-Awesome/examples/_                  |                            | 0.6.11  | MIT        |
| **Font-Google** <br/> _https://developers.google.com/fonts/docs/developer_api_                |                            |         | Apache 2.0 |
| **Gridster** <br/> _http://gridster.net/#documentation_                                       | gridster                   | 0.5.8   | MIT        |
| **Handlebars** <br/> _http://handlebarsjs.com/_                                               | handlebars                 | 2.0.0   | MIT        |
| **Highcharts/Highstock** <br/> _http://www.highcharts.com/docs_                               | highcharts                 | 2.0.4   | Commerical |
| **Jasmine** <br/> _http://jasmine.github.io/1.3/introduction.html_                            | jasmine                    | 1.3.1   | MIT        |
| **JQuery** <br/> _http://jquery.com/_                                                         | jquery                     | 1.10.2  | MIT        |
| **jQuery Inputmask** <br/> _https://github.com/RobinHerbots/jquery.inputmask_                 | jquery.inputmask           | 3.1.25  | MIT        |
| **libphonenumber** <br/> _https://github.com/googlei18n/libphonenumber_                       | libphonenumber             |         | Apache 2.0 |
| **Lodash** <br/> _https://github.com/lodash/lodash/blob/1.3.1/doc/README.md_                  | underscore                 | 1.3.1   |            |
| **Marionette** <br/> _http://marionettejs.com/_                                               | marionette                 | 2.4.1   | MIT        |
| **Moment** <br/> _http://momentjs.com/_                                                       | moment                     | 2.7.0   | MIT        |
| **Placeholders** <br/> _https://github.com/jamesallardice/Placeholders.js_                    | placeholders               | 3.0.2   | MIT        |
| **Typeahead** <br/> _https://github.com/twitter/typeahead.js/_                                | typeahead                  | 0.10.5  | MIT        |
| **Bowser** <br/> _https://github.com/ded/bowser_                                | bowser                  | 0.7.2  | MIT        |
| **Marionette Accessibility**                                                                  | backbone.paginator         | 0.0.1   |            |


> **Note:** Highcharts is not free, but is redistributed under the [terms of non-commerical use](http://shop.highsoft.com/faq/non-commercial#non-commercial-redistribution).

## Implementations ##
### jQuery Inputmask ###
This library enables the use of input formatting, such as limiting input to numeric characters and then displaying the input in an appropriate format. So for example, a user inputs a string of "19921102" and input mask could be used to format it to show "1992-11-02", with no additional logic/eventing. Review the documentation for more options.

Below is an example of adding an input mask to an input field:
```HTML
// HTML Template
<div class="input-group date">
      <input type="text" class="form-control input-sm" id="date" name="date">
</div>
```
```JavaScript
// JavaScript
this.$("#date").inputmask("y-m-d", {
    "placeholder": "YYYY-MM-DD"
});
```

### Bootstrap-Datepicker ###
This library provides a popover-like utility for picking a date graphically and have it set the date as a value inside an input field.

Below is an example of adding a date picker to an input field:
```HTML
// HTML Template
<div class="input-group date">
    <input type="text" class="form-control input-sm" id="filter-from-date" name="date">
</div>
```
```JavaScript
// JavaScript
this.$('.input-group.date').datepicker({});
```

### Bootstrap-Timepicker ###
This library provides a popover-like utility for picking a time graphically and have it set the time as a value inside an input field.

This example below creates a timepicker that has an attached glyphicon button, which triggers the popover/selector:
```HTML
// HTML Template
<div class="input-append input-group bootstrap-timepicker">
  <input id="timepicker" type="text" class="form-control input-sm">
    <span class="input-group-addon">
      <i class="glyphicon glyphicon-time"></i>
    </span>
</div>
```
```JavaScript
// JavaScript
this.$('#timepicker').timepicker();
```
**Note:** The examples in the documentation uses deprecated icons, so please use Bootstrap's glyphicons instead.

### Marionette-Accessibility ###

As the native PayPal accessibility library only sets events and event listeners on initial execution, a custom library has been created which leverages the same features as the PayPal library but sets the roles, events, and listeners on a view when the attach event is fired.  If the view triggering the attach event has a parent, it attempts to issue the function against the parent view.  This library helps with keyboard navigation as well as ARIA role changes for Bootstrap components so long as the Bootstrap patterns are followed.

## CSS/SASS ##
*More Information:* documentation on SASS can be found by visiting their website at: [sass](http://sass-lang.com/)

> **All applet styling should now be done in SASS format.**

Your Sass file ("styles.scss") should be located in the following folder: `[applet]/assets/sass/`
The SASS file will be used during the applet's build task to create css styling for your applet.

**Reminder:** The app imports "styles.css" and the converter names CSS files based on the SASS file name, so SASS files should be named **"styles.scss"** to ensure that the app imports the correct styles file.

### Best Practices when developing SASS for you Applet ###
To apply CSS styles to only your applet the best approach is to have the applet container has the first selctor of all your styles.  Using SASS, this process easy.  See below for an example.

```SASS
[data-appletid="patient_search"] {
  font-size: 14px;
  p {
    ....
  }
  .margin {
    ....
  }
}
```

The above example makes use of the **data-appletid** attribute that is on the container element of every applet.  *Note:* this attribute is set to the value of the applet id so it is unqiue to that specific applet.

The above SASS code will translate into the following CSS when you run `gradle build[applet id]`:

```CSS
[data-appletid="patient_search"] {
  font-size: 14px;
}
[data-appletid="patient_search"] p {
  ....
}
[data-appletid="patient_search"] .margin {
  ....
}
```

If you have styles that are specific to the way your applet looks inside a **modal**, you can use the following method to ensure your styles are speciifc your applet only.

In your JavaScript file where you create the modal view to pass to ADK.showModal(), add a className attribute to the view:
```JavaScript
var modalView = Backbone.Marionette.ItemView.extend({
    className: "uniqueClassName"
});
var modalOptions = {
    ....
};
ADK.showModal(modalView, modalOptions);
```

Then in your SASS file (styles.scss), use that unique class name as your top level selector:
```SASS
.uniqueClassName {
  .p {
    /* some styles */
  }
}
```
