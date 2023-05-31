import createServer from "@utils/server"
import supertest from "supertest"
import * as shortcutService from "@services/shortcut.service"
import { primaryUser, shortcut } from "./mock"
import { v4 as uuidv4 } from 'uuid';

const app = createServer()
let cookie:string[]

beforeAll(async()=>{
        let login = await supertest(app).post("/api/login").send(primaryUser)
        cookie = login.headers["set-cookie"]
})

describe('Shortcut Routes', () => { 
    describe('Create shortcut', () => { 

        describe("Given valid body",()=>{
            it("Should return 201",async()=>{
                const fetchShotcutById = jest.spyOn(shortcutService,"fetchShotcutById")
                const createShortcut = jest.spyOn(shortcutService,"createShortcut")
    
                fetchShotcutById.mockResolvedValue(null)
                createShortcut.mockResolvedValue(shortcut)
    
                const res = await supertest(app).post("/api/shortcut")
                .set("Cookie",cookie)
                .send({
                    shortlink:shortcut.shortlink,
                    url:shortcut.url
                })
    
                expect(res.body).toEqual({
                    ...shortcut,
                    createdAt:shortcut.createdAt.toISOString(),
                    updatedAt:shortcut.updatedAt.toISOString()
                })
                expect(res.statusCode).toBe(201)
            })
        })

        describe("Given invalid body",()=>{
            it("Should return 400",async()=>{

                const missingUrl = await supertest(app).post("/api/shortcut")
                .set("Cookie",cookie)
                .send({
                    url:shortcut.url
                })

                const missingShortlink = await supertest(app).post("/api/shortcut")
                .set("Cookie",cookie)
                .send({
                    url:shortcut.url
                })

                const emptyBody = await supertest(app).post("/api/shortcut")
                .set("Cookie",cookie)
                .send({})
                
                expect(missingUrl.body.length).toBe(1)
                expect(missingShortlink.body.length).toBe(1)
                expect(emptyBody.body.length).toBe(2)

                expect(missingUrl.statusCode).toBe(400)
                expect(missingShortlink.statusCode).toBe(400)
                expect(emptyBody.statusCode).toBe(400)
            })
        })

        describe('Given already existing shortcut', () => { 
            it("Should return 409",async()=>{
                const fetchShotcutById = jest.spyOn(shortcutService,"fetchShotcutById")
    
                fetchShotcutById.mockResolvedValue({
                    ...shortcut,
                    userId:uuidv4()
                })
    
                const res = await supertest(app).post("/api/shortcut")
                .set("Cookie",cookie)
                .send({
                    shortlink:shortcut.shortlink,
                    url:shortcut.url
                })
    
                expect(res.statusCode).toBe(409)
            })
         })
    })

    describe('Get shortcuts', () => { 
        describe('Given authorized user',() => { 
            it("Should return 200",async()=>{
                const fetchShotcutById = jest.spyOn(shortcutService,"fetchAllUserShortcuts")
                
                fetchShotcutById.mockResolvedValue([{
                        ...shortcut,
                        userId:uuidv4()
                    }])

                const res = await supertest(app)
                .get("/api/shortcut")
                .set("Cookie",cookie)
                
                expect(Array.isArray(res.body)).toBe(true)
                expect(res.statusCode).toBe(200)
            })
        })

        describe('Given unauthorized user', () => { 
            it("Should return 401",async()=>{
                const res = await supertest(app).get("/api/shortcut")
                
                expect(res.statusCode).toBe(401)
            })
         })
    })

    describe('Update shortcut', () => { 
        describe('Given valid body', () => { 
            it("Should return 200",async ()=>{
                const fetchShotcutById = jest.spyOn(shortcutService,"fetchShotcutById")
                const updateShortcut = jest.spyOn(shortcutService,"updateShortcut")

                fetchShotcutById.mockResolvedValue({
                    userId:uuidv4(),
                    ...shortcut
                })

                updateShortcut.mockResolvedValue({
                    ...shortcut,
                    userAccessList:[],
                    userId:uuidv4(),
                    shortlink:"https://go.dev",
                })

                const res = await supertest(app)
                .put(`/api/shortcut`)
                .set("Cookie",cookie)
                .send({
                    shortlink:shortcut.shortlink,
                    data:{
                    url:"https://go.dev"
                    }
                })

                expect(res.statusCode).toBe(200)
            })
         })

         describe('Given invalid route', () => { 
            it.only("Should return 404",async ()=>{

                const fetchShotcutById = jest.spyOn(shortcutService,"fetchShotcutById")

                fetchShotcutById.mockResolvedValue(null)

                const res = await supertest(app)
                .put(`/api/shortcut`)
                .set("Cookie",cookie)
                .send({
                    shortlink:shortcut.shortlink,
                    data:{
                    url:"https://go.dev"
                    }
                })

                console.log(res.error)
                expect(res.statusCode).toBe(404)
            })
         })

         
    })

    describe('Delete shortcut', () => { 
        
        describe('Given invalid route', () => { 
            it("Should return 404",async ()=>{

                const fetchShotcutById = jest.spyOn(shortcutService,"fetchShotcutById")

                fetchShotcutById.mockResolvedValue(null)

                const res = await supertest(app)
                .delete(`/api/shortcut/${shortcut.shortlink}`)
                .set("Cookie",cookie)

                console.log(res.error)
                expect(res.statusCode).toBe(404)
            })
         })

         describe('Given valid route', () => { 
            it("Should return 200",async ()=>{
                const fetchShotcutById = jest.spyOn(shortcutService,"fetchShotcutById")
                const deleteShortcut = jest.spyOn(shortcutService,"deleteShortcut")

                fetchShotcutById.mockResolvedValue({
                    userId:uuidv4(),
                    ...shortcut
                })

                deleteShortcut.mockResolvedValue({
                    userId:uuidv4(),
                    ...shortcut
                })

                const res = await supertest(app)
                .delete(`/api/shortcut/${shortcut.shortlink}`)
                .set("Cookie",cookie)

                expect(res.statusCode).toBe(200)
            })
         })
    })
})