import * as dotenv from "dotenv"
import {addAliases} from "module-alias"

function setupEnvironment() {
	dotenv.config()
	addAliases({
		"@utils":__dirname+"/utils",
		"@services":__dirname+"/services",
		"@models":__dirname+"/models",
		"@router":__dirname+"/router",
		"@schemas":__dirname+"/schemas",
		"@controllers":__dirname+"/controllers",
	})
}

export default setupEnvironment()
