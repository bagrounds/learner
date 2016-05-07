/**
 * Tests for Learner
 */
;(function () {
  /* global describe, it, beforeEach */
  "use strict";

  /***************************************************************************
   * Imports
   */

  var chai = require('chai');
  var expect = chai.expect;
  var _ = require('lodash');

  var typeCheck = require('type-check').typeCheck;

  var Learner = require('../lib/Learner');

  /***************************************************************************
   * Tests
   */
  describe('Learner', function () {

    var newLearner;
    var observationA;
    var observationB;
    var observationC;
    var observationD;
    var unlabeledObservation;

    beforeEach(function () {
      newLearner = new Learner();

      observationA = {
        classLabel: 'classA',
        measurement: {
          a: 0,
          b: 0
        }
      };

      observationB = {
        classLabel: 'classB',
        measurement: {
          a: 0,
          b: 10
        }
      };

      observationC = {
        classLabel: 'classC',
        measurement: {
          a: 10,
          b: 0
        }
      };

      observationD = {
        classLabel: 'classD',
        measurement: {
          a: 10,
          b: 10
        }
      };

      unlabeledObservation = {
        measurement: {
          a: 10,
          b: 10
        }
      };

    });

    describe('constructor', function () {

      it('should construct a new Learner object', function () {

        var isLearner = newLearner instanceof Learner;

        expect(isLearner).to.be.true;

        expect(Learner.name).to.equal('Learner');

      });

      it('should initialize with no observations', function (done) {

        expect(newLearner.observations).to.deep.equal([]);

        var learnerOptions = {
          observation: observationA
        };

        newLearner.observe(learnerOptions,function(error,prediction){

          newLearner = new Learner();

          expect(newLearner.observations).to.deep.equal([]);

          done();
        });
      });
    });

    describe('observe', function () {

      it('should have an observe method', function(){

        expect(newLearner).to.respondTo('observe');
      });

      it('should make observations with classLabels', function (done) {

        var expectedObservation = observationA;

        var learnerOptions = {
          observation: expectedObservation
        };

        newLearner.observe(learnerOptions, function (error, prediction) {

          expect(error).to.not.be.ok;

          // get last observation
          var actualObservation = newLearner.observations.slice(-1)[0];

          expect(actualObservation).to.deep.equal(expectedObservation);

          done();
        });
      });

      it('should make observations without classLabels', function (done) {

        var expectedObservation = observationA;

        var learnerOptions = {
          observation: expectedObservation
        };

        newLearner.observe(learnerOptions, function (error, prediction) {

          expect(error).to.not.be.ok;

          // get last observation
          var actualObservation = newLearner.observations.slice(-1)[0];

          expect(actualObservation).to.deep.equal(expectedObservation);

          done();
        });
      });
    });

    describe('predict', function(){

      it('should have a predict method', function(){

        expect(newLearner).to.respondTo('predict');
      });

      it('should return prediction scores in an object', function(done){

        var learnerOptions = {
          observation: unlabeledObservation
        };

        newLearner.predict(learnerOptions,function(error,prediction){

          expect(error).to.not.be.ok;

          var isAnObject = typeCheck('Object',prediction);

          expect(isAnObject).to.be.true;

          done();
        });
      });

      it('should return numerical prediction scores', function(done){

        var numericalDescription = '[Number]';

        var learnerOptions = {observation: unlabeledObservation};

        newLearner.predict(learnerOptions,function(error,prediction){

          expect(error).to.not.be.ok;

          var scores = _.values(prediction);
          var isNumerical = typeCheck(numericalDescription, scores);

          expect(isNumerical).to.be.true;

          var learnerOptions = {observation: observationA};
          newLearner.observe(learnerOptions, function(error, prediction){

            var scores = _.values(prediction);
            var isNumerical = typeCheck(numericalDescription, scores);

            expect(isNumerical).to.be.true;

            var learnerOptions = {observation: observationB};
            newLearner.observe(learnerOptions, function(error, prediction){

              var scores = _.values(prediction);
              var isNumerical = typeCheck(numericalDescription, scores);

              expect(isNumerical).to.be.true;

              done();
            });
          });
        });
      });

      it('should return scores for each observed class + 1 (for unknown)', function(done){

        var learnerOptions = {observation: unlabeledObservation};

        newLearner.predict(learnerOptions,function(error,prediction){

          expect(error).to.not.be.ok;

          var scores = _.values(prediction);

          expect(scores).to.have.length(1);

          var learnerOptions = {observation: observationA};
          newLearner.observe(learnerOptions, function(error, prediction){

            var scores = _.values(prediction);

            expect(scores).to.have.length(2);

            var learnerOptions = {observation: observationB};
            newLearner.observe(learnerOptions, function(error, prediction){

              var scores = _.values(prediction);

              expect(scores).to.have.length(3);

              done();
            });
          });
        });
      });

      it('should not remember data from prediction requests', function(done){

        var learnerOptions = {
          observation: observationA
        };

        newLearner.predict(learnerOptions,function(error,prediction){

          expect(error).to.not.be.ok;

          expect(newLearner.observations).to.deep.equal([]);

          done();
        });
      });
    });
  });
})();
