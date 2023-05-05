import express,{Express} from "express"

function createServer():Express{
	const app = express()
    
	app.use(express.json())
    
	return app
}

export default createServer