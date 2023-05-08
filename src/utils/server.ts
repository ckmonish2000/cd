import express,{Express} from "express"
import router from "@router/index"

function createServer():Express{
	const app = express()
    
	app.use(express.json())

	app.use(router)
	
	return app
}

export default createServer