import {redirectToShortcut} from "@controllers/redirect.controller"
import authorizationMiddleware from "@middleware/authorizationMiddleware"
import validateResource from "@middleware/validateResource"
import {redirectInputSchema} from "@schemas/redirect.schema"
import {tryCatch} from "@utils/tryCatch"
import {Router} from "express"

const router = Router()


/**
 * @openapi
 * /api/shortcut:
 *  get:
 *   tags:
 *    - Redirect
 *   summary: Redirect to original URL
 *   parameters:
 *    - in: path
 *      schema: 
 *       $ref: '#/components/schemas/RedirectSchema'
 *      name: shortcut
 *      required: true
 *      default: go
 *   responses:
 *    201:
 *     description: should return the ID of the newly created user
 *    409:
 *     description: This entry alreay exists
 */
router.get(
	"/api/:shortcut",
	authorizationMiddleware,
	validateResource(redirectInputSchema),
	tryCatch(redirectToShortcut)
)

export default router
