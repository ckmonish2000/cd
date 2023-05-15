import express,{Express} from "express"
import expressSessions from "express-session"
import router from "@routes/index"
import errorHandler from "@middleware/errorHandler"
import cookieParser from "cookie-parser"

declare module "express-session" {
	export interface SessionData {
	user: { [key: string]: any };
	}
}	

function createServer():Express{
	const app = express()
	
	app.use(express.json())

	app.use(cookieParser())

	app.use(expressSessions({
		secret:"this is a secret",
		resave: false,
		saveUninitialized: true,
		cookie: { secure: true }
	}))
	
	app.use(router)
	
	app.use(errorHandler)
	
	return app
}

export default createServer