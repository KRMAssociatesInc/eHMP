/**
 * Created by alexluong on 7/13/15.
 */

/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(['jquery', 'handlebars', 'backbone', 'marionette', 'main/ui_components/components', 'api/UIComponents', 'jasminejquery'],
    function($, Handlebars, Backbone, Marionette, UI) {
        var ModalShowView = Backbone.Marionette.ItemView.extend({
            template: Handlebars.compile('<div>le modal</div>')
        });
        var footerView = Backbone.Marionette.ItemView.extend({
            template: Handlebars.compile("<button type='button' class='btn btn-default' data-dismiss='modal'>Exit</button>")
        });
        var headerView = Backbone.Marionette.ItemView.extend({
            template: Handlebars.compile("<h1>Hi I'm a Modal Header</h1><button type='button' class='btn btn-default'>Previous</button><button type='button' class='btn btn-default'>Next</button>")
        });
        var modalOptions = {
            title: 'what',
            size: 'medium',
            backdrop: true,
            keyboard: true,
            callShow: true,
            headerView: headerView,
            footerView: footerView
        };
        var ModalView = new UI.Modal({ view: ModalShowView, options: modalOptions });

        var TestItemView = Backbone.Marionette.ItemView.extend({
            template: Handlebars.compile('<div>meatloaf</div>')
        });
        var TestLayoutView = Backbone.Marionette.LayoutView.extend({
            template: Handlebars.compile('<div class="stupid-region">meatball</div>'),
            regions: {
                'stupidRegion':'.stupid-region'
            }
        });

        var LayoutView = Backbone.Marionette.LayoutView.extend({
            template: Handlebars.compile('<div class="my-region"></div>'),
            //events: {
            //    'click #modalButton': 'showModal'
            //},
            ui: {
                'myRegion': '.my-region'
            },
            regions: {
                'myRegion': '@ui.myRegion'
            },
            initialize: function(options) {
                var Messaging = Backbone.Radio.channel('global'); // global channel

                var self = this;
                this.listenTo(Messaging, 'get:adkApp:region', function() {
                    console.log('weeb');
                    console.log(self.myRegion);
                    return self.myRegion;
                });
            }
        });

        xdescribe('A modal component', function() {

            afterEach(function() {
                //thing.remove();
            });
            describe('basic', function() {
                beforeEach(function() {
                    //var a = new LayoutView();
                    //var b = ModalView;
                    //b.show();

                    var a = new LayoutView();
                    a.render();

                    ModalView.show();

                    //a.getRegion('myRegion').show(new TestLayoutView());

                    var $thing = a.$el;
                    $('body').append($thing);
                });

                it('llama', function() {
                    console.log('lasagna');
                    console.log($('body').html());
                });

            });
        });
    });