import {Router} from "express"
import validateResource from "@middleware/validateResource"
import {createUserSchema } from "@schemas/user.schema"
import { createUserHandler } from "@controllers/user.controller"

const router = Router()

router.post("/api/users",validateResource(createUserSchema),createUserHandler)


export default router
