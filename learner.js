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
   * @property {String} learnerId
   * @property {String} action register, observe, or predict
   * @property {observation} observation
   */

  /**
   *
   * @function learner
   *
   * @param {options} options
   * @param {callback} callback
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
   * @returns {String} a new unique id
   */
  function generateId(){

    var ids = storage.load('ids');

    if( !ids ){
      console.log('no ids!');

      ids = [];
    }

    console.log(JSON.stringify(ids));

    ids.push(newId(ids));

    ids = storage.save('ids',ids);

    return String(newId);
  }

  function newId(ids){

    var id;

    if( ids.length == 0 ){

      id = 0;
    } else {

      id = Math.max.apply(null, ids) + 1;
    }

    return id;
  }

  /**
   *
   * @param {options} options
   * @param {callback} callback
   */
  function observe(options, callback){

    var learnerId = options.learnerId;
    var observation = options.observation;

    var aLearner = storage.load(learnerId);

    aLearner.observe(observation, function(error, scores){

      storage.save(learnerId,aLearner);

      callback(error,scores);
    });
  }

  /**
   * Make a prediction based on the observation and the existing model.
   *
   * @param {options} options
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
