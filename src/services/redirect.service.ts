import { Shortcut } from "@prisma/client"
import {prisma} from "@root/db"


export const fetchShortcutForUser = async (shortlink:string,userId:string):Promise<Shortcut|null|undefined>=>{
	const shortcutData = await prisma.accessList.findFirst({
		where:{
			shortcutShortlink:shortlink,
			userId:userId
		},
		include:{
			Shortcut:true
		}
	})

	return shortcutData?.Shortcut
}