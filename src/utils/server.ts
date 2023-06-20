import express, {Express} from "express"
import config from "config"
import expressSessions from "express-session"
import router from "@routes/index"
import errorHandler from "@middleware/errorHandler"
import cookieParser from "cookie-parser"
import rateLimiter from "@middleware/rateLimiter"
import cors from "cors"
import trackResponseMetrics from "@middleware/responseTimeMetric"

declare module "express-session" {
	export interface SessionData {
		user: {
			[key: string]: any
		}
	}
}

function createServer(): Express {
	const app = express()
	const sessionSecret = Buffer.from(config.get("privateKey")).toString("ascii")

	app.use(cors())
	
	app.use(express.json())

	app.use(cookieParser())

	app.use(
		expressSessions({
			secret: sessionSecret,
			resave: false,
			saveUninitialized: false,
		})
	)


	app.use(rateLimiter)
	
	// metrics server
	app.use(trackResponseMetrics)

	app.use(router)
	app.use(errorHandler)

	return app
}

export default createServer
