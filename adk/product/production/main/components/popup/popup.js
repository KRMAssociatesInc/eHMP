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

                    //handle alignment alignment
                    var vPlacement = this.options.valign,
                        hPlacement = this.options.halign,
                        vTop = (vPlacement == 'bottom' ? pos.top + pos.height - actualHeight :
                            vPlacement == 'center' ? pos.top + pos.height / 2 - actualHeight / 2 :
                            vPlacement == 'top' ? pos.top :
                            null),
                        hLeft = (hPlacement == 'left' ? pos.left :
                            hPlacement == 'center' ? pos.left + pos.width / 2 - actualWidth / 2 :
                            hPlacement == 'right' ? pos.left + pos.width - actualWidth :
                            null),
                        finalPlacement = (placement == 'bottom' ? {
                                top: vTop ? vTop : pos.top + pos.height,
                                left: hLeft ? hLeft : pos.left + pos.width / 2 - actualWidth / 2
                            } :
                            placement == 'top' ? {
                                top: vTop ? vTop : pos.top - actualHeight,
                                left: hLeft ? hLeft : pos.left + pos.width / 2 - actualWidth / 2
                            } :
                            placement == 'left' ? {
                                top: vTop ? vTop : pos.top + pos.height / 2 - actualHeight / 2,
                                left: hLeft ? hLeft : pos.left - actualWidth
                            } : {
                                top: vTop ? vTop : pos.top + pos.height / 2 - actualHeight / 2,
                                left: hLeft ? hLeft : pos.left + pos.width
                            });

                    //handle offset
                    return {
                        top: finalPlacement.top + (parseFloat(this.options.yoffset) | 0),
                        left: finalPlacement.left + (parseFloat(this.options.xoffset) | 0)
                    };
                };

            _.each(this, function(el) {
                popup = $(el).data('bs.popover');
                if (popoptions instanceof Object) {
                    opts = popup ? _.clone(popup.options) : _.clone(options);
                    _.extend(opts, popoptions);
                    $(el).popover(opts).data('bs.popover').getCalculatedOffset = getCalculatedOffset;
                } else {
                    $(el).popover(popoptions).data('bs.popover').getCalculatedOffset = getCalculatedOffset;
                }

                //set events
                $(el).on('shown.bs.popover', function(e) {
                    var dialog = $(this).parent().find('div.popover.in');
                    dialog.focus();
                    dialog.one('keydown', function(e) {
                        var k = e.which || e.keydode;
                        if (!/27/.test(k)) return;
                        $(el).focus();
                        $(el).popover('hide');
                        e.preventDefault();
                        e.stopPropagation();
                    });
                });

            });
        };
    });