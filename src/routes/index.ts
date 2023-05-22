import {Router,Request,Response} from "express"
import userRouter from "./auth.routers"
import shortcutRouter from "./shortcut.routers"
import redirectRouter from "./redirect.router"
import permissionRouter from "./permission.router"
import analyticsRouter from "./analytics.router"

const router = Router()

router.get("/heartbeat",(req:Request,res:Response)=>{
	res.sendStatus(200)
})

router.use(userRouter)
router.use(shortcutRouter)
router.use(redirectRouter)
router.use(permissionRouter)
router.use(analyticsRouter)

export default router
