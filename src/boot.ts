import * as dotenv from "dotenv"
import {addAliases} from "module-alias"

function setupEnvironment() {
  dotenv.config()
  addAliases({
    "@root": __dirname,
    "@utils": __dirname + "/utils",
    "@services": __dirname + "/services",
    "@models": __dirname + "/models",
    "@routes": __dirname + "/routes",
    "@schemas": __dirname + "/schemas",
    "@controllers": __dirname + "/controllers",
    "@middleware": __dirname + "/middleware",
  })
}

export default setupEnvironment()
