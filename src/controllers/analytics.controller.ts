import {Request, Response} from "express"
import {fetchAnalyticsInputType} from "@schemas/analytics.schema"
import {fetchShotcutById} from "@services/shortcut.service"
import {AppError} from "@utils/tryCatch"
import {fetchAllLogsForShortcut} from "@services/analytics.service"

export const fetchAnalyticsLogHandler = async (
	req: Request<fetchAnalyticsInputType>,
	res: Response
) => {
	const ownerId = req.session.user?.id
	const {shortcut} = req.params

	const checkForShortcut = await fetchShotcutById(shortcut, ownerId)

	if (!checkForShortcut) {
		throw new AppError(
			"cd404",
			"Could not find the shortcut, Either create or request permission for the shotcut",
			404
		)
	}

	const logs = await fetchAllLogsForShortcut(shortcut, ownerId)

	res.status(200).json(logs)
}
