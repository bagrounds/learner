/**
 *
 * @module predictor-neural-network
 */
;(function(){
  'use strict';

  var _ = require('lodash');
  var convnetjs = require("convnetjs");

  var UNKNOWN = 'UNKNOWN';

  module.exports = predict;

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
   * @function predict
   * @alias predictor-neural-network
   *
   * @param {Object} options
   * @param {observation} options.newObservation the new observation to be classified
   * @param {Array<observation>} options.pastObservations all past observations to consider
   * @param {Function} callback handle results
   */
  function predict(options, callback){

    var pastObservations = options.pastObservations;
    var newObservation = options.newObservation;

    pastObservations.forEach(function(observation){
      if( !observation.classLabel ){
        observation.classLabel = UNKNOWN;
      }
    });

    var classes = classesFromObservations(pastObservations);

    var classMap = makeMap(classes);
    //console.log('classMap: ' + JSON.stringify(classMap));

    var featureMap = makeMap(_.keys(newObservation.measurement));
    //console.log('featureMap: ' + JSON.stringify(featureMap));

    var numClasses = classes.length;
    var numInputs = _.values(newObservation.measurement).length;

    var net = makeNet(numInputs,numClasses);

    var trainer = newTrainer(net);

    pastObservations.forEach(function(observation){

      var classLabel = observation.classLabel;
      var measurement = observation.measurement;

      var numbers = numbersFromMeasurement(measurement,featureMap);

      var x = new convnetjs.Vol(numbers);

      var l = classMap[classLabel];

      trainer.train(x, l);

      var p = net.forward(x);

      var m = l == 0 ? 1 : 0;

      var diff = p.w[l] - p.w[m];

      //console.log(p.w);

      //console.log('confidence: ' + diff);
    });

    var p = net.forward(new convnetjs.Vol(numbersFromMeasurement(newObservation.measurement,featureMap)));

    var result = {};

    _.keys(classMap).forEach(function(key){

      //console.log(key);
      //console.log(classMap[key]);

      result[key] = p.w[classMap[key]]
    });

    //console.log('result: ' + JSON.stringify(result));

    callback(null, result);
  }

  /**
   *
   * @param measurement
   * @param featureMap
   * @returns {Array}
   */
  function numbersFromMeasurement(measurement,featureMap) {

    var numbers = [];

    _.keys(measurement).forEach(function (key) {

      numbers[featureMap[key]] = measurement[key];
    });

    return numbers;
  }

  /**
   *
   * @param observations
   * @returns {*}
   */
  function classesFromObservations(observations){

    var classes = observations.reduce(function(classes,observation){

      classes.push(observation.classLabel);

      return _.uniq(classes);
    },[]);

    if( !_.includes(classes, UNKNOWN) ){
      classes.push(UNKNOWN);
    }

    return classes;
  }

  /**
   *
   * @param classLabels
   * @returns {*}
   */
  function makeMap(classLabels){

    //console.log('classLabels: ' + classLabels);

    var map = classLabels.reduce(function(map,classLabel, index){

      map[classLabel] = index;

      return map;
    },{});

    //console.log(map);
    return map;
  }

  /**
   * Given input dimensions and number of classes, initialize a neural net.
   *
   * @param numInputDimensions
   * @param numClasses
   * @returns {*}
   */
  function makeNet(numInputDimensions,numClasses){

    var numNeurons = Math.floor((numInputDimensions + numClasses)/2);

    // species a 2-layer neural network with one hidden layer of 20 neurons
    var layer_defs = [];
    // input layer declares size of input. here: 2-D data
    // ConvNetJS works on 3-Dimensional volumes (sx, sy, depth), but if you're not dealing with images
    // then the first two dimensions (sx, sy) will always be kept at size 1
    layer_defs.push({type: 'input', out_sx: 1, out_sy: 1, out_depth: numInputDimensions});
    // declare 20 neurons, followed by ReLU (rectified linear unit non-linearity)
    layer_defs.push({type: 'fc', num_neurons: numNeurons, activation: 'relu'});
    // declare the linear classifier on top of the previous hidden layer
    layer_defs.push({type: 'svm', num_classes: numClasses});

    var net = new convnetjs.Net();
    net.makeLayers(layer_defs);

    return net;
  }

  /**
   * Initialize a trainer for a neural network.
   *
   * @param net
   * @returns {*}
   */
  function newTrainer(net){
    return new convnetjs.Trainer(net, {method: 'sgd', learning_rate: 0.01,
      l2_decay: 0.001, momentum: 0.9, batch_size: 1,
      l1_decay: 0.001});
  }

})();