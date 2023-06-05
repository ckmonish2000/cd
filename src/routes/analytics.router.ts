import {fetchAnalyticsLogHandler} from "@controllers/analytics.controller"
import authorizationMiddleware from "@middleware/authorizationMiddleware"
import validateResource from "@middleware/validateResource"
import {fetchAnalyticsInputSchema} from "@schemas/analytics.schema"
import {tryCatch} from "@utils/tryCatch"
import {Router} from "express"

const router = Router()

router.get(
	"/api/analytics/:shortcut",
	authorizationMiddleware,
	validateResource(fetchAnalyticsInputSchema),
	tryCatch(fetchAnalyticsLogHandler)
)

export default router
