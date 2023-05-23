import { AccessList } from "@prisma/client"
import {cache, prisma} from "@root/db"

export const addUserToAccessList = async(ownerId:string,userId:string,shortlink:string):Promise<AccessList>=>{
	const memberData = await prisma.accessList.create({
		data:{
			userId:userId,
			shortcutShortlink:shortlink,
			shortcutUserId:ownerId
		},
		include:{
			Shortcut:true
		}
	})

	const cachedKey = `redirect-${shortlink}-${userId}`
	await cache.set(cachedKey,JSON.stringify(memberData.Shortcut),{EX:5*60})

	return memberData
}

export const removeUserFromAccessList = async (id:string):Promise<AccessList>=>{
	const revokedMemberData = await prisma.accessList.delete({
		where:{
			id:id
		},
		include:{
			Shortcut:true,
			User:true
		}
	})

	const shortlink = revokedMemberData.shortcutShortlink
	const userId = revokedMemberData.userId

	const cachedKey = `redirect-${shortlink}-${userId}`
	const cachedData = await cache.get(cachedKey)

	if(cachedData && cachedData!=="null"){
		await cache.del(cachedKey)
	}

	return revokedMemberData
}


export const fetchAccessListForUrl = async (ownerId:string,shortlink:string):Promise<AccessList[]>=>{
	const accessList = await prisma.accessList.findMany({
		where:{
			shortcutUserId:ownerId,
			shortcutShortlink:shortlink
		}
	})

	return accessList
}


export const fetchAccessListById =async (id:string):Promise<AccessList | null>=>{
	const data = await prisma.accessList.findUnique({
		where:{
			id:id
		},
		include:{
			Shortcut:true
		}
	})

	return data
}