import { NextFunction, Request, Response } from "express"
import { fetchUserById } from "@services/user.service"


const authorizationMiddleware = async (req:Request,res:Response,next:NextFunction)=>{
	if(req.session && req.session.user){
		const verifyUserExistance = await fetchUserById(req.session.user.id)

		if(!verifyUserExistance){
			return res.status(404).send("User with the provided info does not exist")
		}

		next()
	}else{
		return res.status(401).send("Unauthorized")
	}
}

export default authorizationMiddleware