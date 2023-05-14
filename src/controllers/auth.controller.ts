import { Request,Response } from "express"
import { registerUserInputType, userLoginInputType } from "@schemas/auth.schema"
import { createNewUser } from "@services/auth.service"
import logger from "@utils/logger"
import { AppError, tryCatch } from "@utils/tryCatch"


export const registerUserHandler = tryCatch(async (req:Request<unknown,unknown,registerUserInputType>,res:Response)=>{
	const {email,password} = req.body
	const registered = await createNewUser(email,password)
	
	if(!registered.success && registered.errorCode === "P2002"){
		throw new AppError(registered.errorCode,"User with this email already exists",409)
	}

	if(registered.success){
		res.status(201).json({id:registered?.id})
	}
})

export const userLoginHandler = (req:Request<unknown,unknown,userLoginInputType>,res:Response)=>{
	res.sendStatus(200).json({})
}

export const userLogoutHandler = (req:Request,res:Response)=>{
	res.sendStatus(200).json({})
}