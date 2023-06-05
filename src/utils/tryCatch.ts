import {Request, Response, NextFunction} from "express"
import {CustomHandlerType} from "./tryCatch.d"

export const tryCatch =
	(controller: CustomHandlerType) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await controller(req, res)
		} catch (err) {
			next(err)
		}
	}

export class AppError extends Error {
	errorCode: string
	statusCode: number
	constructor(errorCode: string, message: string, statusCode: number) {
		super(message)
		this.errorCode = errorCode
		this.statusCode = statusCode
	}
}
