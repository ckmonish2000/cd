import {PrismaClient, Shortcut} from "@prisma/client"
const prisma = new PrismaClient()

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
	const shortcut = await prisma.shortcut.findUnique({where:{
		shortlink_userId:{
			shortlink:shortlink,
			userId:userId
		}
	}
	})

	return shortcut
}


export const updateShortcut = async (shortlink:string,userId:string,data:Partial<{shortlink:string,url:string}>):Promise<Shortcut>=>{
	const patchData:{[key:string]:string} = {}

	Object.entries(data).map(([key,value])=>{
		patchData[key] = value
	})

	console.log(patchData)
	const updatedData = await prisma.shortcut.update({
		where:{
			shortlink_userId:{
				shortlink:shortlink,
				userId:userId
			}
		},
		data:patchData
	})

	return updatedData
}

export const deleteShortcut = async (shortlink:string,userId:string):Promise<Shortcut>=>{
	const deletedData = await prisma.shortcut.delete({
		where:{
			shortlink_userId:{
				shortlink:shortlink,
				userId:userId
			}
		}
	})

	return deletedData
}

export const fetchAllUserShortcuts = async (userId:string):Promise<Shortcut[]>=>{
	const userShortcuts = await prisma.shortcut.findMany({
		where:{
			OR:[
				{userId:userId},
				{userAccessList:{
					some:{id:userId}
				}}
			]
		}
	})

	return userShortcuts
}

