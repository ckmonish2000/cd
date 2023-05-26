import {NextFunction, Request, Response} from "express"
import config from "config"
import {MemoryStoreType} from "./rateLimiter.d"

const reqPerHr = config.get<number>("maxReqPerHr")
const memoryStore: MemoryStoreType = {}

const rateLimitConfig = {
	windowMs: 60 * 60 * 1000, // 1hr
	max: reqPerHr,
}

const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
	const clientIP = req.ip

	if (!memoryStore[clientIP]) {
		memoryStore[clientIP] = {
			count: 1,
			expiry: Date.now() + rateLimitConfig.windowMs,
		}
	} else {
		memoryStore[clientIP].count += 1
	}

	if (memoryStore[clientIP].count > rateLimitConfig.max) {
		const timeRemaining = Math.ceil(
			(memoryStore[clientIP].expiry - Date.now()) / 1000
		)
		res
			.status(429)
			.send(
				`To many requests from this IP please try again later. ${timeRemaining}`
			)
	}

	if (Date.now() > memoryStore[clientIP].expiry) {
		memoryStore[clientIP] = {
			count: 1,
			expiry: Date.now() + rateLimitConfig.windowMs,
		}
	}

	next()
}

export default rateLimiter
