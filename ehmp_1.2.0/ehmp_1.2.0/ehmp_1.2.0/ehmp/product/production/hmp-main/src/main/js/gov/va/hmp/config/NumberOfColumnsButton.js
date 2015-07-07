Ext.define('gov.va.hmp.config.NumberOfColumnsButton', {
    extend:'Ext.button.Button',
    alias: 'widget.numcolumnsbutton',
    ui: 'pill',
    scale: 'large',
    enableToggle: true,
    toggleGroup: 'layout-picker',
    height: 96,
    cls: 'layout-picker-cols-btn',
    config: {
        /**
         * @cfg {Integer} num
         */
        num: 2
    },
    // private
//    tpl: '<em id="{id}-btnWrap"><button type="button" class="btn" style="width: 120px;height: 80px; padding: 10px 0px; margin: 2px 8px" hidefocus="true">' +
//        '<div class="layout-picker-cols"><tpl for="columns"><span class="layout-picker-col"></span></tpl></div>' +
//        '<div class="layout-picker-cols-label">{num} Columns</div>' +
//        '</button></em>',
    renderTpl: [
        '<div id="{id}-btnWrap" class="{baseCls}-wrap',
            '<tpl if="splitCls"> {splitCls}</tpl>',
            '{childElCls}">',
            '<a id="{id}-btnEl" class="{baseCls}-button" role="button" hidefocus="on"',

            // If developer specified their own tabIndex...
                '<tpl if="tabIndex != null>',
                ' tabIndex="{tabIndex}"',
                '</tpl>',
                '>',
                '<span id="{id}-btnInnerEl" class="{baseCls}-inner {innerCls}',
                '{childElCls}">',
                    '<div class="layout-picker-cols"><tpl for="columns"><span class="layout-picker-col"></span></tpl></div>',
                    '<div class="layout-picker-cols-label">{text}</div>',
                '</span>',
                '<span id="{id}-btnIconEl" class="{baseCls}-icon-el {iconCls}',
                '{childElCls}">',
                '</span>',
            '</a>',
        '</div>',
        // if "closable" (tab) add a close element icon
        '<tpl if="closable">',
        // the href attribute is required for the :hover selector to work in IE6/7/quirks
        '<a id="{id}-closeEl" class="{baseCls}-close-btn" title="{closeText}" href="#"></a>',
        '</tpl>'
    ],
    initComponent:function() {
        this.text = this.getNum() + " Columns"; // TODO: move this into applyNum()

        this.callParent(arguments);
    },
    getTemplateArgs: function() {
        var me = this;
        var numcols = [];
        for (var i = 1; i <= me.getNum(); i++) {
            numcols.push(i);
        }

        var data = me.callParent(arguments);
        data = Ext.applyIf(data, {
            num: me.getNum(),
            columns: numcols
        });
        return data;
    }
});