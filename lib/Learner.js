/**
 * Define the Learner class
 */
;(function () {
  'use strict';

  /***************************************************************************
   * Imports
   */
  var typeCheck = require('type-check').typeCheck;
  var _ = require('lodash');

  /** @type {predictor} */
  var defaultPredictor = require('./predictor-nearest-neighbor');

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
   * @param {Object} [options]
   * @param {predictor} [options.predictor]
   * @returns {Learner}
   */
  function Learner(options) {

    var observations = [];

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
   *
   * @method Learner#observe
   * @param {Object} options
   * @param {observation} options.observation
   * @param {callback} [callback]
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
   * @method Learner#predict
   * @param {Object} options
   * @param {observation} options.observation
   * @param {callback} callback
   */
  function predict(options, callback) {

    var newObservation = options.observation;
    var pastObservations = privateMembers.observations;

    /** @type {scores} */
    var scores = privateMembers.predictor(newObservation, pastObservations);

    callback && callback(null, scores);
  }

  /**
   * Check for validity of options given to Learner#observation.
   *
   * @param {Object} options
   * @param {observation} options.observation
   * @returns {Error|Boolean}
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