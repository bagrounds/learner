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
   *  {scores} likelihood scores that newObservation is a member of any class
   *
   * @function predictorNearestNeighbor
   * @alias predictor-nearest-neighbor
   *
   * @param {Object} options
   * @param {observation} options.newObservation the new observation to be classified
   * @param {Array<observation>} options.pastObservations all past observations to consider
   * @param {Function} callback handle results
   */
  function nearestNeighbor(options, callback){

    var newObservation = options.newObservation;
    var pastObservations = options.pastObservations;

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

    callback(null, scores);
  }

  /**
   * Calculates the Euclidian distance between two points.
   *
   * @param {Array<Number>} x1 a vector
   * @param {Array<Number>} x2 a vector
   * @returns {Number} the Euclidean distance between x1 and x2
   */
  function distance(x1,x2){

    return math.norm(math.subtract(x1,x2));
  }
})();