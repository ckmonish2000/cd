import { cache } from "@root/db"
import logger from "./logger"

export const connectToRedis = async()=>{
	try{
		await cache.connect()
		logger.info("Successfully connected to redis")
	}catch(err){
		logger.error("Failed to connect with redis")
		process.exit(1)
	}   
}