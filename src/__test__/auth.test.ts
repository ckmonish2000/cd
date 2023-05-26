import supertest from "supertest"
import createServer from "../utils/server"
import * as authService from "../services/auth.service"
import express from "express"

const app = createServer()
const  server = supertest(app)

describe('heartbeat', () => {
    it("validate server is running",async ()=>{
        const res = await server.get("/heartbeat")
        expect(res.statusCode).toBe(200)
    })
 })

 describe('Auth test', () => { 
    describe("Given complete req body is not passed",()=>{
        it("should throw 400",async()=>{
            const res = await server.post("/api/register").send({})
            
            expect(res.body.length).toBe(3)
            expect(res.statusCode).toBe(400)
        })
    })


    describe("given complete body", ()=>{
       it("200",async()=>{
        const res = await server.post("/api/register").send({
            email:"mrx@gmail.com",
            password:"admin@123",
            confirmPassword:"admin@123"
        })
            expect(res.statusCode).toBe(201)
       })
    })
  })