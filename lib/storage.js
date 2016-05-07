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
  var typeCheck = require('type-check').typeCheck;
  var Configstore = require('configstore');

  var pkg = require('../package');

  var conf = new Configstore(pkg.name + pkg.version);

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
   * Saves data
   *
   * @function storage:save
   * @param {String} key
   * @param {*} value
   * @returns {*}
   */
  function save(key, value){

    conf.set(key,value);

    return load(key);
  }

  /**
   * Loads data
   *
   * @function storage:load
   *
   * @param {String} key
   * @returns {*} the value associated with key
   */
  function load(key){

    return conf.get(key);
  }

  function all(){

    return conf.all;
  }

})();