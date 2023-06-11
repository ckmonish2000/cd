import {Router} from "express"
import validateResource from "@middleware/validateResource"
import {registerUserSchema} from "@schemas/auth.schema"
import {
	registerUserHandler,
	userLoginHandler,
	userLogoutHandler,
} from "@controllers/auth.controller"
import {tryCatch} from "@utils/tryCatch"
import {userLoginSchema} from "@schemas/auth.schema"
import authorizationMiddleware from "@middleware/authorizationMiddleware"

const router = Router()

/**
 * @openapi
 * /api/register:
 *  post:
 *   tags:
 *    - Auth
 *   summary: Register user
 *   description: Add a new user entry 
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/RegisterUserSchema'
 *    required: true
 *   responses:
 *    201:
 *     description: should return the ID of the newly created user
 *    409:
 *     description: This entry alreay exists
 *    400:
 *     description: Client side error
 */
router.post(
	"/api/register",
	validateResource(registerUserSchema),
	tryCatch(registerUserHandler)
)

/**
 * @openapi
 * /api/login:
 *  post:
 *   tags:
 *    - Auth
 *   summary: User login
 *   description: Verify user
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/UserLoginSchema'
 *    required: true 
 *   responses:
 *    200:
 *     description: should return welcome to CD with 200 status code
 */
router.post(
	"/api/login",
	validateResource(userLoginSchema),
	tryCatch(userLoginHandler)
)

/**
 * @openapi
 * /api/logout:
 *  post:
 *   summary: User logout
 *   description: destroy user cookies
 *   tags:
 *    - Auth
 *   responses:
 *    200:
 *     description: should return visit again with 200 status code
 */
router.post("/api/logout", authorizationMiddleware, tryCatch(userLogoutHandler))

export default router
