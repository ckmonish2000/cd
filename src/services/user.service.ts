import { PrismaClient } from "@prisma/client"
import { hashPassword, validatePassword } from "@utils/auth"
import { UserCreationResult} from "./user.service.d"

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
        
		return {success:true,id:newUser.id,status:201}
	}catch(err:any){
		let message = err?.message
		let status = 500

		if (err.code === "P2002") {
			message = "User with this email already exists"
			status=409
		}

		return {success:false,error:message,status:status}
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


