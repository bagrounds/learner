/**
 * Define the Observation class
 */
;(function(){
  "use strict";

  /*****************************************************************************
   * Imports
   */
  var typeCheck = require('type-check');

  module.exports = Observation;

  /**
   * Constructs an Observation
   *
   * @class Observation
   * @classdesc Contains measurement data and a class label
   *
   * @param {options} options
   */
  function Observation(options){

    var error = invalidOptions(options);

    if( error ){
      return error;
    }

    this.classLabel = options.classLabel;
    this.measurement = options.measurement;
  }

  Observation.prototype = Object.create(Observation.prototype);
  Observation.prototype.constructor = Observation;

  /*****************************************************************************
   * Type definitions
   */

  /**
   * @typedef {Object} options
   * @memberof Observation
   * @property {Array<Number>} measurement one or more numerical values
   * @property {String} classLabel class identifier
   */

  /*****************************************************************************
   * Private functions
   */

  /**
   * Checks for invalid options. Returns an error if anything is invalid, false
   * otherwise.
   *
   * @param {options} options {@link options}
   * @returns {Error|boolean} Error if options are invalid, false otherwise.
   */
  function invalidOptions(options){

    var message;

    if( ! typeCheck('String',options.classLabel) ){
      message = 'Invalid class label: ' + options.classLabel;
      message += '. Should be a String';

      return new Error(message);
    }

    if( ! typeCheck('[Number]', options.measurement) ){
      message = 'Invalid class label: ' + options.classLabel;
      message += '. Should be a String';

      return new Error(message);
    }

    return false;
  }


})();