import logger from "@utils/logger"
import { AppError } from "@utils/tryCatch"
import { NextFunction, Request, Response,Errback } from "express"

const errorHandler = (error:Error,req:Request,res:Response,next:NextFunction)=>{
	
	if(error instanceof AppError){
		logger.error(`Instance of app error(${error?.errorCode}): ${error?.name} - ${error?.message}`)
		return res.status(error.statusCode).send(error.message)
	}

	logger.error(`Untracked Error:  ${error?.name} - ${error?.message}`)
	return res.status(500).send("Something went wrong")
}


export default errorHandler