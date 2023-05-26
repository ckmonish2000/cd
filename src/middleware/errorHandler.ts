import logger from "@utils/logger"
import {AppError} from "@utils/tryCatch"
import {NextFunction, Request, Response, Errback} from "express"

interface CustomError extends Error {
	code?: string
}

const errorHandler = (
	error: CustomError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (error instanceof AppError) {
		logger.error(
			`Instance of app error(${error?.errorCode}): ${error?.name} - ${error?.message}`
		)
		return res.status(error.statusCode).send(error.message)
	}

	if (error?.code === "P2002") {
		return res.status(409).send("Unique constraint failure")
	}

	logger.error(`Untracked Error:  ${error?.name} - ${error?.message}`)
	return res.status(500).send("Something went wrong")
}

export default errorHandler
