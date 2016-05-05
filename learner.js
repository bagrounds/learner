/**
 * Learns stuff
 *
 * @module learner
 */
(function(){
  "use strict";

  /*****************************************************************************
   * imports
   */
  var typeCheck = require('type-check').typeCheck;
  var Learner = require('./lib/Learner');
  var storage = require('./lib/storage');

  var V = require('./conf/values');

  /*****************************************************************************
   * exports
   */
  module.exports = learner;

  /**
   * @typedef {Object} options
   * @property {Number} learnerId
   * @property {String} action register, observe, or predict
   * @property {ObservationType} observation
   */

  /**
   *
   * @function learner
   * @param {Object} options
   * @param {String} options.action register, observe, or predict
   * @param {Number} options.learnerId
   * @param {ObservationType} options.observation
   * @param {callback} callback handles results
   */
  function learner(options, callback){

    var error = validateOptions(options);

    if( error ){
      callback(error, options);
    }

    var action = options.action;

    switch(action){

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
   * Validate inputs.
   *
   * @private
   *
   * @param {options} options
   *
   * @returns {Error|null} any errors due to invalid inputs
   */
  function validateOptions(options){

    return null;
  }

  /**
   * Create and register a new Learner.
   *
   * @param options
   * @param {callback} callback
   */
  function register(options, callback){

    var learnerId = generateId();

    var newLearner = new Learner(options);

    storage.save(learnerId, newLearner);

    callback(null, learnerId);
  }

  /**
   * Generates a new unique id.
   *
   * @returns {Number} a new unique id
   */
  function generateId(){

    var ids = storage.load('ids');

    if( !ids ){

      ids = {};

      ids.activeIds = [];

      ids.nextId = function(){

        var id;

        if( ids.activeIds.length == 0 ){

          id = 0;
        } else {

          id = Math.max.apply(null, ids.activeIds) + 1;
        }

        ids.activeIds.push(id);

        return id;
      };

      ids = storage.save('ids',ids);
    }

    return ids.nextId();
  }

  /**
   *
   * @param {Object} options
   * @param {Number} options.learnerId
   * @param {Object} options.observation
   * @param {callback} callback
   */
  function observe(options, callback){

    var learnerId = options.learnerId;
    var observation = options.observation;

    var aLearner = storage.load(learnerId);

    aLearner.observe(observation);

    storage.save(aLearner);

    return aLearner.predict(observation, callback);
  }

  /**
   * Make a prediction based on the observation and the existing model.
   *
   * @param {Object} options
   * @param {Number} options.learnerId
   * @param {Object|Array<Object>} options.observation
   *
   * @param {callback} callback
   */
  function predict(options,callback){

    var learnerId = options.learnerId;
    var observation = options.observation;

    var aLearner = storage.load(learnerId);

    var learnerOptions = {
      observation: observation
    };

    aLearner.predict(learnerOptions,callback);

  }


})();
