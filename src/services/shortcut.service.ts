import {AccessList, Shortcut} from "@prisma/client"
import {cache, prisma} from "@root/db"
import {getCache, unlinkKeys} from "@utils/cacheHelper"

export const createShortcut = async (
	shortlink: string,
	url: string,
	userId: string
): Promise<Partial<Shortcut>> => {
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

	return {
		shortlink: newShortcut.shortlink,
	}
}

export const fetchShotcutById = async (
	shortlink: string,
	userId: string
): Promise<Shortcut | null> => {
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

	await cache.set(cacheKey, JSON.stringify(shortcut), "EX", 60 * 10, "NX")

	return shortcut
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

	return updatedData
}

export const deleteShortcut = async (
	shortlink: string,
	userId: string
): Promise<Shortcut> => {
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

	return deletedData
}

export const fetchAllUserShortcuts = async (
	userId: string
): Promise<Shortcut[]> => {
	const userShortcuts = await prisma.shortcut.findMany({
		where: {
			userAccessList: {
				some: {
					userId: userId,
				},
			},
		},
	})

	return userShortcuts
}
