import { Request,Response } from "express"
import { createUserInputType, userLoginInputType } from "@schemas/user.schema"


export const registerUserHandler = (req:Request<unknown,unknown,createUserInputType>,res:Response)=>{
	res.sendStatus(201).json({})
}

export const userLoginHandler = (req:Request<unknown,unknown,userLoginInputType>,res:Response)=>{
	res.sendStatus(200).json({})
}

export const userLogoutHandler = (req:Request,res:Response)=>{
	res.sendStatus(200).json({})
}