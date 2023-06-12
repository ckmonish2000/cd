import {Router} from "express"
import validateResource from "@middleware/validateResource"
import {
	createShortcutSchema,
	updateShortcutSchema,
} from "@schemas/shortcut.schema"
import {
	createShortcutHandler,
	deleteShortcutHandler,
	fetchAllUserShortcutsHandler,
	updateShortcutHandler,
} from "@controllers/shortcut.controller"
import {deleteShortcutSchema} from "@schemas/shortcut.schema"
import authorizationMiddleware from "@middleware/authorizationMiddleware"
import {tryCatch} from "@utils/tryCatch"

const router = Router()

/**
 * @openapi
 * /api/shortcut:
 *  post:
 *   tags:
 *    - Shortcut
 *   summary: Create new shortcut
 *   description: Create new shortcut for loggedin user
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/CreateShortcutSchema'
 *    required: true
 *   responses:
 *    201:
 *     description: Should return new Shortcut
 *    409:
 *     description: This entry alreay exists
 *    403:
 *     description: Unauthorized
 */
router.post(
	"/api/shortcut",
	authorizationMiddleware,
	validateResource(createShortcutSchema),
	tryCatch(createShortcutHandler)
)

/**
 * @openapi
 * /api/shortcut:
 *  put:
 *   tags:
 *    - Shortcut
 *   summary: Update shortcut
 *   description: Update shortcut for loggedin user
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/UpdateShortcutSchema'
 *    required: true
 *   responses:
 *    200:
 *     description: Updated successfully 
 *    404:
 *     description: Not found
 */
router.put(
	"/api/shortcut",
	authorizationMiddleware,
	validateResource(updateShortcutSchema),
	tryCatch(updateShortcutHandler)
)

/**
 * @openapi
 * /api/shortcut/{shortlink}:
 *  delete:
 *   tags:
 *    - Shortcut
 *   summary: delete shortcut
 *   description: delete shortcut for loggedin user
 *   parameters:
 *    - in: path
 *      name: shortlink
 *      schema:
 *       $ref: '#/components/schemas/DeleteShortcutSchema'
 *   responses:
 *    200:
 *     description: Updated successfully 
 *    404:
 *     description: Not found
 */
router.delete(
	"/api/shortcut/:shortlink",
	authorizationMiddleware,
	validateResource(deleteShortcutSchema),
	tryCatch(deleteShortcutHandler)
)

/**
 * @openapi
 * /api/shortcut:
 *  get:
 *   tags:
 *    - Shortcut
 *   summary: Get all user shortcut
 *   description: Get all shortcuts for loggedin user
 *   responses:
 *    200:
 *     description: Get an array of shortcuts
 *    403:
 *     description: Unauthorized
 */
router.get(
	"/api/shortcut",
	authorizationMiddleware,
	tryCatch(fetchAllUserShortcutsHandler)
)

export default router
