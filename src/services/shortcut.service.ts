import {AccessList, Shortcut} from "@prisma/client"
import {cache, prisma} from "@root/db"


export const createShortcut = async(shortlink:string,url:string,userId:string):Promise<Partial<Shortcut>>=>{

	const newShortcut = await prisma.shortcut.create({
		data:{
			shortlink:shortlink,
			url:url,
			userId:userId,
			userAccessList:{
				create:{
					userId:userId
				}
			}
		}
	})

	return {shortlink:newShortcut.shortlink}
}

export const fetchShotcutById =async (shortlink:string,userId:string):Promise<Shortcut | null> => {
	const cacheKey = `shortcut-${shortlink}-${userId}`

	const cachedData = await cache.get(cacheKey)
	
	if(cachedData && cachedData!=="null"){
		return JSON.parse(cachedData)
	}

	const shortcut = await prisma.shortcut.findUnique({where:{
		shortlink_userId:{
			shortlink:shortlink,
			userId:userId
		}
	}
	})
	
	await cache.set(cacheKey,JSON.stringify(shortcut),{EX:60*30,NX:true})

	return shortcut
}


export const updateShortcut = async (shortlink:string,userId:string,data:Partial<{shortlink:string,url:string}>):Promise<Shortcut & {
    userAccessList: AccessList[];
}>=>{
	const cacheKey = `shortcut-${shortlink}-${userId}`
	const patchData:{[key:string]:string} = {}

	Object.entries(data).map(([key,value])=>{
		patchData[key] = value
	})

	const updatedData = await prisma.shortcut.update({
		where:{
			shortlink_userId:{
				shortlink:shortlink,
				userId:userId
			}
		},
		data:patchData,
		include:{
			userAccessList:true
		}
	})

	const cachedData = await cache.get(cacheKey)
	
	if(cachedData && cachedData!=="null"){
		await cache.del(cacheKey)
	}

	return updatedData
}

export const deleteShortcut = async (shortlink:string,userId:string):Promise<Shortcut>=>{
	const cacheKey = `shortcut-${shortlink}-${userId}`

	const deletedData = await prisma.shortcut.delete({
		where:{
			shortlink_userId:{
				shortlink:shortlink,
				userId:userId
			}
		}
	})

	const cachedData = await cache.get(cacheKey)
	
	if(cachedData && cachedData!=="null"){
		await cache.del(cacheKey)
	}

	return deletedData
}

export const fetchAllUserShortcuts = async (userId:string):Promise<Shortcut[]>=>{
	const userShortcuts = await prisma.shortcut.findMany({
		where:{
			userAccessList:{
				some:{userId:userId}
			}
		}
	})

	return userShortcuts
}

