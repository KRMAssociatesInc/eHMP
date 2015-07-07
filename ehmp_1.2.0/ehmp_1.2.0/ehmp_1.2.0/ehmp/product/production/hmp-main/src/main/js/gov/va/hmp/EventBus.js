/**
 * EventBus for dispatching events application-wide irrespective of component and/or dom hierarchy.
 *
 * TODO: maybe merge this into AppContext or Application instance?
 */
Ext.define('gov.va.hmp.EventBus', {
    singleton: true,
    mixins:{
        observable: 'Ext.util.Observable'
    },
    constructor: function(){
        this.mixins.observable.constructor.call(this);
    }
});