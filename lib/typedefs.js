
/**
 *
 * @typedef {Object} observation
 * @property {Object} measurement
 * @property {String} [classLabel]
 */

/**
 *
 * @typedef {Object} scores
 * @property {Number} UNKNOWN
 */

/**
 * callback
 *
 * @callback {Function} callback handles results of an async function call
 * @type {Function}
 * @property {Error} error describes any errors that may have occurred
 * @property {*} result
 */

/**
 *
 * @typedef {Function} predictor
 * @param {observation} newObservation
 * @param {Array<observation>} pastObservations
 * @returns {scores}
 *
 */
