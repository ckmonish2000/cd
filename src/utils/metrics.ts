import express,{Request,Response} from "express"
import client from "prom-client"
import logger from "./logger"

const app = express()

export const startMetricServer = ()=>{
    const collectDefaultMetrics = client.collectDefaultMetrics()
    
    app.get("/metrics",async(req:Request,res:Response)=>{
        res.set("Content-Type",client.register.contentType)
        return res.send(await client.register.metrics())
    })
    
    app.listen(9100,()=>{
        logger.info("Metrics server started at http://localhost:9100")
    })
}