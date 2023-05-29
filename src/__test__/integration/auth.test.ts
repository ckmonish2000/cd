import supertest from "supertest"
import createServer from "@utils/server"
import * as authService from "@services/auth.service"
import { primaryUser } from "./mock"
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

            console.log(res.statusCode,res.body)

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


