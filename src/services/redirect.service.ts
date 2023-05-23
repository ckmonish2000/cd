import { Shortcut } from "@prisma/client"
import {cache, prisma} from "@root/db"


export const fetchShortcutForUser = async (shortlink:string,userId:string):Promise<Shortcut|null|undefined>=>{
	const cachedKey = `redirect-${shortlink}-${userId}`
	const cachedData = await cache.get(cachedKey)

	if(cachedData && cachedData!=="null"){
		return JSON.parse(cachedData)
	}

	const shortcutData = await prisma.accessList.findFirst({
		where:{
			shortcutShortlink:shortlink,
			userId:userId
		},
		include:{
			Shortcut:true
		}
	})

	if(shortcutData){
		await cache.set(cachedKey,JSON.stringify(shortcutData?.Shortcut),{EX:5*60})
	}

	return shortcutData?.Shortcut
}