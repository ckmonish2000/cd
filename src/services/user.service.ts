import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const createNewUser = async (email:string,password:string)=>{
	await prisma.user.create({
		data:{
			email:email,
			password:password,
		}
	})
}

export const validateUserCredentials = async (email:string,password:string)=>{
	// const user = await prisma.user.findUnique()
	return
}
