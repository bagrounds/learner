/**
 * Tests for serve-function-module-template
 */
;(function () {
    /* global describe, it, before */
    "use strict";

    /***************************************************************************
     * Imports
     */
    var expect = require('chai').expect;

    var aFunction = require('../serve-function-module-template');

    /***************************************************************************
     * Tests
     */
    describe('serve-function-module-template', function () {

        var validOptions;
        var invalidOptions;

        before(function () {

            validOptions = {
                x: 'valid',
                y: 'also valid',
                z: 'this is a invalid input'
            };

            invalidOptions = {
                x: 'valid',
                y: 'also valid',
                z: ['this', 'is', 'an', 'invalid', 'input']
            };
        });

        it('should return an error for invalid inputs', function (done) {

            aFunction(invalidOptions, function (error, result) {

                expect(error).to.be.an('error');

                done();
            });

        });

        it('should not return an error for valid inputs', function (done) {

            aFunction(validOptions, function (error, result) {

                expect(error).to.be.null;

                done();
            });

        });

        it('should return the sum of its inputs', function (done) {

            var expectedResult = validOptions.x + validOptions.y +
                validOptions.z;

            aFunction(validOptions, function (error, result) {

                expect(result).to.equal(expectedResult);

                done();
            });
        });
    });
})();
