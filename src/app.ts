import config from "config"
import createServer from "./utils/server"
import logger from "./utils/logger"

const port = config.get<number>("port")

const app = createServer()

app.listen(port,()=>{
	logger.info(`Express server running on port:${port}`)
})