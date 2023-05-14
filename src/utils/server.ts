import express,{Express,Request,Response,NextFunction} from "express"
import router from "@routes/index"
import errorHandler from "@middleware/errorHandler"

function createServer():Express{
	const app = express()
    
	app.use(express.json())
	
	app.use(router)
	
	app.use(errorHandler)
	
	return app
}

export default createServer