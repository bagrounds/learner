;(function () {
  /* global describe, it */
  "use strict";

  var convnetjs = require('convnetjs');
  var chai = require('chai');
  var expect = chai.expect;

  var predict = require('../lib/predictor-neural-network');

  var pastObservations = [
    {classLabel:'a',measurement:{f1:0.1, f2:-0.9, f3:0.3}},
    {classLabel:'a',measurement:{f1:0.2, f2:-0.9, f3:0.2}},
    {classLabel:'a',measurement:{f1:0.3, f2:-0.8, f3:0.3}},
    {classLabel:'a',measurement:{f1:0.1, f2:-0.7, f3:0.4}},
    {classLabel:'a',measurement:{f1:0.1, f2:-0.8, f3:0.2}},

    {classLabel:'b',measurement:{f1:0.9, f2:0.5, f3: -0.9}},
    {classLabel:'b',measurement:{f1:0.8, f2:0.4, f3: -0.8}},
    {classLabel:'b',measurement:{f1:0.7, f2:0.6, f3: -0.7}},
    {classLabel:'b',measurement:{f1:0.8, f2:0.5, f3: -0.9}},
    {classLabel:'b',measurement:{f1:0.9, f2:0.6, f3: -0.8}}
  ];

  var newObservation = {
    measurement: {f1:0.1, f2:-0.8, f3:0.3}
  };

  var options = {
    pastObservations: pastObservations,
    newObservation: newObservation
  };

  predict(options,function(e,r){

    describe('predictor-neural-network',function(){

      it('should get better with more observations', function(done){

        expect(r['a']).to.be.greaterThan(r['b']);
        done();

      });
    });
  });

})();
