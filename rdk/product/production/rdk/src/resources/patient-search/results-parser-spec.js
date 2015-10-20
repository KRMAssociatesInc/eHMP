'use strict';

var search = require('./results-parser');
//merge
//retrieveObjFromTree
//transformPatient

describe('Search Util', function() {
    describe('Traverse Tree', function(){
        it('get top level item', function(){
            var obj1 = {
                a: {d: 1},
                b: 'stuff',
                c: false
            };
            expect(search.retrieveObjFromTree(obj1, ['a'])).to.eql({d:1});
        });
        it('get object nested item', function(){
            var obj1 = {
                a: { b: {c: {d: {e: 1}}}}
            };
            expect(search.retrieveObjFromTree(obj1, ['a','b','c','d'])).to.eql({e:1});
        });
        it('get array nested item', function(){
            var obj1 = {
                a: [ 'b', ['c','d', ['e', 'f',{g:1}]]]
            };
            expect(search.retrieveObjFromTree(obj1, ['a',1,2,2])).to.eql({g:1});
        });
        it('get item by fuzzy matching - starting', function(){
            var obj1 = {
                a: { b: {hi2u: {d: {e: 1}}}}
            };
            expect(search.retrieveObjFromTree(obj1, ['a','b','hi','d'])).to.eql({e:1});
        });
        it('get item by fuzzy matching - ending', function(){
            var obj1 = {
                a: { b: {hi2u: {d: {e: 1}}}}
            };
            expect(search.retrieveObjFromTree(obj1, ['a','b','2u','d'])).to.eql({e:1});
        });
        it('get item by fuzzy matching - middle', function(){
            var obj1 = {
                a: { b: {hi2u: {d: {e: 1}}}}
            };
            expect(search.retrieveObjFromTree(obj1, ['a','b','i2','d'])).to.eql({e:1});
        });
        it('get item by fuzzy matching - multiple matches', function(){
            var obj1 = {
                a: { b: {hi2u: {d: {e: 1}}, hi2:{d:{e:3}}}}
            };
            expect(search.retrieveObjFromTree(obj1, ['a','b','i2','d'])).to.eql({e:1});
        });
        it('search for key that doesn\'t exist', function(){
            var obj1 = {
                a: { b: {hi2u: {d: {e: 1}}, hi2:{d:{e:3}}}}
            };
            expect(search.retrieveObjFromTree(obj1, ['b','i2','d'])).to.eql(obj1);
        });
    });
    describe('merge', function() {
        it('All fields of simple object merged', function() {
            var obj1 = {
                a: 1,
                b: 'stuff',
                c: false
            };
            var obj2 = {
                d: true,
                e: 'dingus',
                f: 2
            };
            expect(search.merge(obj1, obj2)).to.eql({a:1,b:'stuff',c:false,d:true,e:'dingus',f:2});
        });
        it('Recursive merge of fields', function() {
            var obj1 = {
                a: {
                    b: ['stuff', false, 1, true],
                    c: null
                }
            };
            var obj2 = {
                d: {
                    e: {
                        f: 2
                    }
                }
            };
            expect(search.merge(obj1, obj2)).to.eql({a: {b: ['stuff', false, 1, true],c: null},d: {e: {f: 2}}});
        });
        it('Copy instead of reference', function() {
            var obj1 = {
                a: {
                    b: ['stuff', false, 1, true],
                    c: null
                }
            };
            var obj2 = {
                d: {
                    e: {
                        f: 2
                    }
                }
            };
            // var obj3 = search.merge(obj1, obj2);
            expect(obj1).to.eql({a:{b:['stuff',false,1,true],c:null}});
            expect(obj2).to.eql({d:{e:{f:2}}});
            // obj2.d.e = {g:3};
            // obj1.a.b[2] = 3.14;
            // obj1.a.b.push('hi');
            // obj1.z = function(){};
            // expect(obj3).to.eql({a: {b: ['stuff', false, 1, true],c: null},d: {e: {f: 2}}});
        });
        it('Key collision', function() {
            var obj1 = {
                a: 1,
                b: 'stuff',
                c: false
            };
            var obj2 = {
                a: true,
                b: 'dingus',
                c: 2
            };
            expect(search.merge(obj1, obj2)).to.eql({
                a: true,
                b: 'dingus',
                c: 2});
        });
    });
    describe('transformPatient', function() {
        it('empty object', function() {
            expect(search.transformPatient({})).to.eql({});
        });
        describe('name transformations', function(){
            it('full name to given/family name', function(){
                var patient = {fullName: 'SMITH,JOHN'};
                expect(search.transformPatient(patient)).to.eql({fullName:'SMITH,JOHN',givenNames:'JOHN',familyName:'SMITH', displayName:'SMITH,JOHN'});
            });
            it('given/family name to full name', function(){
                var patient = {givenNames:'JOHN',familyName:'SMITH'};
                expect(search.transformPatient(patient)).to.eql({fullName:'SMITH,JOHN',givenNames:'JOHN',familyName:'SMITH', displayName:'SMITH,JOHN'});
            });
            it('multiple given names to full name', function(){
                var patient = {givenNames:['BILLY','BOB'],familyName:'SMITH'};
                expect(search.transformPatient(patient)).to.eql({fullName:'SMITH,BILLY BOB',givenNames:'BILLY BOB',familyName:'SMITH', displayName:'SMITH,BILLY BOB'});
            });
        });
        describe('dob transformations', function(){
            it('age calculation', function(){
                var year = new Date().getFullYear();
                var age = 56;
                var birthYear = year - age;
                var patient = {birthDate: (birthYear +''+ '0101')};
                expect(search.transformPatient(patient)).to.eql({birthDate: patient.birthDate, age: age});
            });
        });
        describe('ssn transformations', function(){
            it('Last 4 SSN', function(){
                var patient = {ssn: '123456789'};
                expect(search.transformPatient(patient)).to.eql({ssn: patient.ssn, ssn4: '6789'});
            });
        });
        describe('gender transformations', function(){
            it('Unknown Type', function(){
                var patient = {genderCode: 'Z'};
                expect(search.transformPatient(patient)).to.eql({genderCode: 'Z', genderName: 'Unknown'});
            });
            it('Male', function(){
                var patient = {genderCode: 'M'};
                expect(search.transformPatient(patient)).to.eql({genderCode: 'M', genderName: 'Male'});
            });
            it('Female', function(){
                var patient = {genderCode: 'F'};
                expect(search.transformPatient(patient)).to.eql({genderCode: 'F', genderName: 'Female'});
            });
            it('Undifferentiated', function(){
                var patient = {genderCode: 'UN'};
                expect(search.transformPatient(patient)).to.eql({genderCode: 'UN', genderName: 'Undifferentiated'});
            });
            it('Long Gender Code', function(){
                var patient = {genderCode: 'urn:gender:code:Z'};
                expect(search.transformPatient(patient)).to.eql({genderCode: 'Z', genderName: 'Unknown'});
            });
        });
        describe('id transformations', function(){
            var ssnId = '666000608^PI^200SSA^USSSA^A';
            var icn = '5000000116V912836^NI^200M^USVHA^P';
            var dfnPid1 = '100615^PI^C877^USVHA';
            var id1 = '0005000000116V912836^PI^200ESR^USVHA^H';
            var edipi = '4325678^NI^200DOD^USDOD^P';
            it('SSN ID', function(){
                var patient = {id: ssnId};
                expect(search.transformPatient(patient)).to.eql({idClass: 'SSN',facility: '200SSA', dataSource: 'USSSA', pid: '666000608', idType: 'PI', id: patient.id});
            });
            it('ICN ID', function(){
                var patient = {id: icn};
                expect(search.transformPatient(patient)).to.eql({idClass: 'ICN',facility: '200M', dataSource: 'USVHA', pid: '5000000116V912836', idType: 'NI', id: patient.id});
            });
            it('DFN ID', function(){
                var patient = {id: dfnPid1};
                expect(search.transformPatient(patient)).to.eql({idClass: 'DFN',facility: 'C877', dataSource: 'USVHA', pid: 'C877;100615', idType: 'PI', id: patient.id});
            });
            it('Other ID', function(){
                var patient = {id: id1};
                expect(search.transformPatient(patient)).to.eql({idClass: 'Unknown',facility: '200ESR', dataSource: 'USVHA', pid: '0005000000116V912836', idType: 'PI', id: patient.id});
            });
            it('EDIPI ID', function(){
                var patient = {id: edipi};
                expect(search.transformPatient(patient)).to.eql({idClass: 'EDIPI',facility: '200DOD', dataSource: 'USDOD', pid: '4325678', idType: 'NI', id: patient.id});
            });
            it('Bad ID', function(){
                var patient = {id: '39sld9320d82'};
                expect(search.transformPatient(patient)).to.eql({pid: patient.id, id: patient.id, idClass: 'Unknown'});
            });
        });
        describe('address transformations', function() {
            it('One Address', function() {
                var patient = {address: [{use: 'PHYS'}]};
                expect(search.transformPatient(patient)).to.eql({address: [{use: 'H'}]});
            });
            it('Three Addresses', function() {
                var patient = {address: [{use: 'WORK'},{use: 'PHYS'},{use: 'OTHER'}]};
                expect(search.transformPatient(patient)).to.eql({address: [{use: 'WORK'},{use: 'H'},{use: 'OTHER'}]});
            });
            it('No PHYS Address', function() {
                var patient = {address: [{use: 'WORK'},{use: 'DISTANT'},{use: 'OTHER'}]};
                expect(search.transformPatient(patient)).to.eql({address: [{use: 'WORK'},{use: 'DISTANT'},{use: 'OTHER'}]});
            });
        });
        describe('telecom transformations', function() {
            it('One telecom', function() {
                var patient = {telecom: [{use: 'HP'}]};
                expect(search.transformPatient(patient)).to.eql({telecom: [{use: 'H'}]});
            });
            it('Three Telecoms', function() {
                var patient = {telecom: [{use: 'WP'},{use: 'HP'},{use: 'FAX'}]};
                expect(search.transformPatient(patient)).to.eql({telecom: [{use: 'WP'},{use: 'H'},{use: 'FAX'}]});
            });
            it('No HP Telecom', function() {
                var patient = {telecom: [{use: 'WP'},{use: 'CELL'},{use: 'OTHER'}]};
                expect(search.transformPatient(patient)).to.eql({telecom: [{use: 'WP'},{use: 'CELL'},{use: 'OTHER'}]});
            });
        });
    });
});
