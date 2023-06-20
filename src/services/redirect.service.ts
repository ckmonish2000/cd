import { Shortcut } from "@prisma/client"
import { cache, prisma } from "@root/db"
import { getCache, setCache } from "@utils/cacheHelper"
import { databaseResponseTimeHistogram } from "@utils/metrics"

export const fetchShortcutForUser = async (
	shortlink: string,
	userId: string
): Promise<Shortcut | null | undefined> => {
	const merticsTimer = databaseResponseTimeHistogram.startTimer()
	const metricsLable = {
		operation: "fetchShortcutForUser"
	}
	try {
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

		merticsTimer({ ...metricsLable, success: "true" })
		return shortcutData?.Shortcut
	} catch (err) {
		merticsTimer({ ...metricsLable, success: "false" })
		throw err
	}
}
