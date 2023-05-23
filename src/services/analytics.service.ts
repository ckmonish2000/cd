import { Analytics, Prisma } from "@prisma/client"
import {cache, prisma} from "@root/db"

export const addAnalyticLog = async (userId:string,shortlink:string,ownerId:string):Promise<Analytics>=>{
	const logData = await prisma.analytics.create({
		data:{
			shortcutShortlink:shortlink,
			shortcutUserId:ownerId,
			userId:userId
		}
	})
	

	return logData
}

export const fetchAllLogsForShortcut = async(shortlink:string,ownerId:string)=>{
	const condition = {
		shortcutShortlink:shortlink,
		shortcutUserId:ownerId
	}

	const key = `analytics-${shortlink}-${ownerId}`

	const cachedData = await cache.get(key)
	
	if(cachedData && cachedData!=="null"){
		return JSON.parse(cachedData)
	}

	const logs = await prisma.analytics.groupBy({
		by:["userId"],
		_count:{
			userId:true
		},
		where:condition,
	})

	const total = await prisma.analytics.count({where:condition})
	const data = {_count:logs,total: total}

	await cache.set(key,JSON.stringify(data),{EX:40})
	return data
}

export const fetchAllLogsForUser = async(userId:string)=>{
	const logs = await prisma.analytics.findMany({
		where:{
			userId:userId
		},
		include:{
			user:true
		}
	})

	return logs
}