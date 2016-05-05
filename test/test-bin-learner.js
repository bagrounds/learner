/**
 * Tests for bin/serve-function-module-template
 */
;(function () {
    /* global describe, it */
    "use strict";

    /***************************************************************************
     * Imports
     */
    var exec = require('child_process').exec;

    var expect = require('chai').expect;

    /***************************************************************************
     * Tests
     */
    describe('bin/learner', function () {

        it('should work with valid command line parameters', function (done) {

            var command = './bin/serve-function-module-template -x a -y b -z c';
            exec(command, function (error, stdout, stderr) {

                expect(error).to.be.null;

                expect(stderr).to.be.empty;

                expect(stdout.trim()).to.equal('abc');

                done();
            });
        });

        it('should error with invalid command line parameters', function (done) {

            var command = './bin/serve-function-module-template -x a -y b'
            exec(command, function (error, stdout, stderr) {

                expect(error).to.be.null;

                expect(stdout).to.be.empty;

                expect(stderr).to.not.be.empty;

                done();
            });
        });
    });
})();
