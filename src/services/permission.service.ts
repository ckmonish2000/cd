import { AccessList } from "@prisma/client"
import { cache, prisma } from "@root/db"
import { getCache, setCache, unlinkKeys } from "@utils/cacheHelper"
import { databaseResponseTimeHistogram } from "@utils/metrics"

export const addUserToAccessList = async (
	ownerId: string,
	userId: string,
	shortlink: string
): Promise<AccessList> => {
	const merticsTimer = databaseResponseTimeHistogram.startTimer()
	const metricsLable = {
		operation: "addUserToAccessList"
	}

	try {
		const memberData = await prisma.accessList.create({
			data: {
				userId: userId,
				shortcutShortlink: shortlink,
				shortcutUserId: ownerId,
			},
			include: {
				Shortcut: true,
			},
		})

		const cachedKey = `redirect-${shortlink}-${userId}`
		await setCache(cachedKey, JSON.stringify(memberData.Shortcut), "EX", 5 * 60)

		merticsTimer({ ...metricsLable, success: "true" })
		return memberData
	} catch (err) {
		merticsTimer({ ...metricsLable, success: "false" })
		throw err
	}
}

export const removeUserFromAccessList = async (
	id: string
): Promise<AccessList> => {
	const merticsTimer = databaseResponseTimeHistogram.startTimer()
	const metricsLable = {
		operation: "removeUserFromAccessList"
	}

	try {
		const revokedMemberData = await prisma.accessList.delete({
			where: {
				id: id,
			},
			include: {
				Shortcut: true,
				User: true,
			},
		})

		const shortlink = revokedMemberData.shortcutShortlink
		const userId = revokedMemberData.userId

		const cachedKey = `redirect-${shortlink}-${userId}`
		await unlinkKeys(cachedKey)

		merticsTimer({ ...metricsLable, success: "true" })
		return revokedMemberData
	} catch (err) {
		merticsTimer({ ...metricsLable, success: "false" })
		throw err
	}
}

export const fetchAccessListForUrl = async (
	ownerId: string,
	shortlink: string
): Promise<AccessList[]> => {
	const merticsTimer = databaseResponseTimeHistogram.startTimer()
	const metricsLable = {
		operation: "fetchAccessListForUrl"
	}

	try {
		const accessList = await prisma.accessList.findMany({
			where: {
				shortcutUserId: ownerId,
				shortcutShortlink: shortlink,
			},
		})

		merticsTimer({ ...metricsLable, success: "true" })
		return accessList
	} catch (err) {
		merticsTimer({ ...metricsLable, success: "false" })
		throw err
	}
}

export const fetchAccessListById = async (
	id: string
): Promise<AccessList | null> => {
	const merticsTimer = databaseResponseTimeHistogram.startTimer()
	const metricsLable = {
		operation: "fetchAccessListById"
	}

	try {
		const data = await prisma.accessList.findUnique({
			where: {
				id: id,
			},
			include: {
				Shortcut: true,
			},
		})

		merticsTimer({ ...metricsLable, success: "true" })
		return data
	} catch (err) {
		merticsTimer({ ...metricsLable, success: "false" })
		throw err
	}
}
