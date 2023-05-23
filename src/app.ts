import "./boot" // script to load dependencies 
import config from "config"
import createServer from "@utils/server"
import logger from "@utils/logger"
import { connectToRedis } from "@utils/connectToDB"


const port = config.get<number>("port")
const app = createServer()

app.listen(port,async ()=>{
	logger.info(`Express server running on port:${port}`)
	await connectToRedis()
})