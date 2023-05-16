import { Request,Response } from "express"
import { registerUserInputType, userLoginInputType } from "@schemas/auth.schema"
import { checkUserWithEmail, createNewUser } from "@services/auth.service"
import logger from "@utils/logger"
import { AppError, tryCatch } from "@utils/tryCatch"
import { validatePassword } from "@utils/auth"


export const registerUserHandler = async (req:Request<unknown,unknown,registerUserInputType>,res:Response)=>{
	const {email,password} = req.body
	const registered = await createNewUser(email,password)
	
	if(!registered.success && registered.errorCode === "P2002"){
		throw new AppError(registered.errorCode,"User with this email already exists",409)
	}

	if(registered.success){
		res.status(201).json({id:registered?.id})
	}
}

export const userLoginHandler = async (req:Request<unknown,unknown,userLoginInputType>,res:Response)=>{
	const {email,password} = req.body

	const user = await checkUserWithEmail(email)

	if(!user){
		throw new AppError("cd404","Please consider registering first",404)
	}
	
	const isValidPassword = await validatePassword(password,user.password)

	if(!isValidPassword){
		throw new AppError("cd401","Invalid email or password",401)
	}

	req.session.user = {
		id:user.id,
		email:user.email
	}

	res.status(200).send("Welcome To CD")
}

export const userLogoutHandler = (req:Request,res:Response)=>{
	req.session.destroy((err)=>{
		if(err){
			logger.error(err)
		}else{
			res.send("visit again")
		}
	})
}