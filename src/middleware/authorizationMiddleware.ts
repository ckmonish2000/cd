import { NextFunction, Request, Response } from "express"

const authorizationMiddleware = (req:Request,res:Response,next:NextFunction)=>{
	if(req.session && req.session.user){
		next()
	}else{
		return res.send("Unauthorized")
	}
}

export default authorizationMiddleware