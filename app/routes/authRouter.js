/**
 * @module routes/authRouter
 *
 *
 */
import express from 'express'
import { loginValidator, forgetPasswordValidator, resetPasswordValidator } from '../validators/authValidator'
import {
  login, logout, forgetPassword, resetPassword,
} from '../controllers/authController'
import { isAuthenticate } from '../middlewares/authMiddleware'

import validate from '../validators'

const authRouter = express.Router()

/* Login Model. */
/**
 * @typedef Login
 * @property {string} email.required - test@example.com - Email user - eg:test@example.com
 * @property {string} password.required - password123 - Password user - eg:Password123*
 *
 */

/* LoginResponse Model. */
/**
 * @typedef LoginResponse
 * @property {integer} id - user id - eg:1
 * @property {string} name - Name user - eg:test@example.com
 * @property {string} email - Email user - eg:test@example.com
 * @property {string} role - Role - eg:ADMIN
 * @property {string} mobile_phone - mobile_phone - eg:081293090
 * @property {string} sales_office - sales_office - eg:Jakarta
 * @property {boolean} is_active - isActive - eg:true
 * @property {string} last_login - last_login - eg:2021-06-10T03:27:57.576Z
 * @property {integer} created_by - created_by - eg:null
 * @property {integer} updated_by - updated_by - eg:null
 * @property {string} updated_at - Updated at - eg:2021-06-10T03:27:57.576Z
 * @property {string} token - token - eg:token_string
 *
 */

/**
 * This function comment is parsed by doctrine
 * @route POST /auth/login
 * @group Auth - Operations about Auth
 * @param {Login.model} data.body test - Some Name description - Data body - example
 * @returns {LoginResponse.model} 200 - An array of user info
 * @returns {ErrorValidation.model} 422 - Error Validation
 * @returns {Error.model} 500 - Error 500
 */

/**
 * login routes
 * @param {any} - '/login'
 * @param {any} - validate(loginValidator)
 * @returns {any}
 */
authRouter.post('/login', validate(loginValidator), login)

/**
 * This function comment is parsed by doctrine
 * @route POST /auth/logout
 * @group Auth - Operations about Auth
 * @param {logout.model} data.body test - Some Name description - Data body - example
 * @returns {logoutResponse.model} 200 - An array of user info
 * @returns {ErrorValidation.model} 401 - Error Auth
 * @returns {Error.model} 500 - Error 500
 */

/**
 * logout routes
 * @param {any} - '/logout'
 * @returns {any}
 */
authRouter.post('/logout', isAuthenticate, logout)

/* Forget Password Model. */
/**
 * @typedef Forget Password
 * @property {string} email.required - test@example.com - Email user - eg:test@example.com
 *
 */

/* forgetPasswordResponse Model. */
/**
 * @typedef forgetPasswordResponse
 * @property {string} message - message message - eg:Email terkirim
 *
 */

authRouter.post('/forget-pasword', validate(forgetPasswordValidator), forgetPassword)

/* resetPasswordResponse Model. */
/**
 * @typedef resetPasswordResponse
 * @property {string} token - token - eg:Email token-xxxxx-xxxxx
 * @property {string} password - password - eg:Password password
 *
 */

authRouter.post('/reset-pasword', validate(resetPasswordValidator), resetPassword)

export default authRouter
