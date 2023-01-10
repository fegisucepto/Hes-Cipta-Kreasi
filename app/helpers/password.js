/** @module helpers/password */

import bcrypt from 'bcryptjs'

/**
 * This function to generate hash string from some string
 *
 * @author Topan
 * @since 02-02-2021
 *
 *
 * @export
 * @param {string} password - the string to be hashed
 * @return {string} Hashed string
 */
export function getHash(password) {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

/**
 * This function to compare hash string to raw string
 *
 * @export
 * @param {string} password - the raw string to be compared
 * @param {string} hash - the hashed string to be compared
 * @return {boolean} true/false
 */
export function checkHash(password, hash) {
  return bcrypt.compareSync(password, hash)
}
