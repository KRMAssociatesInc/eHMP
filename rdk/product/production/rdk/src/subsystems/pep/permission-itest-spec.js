'use strict';

var pep = require('../../interceptors/authorization/pep');

var req = {
    session: {
        user: {
            duz: {
                'blank': 'dummy'
            }
        }
    },
    _resourceConfigItem: {
        permissions: [],
        interceptors: {
            pep: {
                handlers: ['permission']
            }
        }
    },
    app: {
        config: {
            interceptors: {
                pep: {
                    disabled: false
                }
            }
        }
    },
    audit: {
        sensitive: true
    },
    logger: {
        info: function() {}
    }

};
var res = {
    status: function() {
        return this;
    },
    send: function() {
        return this;
    }
};

var wardClerk = ['ward-clerk'];

var buildRequestResponse = function(roles) {
    //build the request and response like what you would expect them to be to run through this function
    req.session.user.roles = roles;
};

describe('Verify pep permissions results: ', function() {
    beforeEach(function() {
        req = req;
        res = res;
    });

    it('Tests that permissions are a successful array', function(done) {

        this.timeout(3000);

        var next = function() {
            //verify that the user permissions are set as we would expect after the pepCallback function ran
            expect(req.session.user.permissions).to.be.an(Array);
            expect(req.session.user.permissions.length).to.be.above(0);

            done();
        };


        buildRequestResponse(wardClerk);

        //run the permissions file
        pep(req, res, next);
    });
});
