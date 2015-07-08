Ext.define('gov.va.hmp.ux.layout.SlidingCard', {
    extend:'Ext.layout.container.Card',
    alias:'layout.slidingcard',
    next:function () {
        this.callParent(arguments);
    },
    prev:function () {
        this.callParent(arguments);
    },
    setActiveItem:function (newCard) {
        var me = this,
            owner = me.owner,
            oldCard = me.activeItem,
            rendered = owner.rendered,
            oldIndex, newIndex, animateDirection;

        oldIndex = owner.items.indexOf(oldCard);
        newCard = me.parseActiveItem(newCard);
        newIndex = owner.items.indexOf(newCard);

        // If the card is not a child of the owner, then add it.
        // Without doing a layout!
        if (newIndex == -1) {
            newIndex = owner.items.items.length;
            Ext.suspendLayouts();
            newCard = owner.add(newCard);
            Ext.resumeLayouts();
        }

        // Is this a valid, different card?
        if (newCard && oldCard != newCard) {
            // Fire the beforeactivate and beforedeactivate events on the cards
            if (newCard.fireEvent('beforeactivate', newCard, oldCard) === false) {
                return false;
            }
            if (oldCard && oldCard.fireEvent('beforedeactivate', oldCard, newCard) === false) {
                return false;
            }

            if (rendered) {
                Ext.suspendLayouts();

                // If the card has not been rendered yet, now is the time to do so.
                if (!newCard.rendered) {
                    me.renderItem(newCard, me.getRenderTarget(), owner.items.length);
                }

                // determine animateDirection
                if (newIndex > oldIndex) {
                    animateDirection = 'left'
                } else if (newIndex < oldIndex) {
                    animateDirection = 'right'
                }

                if (oldCard) {
                    if (me.hideInactive) {
                        oldCard.hide();
                        oldCard.hiddenByLayout = true;
                    }
                    oldCard.fireEvent('deactivate', oldCard, newCard);
                }
                // Make sure the new card is shown
                if (newCard.hidden) {
                    var left = 0;
                    if (animateDirection) {
                        if (animateDirection == "left") {
                            left = Ext.getBody().getWidth();
                        }
                        else if (animateDirection == "right") {
                            left = -(Ext.getBody().getWidth());
                        }
                        newCard.getEl().setLeft(left);
                    }

                    newCard.show();
                }

                if (animateDirection) {
                    newCard.getEl().animate({
                        to:{
                            left:0
                        },
                        duration:200
                    });
                }

                // Layout needs activeItem to be correct, so set it if the show has not been vetoed
                if (!newCard.hidden) {
                    me.activeItem = newCard;
                }
                Ext.resumeLayouts(true);
            } else {
                me.activeItem = newCard;
            }

            newCard.fireEvent('activate', newCard, oldCard);

            return me.activeItem;
        }
        return false;
    }
});