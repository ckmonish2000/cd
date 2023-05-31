import createServer from "@utils/server"
import supertest from "supertest"
import * as shortcutService from "@services/shortcut.service"
import { primaryUser, shortcut } from "./mock"

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
            it.only("Should return 400",async()=>{

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
    })

    // describe('Get shortcuts', () => { 

    // })

    // describe('Update shortcut', () => { 

    // })

    // describe('Delete shortcut', () => { 
    
    // })
})