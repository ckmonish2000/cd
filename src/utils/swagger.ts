import {Express,Response,Request,NextFunction} from "express"
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import logger from "./logger";

const swaggerOptions: swaggerJsdoc.Options = {
    definition:{
        openapi:"3.0.0",
        info:{
            title:"Project CD REST API",
            version:"1.0.0",
            description:"Documentation for project cd"
        },
        servers:[{url:"https://localhost:3000"}],
    },
    apis: ["./src/routes/index.ts", "./src/schemas/*.ts"],
}

const swaggerSpecs = swaggerJsdoc(swaggerOptions)

const swaggerDocs = (app:Express,port:number)=>{
    app.use("/docs",swaggerUi.serve,swaggerUi.setup(swaggerSpecs))

    app.get("/docs.json",(req:Request,res:Response)=>{
        res.setHeader("Content-Type","application/json")
        res.send(swaggerSpecs)
    })

    logger.info(`Docs available at http://localhost:${port}/docs`)
}

export default swaggerDocs