define([
    'backbone',
    'backbone.radio'
], function(Backbone) {
    'use strict';

    var Messaging = Backbone.Radio.channel('global');

    Messaging.getChannel = function(channelName) {
        return Backbone.Radio.channel(channelName);
    };

    return Messaging;
});
