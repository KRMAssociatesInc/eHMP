define([
    'backbone',
    'handlebars',
    'hbs!app/applets/logon/templates/main',
    'app/applets/logon/facilityListView'
], function(Backbone, Handlebars, mainTemplate, FacilityListView) {

    var MainView = Backbone.Marionette.LayoutView.extend({
        template: mainTemplate,
        regions: {
            facilityListRegion: '#authenication-facility-list'
        },
        events: {
            'submit': 'login',
            'propertychange .form-group': 'clearErrors',
            'change .form-group': 'clearErrors',
            'input .form-group': 'clearErrors',
            'paste .form-group': 'clearErrors'
        },
        onShow: function() {
            this.facilityListView = new FacilityListView({
                'parentView': this
            });
            this.facilityListRegion.show(this.facilityListView);
        },
        clearErrors: function() {
            if (this.$el.find('form').hasClass('has-error')) {
                this.$el.find('form').removeClass('has-error');
            }
            if (this.$el.find('#errorMessage').hasClass('alert-info')) {
                this.$el.find('#errorMessage').removeClass('alert-info text-info');
            }
            this.$el.find('#errorMessage').empty();
        },
        login: function(event) {
            event.preventDefault();
            //disable login button
            var login = this.$el.find('#login');
            login.button('loading');

            this.$el.find('#screenReaderAuthenticating').addClass('sr-only').removeClass('hidden').focus();
            var fp = {
                facility: this.$el.find('form #facility')[0].value,
                accessCode: this.$el.find('form #accessCode')[0].value,
                verifyCode: this.$el.find('form #verifyCode')[0].value
            };
            if (fp.facility && fp.accessCode && fp.verifyCode && (fp.facility !== "noneSelected")) {

                var onSuccessfulLogin = function() {
                    ADK.ADKApp.initAllRouters();
                    ADK.Navigation.navigate(ADK.ADKApp.userSelectedDefaultScreen);
                };

                var thisItemView = this;
                var onFailedLogin = function(error) {
                    if (window.console && window.console.log) {
                        console.log('Error logging in', error);
                    }
                    if (error) {
                        switch (error.status) {
                            case 401:
                                if (error.responseText) {
                                    var errorMessage = $.parseJSON(error.responseText).errorMessage;
                                    thisItemView.$el.find('#errorMessage').html(errorMessage);
                                } else {
                                    thisItemView.$el.find('#errorMessage').html('Authentication error.');
                                }

                                thisItemView.$el.find('form').addClass('has-error');
                                break;
                            case 403:
                                thisItemView.$el.find('#errorMessage').html('User is not authorized to access this system.');
                                thisItemView.$el.find('form').addClass('has-error');
                                break;
                            case 503:
                                thisItemView.$el.find('#errorMessage').html('SYNC NOT COMPLETE. Please try again in a few minutes.');
                                thisItemView.$el.find('#errorMessage').addClass('alert-info text-info');
                                break;
                            default:
                                thisItemView.$el.find('#errorMessage').html('Unable to login due to server error. Status code: ' + error.status);
                                thisItemView.$el.find('form').addClass('has-error');
                                break;
                        }
                    } else {
                        thisItemView.$el.find('#errorMessage').html('Authentication error.');
                        thisItemView.$el.find('form').addClass('has-error');
                    }
                    //enable login button
                    login.button('reset');
                };

                var authenticateUser = ADK.UserService.authenticate(fp.accessCode, fp.verifyCode, fp.facility);

                authenticateUser.done(onSuccessfulLogin).fail(onFailedLogin);

            } else {
                this.$el.find('form').addClass('has-error');
                this.$el.find('#errorMessage').html("Please ensure all fields have been entered");
                //enable login button
                login.button('reset');

            }
        }
    });
    var appletConfig = {
        id: 'logon',
        getRootView: function() {
            return MainView;
        }
    };
    return appletConfig;
});
