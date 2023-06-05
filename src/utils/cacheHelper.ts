import {cache} from "@root/db"
import logger from "./logger"
import { Callback, RedisKey } from "ioredis"

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

export const setCache = (key: RedisKey, value: string | number | Buffer, secondsToken: "EX", seconds: string | number, nx?: "NX", callback?: Callback<"OK" | null> | undefined)=>{
	let data 
	if(!nx){	
		data = cache.set(key,value,secondsToken,seconds)
	}else{
		data = cache.set(key,value,secondsToken,seconds,nx)
	}

	return data
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
