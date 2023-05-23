import { User } from "@prisma/client"
import { prisma } from "@root/db"

export const fetchUserById = async (userId:string):Promise<User | null>=>{
	const userData = await prisma.user.findUnique({
		where:{
			id:userId
		}
	})

	return userData
}