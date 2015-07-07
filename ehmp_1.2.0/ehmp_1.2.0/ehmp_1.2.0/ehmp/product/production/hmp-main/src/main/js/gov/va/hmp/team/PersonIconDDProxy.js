Ext.define('gov.va.hmp.team.PersonIconDDProxy', {
    extend : 'Ext.dd.DDProxy',
    alias  : 'widget.personiconddproxy',

    startDrag: function(x, y) {
        var dragEl = Ext.get(this.getDragEl()),
            el     = Ext.get(this.getEl());

        dragEl.setOpacity(0.8);
        el    .setOpacity(0.4);

        dragEl.applyStyles({
            border : '',
            zIndex : 200000
        });
        dragEl.dom.className = 'circlePerson';
        dragEl.update(el.dom.innerHTML);
        dragEl.first().dom.id = 'circleIconDragId';
    },

    onDragOver: function(e, targetId) {
        var target = Ext.get(targetId);

        if (!target.hasCls('innerCircle')) {
            return;
        }

        this.lastTarget = target;

        target.addCls('circleDragOver');
    },

    onDragOut: function(e, targetId) {
        var target = Ext.get(targetId);

        if (!target.hasCls('innerCircle')) {
            return;
        }

        this.lastTarget = null;

        target.removeCls('circleDragOver');
    },

    endDrag: function() {
        var dragEl = Ext.get(this.getDragEl()),
            el     = Ext.get(this.getEl());

        dragEl.setVisible(true);
        dragEl.setXY(dragEl.getXY());

        dragEl.setVisible(true);

        var lastTarget = this.lastTarget;

        if(lastTarget) {
            dragEl.animate({
                duration : 300,
                to : {
                    x : lastTarget.getX() + 35,
                    y : lastTarget.getY() + 35
                },
                callback : function() {
                    dragEl.first().animate({
                        duration : 300,
                        to : {
                            x : lastTarget.getX(),
                            y : lastTarget.getY(),
                            width  : 100,
                            height : 100
                        },
                        callback : function() {
                            dragEl.fadeOut({
                                duration : 900,
                                easing   : 'easeIn',
                                callback: function(){
                                    dragEl.setVisible(false);
                                }
                            });
                        }
                    });

                    el.animate({
                        duration : 500,
                        to: {
                            opacity : 0
                        }
                    });

                    lastTarget.removeCls('circleDragOver');
                }
            });
        } else {
            dragEl.first().puff({
                duration : 600,
                easing   : 'easeOut'
            });
        }
        this.lastTarget = null;
    }

});