define([
    "backbone",
    "marionette",
    "underscore",
    "api/SessionStorage"

], function(Backbone, Marionette, _, SessionStorage) {
    'use strict';
    var DemographicGroup = Backbone.Model.extend({});

    var util = {
        getSiteDiffs: function(inModel) {
            var domainModel = SessionStorage.get.sessionModel('patient-domain');
            var domainData = domainModel.get('data');
            var siteNames = domainModel.get('sites');
            var currentFacility = this.getFacilityName(inModel, siteNames);
            var vistaSitesDemographics = this.getVistaData(domainData, siteNames, currentFacility);
            var d;
            var diffs = new Backbone.Model();
            var c = new Backbone.Collection(vistaSitesDemographics);
            d = this.getGroupOneModel(inModel, c);
            diffs.set('groupOne', d);
            d = this.getGroupTwoModel(inModel, c);
            diffs.set('groupTwo', d);
            d = this.getGroupThreeModel(inModel, c);
            diffs.set('groupThree', d);
            d = this.getGroupFourModel(inModel, c);
            diffs.set('groupFour', d);
            d = this.getGroupFiveModel(inModel, c);
            diffs.set('groupFive', d);
            return diffs;
        },

        getVistaData: function(domainData, siteNameInfo, currentFacility) {
            var that = this;
            var collection = new Backbone.Collection(domainData);
            var filtered = collection.filter(function(item) {
                var s = that.getFacilityName(item, siteNameInfo);
                item.set('facilityName', s);
                return s && s !== currentFacility;
            });
            return filtered;
        },

        getFacilityName: function(item, siteNameInfo) {
            var pidSite = item.get('pid').split(';')[0];
            var match = siteNameInfo.filter(function(a) {
                return a.siteCode === pidSite;
            });
            if (match.length) {
                return match[0].name;
            } else {
                return '';
            }
        },

        getGroupOneModel: function(inModel, collection) {
            var inObj = this.getGroupOneObj(inModel);
            var that = this;
            var exObj;
            var exs = [];
            _.each(collection.models, function(item) {
                exObj = that.getGroupOneObj(item);
                exObj.facilityName = item.get('facilityName');
                exs.push(exObj);
            });
            var ret = this.updateDiffs(inObj, exs);
            return new DemographicGroup(ret);
        },

        getGroupOneObj: function(model) {
            var hp = {
                phone: {
                    value: this.getPhone(model, 'H'),
                    diff: false
                }
            };
            var wp = {
                phone: {
                    value: this.getPhone(model, 'WP'),
                    diff: false
                }
            };
            var cp = {
                phone: {
                    value: this.getPhone(model, 'MC'),
                    diff: false
                }
            };
            var ret = {
                hPhone: hp,
                wPhone: wp,
                cPhone: cp,
                groupDiff: hp.phone.diff || cp.phone.diff || wp.phone.diff
            };
            return ret;

        },

        getGroupTwoModel: function(inModel, collection) {
            var inObj = this.getGroupTwoObject(inModel);
            var that = this;
            var exObj;
            var exs = [];
            _.each(collection.models, function(item) {
                exObj = that.getGroupTwoObject(item);
                exObj.facilityName = item.get('facilityName');
                exs.push(exObj);
            });
            var ret = this.updateDiffs(inObj, exs);
            return new DemographicGroup(ret);

        },
        getGroupTwoObject: function(inModel) {
            var haddr = this.getAddressObj(inModel, 'H');
            var taddr = this.getAddressObj(inModel, 'TMP');
            var ret = {
                hAddress: haddr,
                tAddress: taddr
            };
            return ret;
        },

        getGroupThreeModel: function(inModel, collection) {
            var inObj = this.getGroupThreeObject(inModel);
            var that = this;
            var exObj;
            var exs = [];
            _.each(collection.models, function(item) {
                exObj = that.getGroupThreeObject(item);
                exObj.facilityName = item.get('facilityName');
                exs.push(exObj);
            });
            var ret = this.updateDiffs(inObj, exs);
            return new DemographicGroup(ret);

        },

        getGroupThreeObject: function(inModel) {
            var eaddr = inModel.get('email');
            var em = {
                email: {
                    value: eaddr ? eaddr : '',
                    diff: false
                },
                diff: false
            };
            var ret = {
                email: em,
                diff: false
            };
            return ret;
        },

        getAddressObj: function(inModel, use) {
            var addr = this.getAddress(inModel, use);
            var ret = {
                line1: {
                    value: addr && addr.line1 ? addr.line1.toLowerCase() : '',
                    diff: false
                },
                line2: {
                    value: addr && addr.line2 ? addr.line2.toLowerCase() : '',
                    diff: false
                },
                line3: {
                    value: addr && addr.line3 ? addr.line3.toLowerCase() : '',
                    diff: false
                },
                line4: {
                    value: addr && addr.line4 ? addr.line4 : '',
                    diff: false
                },
                diff: false
            };
            return ret;
        },

        getGroupFourModel: function(inModel, collection) {
            var inObj = this.getContactObject(inModel, 'Emergency Contact');
            var that = this;
            var exObj;
            var exs = [];
            _.each(collection.models, function(item) {
                exObj = that.getContactObject(item, 'Emergency Contact');
                exObj.facilityName = item.get('facilityName');
                exs.push(exObj);
            });
            var ret = this.updateDiffs(inObj, exs);
            return new DemographicGroup(ret);
        },

        getGroupFiveModel: function(inModel, collection) {
            var inObj = this.getContactObject(inModel, 'Next of Kin');
            var that = this;
            var exObj;
            var exs = [];
            _.each(collection.models, function(item) {
                exObj = that.getContactObject(item, 'Next of Kin');
                exObj.facilityName = item.get('facilityName');
                exs.push(exObj);
            });
            var ret = this.updateDiffs(inObj, exs);
            return new DemographicGroup(ret);
        },

        getContactObject: function(model, typeName) {
            var contact = this.getContact(model, typeName);
            var rel = '';
            if (contact) {
                rel = contact.relationship ? contact.relationship.toLowerCase() : 'Relationship Unknown';
            }
            var fac = {
                facilityName: {
                    value: model.get('facilityName'),
                    diff: false
                }
            };
            var nr = {
                name: {
                    value: contact && contact.name ? contact.name.toLowerCase() : '',
                    diff: false
                },
                relationship: {
                    value: rel,
                    diff: false
                }
            };
            var hp = {
                phone: {
                    value: contact && contact.hPhone ? contact.hPhone : '',
                    diff: false
                }
            };
            var wp = {
                phone: {
                    value: contact && contact.wPhone ? contact.wPhone : '',
                    diff: false
                }
            };
            var ha = this.getContactAddressObj(contact, typeName);
            var ret = {
                nameRel: nr,
                hPhone: hp,
                wPhone: wp,
                address: ha,
                groupDiff: false
            };
            return ret;
        },

        getContactAddressObj: function(contact, use) {
            var addr = this.getContactAddress(contact);
            var ret = {
                line1: {
                    value: addr && addr.line1 ? addr.line1.toLowerCase() : '',
                    diff: false
                },
                line2: {
                    value: addr && addr.line2 ? addr.line2.toLowerCase() : '',
                    diff: false
                },
                line3: {
                    value: addr && addr.line3 ? addr.line3.toLowerCase() : '',
                    diff: false
                },
                line4: {
                    value: addr && addr.line4 ? addr.line4 : '',
                    diff: false
                },
                diff: false
            };
            return ret;
        },


        getAddress: function(model, use) {
            var found;
            if (model.has('address') && model.get('address').length) {
                found = model.get('address').filter(function(a) {
                    return a.use === use;
                });
            }
            if (found && found.length) {
                found[0].line4 = this.getCityStateZip(found[0]);
                return found[0];
            }
            return null;
        },

        getContact: function(model, typeName) {
            var found;
            if (model.has('contact') && model.get('contact').length) {
                found = model.get('contact').filter(function(a) {
                    return a.typeName === typeName;
                });
            }
            if (found && found.length) {
                var phone = this.getContactPhone(found[0], 'H');
                if (phone) {
                    found[0].hPhone = phone;
                }
                phone = this.getContactPhone(found[0], 'WP');
                if (phone) {
                    found[0].wPhone = phone;
                }
                phone = this.getContactPhone(found[0], 'MC');
                if (phone) {
                    found[0].cPhone = phone;
                }
                return found[0];
            }
            return null;
        },

        getContactAddress: function(contact) {
            var address = contact && contact.address ? contact.address[0] : null;
            if (address) {
                address.line4 = this.getCityStateZip(address);
            }
            return address;
        },

        getPhone: function(model, use) {
            var found;
            if (model.has('telecom') && model.get('telecom').length) {
                found = model.get('telecom').filter(function(a) {
                    return a.use === use;
                });
            }
            return found && found.length ? found[0].value : '';
        },

        getContactPhone: function(contact, use) {
            var found;
            if (contact.telecom) {
                found = contact.telecom.filter(function(a) {
                    return a.use === use;
                });
            }
            return found && found.length ? found[0].value : '';
        },

        getCityStateZip: function(address) {
            var ret = '';
            ret = address.city ? ret + address.city.toLowerCase() : ret;
            ret = address.state ? ret + ', ' + address.state : ret;
            ret = address.zip ? ret + ', ' + address.zip : ret;
            return ret;
        },
        updateDiffs: function(obj, list) {
            var item;
            var inVal;
            var exVal;
            var diffKey = 'diff';
            var groupDiffKey = 'groupDiff';
            var diffFound = false;
            var test;
            for (var obj2 in obj) {
                for (var obj3 in obj[obj2]) {
                    for (var key in obj[obj2][obj3]) {
                        if (key !== diffKey && key !== groupDiffKey) {
                            inVal = obj[obj2][obj3][key];
                            for (var i = 0; i < list.length; i++) {
                                test = list[i];
                                exVal = test[obj2][obj3][key];
                                if (exVal !== '' && exVal !== inVal) {
                                    diffFound = true;
                                    obj[obj2][obj3][diffKey] = true;
                                    test[obj2][obj3][diffKey] = true;
                                    obj[groupDiffKey] = true;
                                    obj[obj2].diff = true;
                                }
                            }
                        }
                    }
                }
            }
            if (diffFound) {
                obj.externalSitesData = new Backbone.Collection(list);
            }
            return obj;
        },
        addFacilityName: function(pid, inModel) {
            inModel.set('pid', pid);
            var siteNames = SessionStorage.get.sessionModel('patient-domain').get('sites'),
                facility = this.getFacilityName(inModel, siteNames);
            return inModel.set('facility', facility || pid.split(';')[0]);
        }
    };

    return util;
});
