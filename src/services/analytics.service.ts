import { Analytics, Prisma } from "@prisma/client"
import { cache, prisma } from "@root/db"
import { getCache, setCache } from "@utils/cacheHelper"
import { databaseResponseTimeHistogram } from "@utils/metrics"

export const addAnalyticLog = async (
	userId: string,
	shortlink: string,
	ownerId: string
): Promise<Analytics> => {
	const merticsTimer = databaseResponseTimeHistogram.startTimer()
	const metricsLable = {
		operation: "addAnalyticLog"
	}

	try {
		const logData = await prisma.analytics.create({
			data: {
				shortcutShortlink: shortlink,
				shortcutUserId: ownerId,
				userId: userId,
			},
		})

		merticsTimer({ ...metricsLable, success: "true" })
		return logData
	} catch (err) {
		merticsTimer({ ...metricsLable, success: "false" })
		throw err
	}
}

export const fetchAllLogsForShortcut = async (
	shortlink: string,
	ownerId: string
) => {
	const merticsTimer = databaseResponseTimeHistogram.startTimer()
	const metricsLable = {
		operation: "fetchAllLogsForShortcut"
	}

	try {
		const condition = {
			shortcutShortlink: shortlink,
			shortcutUserId: ownerId,
		}

		const key = `analytics-${shortlink}-${ownerId}`
		const cachedData = await getCache(key)

		if (cachedData) {
			return JSON.parse(cachedData)
		}

		const logs = await prisma.analytics.groupBy({
			by: ["userId"],
			_count: {
				userId: true,
			},
			where: condition,
		})

		const total = await prisma.analytics.count({
			where: condition,
		})
		const data = {
			_count: logs,
			total: total,
		}

		await setCache(key, JSON.stringify(data), "EX", 10, "NX")

		merticsTimer({ ...metricsLable, success: "true" })
		return data
	} catch (err) {
		merticsTimer({ ...metricsLable, success: "false" })
		throw err
	}
}
