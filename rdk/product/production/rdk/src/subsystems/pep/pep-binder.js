module.exports = {
    policy: {
        handler: require('./policy'),
        rules: require('../pdp/policy').rules
    },
    permission: {
        handler: require('./permission'),
        rules: require('../pdp/permission').rules
    },
};
