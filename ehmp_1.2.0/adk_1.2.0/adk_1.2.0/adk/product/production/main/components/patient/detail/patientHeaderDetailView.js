define('main/components/patient/detail/patientHeaderDetailView',  [
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/components/patient/detail/emergencyContactTemplate",
    "hbs!main/components/patient/detail/nokContactTemplate",
    "hbs!main/components/patient/detail/patientEmailTemplate",
    "hbs!main/components/patient/detail/patientPhoneTemplate",
    "hbs!main/components/patient/detail/patientHeaderDetailTemplate",
    "hbs!main/components/patient/detail/patientAddressInfoTemplate",
    "hbs!main/components/patient/detail/vaBenefitsTemplate",
    "hbs!main/components/patient/detail/serviceHistoryTemplate",
    'main/components/patient/detail/quickview/demographicQuickView',

    "main/components/patient/util/modelUtil"
], function(Backbone, Marionette, _, EmContactTemplate, NokContactTemplate, PatientEmailTemplate, PatientPhoneTemplate, PatientHeaderDetailTemplate, PatientAddressTemplate, VABenefitsTemplate, ServiceHistoryTemplate, DemoQV, modelUtil) {

    var GroupView = Backbone.Marionette.ItemView.extend({
        className: 'demographic-group',
        tagName: 'div',
        onRender: function() {
            this.$('.demographic-data').each(function(i) {
                if ($(this).data('diff')){
                    $(this).addClass('demographic-group-diff-text');
                } else {
                    $(this).removeClass('demographic-group-diff-text');
                }
            });
            if (this.options.qv && this.model.get('groupDiff') === true) {
                var viewClass = this.options.myView;
                this.quickView = new viewClass({
                    collection:this.model.get('externalSitesData'),
                });
                this.quickView.render();
                this.$el.popup({
                    placement: 'bottom',
                    halign: 'left',
                    content: this.quickView.$el,
                });
            }
            var self = this;
            this.$el.on('shown.bs.popover', function(e) {
                self.$el.attr('aria-expanded', true);
            });
            this.$el.on('hidden.bs.popover', function(e) {
                self.$el.attr('aria-expanded', false);
            });
        },

        onDestroy: function() {
            //We must explicitly destroy these views if we don't use a view type which handles children
            //Failure to do so may result in a memory leak
            if (this.options.qv && this.model.get('groupDiff') === true) {
                this.quickView.destroy();
            }
        },
        templateHelpers: function(value){
            var model = this.model;
            return {
                insurance: function() {
                    var ins = model.get('insurance');
                    if (ins && ins.length) {
                        ins.sort(function(a,b){
                            var c = a.effectiveDate ? a.effectiveDate : 0;
                            var d = b.effectiveDate ? b.effectiveDate : 0;
                            return d - c;
                        });
                        //temporary fix for incorrect date format in data
                        //Defect has been assigned to Triton
                        var effDate = ins[0].effectiveDate ? modelUtil.getVprDate(ins[0].effectiveDate) : null;
                        ins[0].effDate = effDate;
                        var expDate = ins[0].expirationDate ? modelUtil.getVprDate(ins[0].expirationDate) : null;
                        ins[0].expDate = expDate;
                        return ins[0];
                    }
                    return null;
                },
            };
        },
    });

    var patientHeaderDetailView = Backbone.Marionette.LayoutView.extend({
        template: PatientHeaderDetailTemplate,
        className: 'row demographics-container',
        regions: {
            ptPhoneRegion: '#pt-header-pt-phone',
            ptAddressRegion: '#pt-header-pt-address',
            ptEmailRegion: '#pt-header-email',
            ptEmContactRegion: '#pt-header-em-contact',
            ptNokContactRegion: '#pt-header-nok-contact',
            colThreeRegion: '#pt-header-em-ins',
            colFourRegion: '#pt-header-em-misc'
        },
         events: {
            'hidden.bs.dropdown .dropdown': function(e) {
                this.$('[data-toggle=popup]').popup('hide');
            },
        },

        onRender: function() {
            this.siteDiffs = modelUtil.getSiteDiffs(this.model);
            var ptPhoneView = new GroupView({
                model: this.siteDiffs.get('groupOne'),
                template: PatientPhoneTemplate,
                qv: true,
                myView: DemoQV.ptPhoneQV,
                attributes: {
                    'id' : 'pt-demo-phone-group',
                    'data-demo-group' : 'groupOne',
                    'tabindex' : '0',
                    'data-toggle' : 'popup',
                    'role' : 'button',
                    'aria-haspopup' : true,
                    'aria-expanded' : false
                },
            });

            this.ptPhoneRegion.show(ptPhoneView);

            var ptAddressView = new GroupView({
                model: this.siteDiffs.get('groupTwo'),
                template: PatientAddressTemplate,
                qv: true,
                myView: DemoQV.ptAddressQV,
                attributes: {
                    'id' : 'pt-demo-address-group',
                    'data-demo-group' : 'groupTwo',
                    'tabindex' : '0',
                    'data-toggle' : 'popup',
                    'role' : 'button',
                    'aria-haspopup' : true,
                    'aria-expanded' : false
                },
            });
            this.ptAddressRegion.show(ptAddressView);

            var ptEmailView = new GroupView({
                model: this.siteDiffs.get('groupThree'),
                template: PatientEmailTemplate,
                qv: true,
                myView: DemoQV.ptEmailQV,
                attributes: {
                    'id' : 'pt-demo-email-group',
                    'data-demo-group' : 'groupThree',
                    'tabindex' : '0',
                    'data-toggle' : 'popup',
                    'role' : 'button',
                    'aria-haspopup' : true,
                    'aria-expanded' : false
                },
            });
            this.ptEmailRegion.show(ptEmailView);

            var emContactView = new GroupView({
                model: this.siteDiffs.get('groupFour'),
                template: EmContactTemplate,
                qv: true,
                myView: DemoQV.emContactQV,
                attributes: {
                    'id' : 'pt-demo-em-contact-group',
                    'data-demo-group' : 'groupFour',
                    'tabindex' : '0',
                    'data-toggle' : 'popup',
                    'role' : 'button',
                    'aria-haspopup' : true,
                    'aria-expanded' : false
                },
            });
            this.ptEmContactRegion.show(emContactView);

            var nokContactView = new GroupView({
                model: this.siteDiffs.get('groupFive'),
                template: NokContactTemplate,
                qv: true,
                myView: DemoQV.nokContactQV,
                attributes: {
                    'id' : 'pt-demo-nok-contact-group',
                    'data-demo-group' : 'groupFive',
                    'tabindex' : '0',
                    'data-toggle' : 'popup',
                    'role' : 'button',
                    'aria-haspopup' : true,
                    'aria-expanded' : false
                },
            });
            this.ptNokContactRegion.show(nokContactView);

            var colThreeView = new GroupView({
                model: this.model,
                template: VABenefitsTemplate,
                attributes: {
                    'role' : 'menuitem',
                    'tabindex' : '0',
                },
            });
            this.colThreeRegion.show(colThreeView);

            var colFourView = new GroupView({
                model: this.model,
                template: ServiceHistoryTemplate,
                attributes: {
                    'role' : 'menuitem',
                    'tabindex' : '0',
                },
            });
            this.colFourRegion.show(colFourView);

            var that = this;
            this.$('.demographic-group').each(function(i) {
                var gp = $(this).data('demo-group');
                var testDiff = that.siteDiffs && that.siteDiffs.get(gp);
                if (testDiff) {
                    if (testDiff.has('groupDiff') && testDiff.get('groupDiff') === true) {
                        $(this).addClass('demographic-group-diff');
                        //$(this).attr("tabindex", 0);
                    } else {
                        $(this).removeClass('demographic-group-diff');
                    }
                }
            });
            this.$('[data-toggle=popup]').on('show.bs.popover', function(e) {
                that.$('[data-toggle=popup]').not(this).popup('hide');
            });
        },
        modelEvents: {
            "change": "render"
        },

        handleKeyPress: function(event) {
            event.preventDefault();
            if(event.keyCode === 13){
                this.launchDemographicDiff(event);
            }
        },
    });
    return patientHeaderDetailView;

});