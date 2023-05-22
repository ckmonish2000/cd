import {  User } from "@prisma/client"
import { hashPassword, validatePassword } from "@utils/auth"
import { UserCreationResult} from "./auth.service.d"
import {prisma} from "@root/db"

  
export const createNewUser = async (email:string,password:string):Promise<UserCreationResult>=>{
	try{
		const hashedpassword = await hashPassword(password)

		const newUser = await prisma.user.create({
			data:{
				email:email,
				password:String(hashedpassword),
			}
		})
        
		return {success:true,id:newUser.id}
	}catch(err:any){
		return {success:false,error:err?.message,errorCode:err.code}
	}
}



export const checkUserWithEmail = async (email:string):Promise<User | null>=>{
	const user = await prisma.user.findUnique({
		where:{email:email}
	})

	return user
}
