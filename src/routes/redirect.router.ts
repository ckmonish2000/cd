import {redirectToShortcut} from "@controllers/redirect.controller"
import authorizationMiddleware from "@middleware/authorizationMiddleware"
import validateResource from "@middleware/validateResource"
import {redirectInputSchema} from "@schemas/redirect.schema"
import {tryCatch} from "@utils/tryCatch"
import {Router} from "express"

const router = Router()


/**
 * @openapi
 * /api/{shortcut}:
 *   get:
 *     tags:
 *       - Redirect
 *     summary: Redirect to original URL
 *     parameters:
 *       - in: path
 *         schema:
 *           $ref: '#/components/schemas/RedirectSchema'
 *         name: shortcut
 *         required: true
 *         default: go
 *     responses:
 *       302:
 *         description: Redirect response
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *       400:
 *         description: Shortcut not found
 */
router.get(
	"/api/:shortcut",
	authorizationMiddleware,
	validateResource(redirectInputSchema),
	tryCatch(redirectToShortcut)
)

export default router
