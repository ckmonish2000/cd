import {Router,Request,Response} from "express"
import userRouter from "./auth.routers"
import shortcutRouter from "./shortcut.routers"
import redirectRouter from "./redirect.router"

const router = Router()

router.get("/heartbeat",(req:Request,res:Response)=>{
	res.sendStatus(200)
})

router.use(userRouter)
router.use(shortcutRouter)
router.use(redirectRouter)

export default router
