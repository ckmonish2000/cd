import express,{Request,Response} from "express"
import client from "prom-client"
import logger from "./logger"

const app = express()

export const responseTimeHistogram = new client.Histogram({
    name:"response_time_duration_in_seconds",
    help:"REST API response time in seconds",
    labelNames:["method","route","status_code"]
})

export const databaseResponseTimeHistogram = new client.Histogram({
    name:"db_response_time_duration_in_seconds",
    help:"DB response time in seconds",
    labelNames:["operation","success"]
})

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