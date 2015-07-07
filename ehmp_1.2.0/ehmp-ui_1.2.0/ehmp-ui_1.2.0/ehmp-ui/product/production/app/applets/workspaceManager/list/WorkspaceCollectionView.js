define([
    'underscore',
    'backbone',
    'marionette',
    'gridster',
    'app/applets/workspaceManager/list/problems/associationManagerView',
    'hbs!app/applets/workspaceManager/list/screenEditorRow',
    'hbs!app/applets/workspaceManager/list/problems/associationCounterTemplate'
], function(_, Backbone, Marionette, gridster, AssociationManagerView, screenEditorRow, AssociationCounterTemplate) {

    'use strict';

    var screenManagerChannel = ADK.Messaging.getChannel('managerAddScreen');

    var generateScreenId = function(screenTitle) {
        var newId =  screenTitle.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase().replace(/\s+/g, '-');
        var screensConfig = ADK.UserDefinedScreens.getScreensConfigFromSession();
        var idExists = _.filter(screensConfig.screens, function(screen){
            return screen.id === newId;
        });

        if(idExists.length === 0){
            return newId;
        } else {
            console.error('Cannot create a screen ID that already exists: ' + newId);
        }
    };

    var toggleDefaultHtml = function(e, defaultButtonHTML) {
        var E;
        if (_.isUndefined(e)) {
            E = defaultButtonHTML;
        } else {
            E = e.currentTarget;
        }
        var starIcon = $(E);
        if (starIcon.hasClass('fa-star-o')) {
            starIcon.removeClass('fa-star-o');
            starIcon.addClass('fa-star');
            $(E).addClass('madeDefault');
        } else {
            starIcon.removeClass('fa-star');
            starIcon.addClass('fa-star-o');
            $(E).removeClass('madeDefault');
        }
    };

    var AssociationCounterView = Backbone.Marionette.ItemView.extend({
        template: AssociationCounterTemplate
    });

    var WorkspaceItemView = Backbone.Marionette.LayoutView.extend({
        template: screenEditorRow,
        attributes: function() {
            if (this.model.get('predefined') === true) {
                return {
                    class: 'row',
                    id: this.model.get('id')
                };
            } else {
                return {
                    class: 'row user-defined',
                    'data-screen-id': this.model.get('id'),
                    id: this.model.get('id')
                };
            }
        },
        events: {
            'click .fa-ellipsis-v': 'showManageOptions',
            'click .rearrange-worksheet': 'rearrangeWorksheet',
            'click i.showDefault': 'makeDefault',
            'click .launch-screen': 'launchWorksheet',
            'click .customize-screen' : 'customizeWorksheet',
            'click .delete-worksheet': 'deleteScreen',
            'click .duplicate-worksheet': 'clone',
            'blur .editor-input-element': 'saveInlineChange',
            'keyup .editor-input-element': 'inlineChangeEvent'
        },
        regions: {
            associationCounterRegion: '.associations-counter-region'
        },
        initialize: function() {
            this.screenOptions = {
                id: this.model.get('id'),
                routeName: this.model.get('routeName'),
                title: this.model.get('title'),
                description: this.model.get('description'),
                predefined: this.model.get('predefined'),
                defaultScreen: this.model.get('defaultScreen'),
                problems: _.clone(this.model.get('problems')) || []
            };
            if(!_.isUndefined(this.model.get('author'))){
                this.screenOptions.author = this.model.get('author');
            }

            var screenId = this.model.get('id');
            var module = ADK.ADKApp[screenId];
            var config = ADK.UserDefinedScreens.getGridsterConfigFromSession(this.model.get("id"));
            var predefined = this.model.get('predefined');
            if(predefined === true && module.applets && module.applets.length > 0) {
                this.model.set('hasApplets', true);
            }

            if(predefined === false && config && config.applets && config.applets.length > 0) {
                this.model.set('hasApplets', true);
            }

            if(screenId === 'documents-list') {
                this.model.set('documents-list', true);
            }

            // init association counter
            var self = this;
            this.model.on('change', function(model) {
                if (model.changed.problems) {
                    self.associationCounterRegion.show(new AssociationCounterView({ model: self.model }));
                    self.saveAssociationChange();
                }
            });
        },
        onRender: function() {
            $('body').on('click', {
                self: this
            }, this.closeManageOptions);
            var self = this;
            if (this.screenOptions.defaultScreen) {
                var defaultButtonHTML = this.$el.find('.showDefault');
                toggleDefaultHtml(undefined, defaultButtonHTML);
            }

            this.applyInputMasking();

            this.associationCounterRegion.show(new AssociationCounterView({ model: this.model }));

            var popoverTrigger = this.$('[data-toggle="popover"]');

            var globalClickHandler = function(e) {
                if ($(e.target).closest('.popover').length === 0) { //ignore clicks inside the popover
                    // there was a click outside the popover, so hide the popover
                    var isTrigger = $(e.target).closest('[data-toggle="popover"]').is(popoverTrigger);
                    if (!isTrigger) { // ignore clicks on the trigger elem - let bootstrap handle those
                        popoverTrigger.popover('hide');
                    }
                }
            };

            var globalResizeHandler = _.debounce(_.bind(this.positionPopover, this), 300);

            var popoverKeyupHandler = function(e) {
                if (e.keyCode === 27) {
                    console.log("escape keyup on popover");
                    e.stopPropagation();
                    popoverTrigger.popover('hide');
                    popoverTrigger.focus();
                }
            };

            popoverTrigger.popup({
                container: '.workspaceTable',
                placement: _.bind(this.getPopoverPlacement, this, popoverTrigger),
                halign: 'right',
                // Title is not displayed, but is needed to prevent the content function from being called twice.
                // This is a known issue in bootstrap 3: https://github.com/twbs/bootstrap/issues/12563
                title: 'Title',
                delay: 0,
                content: function() {
                    self.associationManagerView = new AssociationManagerView({ model: self.model });
                    self.associationManagerView.render();
                    return self.associationManagerView.$el;
                },
                template: '<div class="popover association-manager-popover" aria-label="Popup dialog used to search for problems and associate them with this workspace"><div class="popover-content"></div></div>',
                // trigger: 'focus'
                // viewport: '#item-list'
            });
            popoverTrigger.on('shown.bs.popover', function(e) {
                self.associationManagerView.trigger('show');

                // hide the popover on the next click outside the popover
                $('html').on('click', globalClickHandler);

                // reposition the popover when the window is resized
                $(window).on('resize', globalResizeHandler);

                // close the popover when escape is pressed
                $('.association-manager-popover').on('keyup', popoverKeyupHandler);

                popoverTrigger.addClass('active');
            });
            popoverTrigger.on('hidden.bs.popover', function(e) {
                if (self.associationManagerView) {
                    self.associationManagerView.destroy();
                }
                $('html').off('click', globalClickHandler);
                $(window).off('resize', globalResizeHandler);
                $('.association-manager-popover').off('keyup', popoverKeyupHandler);
                popoverTrigger.removeClass('active');
            });
        },
        positionPopover: function() {
            console.log("positioning popover");
            var popoverTrigger = popoverTrigger || this.$('[data-toggle="popover"]');
            var popover = $('.association-manager-popover');
            var placement = this.getPopoverPlacement(popoverTrigger);
            var triggerOffset = popoverTrigger.offset();
            var left = triggerOffset.left + popoverTrigger.outerWidth() - popover.outerWidth();
            var top;

            if (placement === 'bottom') {
                top = triggerOffset.top + popoverTrigger.outerHeight();
            } else if (placement === 'top') {
                top = triggerOffset.top - popover.outerHeight();
            }

            popover.offset({
                left: left,
                top: top
            });
        },
        getPopoverPlacement: function(popoverTrigger) {
            popoverTrigger = popoverTrigger || this.$('[data-toggle="popover"]');
            var placement = 'bottom';
            var popoverTop = popoverTrigger.offset().top + popoverTrigger.outerHeight();
            if (popoverTop + 250 > window.innerHeight) {
                placement = 'top';
            }
            return placement;
        },
        applyInputMasking: function() {
            this.$el.find('.editor-title-element').inputmask("Regex", {
                regex: "^[a-zA-Z0-9\\s]*$"
            });
        },
        showManageOptions: function(e) {
            if ($('#list-group').find('.manager-open').length !== 0) {
                $('body').click();
            }
            var manageOptionsContainer = this.$el.find('.manager-close');
            this.$el.find('.editor-row').css('border', '2px solid #00cccc');
            var parent = manageOptionsContainer.parent();
            manageOptionsContainer.css({
                position: 'fixed',
                top: parent.offset().top + 'px',
                left: parent.offset().left + parent.width() - 20 + 'px'
            });
            $('#list-group').scroll(function() {
                manageOptionsContainer.css({
                    top: parent.offset().top + 'px'
                });
            });
            manageOptionsContainer.addClass('manager-open');
            manageOptionsContainer.removeClass('manager-close');
            $('.manager-open').show();
            //set up flyout animation 
            //fly from left to right
            manageOptionsContainer.css({
                left: parent.offset().left + parent.width() + 20 + 'px'
            });
        },
        closeManageOptions: function(e) {
            var self = e.data.self;
            if (self.$el.find('.manager-open').length !== 0) {
                if (!$(e.target).hasClass('fa-ellipsis-v') && $(e.target).closest('.manageOptions').length === 0) {
                    var manageOptionsContainer = self.$el.find('.manager-open');
                    manageOptionsContainer.addClass('manager-close');
                    manageOptionsContainer.removeClass('manager-open');
                    manageOptionsContainer.removeAttr('style');
                    self.$el.find('.editor-row').css('border', '1px solid grey');
                }
            }
            $('.manager-close').hide();
        },
        rearrangeWorksheet: function(e) {
            $('body').click();
            $('.rearrange-row').removeClass('rearrange-row');
            $('[id="' + this.model.get('id') + '"]').addClass('rearrange-row');
        },
        makeDefault: function(e) {
            $('.madeDefault').removeClass('madeDefault');
            $('.fa-star').addClass('fa-star-o');
            $('.fa-star').removeClass('fa-star');
            //var defaultStarContainer = this.$el.find('.showDefault');
           // defaultStarContainer.show();
            toggleDefaultHtml(e);
            ADK.ADKApp.ScreenPassthrough.setNewDefaultScreen(this.screenOptions.id);
            this.screenOptions.defaultScreen = true;
            ADK.ADKApp.ScreenPassthrough.editScreen(this.screenOptions, this.screenOptions.id);
        },
        launchWorksheet: function(e) {
            var input = $(e.currentTarget);
            input.focus();
            var gridsterConfig = ADK.UserDefinedScreens.getGridsterConfigFromSession(this.model.get('id'));
            var appletsArray = gridsterConfig.applets;
            ADK.Navigation.navigate(this.screenOptions.routeName);
        },
        customizeWorksheet: function(e){
            var input = $(e.currentTarget);
            input.focus();
            ADK.Navigation.navigate(this.screenOptions.routeName);
            var channel = ADK.Messaging.getChannel('addAppletsChannel');
            channel.trigger('addApplets');
        },
        clone: function() {
            $(this.el).trigger('clone_screen', this.model);
        },
        saveInlineChange: function(e) {
            var input = $(e.currentTarget);
            var value = input.val();
            var origValue = input.attr('origValue') ? input.attr('origValue') : '';
            var origId = this.screenOptions.id;
            var isTitle = input.parent().hasClass('editor-title');
            var isDescription = input.parent().hasClass('editor-description');
            if (isTitle) {
                if (value !== '' && value !== origValue) {
                    if (value.trim().toLowerCase() === origValue.toLowerCase()){
                        value = value.trim();
                    }
                    var newTitle = value;
                    if (value.toLowerCase() !== origValue.toLowerCase()){
                        newTitle = this.processTitleChange(value);
                    }
                    input.val(newTitle);
                    var newId = generateScreenId(newTitle);
                    this.screenOptions.id = newId;
                    this.screenOptions.title = newTitle;
                    this.screenOptions.routeName = newId;
                    this.model.set('id', this.screenOptions.id);
                    this.model.set('title', this.screenOptions.title);
                    this.model.set('routeName', this.screenOptions.routeName);
                    ADK.ADKApp.ScreenPassthrough.editScreen(this.screenOptions, origId);
                    input.attr('origValue', newTitle);
                    this.saveIndicator(input);
                    $('#' + origId).attr({
                        id: newId,
                        'data-screen-id': newId
                    });
                }
            }
            else if (isDescription) {
                if (value != origValue) {
                    this.screenOptions.description = value;
                    this.model.set('description', this.screenOptions.description);
                    ADK.ADKApp.ScreenPassthrough.editScreen(this.screenOptions, origId);
                    input.attr('origValue', value);
                    this.saveIndicator(input);
                }
            }
        },
        inlineChangeEvent: function(e) {
            var input = $(e.currentTarget);
            var isTitle = input.parent().hasClass('editor-title');
            input.parent().removeClass('has-success').removeClass('has-error');
            input.next().removeClass('glyphicon-ok').removeClass('glyphicon-asterisk').attr('title','');
            if (isTitle && input.val() === ''){
                input.parent().addClass('has-error');
                input.next().addClass('glyphicon-asterisk').attr('title','Required Field');
            }
        },
        saveAssociationChange: function() {
            if (!this.screenOptions.predefined) {
                var newProblems = this.model.get('problems') || [];
                var currentProblems = this.screenOptions.problems || [];
                var changed = false;
                if (newProblems.length !== currentProblems.length) {
                    changed = true;
                } else {
                    for (var i = 0; i < currentProblems.length && !changed; i++) {
                        if (currentProblems[i].snomed !== newProblems[i].snomed) {
                            changed = true;
                        }
                    }
                }
                if (changed) {
                    this.screenOptions.problems = this.model.get('problems');
                    this.save(this.screenOptions.id);
                }
            }
        },
        save: function(screenId) {
            ADK.ADKApp.ScreenPassthrough.editScreen(this.screenOptions, screenId);
        },
        saveIndicator: function(input) {
            input.parent().addClass('has-success');
            input.next().addClass('glyphicon-ok').attr('title','Saved');
        },
        processTitleChange: function(title) {
            var loop = true;
            var newTitle = title;
            while (loop) {
                if (ADK.ADKApp.ScreenPassthrough.titleExists(newTitle)) {
                    var split = newTitle.split(' ');
                    var counter = isNaN(split[split.length - 1]) ? 2 : parseInt(split[split.length - 1]) + 1;
                    if (counter !== 2){
                        split.length = split.length - 1;
                    }
                    newTitle = split.join(' ') + ' ' + counter;
                }
                else {
                    loop = false;
                }
            }
            return newTitle;
        },
        onBeforeDestroy: function() {
            if (this.associationManagerView) {
                this.associationManagerView.destroy();
            }
            this.$('[data-toggle="popover"]').popover('destroy');
        }
    });

    var WorkspaceCollectionView = Backbone.Marionette.CollectionView.extend({
        childView: WorkspaceItemView,
        initialize: function() {
            var self = this;
            var promise = ADK.UserDefinedScreens.getScreensConfig();
            self.collection = new Backbone.Collection();
            promise.done(function(screensConfig) {
                self.collection.reset(screensConfig.screens);
                self.collectionOrig = self.collection.clone();
            });
            screenManagerChannel.comply('addNewScreen', this.addNewScreen, self);

        },
        events: {
            "clone_screen": "cloneScreen"
        },
        resetCollection: function() {
            this.collection.reset(ADK.UserDefinedScreens.getScreensConfigFromSession().screens);
        },
        onRender: function() {
            var self = this;
            self.setUpDrag();
            //508 functions

            $('html').keydown(function(e) {
                var player = $('.rearrange-row');
                if (player.length === 0) return;
                var prev = player.prev();
                var next = player.next();
                if (e.which === 38 && prev.length > 0) { //up key
                    self.moveWorkspaceUp(player, prev);
                } else if (e.which === 40 && next.length > 0) { //down key
                    self.moveWorkspaceDown(player, next);
                } else if (e.which !== 38 && e.which !== 40) {
                    $('.rearrange-row').removeClass('rearrange-row');
                }
            });

        },
        setUpDrag: function() {
            var self = this;
            var $el = this.$el;
            $el.find('.row').drag({
                items: '.tableRow',
                start: function(e) {
                    $('body').click(); //click body in order to hide the flyout menu
                    var $this = $(this);
                    var parent = $this.parent();
                    parent.before('<div class="row toInsert"></div>');
                    parent.addClass("draggingItem");
                    var height = parent.height();
                    var $toInsert = $el.find('.toInsert');
                    $toInsert.height(height);

                    $this.css({
                        'z-index': 99999,
                        'position': 'fixed',
                        'top': e.pageY - height + 'px',
                        'left': $toInsert.offset().left + 'px',
                        'width': $toInsert.width()
                    });
                    $this.hide();
                    setTimeout(function() {
                        $this.show();
                    }, 50);
                },
                drag: function(e) {
                    var $this = $(this);
                    var height = $this.parent().height();
                    $this.css('position', 'fixed');
                    $this.css('top', e.pageY - height + 'px'); // - $('#list-group').offset().top - $this.height() / 2 + 'px');
                    var $toInsert = $el.find('.toInsert');
                    $this.css('width', $toInsert.width());
                    $this.css('left', $toInsert.offset().left + 'px');
                    $('#list-group .row:not(.toInsert)').each(function() {
                        var $this = $(this);
                        var coveredOffset = $this.offset();
                        var coveredHeight = $this.height();
                        var top = coveredOffset.top;
                        if (e.pageY > top && e.pageY < (top + coveredHeight / 2)) {
                            $this.before($toInsert);
                        } else if (e.pageY > (top + coveredHeight / 2) && e.pageY < (top + coveredHeight)) {
                            $this.after($toInsert);
                        }
                    });
                },
                stop: function(e, ui) {
                    var $this = $(this);
                    var $toInsert = $el.find('.toInsert');
                    $toInsert.before($this.parent());
                    $toInsert.remove();
                    $this.removeAttr("style");
                    $el.find('.draggingItem').removeClass('draggingItem');
                    self.saveScreensOrders();
                }
            });
        },
        filterScreens: function(filterText) {
            this.initialize();
            this.collection.reset(_.filter(this.collectionOrig.models, function(model) {
                if (!_.isUndefined(model.get('description'))) {
                    return model.get('title').toLowerCase().indexOf(filterText.toLowerCase()) >= 0 || model.get('description').toLowerCase().indexOf(filterText.toLowerCase()) >= 0;
                } else {
                    return model.get('title').toLowerCase().indexOf(filterText.toLowerCase()) >= 0;
                }
            }));
            this.render();
        },
        moveWorkspaceUp: function(player, prev) {
            var self = this;
            prev.fadeOut(500, function() {
                prev.stop();
                prev.before(player);
                prev.show();
                self.saveScreensOrders();
            });
        },
        moveWorkspaceDown: function(player, next) {
            var self = this;
            next.fadeOut(500, function() {
                next.stop();
                next.after(player);
                next.show();
                self.saveScreensOrders();
            });

        },
        saveScreensOrders: function() {
            var ids = [];
            $('#list-group .row').each(function() {
                var id = $(this).attr('id');
                if (id)
                    ids.push(id);
            });
            ADK.UserDefinedScreens.sortScreensByIds(ids);
        },
        addNewScreen: function() {
            var self = this;
            var screenOptions;
            var screensConfig = ADK.UserDefinedScreens.getScreensConfigFromSession();
            var newTitle = self.generateTitle(screensConfig);
            var newScreenId = generateScreenId(newTitle);

            var authorString = ADK.UserService.getUserSession().get('firstname');
            authorString = authorString + ' ' + ADK.UserService.getUserSession().get('lastname');

            screenOptions = {
                id: newScreenId,
                routeName: newScreenId,
                title: newTitle,
                description: undefined,
                predefined: false,
                defaultScreen: false,
                author: authorString,
            };

            ADK.ADKApp.ScreenPassthrough.addNewScreen(screenOptions, ADK.ADKApp);
            self.resetCollection();

            //set focus to new screen title input
            self.setFocusToScreenInput(newScreenId);

            $('#list-group').animate({
                scrollTop: $('#list-group')[0].scrollHeight
            }, 'slow');

        },
        setFocusToScreenInput: function(screenId) {
            var sel = $('#' + screenId + ' input:text:first');
            sel.focus();
            sel.val(sel.val());
        },
        generateTitle: function(screensConfig) {
            var maxTitleNum = 0;
            screensConfig.screens.forEach(function(screen) {
                if (screen.title.indexOf('User Defined Workspace') !== -1 && !isNaN(Number(screen.title.slice(23)))) {
                    var titleNum = Number(screen.title.slice(23));
                    if (titleNum > maxTitleNum) maxTitleNum = titleNum;
                }
            });
            return "User Defined Workspace " + (maxTitleNum + 1);
        },
        cloneScreen: function(e) {
            var self = this;
            var screensConfig = ADK.UserDefinedScreens.getScreensConfigFromSession();

            var origTitle = $(e.target).find('input')[0];
            origTitle = ($(origTitle).val() === undefined ? $(e.target).find('.predefined-title').text() : $(origTitle).val());
            var cloneTitle = this.generateCloneTitle(origTitle);
            var newId = generateScreenId(cloneTitle);

            var screenIndex;
            //this is to make sure we have the latest collection from session/jds
            //this.collection can be outdated
            var coll = new Backbone.Collection(ADK.UserDefinedScreens.getScreensConfigFromSession().screens);
            var origModel = _.find(coll.models, function(model, Idx) {
                screenIndex = Idx;
                return model.get('title') === origTitle;
            });

            var authorString = ADK.UserService.getUserSession().get('firstname');
            authorString = authorString + ' ' + ADK.UserService.getUserSession().get('lastname');

            var clonedScreenOptions = {
                id: newId,
                routeName: newId,
                title: cloneTitle,
                description: origModel.get('description'),
                predefined: false,
                defaultScreen: false,
                author: authorString,
                problems: origModel.get('problems')
            };

            ADK.ADKApp.ScreenPassthrough.addNewScreen(clonedScreenOptions, ADK.ADKApp, screenIndex + 1);
            if (origModel.get('predefined') === true) {
                var _applets = ADK.ADKApp[origModel.get('id')].applets;
                var predefinedAppletConfig = {
                    applets: _applets
                };
                ADK.UserDefinedScreens.saveGridsterConfig(predefinedAppletConfig, clonedScreenOptions.id);
                ADK.UserDefinedScreens.cloneScreen(origModel.get('id'), clonedScreenOptions.id, true);
            } else {
                // UserDefinedScreens.cloneGridsterConfig(origModel.get('id'), clonedScreenOptions.id);
                // UserDefinedScreens.cloneScreenFilters(origModel.get('id'), clonedScreenOptions.id);
                ADK.UserDefinedScreens.cloneScreen(origModel.get('id'), clonedScreenOptions.id, false);
            }
            this.resetCollection();

            //set focus to cloned screen title input
            self.setFocusToScreenInput(newId);
        },
        generateCloneTitle: function(origTitle) {
            var cloneTitle;
            var promise = ADK.UserDefinedScreens.getScreensConfig();
            promise.done(function(screensConfig) {
                var previouslyCloned = _.filter(screensConfig.screens, function(screen) {
                    if (screen.title.indexOf(origTitle + ' Copy') !== -1 && screen.title.indexOf(origTitle + ' Copy Copy') === -1) {
                        return screen;
                    }
                });
                if (previouslyCloned.length !== 0) {
                    cloneTitle = origTitle + ' Copy ' + (previouslyCloned.length + 1);
                } else {
                    cloneTitle = origTitle + ' Copy';
                }
            });
            return cloneTitle;
        }
    });

    return WorkspaceCollectionView;
});
