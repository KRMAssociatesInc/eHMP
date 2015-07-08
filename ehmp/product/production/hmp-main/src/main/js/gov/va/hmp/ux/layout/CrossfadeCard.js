Ext.define('gov.va.hmp.ux.layout.CrossfadeCard', {
    extend: 'Ext.layout.container.Card',
    alias: 'layout.crossfadecard',
    setActiveItem: function(newCard) {
        var me = this,
            owner = me.owner,
            oldCard = me.activeItem,
            rendered = owner.rendered,
            newIndex;


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


                if (oldCard) {
                    if (me.hideInactive) {
                        // oldCard.hide();
                        me.hideOldCard(oldCard);
                        oldCard.hiddenByLayout = true;
                    }
                    oldCard.fireEvent('deactivate', oldCard, newCard);
                }
                // Make sure the new card is shown
                if (newCard.hidden) {
                    newCard.show();
                    me.showNewCard(newCard);
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
    },
    // @private
    hideOldCard: function (card) {
        card.getEl().stopAnimation();
        card.getEl().animate({
            duration: 500,
            from: { opacity: 1 },
            to: { opacity: 0 },
            listeners: {
                afteranimate: function() {
                    card.hide();
                    card.getEl().setDisplayed('none');
                }
            }
        });
    },
    // @private
    showNewCard: function (card) {
        card.getEl().setStyle({
            position: 'absolute',
            opacity: 0,
            top: 0
        });
        card.getEl().animate({
            duration: 500,
            from: { opacity: 0 },
            to: { opacity: 1 },
            listeners: {
                afteranimate: function() {
                    card.getEl().setStyle({ position: '' });
                }
            }
        });
    }
});