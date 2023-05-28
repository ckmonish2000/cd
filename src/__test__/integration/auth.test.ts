import supertest from "supertest"
import createServer from "@utils/server"
import * as authService from "@services/auth.service"
import express from "express"

const app = createServer()
const  server = supertest(app)

const testUser = {
    email:"mrx@gmail.com",
    password:"admin@123",
}

const userInfo = {
    email:"ckmonish2001@gmail.com",
    password:"admin@123"
}

describe('heartbeat', () => {
    it("validate server is running",async ()=>{
        const res = await server.get("/heartbeat")
        expect(res.statusCode).toBe(200)
    })
 })

 describe('Registeration Route', () => { 

    describe("Given empty req body",()=>{
        
        it.only("should throw 400",async()=>{
            const res = await server.post("/api/register").send({})
            const errBody = res.body
            
            // validate message is present
            for (const err of errBody){
                expect(err.message).toBeDefined()
            }

            // validate error body contains 3 errors namely for email, password and confirm password
            expect(errBody.length).toBe(3)
            expect(res.statusCode).toBe(400)
        })

        
    })


    describe("given complete body", ()=>{
       it("should return 201 status code with id",async()=>{
        const res = await server.post("/api/register").send({
            email:testUser.email,
            password:testUser.password,
            confirmPassword:testUser.password,
        })
            expect(res.statusCode).toBe(201)
       })
    })
  })


  describe('Login Route', () => { 
    
    describe('Given Username and Password', () => { 
        it("Should return 200 with cookie header",async ()=>{
           
            const res = await supertest(app).post("/api/login").send({
                email:"ckmonish2001@gmail.com",
                password:"admin@123"
            })
            expect(res.statusCode).toBe(200)
            expect(res.text).toBe("Welcome To CD")
            expect(res.headers["set-cookie"]).toBeDefined()
        })
     })

     describe('Given Username is missing', () => {
        it("should return 400 ",()=>{})
      })

  })


