define([
    'backbone'
], function(Backbone) {

    var Model = Backbone.Model.extend({
        defaults: {
            formStatus: {},
            printedModelValues: '',
            popinput: "bar",
            inputError: "Sample String Value",
            input1: "example string 1",
            input2: "example string 2",
            input3: "example string 3",
            input4: "example string 4",
            input5: null,
            input6: null,
            input7: "example string 7",
            input8: 11,
            input9: "example@email.com",
            input10: "password",
            input11: "http://www.google.com",
            input12: "13",
            typeahead1: "MD",
            typeahead2: "VA",
            typeahead3: "CA",
            radio1: "opt3",
            radio2: "opt2",
            radio3: "opt1",
            radio4: "opt1",
            radio5: "opt2",
            radio6: undefined,

            checkbox1: true,
            checkbox2: true,
            checkbox3: true,

            select1: "opt1",
            select2: null,
            select3: "opt3",
            select4: null,
            select5: "opt4",
            select7: "HI",
            select8: "CA",
            //select9: "HI",
            //select12: ["CA", "HI"],

            textarea1: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas blandit ex purus, quis cursus augue tempor vitae. Integer commodo tincidunt.",
            textarea2: null,
            textarea3: null,
            textarea4: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            textarea5: null,
            textarea6: null,
            textarea7: null,
            textarea8: null,

            searchBar: "blood",

            toggleOptionsChecklist: new Backbone.Collection([{
              name: 'toc1',
              label: 'first thing',
              description: 'This is the first row in the checklist',
              value: true,
            }, {
              name: 'toc2',
              label: 'second thing',
              description: 'This is the second row in the checklist',
              value: true,
            }, {
              name: 'toc3',
              lavel: 'third thing',
              description: 'This is the thrid row in the checklist',
              value: false,
              disabled: true
            }]),


            yesNoChecklistError: new Backbone.Collection([{
                name: 'first-thing',
                label: 'First Thing',
                value: false
            }, {
                name: 'second-thing',
                label: 'Second Thing',
                value: undefined
            }, {
                name: 'third-thing',
                label: 'Third Thing',
                value: true
            }]),
            yesNoChecklist: new Backbone.Collection([{
              name: 'service',
              label: 'Service Connected Condition',
              value: undefined
            }, {
              name: 'combat',
              label: 'Combat Vet (Combat Related)',
              value: undefined
            }, {
              name: 'orange',
              label: 'Agent Orange',
              value: undefined
            }]),
            availableProviders: new Backbone.Collection([{
                itemName: '005',
                itemLabel: 'Vehu, Five',
                itemValue: true
            }, {
                itemName: '001',
                itemLabel: 'Vehu, One',
                itemValue: false,
                disabled: true
            }, {
                itemName: '010',
                itemLabel: 'Vehu, Ten',
                itemValue: undefined
            }]),
            availableProviders2: new Backbone.Collection([{
                id: '005',
                description: 'Vehu, Five -2',
                booleanValue: true,
                checkValue: false
            }, {
                id: '001',
                description: 'Vehu, One -2',
                booleanValue: false,
                checkValue: false
            }, {
                id: '010',
                description: 'Vehu, Ten -2',
                booleanValue: undefined,
                checkValue: false
            }]),
            nesting: {
                sub1: "sub1 text value",
                sub2: "sub2 text value"
            },
            datepickerError: "12/23/2005",
            date1: "05/26/2015",
            timePicker1: "23:30",
            timePicker2: "23:30",
            timePicker3: "23:30",
            timePicker4: "23:30",
            alertMessage: "This might be important",
            painRange: 3,
            selectTableModel: new Backbone.Model({
                date: "05/09/2015 - 12:00",
                details: "Was prescribed some pain meds",
                location: "Primary Care"
            })
        },
        errorModel: new Backbone.Model({
            'inputError': 'Your input value is not valid!',
            'typeaheadError': 'Your typeahead value is not valid!',
            'radioError': 'Your radio value is not valid!',
            'checkboxError': 'Your checkbox value is not valid!',
            'selectError': 'Your select value is not valid!',
            'textareaError': 'Your text area value is not valid!',
            'timepickerError': 'Your time picker value is not valid!',
            'datepickerError': 'Your date picker value is not valid!',
            'yesNoChecklistError': 'Your yes/no checklist value is not valid!',
            'checklistError': 'Your checklist value is not valid!',
        }),
        validate: function(attributes, options) {
            this.errorModel.clear();

            var number = parseFloat(this.get("input8"), 10);
            if (isNaN(number)) {
                this.errorModel.set({
                    input8: "Not a number!"
                });
            } else if (number <= 10 || number >= 20) {
                this.errorModel.set({
                    input8: "Must be between 10 and 20"
                });
            }
            if (!_.isEmpty(this.errorModel.toJSON())) {
                return "Validation errors. Please fix.";
            }
        }
    });

    return Model;
});
