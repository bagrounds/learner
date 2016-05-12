/**
 * Stores stuff
 *
 * @module storage
 */
;(function(){
  'use strict';

  /***************************************************************************
   * Imports
   */
  var Configstore = require('configstore');

  var pkg = require('../package');

  var conf = new Configstore(pkg.name + pkg.version);

  var fastStorage = {};


  /***************************************************************************
   * Public API
   */
  module.exports = {
    save: save,
    load: load,
    all: all
  };

  /***************************************************************************
   * Define functions
   */

  /**
   * Saves data.
   *
   * @function save
   *
   * @param {String} key identifier for the value to save
   * @param {*} value to save
   *
   * @returns {*} the saved value
   */
  function save(key, value){

    fastStorage[key] = value;

    conf.set(key,value);

    return load(key);
  }

  /**
   * Loads data.
   *
   * @function load
   * @param {String} key identifier for the value to load
   * @returns {*} the value associated with key
   */
  function load(key){

    if( !fastStorage[key] ){
      fastStorage[key] = conf.get(key);
    }

    return fastStorage[key];
  }

  /**
   *
   * @function all
   * @returns {*} everything that has been saved
   */
  function all(){

    if( !fastStorage ){
      fastStorage = conf.all;
    }

    return fastStorage;
  }

})();