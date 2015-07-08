define([
    'backbone',
    'marionette',
    'app/applets/documents/debugFlag'
], function(Backbone, Marionette, DebugFlag) {
    'use strict';

    var DEBUG = DebugFlag.flag;

    function scaleImages($note) {

        var $images = $note.find('img');

        $images.each(function(idx, $image) {

            $image = $($image);
            var imageWidth = "" + ($image.width() || $image.attr('width'));

            // remove any hard-coded width and height attributes so we can scale the image to fit the detail area
            $image.removeAttr('height'); // remove any hard-coded height setting
            $image.removeAttr('width'); // remove any hard-coded width setting

            if (imageWidth.substring(imageWidth.length - 2) !== 'px') {
                imageWidth += 'px';
            }
            $image.css('max-width', imageWidth);
            $image.css('background-size', 'contain');
            $image.css('width', '100%');
        });
    }

    function buildCssTabindexSelector(elemTypes) {
        var selector = '';
        elemTypes.forEach(function(elem) {
            if (selector.length > 0) {
                selector += ',';
            }
            selector += elem + ':not([tabindex])';
        });
        return selector;
    }

    function insertTabIndexes($note) {

        /* Algorithm:
         * 1. Define a subset of html element types that are likely to contain readable content (and thus ought to have a tabindex)
         * 2. Locate all matching elements in the DoD document
         * 2. For each matching element that deosn't already have a tabindex:
         *    a. If the element doesn't have any children that also match, give it a tabindex of 0
         */

        // element types that we'll consider adding a tabindex to
        var indexableElemTypes = ['td', 'p', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

        // find all the matching types that don't already have a tabindex
        var targetElems = $note.find(buildCssTabindexSelector(indexableElemTypes));

        // add the tabindex (and a data-tab-index attribute so we know which ones we touched)
        targetElems.attr('tabindex', '0');
        targetElems.attr('data-add-tabindex', true);

        // remove the attribute from any
        targetElems.each(function(idx, $elem) {
            $elem = $($elem);
            var childrenWithTabIndexes = $elem.find('[data-add-tabindex]');
            if (childrenWithTabIndexes.size() > 0) {
                $elem.removeAttr('tabindex');
                $elem.removeAttr('data-add-tabindex');
            }
        });
    }

    var dodComplexNoteUtil = {

        parseModel: function(response) {
            return response;
        },

        massageContent: function() {
            var dodContentContainer = $('.dodContent');

            if (dodContentContainer.size() > 0) {
                var $note = $(dodContentContainer[0].contentWindow.document);

                // scale images
                scaleImages($note);

                // insert tab indexes
                insertTabIndexes($note);

                // remove width/height attributes from tables
                $note.find('table[width],col[width],tr[width],th[width],td[width]').removeAttr('width');
                $note.find('table[height],col[height],tr[height],th[height],td[height]').removeAttr('height');

                // set background color
                $note.find('body').css('background-color', '#f5f5f5');
            }
        },

        writeDodNoteContent: function(model, view) {
            var content = model.get('dodComplexNoteContent');
            var dodContent = view ? view.$el.find('.dodContent') : $('.dodContent');

            if (dodContent.size() > 0) {
                var iframeDoc = dodContent[0].contentWindow.document;
                iframeDoc.open();
                iframeDoc.write(content);
                iframeDoc.close();
            }
        },

        scaleDodIframeToContent: function() {
            var $contentIframe = $('.dodContent');

            if ($contentIframe.size() > 0) {
                var contentHeight = $($contentIframe[0].contentWindow.document).height();
                $contentIframe.height(contentHeight);
            }
        },

        showContent: function(model) {

            var me = this;
            function doRender() {
                me.writeDodNoteContent(model);
                me.massageContent();
                me.scaleDodIframeToContent();
                ADK.Messaging.getChannel('search').trigger('documentsLoaded', $('.dodContent').contents().find('body'));
            }

            var $iframe = $('iframe.dodContent');
            if ($iframe.size() === 0) {
                // The iframe hasn't been added to the dom yet; this occurs when it's being displayed in a modal.
                // We can't write html into the iframe's document because it doesn't exist yet
                // We need to wait until the iframe is added to the dom.

                // Use MutationObserver to listen for dom changes to the modal region (note: will not work in IE < 11)
                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {

                        for (var i = 0; i < mutation.addedNodes.length; i++) {

                            $iframe = $(mutation.addedNodes[i]).find('iframe.dodContent');
                            if ($iframe.size() > 0) {

                                // remove MutationObserver
                                observer.disconnect();

                                // the iframe has been added, so now we can write the DoD content into it
                                doRender();
                            }
                        }
                    });
                });
                observer.observe($('#modal-region')[0], {
                    childList: true,
                    attributes: false,
                    characterData: true,
                    subtree: true
                });
            } else {
                doRender();
            }
        }
    };

    return dodComplexNoteUtil;
});
