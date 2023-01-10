/** @module helpers/listResponse */

/**
 *
 *
 * @export
 * @param {integer} total
 * @param {integer} page
 * @param {integer} perPage
 * @param {array} data
 * @return {object}
 */
export default function listResponse(total, page, perPage, data, additional = {}) {
  return {
    total,
    page,
    perPage,
    totalPage: Math.ceil(total / perPage),
    ...additional,
    list: data,
  }
}
