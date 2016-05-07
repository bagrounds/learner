/**
 * Tests for learner
 */
;(function () {
    /* global describe, it, before */
    "use strict";

    /***************************************************************************
     * Imports
     */
    var expect = require('chai').expect;
    var learner = require('../learner');
    var typeCheck = require('type-check').typeCheck;

    /***************************************************************************
     * Tests
     */
    describe('learner', function () {

        it('should be a function', function(){
            var isFunction = typeCheck('Function',learner);

            expect(isFunction).to.be.true;
        });

        describe('options.action = "register"', function(){

            it('should return a key', function(done){

                var learnerOptions = {
                    action: 'register'
                };

                learner(learnerOptions,function(error,id){

                    var isString = typeCheck('String',id);

                    expect(isString).to.be.true;
                    done();
                });

            });
        });

        describe('options.action = "observe"', function(){

            it('should be a valid action', function(){

            });
        });

        describe('options.action = "predict"', function(){

            it('should be a valid action', function(){

            });
        });
    });
})();
