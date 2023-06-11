import {fetchAnalyticsLogHandler} from "@controllers/analytics.controller"
import authorizationMiddleware from "@middleware/authorizationMiddleware"
import validateResource from "@middleware/validateResource"
import {fetchAnalyticsInputSchema} from "@schemas/analytics.schema"
import {tryCatch} from "@utils/tryCatch"
import {Router} from "express"

const router = Router()

/**
 * @openapi
 * /api/analytics/:shortcut:
 *  get:
 *   tags:
 *    - Analytics
 *   parameters:
 *    - in: path
 *      schema:
 *       $ref: '#/components/schemas/FetchAnalyticsSchema'
 *      name: shortcut
 */
router.get(
	"/api/analytics/:shortcut",
	authorizationMiddleware,
	validateResource(fetchAnalyticsInputSchema),
	tryCatch(fetchAnalyticsLogHandler)
)

export default router
