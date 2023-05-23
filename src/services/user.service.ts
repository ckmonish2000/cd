import { User } from "@prisma/client"
import { cache, prisma } from "@root/db"

export const fetchUserById = async (userId:string):Promise<User | null>=>{
	const cacheKey = `user-${userId}`
	const cachedData = await cache.get(cacheKey)
	
	if(cachedData && cachedData!=="null"){
		return JSON.parse(cachedData)
	}

	const userData = await prisma.user.findUnique({
		where:{
			id:userId
		}
	})

	await cache.set(cacheKey,JSON.stringify(userData),{EX:60*120,NX:true})
	return userData
}