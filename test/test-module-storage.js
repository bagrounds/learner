/**
 * Tests storage
 */
;(function () {
  /* global describe, it, before */
  'use strict';

  /***************************************************************************
   * Imports
   */
  var chai = require('chai');
  var expect = chai.expect;

  var storage = require('../lib/storage');

  /***************************************************************************
   * Tests
   */
  describe('storage', function () {

    var key;
    var value;

    before(function () {

      key = 'key';
      value = {array:[{a:'a'},{b:3},{c:[]}],d:'d'};
    });

    it('should save values', function () {

      var data = storage.save(key,value);

      expect(data).to.deep.equal(value);

    });

    it('should load values', function () {

      storage.save(key,value);

      var loadedValue = storage.load(key);

      expect(loadedValue).to.deep.equal(value);

    });

  });
})();
