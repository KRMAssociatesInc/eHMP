define('main/components/popup/popup', [
        'backbone',
        'marionette',
        'jquery',
        'underscore'
    ],
    function(Backbone, Marionette, $, _) {

        var options = {
            //be sure to keep the role and classes in place if a different template is needed
            'template': '<div class="popover" role="tooltip"><div class="popover-title"></div><div class="popover-content"></div></div>',
            'html': true,
            'title': '', //This should be set by rendering a view and passing in this.$el or someView.$el
            'content': '', //Same as above....
            /*
            'placement': 'right',
            //The two following options should likely not be used together as interesting behavior could occur
            //'valign': 'top', //top | center (default) | bottom -- should only be used when placement is left or right
            //'halign': '', //left | center (default) | right -- should only be used when placement is top or bottom
            //use negative margins when on the other side the element
            'margin-left': '0px',
            'margin-top': '0px',
            //use offsets when a shift is needed but popover is not referenced in a such a way that margin will cause a shift
            'xoffset': '0px',
            'yoffset': '0px',
            //jQuery reference to element which will be used for placment
            'referenceEl': null
            */
        };

        $.prototype.popup = function(popoptions) {

            if (!this.size()) {
                return;
            }

            var popup,
                opts,
                getCalculatedOffset = function(placement, pos, actualWidth, actualHeight) {
                    //override the CSS
                    var mleft = this.$tip.css('margin-left'),
                        mtop = this.$tip.css('margin-top');
                    this.$tip.css('margin-left', this.options['margin-left'] ? this.options['margin-left'] : mleft).css('margin-top', this.options['margin-top'] ? this.options['margin-top'] : mtop);

                    if(typeof this.options.autoHandler === 'function') {
                        placement = this.options.autoHandler.call(this, arguments) || placement;
                    }

                    //handle alignment alignment
                    var vPlacement = this.options.valign,
                        hPlacement = this.options.halign,
                        referenceELBounds = (this.options.referenceEl && this.options.referenceEl[0]) ? this.options.referenceEl[0].getBoundingClientRect() : false,
                        nPos = (referenceELBounds) ? _.extend({}, pos, referenceELBounds, {
                            bottom: referenceELBounds.top + referenceELBounds.height,
                            right: referenceELBounds.left + referenceELBounds.width,
                            height: referenceELBounds.height,
                            width: referenceELBounds.width
                        }) : pos,
                        vTop = (vPlacement == 'bottom' ? nPos.top + nPos.height - actualHeight :
                            vPlacement == 'center' ? nPos.top + nPos.height / 2 - actualHeight / 2 :
                            vPlacement == 'top' ? nPos.top :
                            null),
                        hLeft = (hPlacement == 'left' ? nPos.left :
                            hPlacement == 'center' ? nPos.left + nPos.width / 2 - actualWidth / 2 :
                            hPlacement == 'right' ? nPos.left + nPos.width - actualWidth :
                            null),
                        finalPlacement = (placement == 'bottom' ? {
                                top: vTop ? vTop : nPos.top + nPos.height,
                                left: hLeft ? hLeft : nPos.left + nPos.width / 2 - actualWidth / 2
                            } :
                            placement == 'top' ? {
                                top: vTop ? vTop : nPos.top - actualHeight,
                                left: hLeft ? hLeft : nPos.left + nPos.width / 2 - actualWidth / 2
                            } :
                            placement == 'left' ? {
                                top: vTop ? vTop : nPos.top + nPos.height / 2 - actualHeight / 2,
                                left: hLeft ? hLeft : nPos.left - actualWidth
                            } : {
                                top: vTop ? vTop : nPos.top + nPos.height / 2 - actualHeight / 2,
                                left: hLeft ? hLeft : nPos.left + nPos.width
                            });

                    //handle offset
                    return {
                        top: finalPlacement.top + (parseFloat((typeof this.options.yoffset === 'function') ? this.options.yoffset.apply(this, arguments) : this.options.yoffset) | 0),
                        left: finalPlacement.left + (parseFloat((typeof this.options.xoffset === 'function') ? this.options.xoffset.apply(this, arguments) : this.options.xoffset) | 0)
                    };
                };

            _.each(this, function(el) {
                popup = $(el).data('bs.popover');
                opts = (popoptions instanceof Object) ? _.extend({}, (popup) ? popup.options : options, popoptions) : popoptions;

                $(el).popover(opts);
                if ($(el).data('bs.popover')) {
                    $(el).data('bs.popover').getCalculatedOffset = getCalculatedOffset;
                }

                /*
                //set events
                $(el).on('shown.bs.popover', function(e) {
                    var dialog = $(this).parent().find('div.popover.in');
                    dialog.focus();
                    dialog.one('keydown', function(e) {
                        var k = e.which || e.keydode;
                        if (!/27/.test(k)) return; //esc key
                        $(el).focus();
                        $(el).popover('hide');
                        e.preventDefault();
                        e.stopPropagation();
                    });
                });*/

            });
        };
    });