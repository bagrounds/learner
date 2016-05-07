/**
 * Learns stuff.
 *
 * @summary   Exposes learner interface
 *
 * @requires {@link http://www.npmjs.org/packages/type-check|type-check}
 * @requires {@link http://www.npmjs.org/packages/lodash|lodash}
 * @requires {@link Learner}
 * @requires module:storage
 *
 * @module learner
 */
(function () {
  'use strict';

  /*****************************************************************************
   * imports
   */

  var typeCheck = require('type-check').typeCheck;
  var Learner = require('./lib/Learner');
  var storage = require('./lib/storage');
  var _ = require('lodash');

  /*****************************************************************************
   * exports
   */
  module.exports = learner;

  /**
   * Register a new Learner, record an observation, or make a prediction.
   *
   * @function learner
   *
   * @param {options} options contains function parameters
   * @param {callback} callback handles results
   */
  function learner(options, callback) {

    if (!options.action) {
      listRegisteredIds(callback);
      return;
    }

    var error = invalidOptions(options);
    if (error) {
      callback(error, options);
      return;
    }

    var action = options.action;

    switch (action) {

      case 'register':
        register(options, callback);
        break;

      case 'observe':
        observe(options, callback);
        break;

      case 'predict':
        predict(options, callback);
        break;

      default:
        callback(new Error('invalid action: ' + action), options);
    }
  }

  /*****************************************************************************
   * Define helper functions
   */

  /**
   * @typedef {Object} options
   * @property {String} learnerId
   * @property {String} action register, observe, or predict
   * @property {observation} observation
   */

  /**
   * @typedef {Function} callback handles results of an async function call
   * @type {Function}
   * @property {Error} error describes any errors that may have occurred
   * @property {*} result
   */


  /**
   * Validate inputs.
   *
   * @param {options} options passed to learner
   *
   * @returns {Error|null} any errors due to invalid inputs
   */
  function invalidOptions(options) {

    var SUPPORTED_ACTIONS = [
      'register',
      'observe',
      'predict'
    ];

    // description of observation object
    var dObservation = '{measurement: Object, classLabel: Maybe String}';

    var dOptions = '{action: String, learnerId: String, observation: ' + dObservation + '}';

    if( !_.includes( SUPPORTED_ACTIONS, options.action) ){
      var message = options.action + ' is an unsupported action. ';

      message += 'Supported actions: ' + JSON.toString(SUPPORTED_ACTIONS);

      return new Error(message);
    }

    typeCheck(dOptions, options);

    return null;
  }

  /**
   * Create and register a new Learner.
   *
   * @param {options} options passed to learner
   * @param {callback} callback handle results
   */
  function register(options, callback) {

    var learnerId = generateId();

    var newLearner = new Learner(options);

    storage.save(learnerId, newLearner);

    callback(null, learnerId);
  }

  /**
   * Create and register a new Learner.
   *
   * @param {callback} callback handle results
   */
  function listRegisteredIds(callback) {

    callback(null, storage.all());
  }

  /**
   * Generates a new unique id.
   *
   * @returns {String} a new unique id
   */
  function generateId() {

    var ids = storage.load('ids');

    if (!ids) {

      ids = [];
    }

    ids.push(newId(ids));

    ids = storage.save('ids', ids);

    return String(newId);
  }

  function newId(ids) {

    var id;

    if (ids.length == 0) {

      id = 0;
    } else {

      id = Math.max.apply(null, ids) + 1;
    }

    return id;
  }

  /**
   * Record an observation
   *
   * @param {options} options passed to learner
   * @param {callback} callback handle results
   */
  function observe(options, callback) {

    var learnerId = options.learnerId;
    var observation = options.observation;

    var aLearner = storage.load(learnerId);

    aLearner.observe(observation, function (error, scores) {

      storage.save(learnerId, aLearner);

      callback(error, scores);
    });
  }

  /**
   * Make a prediction based on the observation and the existing model.
   *
   * @param {options} options passed to learner
   *
   * @param {callback} callback handle results
   */
  function predict(options, callback) {

    var learnerId = options.learnerId;
    var observation = options.observation;

    var aLearner = storage.load(learnerId);

    var learnerOptions = {
      observation: observation
    };

    aLearner.predict(learnerOptions, callback);
  }


})();
