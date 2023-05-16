import {Router,Request,Response} from "express"
import userRouter from "./auth.routers"

const router = Router()

router.get("/heartbeat",(req:Request,res:Response)=>{
	res.sendStatus(200)
})

router.use(userRouter)

export default router
