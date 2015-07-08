Ext.define('gov.va.hmp.ux.Circle', {
    extend:'Ext.Component',
    alias:'widget.circle',
    height:182,
    width:182,
//    config: {
        title:'Unknown',
        subtitle:'Unknown',
//    },
    initComponent:function () {
        var me = this;

        Ext.apply(me, {
            renderSelectors:{
                circleCenterEl:'div.circleCenter',
                innerCircleEl:'div.innerCircle',
                outerCircleEl:'div.outerCircle'
            },
            childEls: [
                'titleEl',
                'subtitleEl'
            ],
            renderTpl:me.createCircleTemplate()
        });

        me.callParent(arguments);

        me.on('afterrender', me.addCircleEvents, me);
    },
    beforeRender: function () {
        var me = this;

        me.callParent();

        // Apply the renderData to the template args
        Ext.apply(me.renderData, me.getTemplateArgs());
    },
    getTemplateArgs: function() {
        var me = this;
        return {
            title : me.title,
            subtitle: me.subtitle
        };
    },
    createCircleTemplate:function () {
        var circlePositions = [
            [164,  95],
            [155,  61],
            [128,  35],
            [ 93,  26],
            [ 58,  35],
            [ 33,  61],
            [ 24,  95],
            [ 33, 129],
            [ 58, 154],
            [ 93, 163],
            [128, 154],
            [155, 129]
        ];

        var circleIcons = '';

        for (var i=0, len=circlePositions.length; i < len; i++) {
            circleIcons += (
                '<div class="circlePerson" style="'+
                    'margin-top :'+(-circlePositions[i][0]+79)+'px;'+
                    'margin-left:'+(-circlePositions[i][1]+80)+'px;">'+

                    '<img selectable="false" src="http://circles.source-lounge.de/SenchaCon/Circles/resources/images/contacts/thumbs/user'+ (i+1) +'_50.png"/>'+
//                                        '<img selectable="false" src="/images/icons/pt-no-picture.png"/>' +
                    '</div>'
                );
        }

        return tpl = Ext.create('Ext.XTemplate',
            '<div class="circleCenter">' +
                circleIcons +
                '<div class="innerCircle"><div id="{id}-titleEl">{title}</div><div id="{id-subtitleEl}">{subtitle}</div></div>' +
                '<div class="outerCircle"></div>' +
            '</div>'
        );
    },
    addCircleEvents:function () {
        var me = this;

        Ext.create('Ext.dd.DropZone', me.innerCircleEl, {ddGroup: 'personDD'});

        me.circleCenterEl.on({
            mouseenter:function () {
                me.outerCircleEl.animate({
                    stopAnimation:false,
                    to:{
                        marginTop:'-91px',
                        marginLeft:'-91px',
                        width:'182px',
                        height:'182px'
                    }
                });

                Ext.select('#'+this.id+' .circlePerson').each(function(item) {
                    Ext.get(item.dom).setOpacity(1, {
                        duration : 600
                    });
                });
            },
            mouseleave:function () {
                me.outerCircleEl.animate({
                    stopAnimation:false,
                    to:{
                        marginTop:'-61px',
                        marginLeft:'-61px',
                        width:'122px',
                        height:'122px'
                    }
                });

                Ext.select('#'+this.id+' .circlePerson').each(function(item) {
                    Ext.get(item.dom).setOpacity(0, {
                        duration : 100
                    });
                });
            },
            scope:me
        });

        Ext.select('#'+me.id+' .circlePerson').each(function(item) {
            var circleIcon = Ext.get(item.dom);

            Ext.create('gov.va.hmp.team.PersonIconDDProxy', circleIcon, 'personDD');

            circleIcon.first().on({
                mouseenter : function(e, icon) {
                    icon.parentNode.style.zIndex = 100;
                    Ext.get(icon).animate({
                        stopAnimation : true,
                        to : {
                            marginTop  : -10,
                            marginLeft : -10,
                            width      : 50,
                            height     : 50,
                            opacity    : 1
                        }
                    });
                },
                mouseleave : function(e, icon) {
                    icon.parentNode.style.zIndex = 10;
                    Ext.get(icon).animate({
                        stopAnimation : true,
                        to : {
                            marginTop  : 0,
                            marginLeft : 0,
                            width      : 30,
                            height     : 30,
                            opacity    : 1
                        }
                    });
                }
            });
        });
    },
    setTitle:function(title){
        var me = this,
            oldTitle = me.title || '';

        if (title != oldTitle) {
            me.title = title;
            if (me.rendered) {
                me.titleEl.update(title || '&#160;');
                me.updateLayout();
            }
        }

        return me;
    },
    setSubtitle:function(subtitle){
        var me = this,
            oldTitle = me.subtitle || '';

        if (subtitle != oldTitle) {
            me.subtitle = subtitle;
            if (me.rendered) {
                me.subtitleEl.update(subtitle || '&#160;');
                me.updateLayout();
            }
        }

        return me;
    }
});