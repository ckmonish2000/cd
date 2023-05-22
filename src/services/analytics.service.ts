import { Analytics, Prisma, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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

	const logs = await prisma.analytics.groupBy({
		by:["userId"],
		_count:{
			userId:true
		},
		where:condition,
	})

	const total = await prisma.analytics.count({where:condition})

	return {_count:logs,total: total}
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