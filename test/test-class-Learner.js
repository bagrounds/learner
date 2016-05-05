/**
 * Tests for helper-module
 */
;(function () {
    /* global describe, it */
    "use strict";

    /***************************************************************************
     * Imports
     */
    var expect = require('chai').expect;

    var helperModule = require('../lib/helper-module');

    /***************************************************************************
     * Tests
     */
    describe('helper-module', function () {

        describe('add', function () {

            it('should add numbers', function () {

                var result = helperModule.add([1, 2, 3]);

                var expectedResult = 6;

                expect(result).to.equal(expectedResult);
            });

            it('should add strings', function () {

                var result = helperModule.add(['a', 'b', 'c']);

                var expectedResult = 'abc';

                expect(result).to.equal(expectedResult);
            });
        });
    });
})();
