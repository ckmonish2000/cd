import { redirectToShortcut } from "@controllers/redirect.controller"
import authorizationMiddleware from "@middleware/authorizationMiddleware"
import validateResource from "@middleware/validateResource"
import { redirectInputSchema } from "@schemas/redirect.schema"
import { tryCatch } from "@utils/tryCatch"
import {Router} from "express"

const router = Router()

router.get("/api/:shortcut",authorizationMiddleware,validateResource(redirectInputSchema),tryCatch(redirectToShortcut))

export default router