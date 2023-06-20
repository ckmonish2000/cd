import { AccessList, Shortcut } from "@prisma/client"
import { cache, prisma } from "@root/db"
import { getCache, setCache, unlinkKeys } from "@utils/cacheHelper"
import { databaseResponseTimeHistogram } from "@utils/metrics"

export const createShortcut = async (
	shortlink: string,
	url: string,
	userId: string
): Promise<Partial<Shortcut>> => {
	const merticsTimer = databaseResponseTimeHistogram.startTimer()
	const metricsLable = {
		operation: "createShortcut"
	}

	try {
		const newShortcut: Shortcut = await prisma.shortcut.create({
			data: {
				shortlink: shortlink,
				url: url,
				userId: userId,
				userAccessList: {
					create: {
						userId: userId,
					},
				},
			},
		})

		merticsTimer({ ...metricsLable, success: "true" })
		return {
			shortlink: newShortcut.shortlink,
		}
	} catch (err) {
		merticsTimer({ ...metricsLable, success: "false" })
		throw err
	}
}

export const fetchShotcutById = async (
	shortlink: string,
	userId: string
): Promise<Shortcut | null> => {
	const merticsTimer = databaseResponseTimeHistogram.startTimer()
	const metricsLable = {
		operation: "fetchShotcutById"
	}

	try {
		const cacheKey = `shortcut-${shortlink}-${userId}`

		const cachedData = await getCache(cacheKey)

		if (cachedData) {
			const parsedData: Shortcut | null = JSON.parse(cachedData)
			return parsedData
		}

		const shortcut: Shortcut | null = await prisma.shortcut.findUnique({
			where: {
				shortlink_userId: {
					shortlink: shortlink,
					userId: userId,
				},
			},
		})

		await setCache(cacheKey, JSON.stringify(shortcut), "EX", 60 * 10, "NX")

		merticsTimer({ ...metricsLable, success: "true" })
		return shortcut
	} catch (err) {
		merticsTimer({ ...metricsLable, success: "false" })
		throw err
	}
}

export const updateShortcut = async (
	shortlink: string,
	userId: string,
	data: Partial<{
		shortlink: string
		url: string
	}>
): Promise<
	Shortcut & {
		userAccessList: AccessList[]
	}
> => {
	const merticsTimer = databaseResponseTimeHistogram.startTimer()
	const metricsLable = {
		operation: "updateShortcut"
	}

	try {
		const cacheKey = `shortcut-${shortlink}-${userId}`
		const patchData: {
			[key: string]: string
		} = {}

		Object.entries(data).map(([key, value]) => {
			patchData[key] = value
		})

		const updatedData = await prisma.shortcut.update({
			where: {
				shortlink_userId: {
					shortlink: shortlink,
					userId: userId,
				},
			},
			data: patchData,
			include: {
				userAccessList: true,
			},
		})

		await unlinkKeys(cacheKey)
		await unlinkKeys(`redirect-${shortlink}-*`)

		merticsTimer({ ...metricsLable, success: "true" })
		return updatedData
	} catch (err) {
		merticsTimer({ ...metricsLable, success: "false" })
		throw err
	}
}

export const deleteShortcut = async (
	shortlink: string,
	userId: string
): Promise<Shortcut> => {
	const merticsTimer = databaseResponseTimeHistogram.startTimer()
	const metricsLable = {
		operation: "deleteShortcut"
	}

	try {
		const cacheKey = `shortcut-${shortlink}-${userId}`

		const deletedData = await prisma.shortcut.delete({
			where: {
				shortlink_userId: {
					shortlink: shortlink,
					userId: userId,
				},
			},
		})

		await unlinkKeys(cacheKey)
		await unlinkKeys(`redirect-${shortlink}-*`)

		merticsTimer({ ...metricsLable, success: "true" })
		return deletedData
	} catch (err) {
		merticsTimer({ ...metricsLable, success: "false" })
		throw err
	}
}

export const fetchAllUserShortcuts = async (
	userId: string
): Promise<Shortcut[]> => {
	const merticsTimer = databaseResponseTimeHistogram.startTimer()
	const metricsLable = {
		operation: "fetchAllUserShortcuts"
	}

	try {
		const userShortcuts = await prisma.shortcut.findMany({
			where: {
				userAccessList: {
					some: {
						userId: userId,
					},
				},
			},
		})
		merticsTimer({ ...metricsLable, success: "true" })
		return userShortcuts
	} catch (err) {
		merticsTimer({ ...metricsLable, success: "false" })
		throw err
	}
}
