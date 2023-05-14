import { Request,Response } from "express"
import { registerUserInputType, userLoginInputType } from "@schemas/auth.schema"
import { createNewUser } from "@services/auth.service"
import logger from "@utils/logger"


export const registerUserHandler = async (req:Request<unknown,unknown,registerUserInputType>,res:Response)=>{
	const {email,password} = req.body
	const registered = await createNewUser(email,password)
	
	if(!registered.success){
		const statusCode = registered.errorCode==="P2002" ? 409 : 500
		const errorMessage = registered.errorCode==="P2002" ?"User with this email already exists":"Something went wrong"
		res.status(statusCode).send(errorMessage)
	}

	if(registered.success){
		res.status(201).json({id:registered?.id})
	}
}

export const userLoginHandler = (req:Request<unknown,unknown,userLoginInputType>,res:Response)=>{
	res.sendStatus(200).json({})
}

export const userLogoutHandler = (req:Request,res:Response)=>{
	res.sendStatus(200).json({})
}