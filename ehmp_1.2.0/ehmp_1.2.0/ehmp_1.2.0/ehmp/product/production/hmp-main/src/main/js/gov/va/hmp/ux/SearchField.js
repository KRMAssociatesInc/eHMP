Ext.define('gov.va.hmp.ux.SearchField', {
    extend: 'Ext.form.field.Trigger',
    requires: [
        'gov.va.hmp.ux.ClearButton'
    ],
    alias: 'widget.searchfield',
    /**
     * @cfg {Boolean} [triggerDisabled=true]
     * True to enable 'triggerclick' event and clickable styling on trigger
     */
    triggerDisabled: true,
    cls: 'search-query',
    triggerCls: Ext.baseCSSPrefix + 'form-search-trigger',
    plugins: ['clearbutton'],
    initComponent: function () {
        this.callParent(arguments);

        this.addEvents(
        /**
         * @event triggerclick
         * Fires when trigger is clicked.
         * @param {gov.va.hmp.ux.SearchField} cmp This SearchField
         */
            'triggerclick');
    },
    getSubTplMarkup: function () {
        var me = this,
            field = Ext.form.field.Trigger.superclass.getSubTplMarkup.apply(this, arguments);

        return '<table id="' + me.id + '-triggerWrap" class="' + Ext.baseCSSPrefix + 'form-trigger-wrap" cellpadding="0" cellspacing="0"><tbody><tr>' +
            me.getTriggerMarkup() +
            '<td id="' + me.id + '-inputCell" class="' + Ext.baseCSSPrefix + 'form-trigger-input-cell">' + field + '</td>' +
            '</tr></tbody></table>';
    },
    getTriggerMarkup: function() {
        var me = this,
            i = 0,
            hideTrigger = (me.readOnly || me.hideTrigger),
            triggerCls,
            triggerBaseCls = me.triggerBaseCls,
            triggerConfigs = [],
            unselectableCls = Ext.dom.Element.unselectableCls,
            style = 'width:' + me.triggerWidth + 'px;' + (hideTrigger ? 'display:none;' : ''),
            cls = me.extraTriggerCls + ' ' + Ext.baseCSSPrefix + 'trigger-cell ' + unselectableCls;

        // TODO this trigger<n>Cls API design doesn't feel clean, especially where it butts up against the
        // single triggerCls config. Should rethink this, perhaps something more structured like a list of
        // trigger config objects that hold cls, handler, etc.
        // triggerCls is a synonym for trigger1Cls, so copy it.
        if (!me.trigger1Cls) {
            me.trigger1Cls = me.triggerCls;
        }

        // Create as many trigger elements as we have trigger<n>Cls configs, but always at least one
        for (i = 0; (triggerCls = me['trigger' + (i + 1) + 'Cls']) || i < 1; i++) {
            triggerConfigs.push({
                tag: 'td',
                role: 'presentation',
                valign: 'top',
                cls: cls + (me.triggerDisabled ? ' hmp-item-disabled' : ''),
                style: style,
                cn: {
                    cls: [Ext.baseCSSPrefix + 'trigger-index-' + i, triggerBaseCls, triggerCls].join(' '),
                    role: 'presentation'
                }
            });
        }
        triggerConfigs[0].cn.cls += ' ' + triggerBaseCls + '-first';

        return Ext.DomHelper.markup(triggerConfigs);
    },
    onTriggerClick: function () {
        if (this.triggerDisabled) return;

        this.fireEvent('triggerclick', this);
    }
});
