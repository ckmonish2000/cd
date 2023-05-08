import {Router,Request,Response} from "express"
import { createUserInputType, createUserSchema } from "@schemas/user.schema"
import validateResource from "@middleware/validateResource"

const router = Router()

router.post("/api/users",validateResource(createUserSchema),(req:Request<unknown,unknown,createUserInputType>,res:Response)=>{
	res.send(req.body)
})

export default router
