import { Request,Response } from "express"
import { createUserInputType, userLoginInputType } from "@schemas/user.schema"
import { createNewUser } from "@services/user.service"
import logger from "@utils/logger"


export const registerUserHandler = async (req:Request<unknown,unknown,createUserInputType>,res:Response)=>{
	const {email,password} = req.body
	const registered = await createNewUser(email,password)
	
	if(!registered.success){
		res.status(registered.status).send(registered)
	}else{
		res.status(registered.status).json({id:registered?.id})
	}
}

export const userLoginHandler = (req:Request<unknown,unknown,userLoginInputType>,res:Response)=>{
	res.sendStatus(200).json({})
}

export const userLogoutHandler = (req:Request,res:Response)=>{
	res.sendStatus(200).json({})
}