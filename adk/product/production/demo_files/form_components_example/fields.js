define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars',
    'app/applets/ui_components_demo/handlers/mockFetchPickList'
], function(Backbone, Marionette, $, Handlebars, mockFetchPickList ) {
    var pickList1 = new Backbone.Collection([{
        name: 'first-thing',
        label: 'First Thing',
        value: false,
        disabled: false
    }, {
        name: 'second-thing',
        label: 'Second Thing',
        value: false,
        disabled: true
    }, {
        name: 'third-thing',
        label: 'Third Thing',
        value: undefined,
        disabled: false
    }]);

    var statesArray = [{
        code: 'AL',
        description: 'Alabama'
    }, {
        code: 'AK',
        description: 'Alaska'
    }, {
        code: 'AZ',
        description: 'Arizona'
    }, {
        code: 'AR',
        description: 'Arkansas'
    }, {
        code: 'CA',
        description: 'California'
    }, {
        code: 'MD',
        description: 'Maryland'
    }, {
        code: 'MA',
        description: 'Massachusetts'
    }, {
        code: 'MI',
        description: 'Michigan'
    }, {
        code: 'VA',
        description: 'Virginia'
    }, {
        code: 'WA',
        description: 'Washington'
    }];

    var statesCollection = new Backbone.Collection(statesArray);

    var optionsArray = [{
        label: "Option 1",
        value: "opt1"
    }, {
        label: "Option 2",
        value: "opt2"
    }, {
        label: "Option 3",
        value: "opt3"
    }];

    var optionsCollection = new Backbone.Collection(optionsArray);

    var timeZonesArray = [{
        group: 'Alaska/Hawaiian Time Zone',
        pickList: [{
            value: 'AK',
            label: 'Alaska'
        }, {
            value: 'HI',
            label: 'Hawaii'
        }]
    }, {
        group: 'Pacific Time Zone',
        pickList: [{
            value: 'CA',
            label: 'California'
        }, {
            value: 'NV',
            label: 'Nevada'
        }, {
            value: 'OR',
            label: 'Oregon'
        }, {
            value: 'WA',
            label: 'Washington'
        }]
    }, {
        group: 'Mountain Time Zone',
        pickList: [{
            value: 'AZ',
            label: 'Arizona'
        }, {
            value: 'CO',
            label: 'Colorado'
        }, {
            value: 'ID',
            label: 'Idaho'
        }, {
            value: 'MT',
            label: 'Montana'
        }, {
            value: 'NE',
            label: 'Nebraska'
        }, {
            value: 'NM',
            label: 'New Mexico'
        }, {
            value: 'ND',
            label: 'North Dakota'
        }, {
            value: 'UT',
            label: 'Utah'
        }, {
            value: 'WY',
            label: 'Wyoming'
        }]
    }];

    var timeZonesArrayWithCustomMapping = [{
        myGroup: 'Alaska/Hawaiian Time Zone',
        pickList: [{
            code: 'AK',
            description: 'Alaska'
        }, {
            code: 'HI',
            description: 'Hawaii'
        }]
    }, {
        myGroup: 'Pacific Time Zone',
        pickList: [{
            code: 'CA',
            description: 'California'
        }, {
            code: 'NV',
            description: 'Nevada'
        }, {
            code: 'OR',
            description: 'Oregon'
        }, {
            code: 'WA',
            description: 'Washington'
        }]
    }, {
        myGroup: 'Mountain Time Zone',
        pickList: [{
            code: 'AZ',
            description: 'Arizona'
        }, {
            code: 'CO',
            description: 'Colorado'
        }, {
            code: 'ID',
            description: 'Idaho'
        }, {
            code: 'MT',
            description: 'Montana'
        }, {
            code: 'NE',
            description: 'Nebraska'
        }, {
            code: 'NM',
            description: 'New Mexico'
        }, {
            code: 'ND',
            description: 'North Dakota'
        }, {
            code: 'UT',
            description: 'Utah'
        }, {
            code: 'WY',
            description: 'Wyoming'
        }]
    }];

    var TimeZones = Backbone.Collection.extend({
        model: Backbone.Model.extend({
            parse: function(resp) {
                resp.pickList = new Backbone.Collection(resp.pickList);
                return resp;
            }
        })
    });

    var timeZonesCollection1 = new TimeZones(timeZonesArray, {
        parse: true
    });

    return {
      collapsibleContainer: [{
          control: 'collapsibleContainer',
          name: 'unique',
          headerItems: [{
            control: 'container',
            extraClasses: ["col-xs-8", "bpInput"],
            items: [{
              control: 'input',
              name: 'Blood Pressure',
              label: 'Blood Pressure',
              units: 'mm[HG]'
            }]
          },{
            control: 'container',
            extraClasses: ["col-xs-3"],
            items: [{
              control: 'radio',
              name: 'bp-radio-po',
              options: [{
                value: 'bp-unavailable',
                label: 'Unavailable',
              }, {
                value: 'bp-refused',
                label: 'Refused'
              }]
            }]
          }],
          collapseItems: [{
              control: "select",
              name: "bp-location-po",
              label: "Location",
              title: "To select an option, use the up and down arrow keys then press enter to select",
              extraClasses: ["col-xs-6"],
              disabled: true,
              pickList: [{
                label: "Option 1",
                value: "opt1"
              }, {
                label: "Option 2",
                value: "opt2"
              }, {
                label: "Option 3",
                value: "opt3"
              }]
            }, {
              control: "select",
              name: "bp-method-po",
              label: "Method",
              title: "To select an option, use the up and down arrow keys then press enter to select",
              extraClasses: ["col-xs-6"],
              disabled: true,
              pickList: [{
                label: "Option 1",
                value: "opt1"
              }, {
                label: "Option 2",
                value: "opt2"
              }, {
                label: "Option 3",
                value: "opt3"
              }]
            }, {
              control: "select",
              label: "Cuff Size",
              title: "To select an option, use the up and down arrow keys then press enter to select",
              name: "bp-cuff-size-po",
              extraClasses: ["col-xs-6"],
              disabled: true,
              pickList: [{
                label: "Option 1",
                value: "opt1"
              }, {
                label: "Option 2",
                value: "opt2"
              }, {
                label: "Option 3",
                value: "opt3"
              }]
            }, {
              control: "select",
              label: "Position",
              title: "To select an option, use the up and down arrow keys then press enter to select",
              name: "bp-position-po",
              extraClasses: ["col-xs-6"],
              disabled: true,
              pickList: [{
                label: "Option 1",
                value: "opt1"
              }, {
                label: "Option 2",
                value: "opt2"
              }, {
                label: "Option 3",
                value: "opt3"
              }]
            }]
          }],
        popover: [{
          control: "container",
          items: [{
            control: 'popover',
            legend: 'Popover',
            label: "Pop",
            name: "Popover",
            options: {
              header: '<div>Foobar</div>',
              placement: 'right'
            },
            extraClasses: ["btn-lg", "btn-info"],

            items: [{
              control: "container",
              tagName: 'a',
              extraClasses: ["here-i-am"],
              items: [
                {
                  control: "select",
                  name: "select1",
                  title: "To view the option(s), use the up and down arrow keys, and then press enter to select an option.",
                  label: "select",
                  pickList: optionsCollection,
                  groupEnabled: false
                },
                {
                  control: "button",
                  name: 'foobar',
                  label: "test",
                  type: "button",
                  extraClasses: ["btn-lg", "btn-danger"]
                }, {control: "spacer"}, {

                  control: "datepicker",
                  name: "date1",
                  label: "date"

                }, {control: "spacer"}, {

                  control: "input",
                  name: "popinput",
                  label: "input (with extra classes)",
                  placeholder: "Enter text...",
                  title: "Please enter a string value into input 3.",
                  extraClasses: ["class1", "class2"]
                }
              ]
            }]
          }]
        }],
        button: [{
          control: "container",
          template: "<b>button (submit)</b><br />",
          items: [{
            control: "button",
            label: "Next",
            name: "formStatus"
          }]
        }, {
          control: "container",
          template: "<br /><b>button (basic)</b><br />",
          items: [{
            control: "button",
            type: "button",
            label: "Button"
          }]
        }, {
          control: "container",
          template: "<br /><b>button (with id)</b><br />",
          items: [{
            control: "button",
            type: "button",
            label: "Button",
            id: "example-button-id"
          }]
        }, {
          control: "container",
          template: "<br /><b>button (with icon)</b><br />",
          items: [{
            control: "button",
            type: "button",
            label: "Button with Icon",
            icon: "fa-th"
          }]
        }, {
          control: "container",
          template: "<br /><b>button (disabled)</b><br />",
          items: [{
            control: "button",
            type: "button",
            label: "Disabled",
            disabled: true
          }]
        }, {
          control: "container",
          template: "<br /><b>button (different sizes)</b><br />",
          items: [{
            control: "button",
            type: "button",
            label: "Large",
            size: "lg"
          }, {
            control: "button",
            type: "button",
            label: "Small",
            size: "sm"
          }, {
            control: "button",
            type: "button",
            label: "Extra Small",
            size: "xs"
          }]
        }, {
          control: "container",
          template: "<br /><b>button (with extra classes)</b><br />",
          items: [{
            control: "button",
            type: "button",
            label: "Danger",
            extraClasses: ["btn-danger"]
          }, {
            control: "button",
            type: "button",
            label: "Warning",
            extraClasses: ["btn-warning"]
          }, {
            control: "button",
            type: "button",
            label: "Success",
            extraClasses: ["btn-success"]
          }]
        }],
        input: [{
          control: "input",
          name: "inputError",
          label: "input (with error message)",
          placeholder: "Enter text...",
          title: "This is an example input field, that has an error message."
        }, {
          control: "input",
          name: "input1",
          label: "uneditable-input",
          placeholder: "Enter text...",
          title: "This is an example input field, that is uneditable.",
          readonly: true
        }, {
          control: "input",
          name: "input2",
          label: "input",
          title: "Please enter a string value into input 2.",
          placeholder: "Enter text..."
        }, {
          control: "input",
          name: "input3",
          label: "input (with extra classes)",
          placeholder: "Enter text...",
          title: "Please enter a string value into input 3.",
          extraClasses: ["class1", "class2"]
        }, {
          control: "input",
          name: "input4",
          label: "input (disabled)",
          title: "Input 4 is currently disabled.",
          placeholder: "Enter text...",
          disabled: true
        }, {
          control: "input",
          name: "input5",
          label: "input (no initial value)",
          title: "Please enter a string value into input 5.",
          placeholder: "Enter text..."
        }, {
          control: "input",
          name: "input6",
          label: "input (required and no initial value)",
          title: "Please enter a string value into input 6.",
          placeholder: "Enter text...",
          required: true
        }, {
          control: "input",
          name: "input7",
          label: "input (with help message)",
          placeholder: "Enter text...",
          title: "Please enter a string value into input 7.",
          helpMessage: "This is a help message."
        }, {
          control: "spacer"
        }, {
          control: "input",
          name: "input8",
          label: "input (number)",
          placeholder: "Enter number...",
          title: "Please enter a number into input 8.",
          type: "number"
        }, {
          control: "input",
          name: "input9",
          label: "input (email)",
          placeholder: "Enter email...",
          title: "Please enter an email address into input 9.",
          type: "email"
        }, {
          control: "input",
          name: "input10",
          label: "input (password)",
          placeholder: "Enter password...",
          title: "Please enter unique password into input 10.",
          type: "password"
        }, {
          control: "input",
          name: "input11",
          label: "input (url)",
          placeholder: "Enter url...",
          title: "Please enter an url address including https:// into input 11.",
          type: "url"
        }, {
          control: "spacer"
        }, {
          control: "input",
          name: "input12",
          label: "input (with unit helper)",
          type: "number",
          title: "Please enter a number",
          placeholder: "Enter number...",
          units: 'minutes'
        }, {
          control: "input",
          name: "input13",
          label: "input (with radio button units)",
          type: "number",
          title: "Please enter a temperature",
          placeholder: "Enter a temperature...",
          units: [{
            label: "F",
            value: "f",
            title: "F Units"
          }, {
            label: "C",
            value: "c",
            title: "C Units"
          }]
        }, {
          control: "container",
          extraClasses: ["col-xs-12"],
          items: [{
            control: "spacer"
          }]
        }, {
          control: "input",
          name: "input14",
          label: "input (with character count)",
          title: "Typing with maxlength of 60",
          placeholder: "Enter keyboard input",
          maxlength: 60,
          charCount: true
        }, {
          control: "input",
          name: "input15",
          label: "uneditable-input with sr-only label",
          placeholder: "Enter text...",
          title: "This is an example input field, that is uneditable.",
          readonly: true,
          srOnlyLabel: true
        }, {
          control: "input",
          name: "input16",
          label: "input (with selectable units)",
          type: "number",
          title: "Please enter a temperature",
          placeholder: "Enter a temperature...",
          units: [{
            label: "A",
            value: "a",
            title: "A Units",
          }, {
            label: "B",
            value: "b",
            title: "B Units"
          }, {
            label: "C",
            value: "c",
            title: "C Units"
          }, {
            label: "D",
            value: "d",
            title: "D Units"
          }, {
            label: "E",
            value: "e",
            title: "E Units"
          }]
        }, {
          control: "input",
          name: "input17",
          label: "input with one element in units",
          type: "number",
          title: "Please enter a temperature",
          placeholder: "Enter a temperature...",
          units: [{
            label: "TEST",
            value: "t",
            title: "Test Unit",
          }]
        }],
        radio: [{
          control: "radio",
          name: "radioError",
          title: "radio (with error message)",
          label: "radio",
          options: [{
            label: "Option 1",
            value: "opt1",
            title: "Option 1"
          }, {
            label: "Option 2",
            value: "opt2",
            title: "Option 2"
          }, {
            label: "Option 3",
            value: "opt3",
            title: "Option 3"
          }]
        }, {
          control: "radio",
          name: "radio1",
          title: "To select an option, use the arrow keys.",
          label: "radio",
          options: [{
            label: "Option 1",
            value: "opt1",
            title: "Option 1"
          }, {
            label: "Option 2",
            value: "opt2",
            title: "Option 2"
          }, {
            label: "Option 3",
            value: "opt3",
            title: "Option 3"
          }]
        }, {
          control: "radio",
          name: "radio2",
          title: "To select an option, use the arrow keys.",
          label: "radio (with extra classes)",
          options: [{
            label: "Option 1",
            value: "opt1",
            title: "Option 1"
          }, {
            label: "Option 2",
            value: "opt2",
            title: "Option 2"
          }, {
            label: "Option 3",
            value: "opt3",
            title: "Option 3"
          }],
          extraClasses: ["class1", "class2"]
        }, {
          control: "radio",
          name: "radio3",
          title: "To select an option, use the arrow keys.",
          label: "radio (all options disabled)",
          options: [{
            label: "Option 1",
            value: "opt1",
            title: "Option 1"
          }, {
            label: "Option 2",
            value: "opt2",
            title: "Option 2"
          }, {
            label: "Option 3",
            value: "opt3",
            title: "Option 3"
          }],
          disabled: true
        }, {
          control: "radio",
          name: "radio4",
          title: "To select an option, use the arrow keys.",
          label: "radio (one option disabled)",
          options: [{
            label: "Option 1",
            value: "opt1",
            title: "Option 1"
          }, {
            label: "Option 2",
            value: "opt2",
            title: "Option 2",
            disabled: true
          }, {
            label: "Option 3",
            value: "opt3",
            title: "Option 3"
          }]
        }, {
          control: "radio",
          name: "radio5",
          title: "To select an option, use the arrow keys.",
          label: "radio (with help message)",
          options: [{
            label: "Option 1",
            value: "opt1",
            title: "Option 1"
          }, {
            label: "Option 2",
            value: "opt2",
            title: "Option 2"
          }, {
            label: "Option 3",
            value: "opt3",
            title: "Option 3"
          }],
          helpMessage: "This is a help message."
        }, {
          control: "radio",
          name: "radio6",
          title: "To select an option, use the arrow keys.",
          label: "radio (required)",
          options: [{
            label: "Option 1",
            value: "opt1",
            title: "Option 1"
          }, {
            label: "Option 2",
            value: "opt2",
            title: "Option 2"
          }, {
            label: "Option 3",
            value: "opt3",
            title: "Option 3"
          }],
          required: true
        }, {
          control: "radio",
          name: "radio7",
          title: "To select an option, use the arrow keys.",
          label: "radio with sr-only label",
          options: [{
            label: "Option 1",
            value: "opt1",
            title: "Option 1"
          }, {
            label: "Option 2",
            value: "opt2",
            title: "Option 2"
          }, {
            label: "Option 3",
            value: "opt3",
            title: "Option 3"
          }],
          srOnlyLabel: true
        }],
        select: [{
          control: 'select',
          name: "selectError",
          title: "To view the option(s), use the up and down arrow keys, and then press enter to select an option.",
          label: "select (with error message and filter)",
          pickList: timeZonesCollection1,
          showFilter: true,
          groupEnabled: true
        }, {
          control: "select",
          name: "selectError",
          title: "To view the option(s), use the up and down arrow keys, and then press enter to select an option.",
          label: "select (with error message)",
          pickList: optionsCollection,
        }, {
          control: "select",
          name: "select1",
          title: "To view the option(s), use the up and down arrow keys, and then press enter to select an option.",
          label: "select",
          pickList: optionsCollection,
          groupEnabled: false
        }, {
          control: "select",
          name: "select2",
          title: "To view the option(s), use the up and down arrow keys, and then press enter to select an option.",
          label: "select (with extra classes)",
          pickList: optionsArray,
          extraClasses: ["class1", "class2"]
        }, {
          control: "select",
          name: "select3",
          title: "To view the option(s), use the up and down arrow keys, and then press enter to select an option.",
          label: "select (disabled)",
          pickList: optionsArray,
          disabled: true
        }, {
          control: "select",
          name: "select4",
          title: "To view the option(s), use the up and down arrow keys, and then press enter to select an option.",
          label: "select (required)",
          pickList: optionsArray,
          required: true
        }, {
          control: "select",
          name: "select5",
          title: "To view the option(s), use the up and down arrow keys, and then press enter to select an option.",
          label: "select (list)",
          pickList: [{
            label: "Option 1",
            value: "opt1"
          }, {
            label: "Option 2",
            value: "opt2"
          }, {
            label: "Option 3",
            value: "opt3"
          }, {
            label: "Option 4",
            value: "opt4"
          }, {
            label: "Option 5",
            value: "opt5"
          }],
          size: 6
        }, {
          control: "select",
          name: "select6",
          title: "To view the option(s), use the up and down arrow keys, and then press enter to select an option.",
          label: "select (empty option)"
        }, {
          control: "select",
          name: "select7",
          label: "select (filter & collection)",
          pickList: timeZonesCollection1,
          showFilter: true,
          groupEnabled: true,
        }, {
          control: "select",
          name: "select8",
          label: "select (filter & collection & attribute mapping)",
          pickList: timeZonesArrayWithCustomMapping,
          showFilter: true,
          groupEnabled: true,
          attributeMapping: {
            group: 'myGroup',
            label: 'description',
            value: 'code'
          }
        }, {
          control: "select",
          name: "select9",
          label: "select (filter & group & required)",
          pickList: timeZonesArrayWithCustomMapping,
          showFilter: true,
          groupEnabled: true,
          attributeMapping: {
            group: 'myGroup',
            label: 'description',
            value: 'code'
          },
          required: true
        }, {
          control: "select",
          name: "select10",
          label: "select (filter & array)",
          pickList: timeZonesArray,
          showFilter: true,
          groupEnabled: true
        }, {
          control: "select",
          name: "select11",
          title: "To view the option(s), use the up and down arrow keys, and then press enter to select an option.",
          label: "select with sr-only",
          pickList: optionsCollection,
          groupEnabled: false,
          srOnlyLabel: true
        }, {
          control: "select",
          name: "select12",
          title: "To view the option(s), use the up and down arrow keys, and then press enter to select an option.",
          label: "select (multiple)",
          pickList: optionsCollection,
          groupEnabled: false,
          multiple: true
        }, {
            control: "select",
            name: "select13",
            title: "To view the option(s), use the up and down arrow keys, and then press enter to select an option.",
            label: "select (filter & array & fetch)",
            //pickList: timeZonesArray,
            showFilter: true,
            groupEnabled: true,
            fetchFunction: mockFetchPickList
        }],
        checkbox: [{
          control: "checkbox",
          name: "checkboxError",
          label: "checkbox (with error message)",
          title: "Example checkbox."
        }, {
          control: "checkbox",
          name: "checkbox1",
          label: "checkbox",
          title: "Example checkbox."
        }, {
          control: "checkbox",
          name: "checkbox2",
          label: "checkbox (with extra classes)",
          title: "Example checkbox with extra classes.",
          extraClasses: ["class1", "class2"]
        }, {
          control: "checkbox",
          name: "checkbox3",
          label: "checkbox (disabled)",
          title: "Example checkbox that is disabled.",
          disabled: true
        }],
        textarea: [{
          control: "textarea",
          name: "textareaError",
          label: "textarea (with error message)",
          placeholder: "Enter text..."
        }, {
          control: "textarea",
          name: "textarea1",
          label: "textarea",
          placeholder: "Enter text..."
        }, {
          control: "textarea",
          name: "textarea2",
          label: "textarea (disabled)",
          placeholder: "Enter text...",
          disabled: true
        }, {
          control: "textarea",
          name: "textarea3",
          label: "textarea (required)",
          placeholder: "Enter text...",
          required: true
        }, {
          control: "textarea",
          name: "textarea4",
          label: "textarea (with height set to 5 rows)",
          placeholder: "Enter text...",
          rows: 5
        }, {
          control: "textarea",
          name: "textarea5",
          label: "textarea (with width set to 3 rows)",
          placeholder: "Enter text...",
          cols: 3
        }, {
          control: "textarea",
          name: "textarea6",
          label: "textarea (with extra classes)",
          placeholder: "Enter text...",
          extraClasses: ["class1", "class2"]
        }, {
          control: "textarea",
          name: "textarea7",
          label: "textarea (with a set maxlength)",
          placeholder: "Enter text...",
          maxlength: 20
        }, {
          control: "textarea",
          name: "textarea8",
          label: "textarea (with help message)",
          placeholder: "Enter text...",
          helpMessage: "This is a help message."
        }, {
          control: "container",
          tagName: "p",
          template: "<hr><p><b>Note:</b> textarea has a default maxlength of '4000'</p>"
        }, {
          control: "textarea",
          name: "textarea1",
          label: "textarea with sr-only label",
          placeholder: "Enter text...",
          srOnlyLabel: true
        }],
        typeahead: [{
          control: "typeahead",
          name: "typeaheadError",
          label: "typeahead (with error message)",
          placeholder: "Please select a state.",
          pickList: statesCollection,
          options: {
            minLength: 3
          },
          attributeMapping: {
            label: 'description',
            value: 'code'
          }
        }, {
          control: "typeahead",
          name: "typeahead1",
          label: "typeahead",
          placeholder: "Please select a state.",
          pickList: statesCollection,
          options: {
            minLength: 3
          },
          attributeMapping: {
            label: 'description',
            value: 'code'
          }
        }, {
          control: "typeahead",
          name: "typeahead2",
          label: "typeahead (with extra classes)",
          placeholder: "Please select a state.",
          pickList: statesCollection,
          extraClasses: ["class1", "class2"],
          attributeMapping: {
            label: 'description',
            value: 'code'
          }
        }, {
          control: "typeahead",
          name: "typeahead3",
          label: "typeahead (disabled)",
          placeholder: "Please select a state.",
          pickList: statesCollection,
          attributeMapping: {
            label: 'description',
            value: 'code'
          },
          disabled: true
        }, {
          control: "typeahead",
          name: "typeahead4",
          label: "typeahead (required)",
          placeholder: "Please select a state.",
          pickList: statesCollection,
          attributeMapping: {
            label: 'description',
            value: 'code'
          },
          required: true
        }, {
          control: "typeahead",
          name: "typeahead5",
          label: "typeahead (array)",
          placeholder: "Please select a state.",
          pickList: statesArray,
          attributeMapping: {
            label: 'description',
            value: 'code'
          },
          required: true
        }, {
          control: "typeahead",
          name: "typeahead6",
          label: "typeahead with sr-only label",
          placeholder: "Please select a state.",
          pickList: statesCollection,
          attributeMapping: {
            label: 'description',
            value: 'code'
          },
          srOnlyLabel: true
        }],
        datepicker: [{
          name: "datepickerError",
          label: "datepicker (with error message)",
          control: "datepicker"
        }, {
          name: "date1",
          label: "datepicker",
          control: "datepicker"
        }, {
          name: "date2",
          label: "datepicker (with extra classes)",
          control: "datepicker",
          extraClasses: ["class1", "class2"]
        }, {
          name: "date3",
          label: "datepicker (disabled)",
          disabled: true,
          control: "datepicker"
        }, {
          name: "date4",
          label: "datepicker (required)",
          required: true,
          control: "datepicker"
        }, {
          name: "date5",
          label: "datepicker with sr-only label",
          control: "datepicker",
          srOnlyLabel: true
        }],
        timepicker: [{
          name: "timepickerError",
          label: "timepicker (with error message)",
          control: 'timepicker'
        }, {
          name: 'timePicker1',
          label: 'timepicker (basic)',
          control: 'timepicker',
          title: 'Enter a time',
          placeholder: 'HH:MM'
        }, {
          name: 'timePicker2',
          label: 'timepicker (with extra classes)',
          control: 'timepicker',
          extraClasses: ["class1", "class2"]
        }, {
          name: 'timePicker3',
          label: 'timepicker (disabled)',
          control: 'timepicker',
          disabled: true
        }, {
          name: 'timePicker4',
          label: 'timepicker (readonly)',
          control: 'timepicker',
          readonly: true
        }, {
          name: 'timePicker5',
          label: 'timepicker (required)',
          control: 'timepicker',
          required: true
        }, {
          name: 'timePicker6',
          label: 'timepicker (basic) with sr-only label',
          control: 'timepicker',
          srOnlyLabel: true
        }],
        checklist: [{
          name: "checklistError",
          label: "checklist (with error message)",
          control: "checklist",
          collection: pickList1,
          extraClasses: ["fancy", "BIGGGG"]
        }, {
          name: "availableProviders",
          label: "Providers",
          control: "checklist",
          collection: pickList1,
          extraClasses: ["fancy", "BIGGGG"],
          attributeMapping: {
            unique: 'itemName',
            value: 'itemValue',
            label: 'itemLabel'
          }
        }],
        yesNoChecklist: [{
          name: "yesNoChecklistError",
          label: "Yes/No checklist (with error message)",
          control: "yesNoChecklist",
        }, {
          name: "yesNoChecklist",
          label: "Visit Related To",
          control: "yesNoChecklist"
        }],
        toggleOptionsChecklist: [{
          name: 'toggleOptionsChecklist',
          label: 'toggle options checklist',
          control: 'toggleOptionsChecklist',
          columnHeaders: [{
            name: 'SC',
            description: 'Service Connected'
          }, {
            name: 'CV',
            description: 'Combat Veteran'
          }, {
            name: 'AO',
            description: 'Agent Orange exposure'
          }, {
            name: 'IR',
            description: 'Ionizing Radiation Exposure'
          }, {
            name: 'SWAC',
            description: 'Southwest Asia Conditions'
          }, {
            name: 'SHD',
            description: 'Shipboard Hazard and Defense'
          }, {
            name: 'MST',
            description: 'Military Sexual Truama'
          }, {
            name: 'HNC',
            description: 'Hippopotomal Nordic Conditions'
          }],
          description: 'This is the toggle options checklist'
        }],
        multiselectSideBySide: [{
          name: "availableProviders2",
          label: "Providers",
          control: "multiselectSideBySide",
          // collection: pickList1,
          header: "Providers for this encounter",
          extraClasses: ["fancy", "BIGGGG"],
          attributeMapping: {
            unique: 'id',
            value: 'booleanValue',
            label: 'description',
            checkValue: 'checked'
          },
          selectedItems: [{
            headerName: 'Check',
            control: 'checkbox',
            name: 'checkValue'
          }]
        }],
        nestedCommentBox: [{
          control: "fieldset",
          legend: "Nested Comment Box",
          items: [{
            control: "nestedCommentBox",
            name: "diagnosis",
            label: "Selected Diagnosis",
            extraClasses: ["special-class-for-ncb"],
            itemColumn: {
              columnTitle: "Diagnosis",
              columnClasses: ["percent-width-51"]
            },
            commentColumn: {
              columnTitle: "Comments",
              columnClasses: ["percent-width-15"]
            },
            additionalColumns: [{
              columnClasses: ["percent-width-13"],
              columnTitle: "Add to CL",
              name: "addToCL",
              control: 'checkbox'
            }, {
              columnClasses: ["percent-width-16"],
              columnTitle: "Primary",
              name: "primary",
              control: 'button',
              extraClasses: ["btn-xs", "btn-link"],
              type: "button",
              label: "Primary"
            }],
            collection: new Backbone.Collection([{
              id: "diagnosisGroup1",
              label: "Diagnosis Group 1",
              listItems: new Backbone.Collection([{
                id: "group1-diagnosis1",
                label: "group1 Diagnosis 1",
                selectedValue: true,
                addToCL: true,
                comments: new Backbone.Collection([]),
                primary: true
              }, {
                id: "group1-diagnosis2",
                label: "group1 Diagnosis 2",
                selectedValue: true,
                addToCL: false,
                comments: new Backbone.Collection([{
                  commentString: "This might be a non-causative symptom",
                  author: {
                    name: "USER,PANORAMA",
                    duz: {
                      "9E7A": "10000000255"
                    }
                  },
                  timeStamp: "12/12/2014 11:12PM"
                }]),
                primary: false
              }])
            }, {
              id: "diagnosisGroup2",
              label: "Diagnosis Group 2",
              listItems: new Backbone.Collection([{
                id: "group2-diagnosis1",
                label: "group2 Diagnosis 1",
                selectedValue: true,
                addToCL: true,
                comments: new Backbone.Collection([{
                  commentString: "This is probably the primary cause of the patients pain",
                  author: {
                    name: "USER,PANORAMA",
                    duz: {
                      "9E7A": "10000000255"
                    }
                  },
                  timeStamp: "12/14/2014 11:15PM"
                }, {
                  commentString: "Some additional thoughts: this cause is so weird",
                  author: {
                    name: "USER,OTHER",
                    duz: {
                      "9E7A": "10000000238"
                    }
                  },
                  timeStamp: "12/13/2014 11:17PM"
                }]),
                primary: true
              }, {
                id: "group2-diagnosis2",
                label: "group2 Diagnosis 2",
                selectedValue: false,
                addToCL: false,
                comments: new Backbone.Collection([{
                  commentString: "This might be a non-causative symptom",
                  author: {
                    name: "USER,OTHER",
                    duz: {
                      "9E7A": "10000000238"
                    }
                  },
                  timeStamp: "12/19/2014 11:11PM"
                }]),
                primary: false
              }])
            }]),
            attributeMapping: {
              collection: "listItems",
              commentsCollection: "comments",
              comment: "commentString",
              value: "selectedValue",
              label: "label",
              unique: "id",
              author: "author",
              timeStamp: "timeStamp"
            }
          }]
        }],
        commentBox: [{
          control: "fieldset",
          legend: "Comment Box",
          items: [{
            control: "commentBox",
            name: "commentCollection",
            collection: new Backbone.Collection([{
              commentString: "This is probably the primary cause of the patients pain",
              author: {
                name: "USER,PANORAMA",
                duz: {
                  "9E7A": "10000000255"
                }
              },
              timeStamp: "12/14/2014 11:15PM"
            }, {
              commentString: "Some additional thoughts: this cause is so weird",
              author: {
                name: "USER,OTHER",
                duz: {
                  "9E7A": "10000000238"
                }
              },
              timeStamp: "12/13/2014 11:17PM"
            }]),
            attributeMapping: {
              comment: "commentString",
              author: "author",
              timeStamp: "timeStamp"
            }
          }]
        }],
        alertBanner: [{
          control: "fieldset",
          legend: "Alert Banner",
          items: [{
            control: "alertBanner",
            name: "alertMessage",
            type: "warning",
            dismissible: true,
            title: "Warning Title",
            icon: "fa-warning"
          }, {
            control: "alertBanner",
            name: "alertMessage",
            type: "success",
            icon: "fa-check"
          }, {
            control: "alertBanner",
            name: "alertMessage",
            dismissible: true
          }, {
            control: "alertBanner",
            name: "alertMessage",
            type: "danger",
            title: "Danger title",
            extraClasses: ["special-alert-control-class"]
          }]
        }],
        rangeSlider: [{
          control: "fieldset",
          legend: "Range Slider",
          items: [{
            control: "rangeSlider",
            name: "painRange",
            sliderTitle: 'Level of Pain',
            id: "pain-slider",
            label: "Enter in the level of pain from zero to ten, zero being no pain and ten being the greatest amount of pain.",
            min: 0,
            max: 10,
            step: 1,
            density: 10,
            decimals: 0,
            extraClasses: ["pain-slider"]
          }]
        }],
        tableSelectableRows: [{
          control: "fieldset",
          legend: "Selectable Table",
          items: [{
            control: "selectableTable",
            name: "selectTableModel",
            id: "encounterLocationTable",
            collection: new Backbone.Collection([{
              date: "05/09/2015 - 12:00",
              details: "Was prescribed some pain meds",
              location: "Primary Care"
            }, {
              date: "05/09/2014 - 2:00",
              details: "Was given a cast for broken foot",
              location: "General Medicine"
            }, {
              date: "05/09/2013 - 1:00",
              details: "Hurt neck in plane crash",
              location: "Therapy"
            }, {
              date: "05/09/2012 - 2:30",
              details: "Swallowed a fork, need internal stitches",
              location: "ENT Surgery"
            }]),
            columns: [{ // order of columns and what is displayed (collection's models can have more than the columns)
              title: "Date",
              id: "date"
            }, {
              title: "Details",
              id: "details"
            }, {
              title: "Location",
              id: "location"
            }],
            extraClasses: ["special-class"] // goes onto container above .faux-table
          }]
        }],
        tabs: [{
          control: "fieldset",
          legend: "Selectable Table",
          items: [{
            control: "tabs",
            extraClasses: ["special-class-tabs"],
            tabs: [{
              title: "Clinic Appointments",
              items: [{
                name: "date1",
                label: "From",
                control: "datepicker",
                extraClasses: ["col-xs-6"]
              }, {
                name: "date2",
                label: "To",
                control: "datepicker",
                extraClasses: ["col-xs-6"]
              }, {
                control: "selectableTable",
                name: "selectTableModel",
                id: "encounterLocationTable",
                collection: new Backbone.Collection([{
                  date: "05/09/2015 - 12:00",
                  details: "Was prescribed some pain meds",
                  location: "Primary Care"
                }, {
                  date: "05/09/2014 - 2:00",
                  details: "Was given a cast for broken foot",
                  location: "General Medicine"
                }, {
                  date: "05/09/2013 - 1:00",
                  details: "Hurt neck in plane crash",
                  location: "Therapy"
                }, {
                  date: "05/09/2012 - 2:30",
                  details: "Swallowed a fork, need internal stitches",
                  location: "ENT Surgery"
                }]),
                columns: [{ // order of columns and what is displayed (collection's models can have more than the columns)
                  title: "Date",
                  id: "date"
                }, {
                  title: "Details",
                  id: "details"
                }, {
                  title: "Location",
                  id: "location"
                }]
              }]
            }, {
              title: "Hospital Admissions",
              items: [{
                control: "selectableTable",
                name: "selectTableModel",
                id: "encounterLocationTable",
                collection: new Backbone.Collection([{
                  date: "05/09/2015 - 12:00",
                  details: "Was prescribed some pain meds",
                  location: "Primary Care"
                }, {
                  date: "05/09/2014 - 2:00",
                  details: "Was given a cast for broken foot",
                  location: "General Medicine"
                }, {
                  date: "05/09/2013 - 1:00",
                  details: "Hurt neck in plane crash",
                  location: "Therapy"
                }, {
                  date: "05/09/2012 - 2:30",
                  details: "Swallowed a fork, need internal stitches",
                  location: "ENT Surgery"
                }]),
                columns: [{ // order of columns and what is displayed (collection's models can have more than the columns)
                  title: "Date",
                  id: "date"
                }, {
                  title: "Details",
                  id: "details"
                }, {
                  title: "Location",
                  id: "location"
                }],
                extraClasses: ["special-class"] // goes onto container above .faux-table
              }]
            }, {
              title: "New Visit",
              items: [{
                control: "input",
                name: "input5",
                label: "Text-input-5",
                placeholder: "Enter text...",
                title: "Please enter a string value into input 5."
              }, {
                control: "input",
                name: "input6",
                label: "Text-input-6",
                placeholder: "Enter text...",
                title: "Please enter a string value into input 6."
              }]
            }]
          }]
        }],
        dropdown: [
            {
                control: 'dropdown',
                split: false,
                icon: 'fa-list',
                id: 'dropdown-a',
                extraClasses: ['ping', 'pong'],
                items: [
                    { label: 'Sub Item 1', id: 'item-1', extraClasses: ['extra-class-a', 'extra-class-b'] },
                    { label: 'Sub Item 2', id: 'item-2', extraClasses: ['extra-class-c', 'extra-class-d'] }
                ]
            },
            {
                control: 'dropdown',
                split: false,
                label: 'Single button dropdown',
                id: 'dropdown-b',
                extraClasses: ['ping', 'pong'],
                items: [
                    { label: 'Sub Item 1', id: 'item-1', extraClasses: ['extra-class-a', 'extra-class-b'] },
                    { label: 'Sub Item 2', id: 'item-2', extraClasses: ['extra-class-c', 'extra-class-d'] }
                ]
            },
            {
                control: 'dropdown',
                split: false,
                label: 'Single button dropdown w/ icon',
                icon: 'fa-list',
                id: 'dropdown-c',
                extraClasses: ['ping', 'pong'],
                items: [
                    { label: 'Sub Item 1', id: 'item-1', extraClasses: ['extra-class-a', 'extra-class-b'] },
                    { label: 'Sub Item 2', id: 'item-2', extraClasses: ['extra-class-c', 'extra-class-d'] }
                ]
            },
            {
                control: 'dropdown',
                split: true,
                label: 'Split button dropdown',
                type: 'submit',
                title: 'Please enter to accept',
                id: 'dropdown-d',
                extraClasses: ['ping', 'pong'],
                items: [
                    { label: 'Sub Item 1', id: 'item-1', extraClasses: ['extra-class-a', 'extra-class-b'] },
                    { label: 'Sub Item 2', id: 'item-2', extraClasses: ['extra-class-c', 'extra-class-d'] }
                ]
            },
            {
                control: 'dropdown',
                split: true,
                label: 'Split button dropdown w/ icon',
                icon: 'fa-heartbeat',
                type: 'submit',
                title: 'Please enter to accept',
                id: 'dropdown-e',
                extraClasses: ['ping', 'pong'],
                items: [
                    { label: 'Sub Item 1', id: 'item-1', extraClasses: ['extra-class-a', 'extra-class-b'] },
                    { label: 'Sub Item 2', id: 'item-2', extraClasses: ['extra-class-c', 'extra-class-d'] }
                ]
            }
        ]
    };

});
