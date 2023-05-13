import {Router} from "express"
import validateResource from "@middleware/validateResource"
import {createUserSchema } from "@schemas/user.schema"
import { registerUserHandler } from "@controllers/user.controller"

const router = Router()

router.post("/api/users",validateResource(createUserSchema),registerUserHandler)


export default router

