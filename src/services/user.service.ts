import {User} from "@prisma/client"
import {cache, prisma} from "@root/db"
import {getCache, setCache} from "@utils/cacheHelper"

export const fetchUserById = async (userId: string): Promise<User | null> => {
	const cacheKey = `user-${userId}`
	const cachedData = await getCache(cacheKey)

	if (cachedData) {
		const parsedData: User | null = JSON.parse(cachedData)
		return parsedData
	}

	const userData = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	})

	await setCache(cacheKey, JSON.stringify(userData), "EX", 60 * 120, "NX")

	return userData
}
