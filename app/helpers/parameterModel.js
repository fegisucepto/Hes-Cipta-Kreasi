/* eslint-disable func-names */
/*
* if used for list
* can use parameter
* req.order
* req.condition
* req.attributes
* */

/**
 * @module helpers/parameterModel
*/

export default {
  /**
   *
   * @author Uwais
   * @version 0.0.1
   * @since 02-02-2022
   *
   *
   * @param {string} [model='']
   * @return {*}
   */
  define(model = '') {
    return async function (req, res, next) {
      req.model = model
      next()
    }
  },
  /**
   *
   *
   * @param {string} [model='']
   * @param {boolean} [cb=false]
   * @return {*}
   */
  custom(model = '', cb = false) {
    return async function (req, res, next) {
      req.model = model

      if (!cb) return next({ status: 404, message: req.t('404') })
      return cb(req, res, next)
    }
  },
}
