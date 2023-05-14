import { Request,Response,NextFunction,Handler } from "express"


export const tryCatch = (controller:Handler)=>async (req:Request,res:Response,next:NextFunction)=>{
	try{
		await controller(req,res,next)
	}catch(err){
		next(err)
	}
}

export class AppError extends Error{
	errorCode:string
	statusCode:number
	constructor(errorCode:string,message:string,statusCode:number){
		super(message)
		this.errorCode = errorCode
		this.statusCode = statusCode
	}
}