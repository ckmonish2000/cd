import { responseTimeHistogram } from "@utils/metrics"
import { Request, Response } from "express"
import responseTime from "response-time"

const trackResponseMetrics = (req:Request,res:Response,time:number)=>{
    if(req.route){
        responseTimeHistogram.observe({
            method:req.method,
            route:req.route?.path,
            status_code:res.statusCode
        }, time * 1000)
    }
}

export default responseTime(trackResponseMetrics)
