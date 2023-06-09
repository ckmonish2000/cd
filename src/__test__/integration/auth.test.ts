import supertest from "supertest"
import createServer from "@utils/server"
import * as authService from "@services/auth.service"
import * as authUtils from "@utils/auth"
import { primaryUser, secondaryUser } from "./mock"
import { v4 as uuidv4 } from 'uuid';


const app = createServer()
const  server = supertest(app)

describe('heartbeat', () => {
    it("validate server is running",async ()=>{
        const res = await server.get("/heartbeat")
        expect(res.statusCode).toBe(200)
    })
 })

 describe('Registeration Route', () => { 

    describe("Given partial or empty req body",()=>{

        it("Empty body should return 400",async()=>{
            // should throw 3 validation errors

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

        it("Missing email should return 400",async()=>{
            // should throw 1 validation errors

            const res = await server.post("/api/register").send({
                password:primaryUser.password,
                confirmPassword:primaryUser.password,
            })
    
            expect(res.body[0].message).toEqual("Email is a required field")
            expect(res.body.length).toBe(1)
           })


           it("Missing password should return 400",async()=>{
            // should throw 1 validation errors and return 400 status code
            
            const res = await server.post("/api/register").send({
                email:primaryUser.email,
                confirmPassword:primaryUser.password,
            })
            
            expect(res.body[0].message).toEqual("password is a required field")
            expect(res.body.length).toBe(1)
           })


           it("Missing confirm password should return 400",async()=>{
            // should throw 1 validation errors and return 400 status code
            
            const res = await server.post("/api/register").send({
                email:primaryUser.email,
                password:primaryUser.password,
            })
            
            expect(res.body[0].message).toEqual("confirm password is a required field")
            expect(res.body.length).toBe(1)
           })
    })


    describe('Given different password and confirm password ', () => {
        it("should return 400",async()=>{
            const res = await server.post("/api/register").send({
                email:primaryUser.email,
                password:primaryUser.password,
                confirmPassword:primaryUser.password+uuidv4(),
            })

            expect(res.body.length).toBe(1)
            expect(res.body[0].message).toEqual("Both password and confirm password must be same")
        })
     })

    describe("given complete body", ()=>{
       it("should return 201 status code with id",async()=>{
        const userId = uuidv4()
        const createNewUser = jest.spyOn(authService,"createNewUser")
        createNewUser.mockResolvedValue({email:primaryUser.email,password:primaryUser.password,id:userId})

        const res = await server.post("/api/register").send({
            email:primaryUser.email,
            password:primaryUser.password,
            confirmPassword:primaryUser.password,
        })

        expect(res.statusCode).toBe(201)
        expect(createNewUser.mock.calls.length).toBe(1)
        expect(res.body.id).toEqual(userId)
       })
    })
  })


describe('Login Route', () => { 
    describe('Given malformed req body', () => { 
        
        it("Given empty body",async()=>{
            
            const res = await server.post("/api/login").send({})
            const errBody = res.body
            
            for (const err of errBody){
                expect(err.message).toBeDefined()
            }

            expect(errBody.length).toBe(2)
            expect(res.statusCode).toBe(400)
        })

        it("Given missing email",async()=>{
            const res = await server.post("/api/login").send({
                password:primaryUser.password,
            })
            
            expect(res.statusCode).toBe(400)
            expect(res.body[0].message).toEqual("Email can not be empty")
            expect(res.body.length).toBe(1)
        })

        it("Given missing password",async()=>{
            const res = await server.post("/api/login").send({
                email:primaryUser.email
            })
            
            expect(res.statusCode).toBe(400)
            expect(res.body[0].message).toEqual("Please enter a valid password")
            expect(res.body.length).toBe(1)
        })

        it("Given malformed email",async()=>{
            const res = await server.post("/api/login").send({
                email:"username",
                password:primaryUser.password
            })
            
            expect(res.statusCode).toBe(400)
            expect(res.body[0].message).toEqual("Not a valid email address")
            expect(res.body.length).toBe(1)
        })

        it("Given password less than min length",async()=>{
            const res = await server.post("/api/login").send({
                email:primaryUser.email,
                password:"123"
            })
            
            expect(res.statusCode).toBe(400)
            expect(res.body[0].message).toEqual("password should atleast be 8 charachters  long")
            expect(res.body.length).toBe(1)
        })
     })

    describe("Given valid creds",()=>{
        it("should return 200 with cookie",async ()=>{
            const userId = uuidv4()
            const checkUserWithEmail = jest.spyOn(authService,"checkUserWithEmail")
            const validatePassword = jest.spyOn(authUtils,"validatePassword")

            checkUserWithEmail.mockResolvedValue({
                id:userId,
                email:primaryUser.email,
                password:primaryUser.password
            })

            validatePassword.mockResolvedValue(true)

            const res = await supertest(app).post("/api/login").send(primaryUser)
            
            expect(res.statusCode).toBe(200)
            expect(res.text).toBe("Welcome To CD")
            expect(res.headers["set-cookie"]).toBeDefined()
        })
    })

    describe("Given invalid email",()=>{
       it("should return 404",async()=>{
        const checkUserWithEmail = jest.spyOn(authService,"checkUserWithEmail")

        checkUserWithEmail.mockResolvedValue(null)

        const res = await supertest(app).post("/api/login").send(secondaryUser)

        expect(res.statusCode).toBe(404)
        expect(res.text).toBe("Please consider registering first")
        expect(res.headers["set-cookie"]).toBeUndefined()
       })
    })

    describe("Given invalid password",()=>{
        it("should return 404",async()=>{
        const userId = uuidv4()
         const checkUserWithEmail = jest.spyOn(authService,"checkUserWithEmail")
         const validatePassword = jest.spyOn(authUtils,"validatePassword")

         validatePassword.mockResolvedValue(false)

         checkUserWithEmail.mockResolvedValue({
            id:userId,
            email:primaryUser.email,
            password:secondaryUser.password
         })
 
         const res = await supertest(app).post("/api/login").send({
            email:primaryUser.email,
            password:secondaryUser.password
         })
 
         expect(res.statusCode).toBe(401)
         expect(res.text).toBe("Invalid email or password")
         expect(res.headers["set-cookie"]).toBeUndefined()
        })
     })
    })
