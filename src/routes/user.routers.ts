import {Router} from "express"
import {createUserSchema } from "@schemas/user.schema"
import validateResource from "@middleware/validateResource"
import { createUserHandler } from "@controllers/user.controller"

const router = Router()

router.post("/api/users",validateResource(createUserSchema),createUserHandler)


export default router
