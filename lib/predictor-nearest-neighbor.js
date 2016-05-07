/**
 *
 * @module predictor-nearest-neighbor
 */
;(function(){
  'use strict';

  var math = require('mathjs');
  var _ = require('lodash');

  module.exports = nearestNeighbor;

  /**
   * Each class is assigned a score equal to the minimum distance between the
   * new observation, and each past observation of that class.
   *
   * This is an intentionally simple algorithm. Better algorithms might consider
   * additional factors such as: how many observations have been made per class,
   * and how much variance exists between those observations.
   *
   * @function {predictor} predictorNearestNeighbor
   * @alias predictor-nearest-neighbor
   *
   * @param {observation} newObservation
   * @param {Array<observation>} pastObservations
   * @returns {scores}
   */
  function nearestNeighbor(newObservation, pastObservations){

    var scores = { UNKNOWN: Number.MAX_VALUE };

    // score is the minimum distance between the new observation, and
    // each observation of each existing class
    scores = pastObservations.reduce(function(scores,anObservation){

      var classLabel = anObservation.classLabel;

      // if this observation isn't labeled, label it 'UNKNOWN'
      if( !classLabel ){
        classLabel = 'UNKNOWN';
      }

      // if this class doesn't have a score, assign the biggest score possible
      if( !scores[classLabel] ){
        scores[classLabel] = Number.MAX_VALUE;
      }

      var m1 = _.values(newObservation.measurement);
      var m2 = _.values(anObservation.measurement);

      var d = distance(m1, m2);

      // update this classes score if this distance is less than previous value
      scores[classLabel] = Math.min(d,scores[classLabel]);

      return scores;
    }, scores);

    return scores;
  }

  /**
   * Calculates the Euclidian distance between two points.
   *
   * @param {Array<Number>} x1
   * @param {Array<Number>} x2
   * @returns {Number}
   */
  function distance(x1,x2){

    return math.norm(math.subtract(x1,x2));
  }
})();