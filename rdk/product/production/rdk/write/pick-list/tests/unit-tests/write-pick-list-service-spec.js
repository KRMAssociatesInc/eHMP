'use strict';
//var _ = require('underscore');
var pickListService = require('../../write-pick-list-service');
describe('pick list service', function() {
        beforeEach(function() {
    });

    it('verify simple get', function() {
        runs(function () {
            pickListService.dbFunctions.initiateDB();
            pickListService.dbFunctions.getList('9E7A','allergy',function(err,result){
                expect(JSON.stringify(result).toEqual('["test1,test2"]'));
            });
        });
    });

    it('verify simple delete', function() {
        runs(function () {
            pickListService.dbFunctions.initiateDB();
            pickListService.dbFunctions.deleteList('9E7A','allergy',function(err,result){
                expect(result.toBe(1));
            });
        });
    });

    it('verify simple update', function() {
        runs(function () {
            pickListService.dbFunctions.initiateDB();
            pickListService.dbFunctions.updateList('9E7A','allergy',['testAllergy'],function(err,result){
                expect(result.toBe(1));
            });
        });
    });

    it('verify simple insert', function() {
        runs(function () {
            pickListService.dbFunctions.initiateDB();
            pickListService.dbFunctions.insertList('9E7A','allergy',['testAllergy'],function(err,result){
                expect(JSON.stringify(result.data).toEqual('["testAllergy"]'));
            });
        });
    });


});
