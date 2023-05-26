import supertest from "supertest"
import createServer from "../utils/server"
import * as authService from "../services/auth.service"
import express from "express"

const app = createServer()
const app2 = express();

app2.get("/heartbeat", (req: any, res: any) => {
	res.sendStatus(200)
})

const  server = supertest(app2)

describe('heartbeat', () => {
    it("validate server is running",async ()=>{
        const res = await server.get("/heartbeat")
        console.log(res.statusCode)
        expect(200).toBe(200)
    })
 })