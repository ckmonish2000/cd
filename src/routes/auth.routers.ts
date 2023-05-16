import {Router} from "express"
import validateResource from "@middleware/validateResource"
import {registerUserSchema } from "@schemas/auth.schema"
import { registerUserHandler, userLoginHandler, userLogoutHandler } from "@controllers/auth.controller"
import { tryCatch } from "@utils/tryCatch"
import { userLoginSchema } from "@schemas/auth.schema"
import authorizationMiddleware from "@middleware/authorizationMiddleware"

const router = Router()

router.post("/api/register",validateResource(registerUserSchema),tryCatch(registerUserHandler))
router.post("/api/login",validateResource(userLoginSchema),tryCatch(userLoginHandler))
router.post("/api/logout",authorizationMiddleware,tryCatch(userLogoutHandler))

export default router

