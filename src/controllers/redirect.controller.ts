import {redirectInputInputType} from "@schemas/redirect.schema"
import {addAnalyticLog} from "@services/analytics.service"
import {fetchShortcutForUser} from "@services/redirect.service"
import logger from "@utils/logger"
import {AppError} from "@utils/tryCatch"
import {Request, Response} from "express"

export const redirectToShortcut = async (
	req: Request<redirectInputInputType>,
	res: Response
) => {
	const userId = req.session.user?.id
	const {shortcut} = req.params

	const redirectionData = await fetchShortcutForUser(shortcut, userId)

	if (!redirectionData) {
		throw new AppError(
			"cd404",
			"Could not find the shortcut, Either create or request permission for the shotcut",
			404
		)
	}

	// const logData = await addAnalyticLog(userId,redirectionData.shortlink,redirectionData.userId)

	// logger.debug(`Added entry to analytics log logID = ${logData.id}`)

	res.status(302).redirect(redirectionData.url)
}
