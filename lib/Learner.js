/**
 *
 * @class Learner
 * @classdesc Record observations and make predictions
 */
;(function () {
  'use strict';

  /***************************************************************************
   * Imports
   */
  var typeCheck = require('type-check').typeCheck;
  var _ = require('lodash');

  var defaultPredictor = require('./predictor-nearest-neighbor');

  module.exports = Learner;

  /***************************************************************************
   * Define functions
   */

  var privateMembers;

  /**
   * Constructor
   *
   * @param {Object} [options] contains constructor parameters
   * @param {Array} [options.observations] past observations
   * @param {predictor} [options.predictor] a predictor function to use instead of the default
   */
  function Learner(options) {

    var observations = [];

    if( options && options.observations ){
      observations = options.observations;
    }

    var predictor = defaultPredictor;

    if( options && options.predictor ){
      predictor = options.predictor;
    }

    privateMembers = {
      get observations() {
        return _.cloneDeep(observations);
      },
      addObservation: function(newObservation) {
        observations.push(newObservation);
      },
      predictor: predictor
    };
  }

  // set prototype and constructor
  Learner.prototype = Object.create(Learner.prototype);
  Learner.prototype.constructor = Learner;

  Learner.prototype.observe = observe;
  Learner.prototype.predict = predict;

  Learner.prototype.__defineGetter__('observations', function() { return privateMembers.observations; });



  /**
   * Records an observation.
   *
   * @method Learner#observe
   * @param {Object} options function parameters
   * @param {observation} options.observation the new observation to record
   * @param {callback} [callback] handle results
   */
  function observe(options, callback) {

    var error = invalidObservationOptions(options);

    if( error ){
      callback && callback(error);
      return;
    }

    var newObservation = options.observation;

    privateMembers.addObservation(newObservation);

    predict(options,callback);
  }

  /**
   * Makes a prediction for the given observation. Returns likelihood scores
   * that this observation is a member of any known class.
   *
   * @method Learner#predict
   * @param {Object} options function parameters
   * @param {observation} options.observation an observation to make a prediction for
   * @param {Function} callback handle results
   */
  function predict(options, callback) {

    var predictorOptions = {
      newObservation: options.observation,
      pastObservations: privateMembers.observations
    };

      /** @type {scores} */
      privateMembers.predictor(predictorOptions, callback);
  }

  /**
   * Check for validity of options given to Learner#observation.
   *
   * @param {Object} options function parameters
   * @param {observation} options.observation an observation to inspect for validity
   * @returns {Error|Boolean} an error if the observation is invalid, false otherwise
   */
  function invalidObservationOptions(options){

    var observation = options.observation;

    var message = 'Invalid ';

    var type = '{classLabel:Maybe String,measurement:Object}';

    if( ! typeCheck(type,observation) ){
      message += 'observation: ' + JSON.stringify(observation);
      message += ' should be like: ' + type;

      return new Error(message);
    }

    var values = _.values(observation.measurement);

    if( ! typeCheck('[Number]', values) ){
      message += 'measurement values: ' + JSON.stringify(values);
      message += ' should be an Array of Numbers.';

      return new Error(message);
    }

    return false;
  }
})();