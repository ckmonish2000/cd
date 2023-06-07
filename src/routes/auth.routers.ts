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
 *   summary: Register user
 *   description: Add a new user entry 
 *   tags:
 *    - Auth
 *   responses:
 *    201:
 *     description: should return the ID of the newly created user
 */
router.post(
	"/api/register",
	validateResource(registerUserSchema),
	tryCatch(registerUserHandler)
)
router.post(
	"/api/login",
	validateResource(userLoginSchema),
	tryCatch(userLoginHandler)
)
router.post("/api/logout", authorizationMiddleware, tryCatch(userLogoutHandler))

export default router
