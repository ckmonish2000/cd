import {
	addUserToAccessListHandler,
	fetchAccessListForUrlHandler,
	revokeUserToAccessListHandler,
} from "@controllers/permission.controller"
import authorizationMiddleware from "@middleware/authorizationMiddleware"
import validateResource from "@middleware/validateResource"
import {fetchAccessListForUrlInputSchema} from "@schemas/permission.schema"
import {revokePermissionInputSchema} from "@schemas/permission.schema"
import {createPermissionInputSchema} from "@schemas/permission.schema"
import {tryCatch} from "@utils/tryCatch"
import {Router} from "express"

const router = Router()

/**
 * @openapi
 * /api/permission:
 *  post:
 *   tags:
 *    - Permission
 *   summary: Provide another user permission
 *   description: Provide another user permission to shortcuts you own
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/CreatePermissionSchema'
 *    required: true
 *   responses:
 *    201:
 *     description: Should return new permission id
 *    404:
 *     description: User not found
 */
router.post(
	"/api/permission",
	authorizationMiddleware,
	validateResource(createPermissionInputSchema),
	tryCatch(addUserToAccessListHandler)
)

/**
 * @openapi
 * /api/permission/{accessListId}:
 *  delete:
 *   tags:
 *    - Permission
 *   summary: Revoke user permission
 *   description: Revoke user permission to shortcuts you own
 *   parameters:
 *   - in: path
 *     schema:
 *      $ref: '#/components/schemas/RevokePermissionSchema'
 *     name: accessListId
 *     required: true
 *     default: 516782ba-63d9-43b6-b278-620c1caefd48
 *   responses:
 *    200:
 *     description: Should return permission object
 *    404:
 *     description: User not found
 */
router.delete(
	"/api/permission/:accessListId",
	authorizationMiddleware,
	validateResource(revokePermissionInputSchema),
	tryCatch(revokeUserToAccessListHandler)
)

/**
 * @openapi
 * /api/permission/{shortlink}:
 *  get:
 *   tags:
 *    - Permission
 *   summary: Get all users who have access to a link
 *   description: Get all users who have access to a link can be used only by the owner of the shortcut.
 *   parameters:
 *   - in: path
 *     schema:
 *      $ref: '#/components/schemas/AccessListForUrlSchema'
 *     required: true
 *     name: shortlink
 *     default: google
 *   responses:
 *    200:
 *     description: Should return array of user id
 *    404:
 *     description: User not found
 */
router.get(
	"/api/permission/:shortlink",
	authorizationMiddleware,
	validateResource(fetchAccessListForUrlInputSchema),
	tryCatch(fetchAccessListForUrlHandler)
)

export default router
