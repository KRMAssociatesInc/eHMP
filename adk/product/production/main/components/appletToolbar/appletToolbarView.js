define([
    "jquery",
    "underscore",
    "backbone",
    "marionette",
    "handlebars",
    "api/Messaging",
    "api/ResourceService",
    'hbs!main/components/appletToolbar/templates/toolbarTemplate',
    'hbs!main/components/appletToolbar/templates/buttonTemplate',
    'hbs!main/components/appletToolbar/templates/dropdownTemplate'
], function($, _, Backbone, Marionette, Handlebars, Messaging, ResourceService, ToolbarTemplate, ButtonTemplate, DropdownTemplate) {

    var buttonFactory = function(bOptions, buttonType) {
        switch (buttonType.toLowerCase()) {
            case 'detailsviewbutton':
                return {
                    icon: 'fa-file-text-o',
                    view: ButtonView.extend({
                        options: bOptions,
                        attributes: _.extend({}, ButtonView.prototype.attributes, {
                            'tooltip-data-key': 'toolbar_detailview',
                            'button-type': 'detailView-button-toolbar'
                        }),
                        events: _.extend({}, ButtonView.prototype.events, {
                            click: function(e) {
                                e.preventDefault();
                                var currentPatient = ResourceService.patientRecordService.getCurrentPatient();
                                var channelObject = {
                                    model: this.options.targetElement.model,
                                    uid: this.options.targetElement.model.get("uid"),
                                    patient: {
                                        icn: currentPatient.attributes.icn,
                                        pid: currentPatient.attributes.pid
                                    }
                                };

                                if (this.options.targetElement.applet) {
                                    channelObject.applet = this.options.targetElement.applet;
                                }
                                Messaging.getChannel('gists').trigger('close:quicklooks');
                                Messaging.getChannel(this.options.targetElement.model.get('applet_id')).trigger('detailView', channelObject);
                            }
                        })
                    })
                };
            case 'quicklookbutton':
                return {
                    icon: 'fa-eye',
                    view: ButtonView.extend({
                        options: bOptions,
                        attributes: _.extend({}, ButtonView.prototype.attributes, {
                            'tooltip-data-key': 'toolbar_quicklook',
                            'button-type': 'quick-look-button-toolbar'
                        }),
                        events: _.extend({}, ButtonView.prototype.events, {
                            'click': function(e) {
                                e.preventDefault();
                                e.stopImmediatePropagation();
                                var pop = this.options.targetElement.$('[data-toggle=popover]');
                                pop.trigger('click');
                            }
                        })
                    })
                };
            case 'submenubutton':
                if (bOptions.submenuItems.length === 0) {
                    return {
                        icon: 'fa-share-alt',
                        view: ButtonView.extend({
                            options: bOptions,
                            attributes: _.extend({}, ButtonView.prototype.attributes, {
                                'tooltip-data-key': 'toolbar_submenu',
                                'button-type': 'submenu-button-toolbar',
                                'disabled': true
                            }),
                            onRender: function() {
                                this.$('i').attr('disabled', true);
                            }
                        })
                    };
                }
                if (bOptions.submenuItems.length === 1) {
                    return {
                        icon: 'fa-share-alt',
                        view: ButtonView.extend({
                            options: bOptions,
                            attributes: _.extend({}, ButtonView.prototype.attributes, {
                                'tooltip-data-key': 'toolbar_submenu',
                                'button-type': 'submenu-button-toolbar',
                                'href': bOptions.submenuItems[0].url
                            })
                        })
                    };
                }
                return {
                    icon: 'fa-share-alt',
                    view: DropdownView.extend({
                        options: bOptions,
                        childViewContainer: '.dropdown-menu',
                        childView: Backbone.Marionette.ItemView.extend({
                            tagName: 'li',
                            className: 'appletToolbar-submenu-title',
                            template: Handlebars.compile('<a href="{{url}}">{{displayText}}</a>')
                        }),
                        attributes: _.extend({}, DropdownView.prototype.attributes, {
                            'button-type': 'submenu-button-toolbar'
                        }),
                        onRender: function() {
                            _.each(this.options.submenuItems, function(menuItem) {
                                this.addChild(new Backbone.Model(menuItem), this.childView);
                            }, this);
                            this.ui.dropdownEl.dropdown();
                        }
                    })
                };
            case 'infobutton':
                return {
                    icon: 'fa-info',
                    view: ButtonView.extend({
                        options: bOptions,
                        attributes: _.extend({}, ButtonView.prototype.attributes, {
                            'tooltip-data-key': 'toolbar_infobutton',
                            'button-type': 'info-button-toolbar'
                        }),
                        events: _.extend({}, ButtonView.prototype.events, {
                            'click': function(e) {
                                e.preventDefault();
                                var currentPatient = ResourceService.patientRecordService.getCurrentPatient();
                                var channelObject = {
                                    model: this.options.targetElement.model,
                                    uid: this.options.targetElement.model.get("uid"),
                                    patient: currentPatient
                                };
                                ADK.utils.infoButtonUtils.callProvider(channelObject);
                            }
                        })
                    })
                };
            case 'deletestackedgraphbutton':
                return {
                    icon: 'fa-times',
                    view: ButtonView.extend({
                        options: bOptions,
                        className: 'btn',
                        attributes: _.extend({}, ButtonView.prototype.attributes, {
                            'tooltip-data-key': 'toolbar_deletestackedgraph',
                            'button-type': 'deletestackedgraph-button-toolbar'
                        }),
                        events: _.extend({}, ButtonView.prototype.events, {
                            click: function(e) {
                                e.preventDefault();
                                Messaging.getChannel('stackedGraph').trigger('delete', {
                                    model: this.options.targetElement.model
                                });
                            }
                        })
                    })

                };
            case 'tilesortbutton':
                return {
                    icon: 'fa-arrows-v',
                    view: ButtonView.extend({
                        options: bOptions,
                        className: 'btn tilesort-button-toolbar',
                        attributes: _.extend({}, ButtonView.prototype.attributes, {
                            'tooltip-data-key': 'toolbar_tilesortbutton',
                            'button-type': 'tilesort-button-toolbar'
                        }),
                        events: _.extend({}, ButtonView.prototype.events, {
                            click: function(e) {
                                e.preventDefault();
                            },
                            keydown: function(e) {
                                var draggingClass = 'tilesort-keydown-dragging';
                                var startTile = this.$el.closest('.gistItem');
                                var selectedTileIndex = $(startTile).parent().find('.gistItem').index(startTile);
                                var itemList = this.$el.closest('.gistItem').parent();

                                var tileNameList = $(itemList).find('.problem-name').length > 0 ? $(itemList).find('.problem-name') : $(itemList).find('[name="name"]');
                                var tileName = '';
                                if (!this.$el.hasClass(draggingClass)) {
                                    var tile;

                                    if (this.options.isStackedGraph) {
                                        tile = this.$el.closest('.appletToolbar').parent().parent().siblings('[draggable="true"]');
                                    } else {
                                        tile = this.$el.closest('.appletToolbar').parent().siblings('[draggable="true"]');
                                    }

                                    if (tile.length) {
                                        switch (e.which) {
                                            case 13:
                                            case 32:
                                                e.preventDefault();
                                                e.stopPropagation();

                                                this.$el.addClass(draggingClass);

                                                startTile.trigger('dragstart');

                                                this.$el.tooltip('destroy');

                                                tileName = tileNameList[selectedTileIndex].textContent;

                                                this.$el.append("<span class=\"sr-only\">You are on the Sort Tile button for the " + tileName +
                                                    " tile. To sort each tile, press enter on the sort tile button, then use the Up and Down arrow keys to reorder the selected tile. Press the enter key again to deselect the tile and lock into position. </span>");
                                                break;
                                        }
                                    }
                                } else {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    var itemListLen = tileNameList.length;

                                    switch (e.which) {
                                        case 38: // up arrow
                                        case 87: // up arrow

                                            this.$el.find('.sr-only').remove();
                                            if (selectedTileIndex > 0) {
                                                $(itemList).children('.gistItem').eq(selectedTileIndex - 1).before($(itemList).children('.gistItem').eq(selectedTileIndex));
                                                tileName = tileNameList[selectedTileIndex - 1].textContent;
                                                this.$el.append("<span class=\"sr-only\">You are above the " + tileName + " tile</span>");

                                                selectedTileIndex--;
                                            } else {
                                                this.$el.append("<span class=\"sr-only\">You've reached the top of the list</span>");
                                            }

                                            // drops out of focus after move
                                            this.$el.focus();
                                            this.$el.addClass(draggingClass);

                                            break;
                                        case 40: // down arrow
                                        case 90: // down arrow
                                            if (selectedTileIndex < itemListLen) {
                                                $(itemList).children('.gistItem').eq(selectedTileIndex + 1).after($(itemList).children('.gistItem').eq(selectedTileIndex));
                                                selectedTileIndex++;
                                            }

                                            // drops out of focus after move
                                            this.$el.focus();
                                            this.$el.addClass(draggingClass);

                                            this.$el.find('.sr-only').remove();
                                            if (tileNameList[selectedTileIndex]) {
                                                tileName = tileNameList[selectedTileIndex].textContent;
                                                this.$el.append("<span class=\"sr-only\">You are below the " + tileName + " tile</span>");
                                            } else {
                                                this.$el.append("<span class=\"sr-only\">You've reached the end of the list.</span>");
                                            }

                                            break;
                                        case 13:
                                        case 32:

                                            tileName = tileNameList[selectedTileIndex].textContent;
                                            this.$el.find('.sr-only').remove();
                                            this.$el.append("<span class=\"sr-only\">You just dropped the " + tileName + " tile</span>");

                                            this.$el.removeClass(draggingClass);

                                            var selectedTile = this.$el.closest('.gistItem');
                                            $(selectedTile).trigger('drop');
                                            $(selectedTile).focus();



                                            break;
                                    }

                                    this.$el.focus();
                                }
                            }
                        })
                    })
                };
            case 'additembutton':
                return {
                    icon: 'fa-plus',
                    view: ButtonView.extend({
                        options: bOptions,
                        className: 'btn additem-button-toolbar',
                        attributes: _.extend({}, ButtonView.prototype.attributes, {
                            'tooltip-data-key': 'toolbar_addorders',
                            'button-type': 'additem-button-toolbar'
                        }),
                        events: _.extend({}, ButtonView.prototype.events, {
                            'click': function(e) {
                                e.preventDefault();
                                e.stopImmediatePropagation();
                                var channelObject = {
                                    model: this.options.targetElement.model,
                                };

                                if (this.options.targetElement.applet) {
                                    channelObject.applet = this.options.targetElement.applet;
                                }
                                 e.preventDefault();
                                    var writebackView = ADK.utils.appletUtils.getAppletView('orders', 'writeback');
                                    var formModel = new Backbone.Model();
                                    var workflowOptions = {
                                        size: "large",
                                        title: "Order a Lab Test",
                                        showProgress: false,
                                        keyboard: true,
                                            steps: [{
                                                view: writebackView,
                                                viewModel: formModel,
                                                stepTitle: 'Step 1'
                                            }]
                                        };
                                    ADK.UI.Workflow.show(workflowOptions);
                                //Messaging.getChannel(this.options.targetElement.model.get("applet_id")).trigger('additem', channelObject);
                            }
                        })
                    })
                };
        }
        return {
            icon: '',
            view: ButtonView.extend({
                options: bOptions,
                events: _.extend({}, ButtonView.prototype.events, {
                    click: function(e) {
                        e.preventDefault();
                    }
                })
            })
        };
    };

    var ButtonView = Backbone.Marionette.ItemView.extend({
        tagName: 'a',
        template: ButtonTemplate,
        className: 'btn',
        initialize: function(options) {
            this.options = options;
        },
        attributes: {
            'data-toggle': 'tooltip',
            'data-container': 'body',
            'data-placement': 'auto top',
            //'data-original-title': this.model.title,
            //'title': this.model.title,
            'tabindex': 0
        },
        events: {
            'focusin': 'handleTrigger',
            'keydown': function(e) {
                if (!/(13|32)/.test(e.which)) return;
                e.preventDefault();
                e.stopPropagation();
                this.$el.trigger('click');
            }
        },
        handleTrigger: function(e) {
            this.trigger('before:click');
            this.$el.addClass('toolbar-btn-hover');
        },
        onDestroy: function(e) {
            this.$el.tooltip('destroy');
        }
    });

    var DropdownView = Backbone.Marionette.CompositeView.extend({
        template: DropdownTemplate,
        className: 'btn-group',
        attributes: {
            'role': 'group',
        },
        ui: {
            'dropdownEl': '[data-toggle=dropdown]'
        },
        events: {
            'keydown': function(e) {
                if (!/(13|32)/.test(e.which)) return;
                e.preventDefault();
                this.$el.trigger('click');
            }
        }
    });

    var toolbarView = Backbone.Marionette.CompositeView.extend({
        fade: 100,
        template: ToolbarTemplate,
        className: 'appletToolbar',
        childViewContainer: '.btn-group',
        childEvents: {
            'before:click': function(e) {
                this.$('.toolbar-btn-hover').removeClass('toolbar-btn-hover');
            },
            'focusout': function(e) {
                this.$('.toolbar-btn-hover').removeClass('toolbar-btn-hover');
            }
        },
        initialize: function(options) {
            this.options = options;
            this.targetElement = options.targetElement;
        },
        onRender: function(e) {
            _.each(this.options.buttonTypes, function(buttontype) {
                var button = buttonFactory(this.options, buttontype);
                this.addChild(new Backbone.Model({
                    icon: button.icon
                }), button.view);
            }, this);
        },
        show: function(e) {
            this.trigger('show:toolbar');
            this.$el.fadeIn(this.fade, _.bind(function(e) {
                this.trigger('shown:toolbar');
            }, this));
        },
        hide: function(e) {
            this.trigger('hide:toolbar');
            this.$('.toolbar-btn-hover').removeClass('toolbar-btn-hover');
            this.$el.fadeOut(this.fade, _.bind(function(e) {
                this.trigger('hidden:toolbar');
            }, this));
        }
    });
    return toolbarView;
});