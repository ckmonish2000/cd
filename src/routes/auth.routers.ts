import {Router} from "express"
import validateResource from "@middleware/validateResource"
import {registerUserSchema } from "@schemas/auth.schema"
import { registerUserHandler } from "@controllers/auth.controller"

const router = Router()

router.post("/api/register",validateResource(registerUserSchema),registerUserHandler)


export default router

