/**
 * Define the Learner class
 */
;(function () {
  'use strict';

  /***************************************************************************
   * Imports
   */
  var typeCheck = require('type-check').typeCheck;
  var math = require('mathjs');
  var Observation = require('./Observation');

  module.exports = Learner;

  /***************************************************************************
   * Define functions
   */

  var privateMembers;

  /**
   * Constructs a Learner
   *
   * @class Learner
   * @classdesc Learns stuff
   *
   * @param {Object} options
   * @returns {Learner}
   */
  function Learner(options) {

    this.data = options.data;

    var observations = [];

    privateMembers = {
      getObservations: function() {
        return observations;
      },
      setObservations: function(newObservations) {
        observations = newObservations;
      }
    }

  }

  // set prototype and constructor
  Learner.prototype = Object.create(Learner.prototype);
  Learner.prototype.constructor = Learner;

  Learner.prototype.observe = observe;
  Learner.prototype.predict = predict;

  /**
   *
   * @method Learner#observe
   * @param {Object} options
   * @param {Observation} options.observation
   * @param {callback} callback
   */
  function observe(options, callback) {

    var observation = options.observation;

    var observations = privateMembers.getObservations();

    observations.push(observation);

    privateMembers.setObservations(observations);

    callback(null, predict(observation));
  }

  /**
   * @method Learner#predict
   * @param options
   * @param callback
   */
  function predict(options, callback) {

    var observation = options.observation;

    var observations = privateMembers.getObservations();

    var winningClass;

    observations.reduce(function(minDistance,anObservation){

      var distance = math.distance(observation.measurement,anObservation.measurement);

      if( distance < minDistance ){
        winningClass = anObservation.classLabel;
        minDistance = distance;
      }

      return minDistance;
    },Number.MAX_VALUE);

    callback(null, winningClass);
  }

  /**
   *
   * @param {Array<Observation>} observations
   * @returns {*} a model trained on the observations
   */
  function train(observations){
    return observations;
  }

})();