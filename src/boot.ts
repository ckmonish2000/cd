import * as dotenv from "dotenv"
import {addAliases} from "module-alias"

function setupEnvironment() {
	dotenv.config()
	addAliases({
		"@utils":__dirname+"/utils"
	})
}

export default setupEnvironment()
