import { AccessList } from "@prisma/client"
import {prisma} from "@root/db"



export const addUserToAccessList = async(ownerId:string,userId:string,shortlink:string):Promise<AccessList>=>{
	const memberData = await prisma.accessList.create({
		data:{
			userId:userId,
			shortcutShortlink:shortlink,
			shortcutUserId:ownerId
		}
	})

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