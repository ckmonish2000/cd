import {  User } from "@prisma/client"
import { hashPassword } from "@utils/auth"
import {prisma} from "@root/db"

  
export const createNewUser = async (email:string,password:string): Promise<User>=>{
	const hashedpassword = await hashPassword(password)

	const newUser = await prisma.user.create({
		data:{
			email:email,
			password:String(hashedpassword),
		}
	})
        
	return newUser
}


export const checkUserWithEmail = async (email:string):Promise<User | null>=>{
	const user = await prisma.user.findUnique({
		where:{email:email}
	})

	return user
}
