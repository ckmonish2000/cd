import { PrismaClient } from "@prisma/client"
import { hashPassword, validatePassword } from "@utils/auth"
import { UserCreationResult} from "./auth.service.d"

const prisma = new PrismaClient()
  
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

export const validateUserCredentials = async (email:string,password:string):Promise<boolean>=>{
	const user = await prisma.user.findUnique({
		where:{
			email:email
		}
	})

	if(!user){
		throw new Error("Invalid email or password")
	}

	const validate = validatePassword(password,user.password)

	return validate
}


