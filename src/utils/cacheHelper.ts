import {cache} from "@root/db"
import logger from "./logger"

export const getCache = (key: string): Promise<string | null | undefined> => {
	return new Promise((resolve, reject) => {
		cache.get(key, (error, result) => {
			if (error) {
				logger.error(error)
				reject(error)
			} else {
				resolve(result)
			}
		})
	})
}

export const unlinkKeys = async (key: string) => {
	cache.keys(key).then(function (keys) {
		const pipeline = cache.pipeline()
		keys.forEach(function (key) {
			pipeline.unlink(key)
		})
		return pipeline.exec()
	})
}
