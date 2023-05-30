import {Shortcut} from "@prisma/client"
import {cache, prisma} from "@root/db"
import {getCache, setCache} from "@utils/cacheHelper"

export const fetchShortcutForUser = async (
	shortlink: string,
	userId: string
): Promise<Shortcut | null | undefined> => {
	const cachedKey = `redirect-${shortlink}-${userId}`
	const cachedData = await getCache(cachedKey)

	if (cachedData) {
		return JSON.parse(cachedData)
	}

	const shortcutData = await prisma.accessList.findFirst({
		where: {
			shortcutShortlink: shortlink,
			userId: userId,
		},
		include: {
			Shortcut: true,
		},
	})

	if (shortcutData) {
		await setCache(
			cachedKey,
			JSON.stringify(shortcutData?.Shortcut),
			"EX",
			5 * 60,
			"NX"
		)
	}

	return shortcutData?.Shortcut
}
